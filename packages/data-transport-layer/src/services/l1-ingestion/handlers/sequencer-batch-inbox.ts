/* Imports: External */
import { BigNumber, ethers, constants } from 'ethers'
import {
  BlockWithTransactions,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { MerkleTree } from 'merkletreejs'
import { getContractFactory } from '@metis.io/contracts'
import {
  fromHexString,
  toHexString,
  toRpcHexString,
  EventArgsSequencerBatchAppended,
  MinioClient,
  MinioConfig,
  remove0x,
  zlibDecompress,
} from '@metis.io/core-utils'

/* Imports: Internal */
import {
  DecodedSequencerBatchTransaction,
  SequencerBatchAppendedExtraData,
  SequencerBatchInboxParsedEvent,
  TransactionBatchEntry,
  TransactionEntry,
  EventHandlerSetAny,
  BlockEntry,
} from '../../../types'
import { SEQUENCER_GAS_LIMIT, parseSignatureVParam } from '../../../utils'
import { MissingElementError } from './errors'

export const handleEventsSequencerBatchInbox: EventHandlerSetAny<
  SequencerBatchAppendedExtraData,
  SequencerBatchInboxParsedEvent
> = {
  getExtraData: async (event, l1RpcProvider) => {
    const l1Transaction = event.transaction as TransactionResponse
    const eventBlock = event.block as BlockWithTransactions

    const batchSubmissionData: any = {}
    let batchSubmissionVerified = false

    // [1: DA type] [1: compress type] [32: batch index] [32: L2 start] [4: total blocks, max 65535] [<DATA> { [3: txs count] [5 block timestamp = l1 timestamp of txs] [32 l1BlockNumber of txs, get it from tx0] [1: TX type 0-sequencer 1-enqueue] [3 tx data length] [raw tx data] [3 sign length *sequencerTx*] [sign data] [32 l1Origin *enqueue*].. } ...]
    const calldata = fromHexString(l1Transaction.data)
    if (calldata.length > 70) {
      const offset = 2
      // l2 block number - 1, in order to keep same as CTC
      batchSubmissionData.prevTotalElements = BigNumber.from(
        calldata.slice(offset + 32, offset + 64)
      ).sub(1)
      batchSubmissionData.batchIndex = BigNumber.from(
        calldata.slice(offset, offset + 32)
      )
      batchSubmissionData.batchSize = BigNumber.from(
        calldata.slice(offset + 66, offset + 70)
      )
      batchSubmissionVerified = true
    }

    if (!batchSubmissionVerified) {
      throw new Error(
        `Well, this really shouldn't happen. A SequencerBatchInbox data doesn't have a corresponding TransactionBatchAppended event.`
      )
    }

    return {
      timestamp: eventBlock.timestamp,
      blockNumber: eventBlock.number,
      submitter: l1Transaction.from,
      l1TransactionHash: l1Transaction.hash,
      l1TransactionData: l1Transaction.data,
      gasLimit: `${SEQUENCER_GAS_LIMIT}`,

      prevTotalElements: batchSubmissionData.prevTotalElements,
      batchIndex: batchSubmissionData.batchIndex,
      batchSize: batchSubmissionData.batchSize,
      batchRoot: eventBlock.parentHash,
      batchExtraData: '',
    }
  },
  parseEvent: async (event, extraData, l2ChainId, options) => {
    const blockEntries: BlockEntry[] = []

    // [1: DA type] [1: compress type] [32: batch index] [32: L2 start] [4: total blocks, max 65535] [<DATA> { [3: txs count] [5 block timestamp = l1 timestamp of txs] [32 l1BlockNumber of txs, get it from tx0] [1: TX type 0-sequencer 1-enqueue] [3 tx data length] [raw tx data] [3 sign length *sequencerTx*] [sign data] [32 l1Origin *enqueue*].. } ...]
    const calldata = fromHexString(extraData.l1TransactionData)
    if (calldata.length < 70) {
      throw new Error(
        `Block ${extraData.blockNumber} transaction data of inbox ${extraData.l1TransactionHash} is invalid for decoding: ${extraData.l1TransactionData} , ` +
          `converted buffer length is < 70.`
      )
    }
    // DA: 0 - L1, 1 - memo, 2 - celestia
    // current DA is 0
    // Compress Type: 0 - none, 11 - zlib
    const compressType = BigNumber.from(calldata.slice(1, 2)).toNumber()
    let contextData = calldata.slice(70)
    if (compressType === 11) {
      contextData = await zlibDecompress(contextData)
    }
    let offset = 0
    let blockIndex = 0
    const l2Start = BigNumber.from(calldata.slice(2 + 32, 2 + 64)).toNumber()
    let pointerEnd = false
    while (!pointerEnd) {
      const txCount = BigNumber.from(contextData.slice(offset, 3)).toNumber()
      offset += 3
      const blockTimestamp = BigNumber.from(
        contextData.slice(offset, 5)
      ).toNumber()
      offset += 5
      const l1BlockNumber = BigNumber.from(
        contextData.slice(offset, 32)
      ).toNumber()
      offset += 32

      const blockEntry: BlockEntry = {
        index: l2Start + blockIndex - 1, // keep same rule as single tx index
        batchIndex: extraData.batchIndex.toNumber(),
        timestamp: blockTimestamp,
        transactions: [],
        confirmed: true,
      }
      blockIndex++

      for (let i = 0; i < txCount; i++) {
        const txType = BigNumber.from(contextData.slice(offset, 1)).toNumber()
        offset += 1
        const txDataLen = BigNumber.from(
          contextData.slice(offset, 3)
        ).toNumber()
        offset += 3
        const txData: Buffer = contextData.slice(offset, txDataLen)
        offset += txDataLen

        const decoded = decodeSequencerBatchTransaction(txData, l2ChainId)
        const transactionEntry: TransactionEntry = {
          index: blockEntry.index,
          batchIndex: extraData.batchIndex.toNumber(),
          blockNumber: l1BlockNumber,
          timestamp: blockTimestamp,
          gasLimit: BigNumber.from(0).toString(),
          target: constants.AddressZero,
          origin: null,
          data: toHexString(txData),
          queueOrigin: 'sequencer',
          value: decoded.value,
          queueIndex: null,
          decoded,
          confirmed: true,
          seqSign: null,
        }
        let signData = null
        if (txType === 0) {
          const signLen = BigNumber.from(
            contextData.slice(offset, 3)
          ).toNumber()
          offset += 3
          if (signLen > 0) {
            const decodedSign = remove0x(
              toHexString(contextData.slice(offset, signLen))
            )
            offset += signLen

            // sign length is 64 * 2 + 2, or '000000'
            if (decodedSign && decodedSign === '000000') {
              // transactionEntries[i].seqSign = '0x0,0x0,0x0'
              signData = '0x0,0x0,0x0'
            } else if (!decodedSign || decodedSign.length < 130) {
              // transactionEntries[i].seqSign = ''
              signData = ''
            } else {
              const seqR =
                '0x' + removeLeadingZeros(decodedSign.substring(0, 64))
              const seqS =
                '0x' + removeLeadingZeros(decodedSign.substring(64, 128))
              let seqV = decodedSign.substring(128)
              if (seqV.length > 0) {
                seqV = '0x' + removeLeadingZeros(seqV)
              } else {
                seqV = '0x0'
              }
              // transactionEntries[i].seqSign = `${seqR},${seqS},${seqV}`
              signData = `${seqR},${seqS},${seqV}`
            }

            transactionEntry.seqSign = signData
          }
        } else {
          const l1Origin = toHexString(contextData.slice(offset, 32))
          offset += 32

          transactionEntry.origin = l1Origin
          transactionEntry.queueIndex = BigNumber.from(decoded.nonce).toNumber()
          transactionEntry.queueOrigin = 'l1'
          transactionEntry.value = '0x0'
        }
        blockEntry.transactions.push(transactionEntry)
      }

      if (offset >= contextData.length) {
        pointerEnd = true
      }
    }

    const transactionBatchEntry: TransactionBatchEntry = {
      index: extraData.batchIndex.toNumber(),
      root: extraData.batchRoot,
      size: extraData.batchSize.toNumber(),
      prevTotalElements: extraData.prevTotalElements.toNumber(),
      extraData: extraData.batchExtraData,
      blockNumber: BigNumber.from(extraData.blockNumber).toNumber(),
      timestamp: BigNumber.from(extraData.timestamp).toNumber(),
      submitter: extraData.submitter,
      l1TransactionHash: extraData.l1TransactionHash,
    }

    return {
      transactionBatchEntry,
      blockEntries,
    }
  },
  storeEvent: async (entry, db, options) => {
    // Defend against situations where we missed an event because the RPC provider
    // (infura/alchemy/whatever) is missing an event.
    if (entry.transactionBatchEntry.index > 0) {
      const prevTransactionBatchEntry = await db.getTransactionBatchByIndex(
        entry.transactionBatchEntry.index - 1
      )

      // We should *always* have a previous transaction batch here.
      if (prevTransactionBatchEntry === null) {
        throw new MissingElementError('SequencerBatchInbox')
      }
    }

    // Compatible with rollup client data before deSeqBlock
    let foundIndex = -1
    for (let i = 0; i < entry.blockEntries.length; i++) {
      const blockNumber = entry.blockEntries[i].index + 1
      if (
        (!options.deSeqBlock || options.deSeqBlock < blockNumber) &&
        entry.blockEntries[i].transactions.length === 1
      ) {
        foundIndex = i
        await db.putTransactionEntries(entry.blockEntries[i].transactions)
      } else {
        break
      }
    }

    if (foundIndex >= 0) {
      if (foundIndex < entry.blockEntries.length - 1) {
        await db.putBlockEntries(entry.blockEntries.slice(foundIndex + 1))
      }
    } else {
      await db.putBlockEntries(entry.blockEntries)
    }

    // Add an additional field to the enqueued transactions in the database
    // if they have already been confirmed
    entry.blockEntries.forEach(async (block) => {
      for (const transactionEntry of block.transactions) {
        if (transactionEntry.queueOrigin === 'l1') {
          await db.putTransactionIndexByQueueIndex(
            transactionEntry.queueIndex,
            transactionEntry.index
          )
        }
      }
    })

    await db.putTransactionBatchEntries([entry.transactionBatchEntry])
  },
}

interface SequencerBatchContext {
  numSequencedTransactions: number
  numSubsequentQueueTransactions: number
  timestamp: number
  blockNumber: number
}

const parseSequencerBatchContext = (
  calldata: Buffer,
  offset: number
): SequencerBatchContext => {
  return {
    numSequencedTransactions: BigNumber.from(
      calldata.slice(offset, offset + 3)
    ).toNumber(),
    numSubsequentQueueTransactions: BigNumber.from(
      calldata.slice(offset + 3, offset + 6)
    ).toNumber(),
    timestamp: BigNumber.from(
      calldata.slice(offset + 6, offset + 11)
    ).toNumber(),
    blockNumber: BigNumber.from(
      calldata.slice(offset + 11, offset + 16)
    ).toNumber(),
  }
}

const parseMerkleLeafFromSequencerBatchTransaction = (
  calldata: Buffer,
  offset: number
): Buffer => {
  const transactionLength = BigNumber.from(
    calldata.slice(offset, offset + 3)
  ).toNumber()

  return calldata.slice(offset, offset + 3 + transactionLength)
}

const parseSequencerBatchTransaction = (
  calldata: Buffer,
  offset: number
): Buffer => {
  const transactionLength = BigNumber.from(
    calldata.slice(offset, offset + 3)
  ).toNumber()

  return calldata.slice(offset + 3, offset + 3 + transactionLength)
}

const decodeSequencerBatchTransaction = (
  transaction: Buffer,
  l2ChainId: number
): DecodedSequencerBatchTransaction => {
  const decodedTx = ethers.utils.parseTransaction(transaction)

  return {
    nonce: BigNumber.from(decodedTx.nonce).toString(),
    gasPrice: BigNumber.from(decodedTx.gasPrice).toString(),
    gasLimit: BigNumber.from(decodedTx.gasLimit).toString(),
    value: toRpcHexString(decodedTx.value),
    target: decodedTx.to ? toHexString(decodedTx.to) : null,
    data: toHexString(decodedTx.data),
    sig: {
      v: parseSignatureVParam(decodedTx.v, l2ChainId),
      r: toHexString(decodedTx.r),
      s: toHexString(decodedTx.s),
    },
  }
}

const removeLeadingZeros = (inputString: string): string => {
  const trimmedString = inputString.replace(/^0+/, '')
  return trimmedString || '0'
}
