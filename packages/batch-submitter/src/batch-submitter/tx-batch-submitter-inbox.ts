/* External Imports */
import { Promise as bPromise } from 'bluebird'
import {
  Signer,
  ethers,
  providers,
  BigNumber,
  PopulatedTransaction,
} from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { Logger } from '@eth-optimism/common-ts'
import {
  L2Block,
  QueueOrigin,
  remove0x,
  toHexString,
  encodeHex,
  L2Transaction,
} from '@metis.io/core-utils'
import { randomUUID } from 'crypto'

/* Internal Imports */
import { TransactionSubmitter, MpcClient } from '../utils'
import { InboxStorage } from '../storage'
import { TxSubmissionHooks } from '..'

export interface BatchToInboxRawTx {
  rawTransaction: string | undefined
  seqSign: string | undefined | null
  isSequencerTx: boolean
  l1BlockNumber: number | null
  l1TxOrigin: string | null
}

export interface BatchToInboxElement {
  stateRoot: string
  timestamp: number
  blockNumber: number
  txs: BatchToInboxRawTx[]
}
export declare type BatchToInbox = BatchToInboxElement[]

export interface InboxBatchParams {
  inputData: string
  batch: BatchToInbox
}

export class TransactionBatchSubmitterInbox {
  constructor(
    readonly inboxStorage: InboxStorage,
    readonly inboxAddress: string,
    readonly l2Provider: providers.StaticJsonRpcProvider,
    readonly logger: Logger,
    readonly maxTxSize: number
  ) {}

  public async submitBatchToInbox(
    startBlock: number,
    endBlock: number,
    nextBatchIndex: number,
    metrics: any,
    signer: Signer,
    mpcUrl: string,
    shouldSubmitBatch: (sizeInBytes: number) => boolean,
    transactionSubmitter: TransactionSubmitter,
    hooks: TxSubmissionHooks,
    submitAndLogTx: (
      submitTransaction: () => Promise<TransactionReceipt>,
      successMessage: string,
      callback?: (
        receipt: TransactionReceipt | null,
        err: any
      ) => Promise<boolean>
    ) => Promise<TransactionReceipt>
  ): Promise<TransactionReceipt> {
    const params = await this._generateSequencerBatchParams(
      startBlock,
      endBlock,
      nextBatchIndex
    )
    if (!params) {
      throw new Error(
        `Cannot create sequencer batch with params start ${startBlock}, end ${endBlock} and next batch index ${nextBatchIndex}`
      )
    }

    const [batchParams, wasBatchTruncated] = params
    // encodeBatch of calldata for _shouldSubmitBatch
    const batchSizeInBytes = batchParams.inputData.length / 2
    this.logger.debug('Sequencer batch generated', {
      batchSizeInBytes,
    })

    // Only submit batch if one of the following is true:
    // 1. it was truncated
    // 2. it is large enough
    // 3. enough time has passed since last submission
    if (!wasBatchTruncated && !shouldSubmitBatch(batchSizeInBytes)) {
      return
    }
    metrics.numTxPerBatch.observe(endBlock - startBlock)
    const l1tipHeight = await signer.provider.getBlockNumber()
    this.logger.debug('Submitting batch to inbox.', {
      calldata: batchParams,
      l1tipHeight,
    })

    return this.submitSequencerBatch(
      nextBatchIndex,
      batchParams,
      signer,
      mpcUrl,
      transactionSubmitter,
      hooks,
      submitAndLogTx
    )
  }

  /*********************
   * Private Functions *
   ********************/

  private async submitSequencerBatch(
    nextBatchIndex: number,
    batchParams: InboxBatchParams,
    signer: Signer,
    mpcUrl: string,
    transactionSubmitter: TransactionSubmitter,
    hooks: TxSubmissionHooks,
    submitAndLogTx: (
      submitTransaction: () => Promise<TransactionReceipt>,
      successMessage: string,
      callback?: (
        receipt: TransactionReceipt | null,
        err: any
      ) => Promise<boolean>
    ) => Promise<TransactionReceipt>
  ): Promise<TransactionReceipt> {
    this.logger.info('submitter with mpc', { url: mpcUrl })
    const tx: PopulatedTransaction = {
      to: this.inboxAddress,
      data: '0x' + batchParams.inputData,
      value: ethers.utils.parseEther('0'),
    }
    // MPC enabled: prepare nonce, gasPrice
    if (mpcUrl) {
      const mpcClient = new MpcClient(mpcUrl)
      const mpcInfo = await mpcClient.getLatestMpc()
      if (!mpcInfo || !mpcInfo.mpc_address) {
        throw new Error('MPC info get failed')
      }
      const mpcAddress = mpcInfo.mpc_address
      tx.nonce = await signer.provider.getTransactionCount(mpcAddress)
      tx.gasLimit = await signer.provider.estimateGas({
        to: tx.to,
        from: mpcAddress,
        data: tx.data,
      })
      // mpc model can't use ynatm, set more gas price?
      const gasPrice = await signer.provider.getGasPrice()
      // TODO
      // gasPrice.add()
      tx.gasPrice = gasPrice
      // call mpc to sign tx
      const serializedTransaction = JSON.stringify({
        nonce: mpcClient.removeHexLeadingZero(ethers.utils.hexlify(tx.nonce)),
        gasPrice: mpcClient.removeHexLeadingZero(tx.gasPrice.toHexString()),
        gasLimit: mpcClient.removeHexLeadingZero(tx.gasLimit.toHexString()),
        to: tx.to,
        value: mpcClient.removeHexLeadingZero(tx.value.toHexString(), true),
        data: tx.data,
      })
      const signId = randomUUID()
      const postData = {
        sign_id: signId,
        mpc_id: mpcInfo.mpc_id,
        sign_type: '0',
        sign_data: serializedTransaction,
        sign_msg: '',
      }
      const signResp = await mpcClient.proposeMpcSign(postData)
      if (!signResp) {
        throw new Error('MPC propose sign failed')
      }

      const signedTx = await mpcClient.getMpcSign(signId)
      if (!signedTx) {
        throw new Error('MPC get sign failed')
      }

      const submitSignedTransaction = (): Promise<TransactionReceipt> => {
        return transactionSubmitter.submitSignedTransaction(tx, signedTx, hooks)
      }
      return submitAndLogTx(
        submitSignedTransaction,
        'Submitted batch to inbox with MPC!',
        (receipt: TransactionReceipt | null, err: any): Promise<boolean> => {
          return this._setBatchInboxRecord(receipt, err, nextBatchIndex)
        }
      )
    } else {
      tx.nonce = await signer.getTransactionCount()
      tx.gasLimit = await signer.provider.estimateGas({
        //estimate gas
        to: tx.to,
        from: await signer.getAddress(),
        data: tx.data,
      })
    }

    const submitTransaction = (): Promise<TransactionReceipt> => {
      return transactionSubmitter.submitTransaction(tx, hooks)
    }
    return submitAndLogTx(
      submitTransaction,
      'Submitted batch to inbox!',
      (receipt: TransactionReceipt | null, err: any): Promise<boolean> => {
        return this._setBatchInboxRecord(receipt, err, nextBatchIndex)
      }
    )
  }

  private async _setBatchInboxRecord(
    receipt: TransactionReceipt | null,
    err: any,
    batchIndex: number
  ): Promise<boolean> {
    let saveStatus = false
    if (receipt) {
      saveStatus = await this.inboxStorage.recordConfirmedTx({
        batchIndex,
        blockNumber: receipt.blockNumber,
        txHash: receipt.transactionHash,
      })
    } else {
      saveStatus = await this.inboxStorage.recordFailedTx(
        batchIndex,
        err.toString()
      )
    }
    return saveStatus
  }

  private async _generateSequencerBatchParams(
    startBlock: number,
    endBlock: number,
    nextBatchIndex: number
  ): Promise<[InboxBatchParams, boolean]> {
    // Get all L2 BatchElements for the given range
    const blockRange = endBlock - startBlock
    const batch: BatchToInbox = await bPromise.map(
      [...Array(blockRange).keys()],
      (i) => {
        this.logger.debug('Fetching L2BatchElement', {
          blockNo: startBlock + i,
        })
        return this._getL2BatchElement(startBlock + i)
      },
      { concurrency: 100 }
    )

    // fix max batch size with env
    const fixedMaxTxSize = this.maxTxSize

    let inboxBatchParams = await this._getSequencerBatchParams(
      startBlock,
      nextBatchIndex,
      batch
    )
    let wasBatchTruncated = false
    // This method checks encoded length without options anyway
    let encoded = inboxBatchParams.inputData
    while (encoded.length / 2 > fixedMaxTxSize) {
      this.logger.info('Splicing batch...', {
        batchSizeInBytes: encoded.length / 2,
      })
      batch.splice(Math.ceil((batch.length * 2) / 3)) // Delete 1/3rd of all of the batch elements
      inboxBatchParams = await this._getSequencerBatchParams(
        startBlock,
        nextBatchIndex,
        batch
      )
      encoded = inboxBatchParams.inputData
      //  This is to prevent against the case where a batch is oversized,
      //  but then gets truncated to the point where it is under the minimum size.
      //  In this case, we want to submit regardless of the batch's size.
      wasBatchTruncated = true
    }

    this.logger.info('Generated sequencer batch params', {
      contexts: inboxBatchParams.batch,
      inputData: encoded,
      wasBatchTruncated,
    })
    return [inboxBatchParams, wasBatchTruncated]
  }

  private async _getSequencerBatchParams(
    l2StartBlock: number,
    nextBatchIndex: number,
    blocks: BatchToInbox
  ): Promise<InboxBatchParams> {
    // [1: DA type] [1: compress type] [32: batch index] [32: L2 start] [4: total blocks, max 65535] [<DATA> { [3: txs count] [5 block timestamp] [1: TX type 0-sequencer 1-enqueue] [3 tx data length] [raw tx data] [3 sign length *sequencerTx*] [sign data] [32 l1BlockNumber *enqueue*] [32 l1Origin *enqueue*].. } ...]
    // DA: 0 - L1, 1 - memo, 2 - celestia
    const da = encodeHex(0, 2)
    // Compress Type: 0 - none, 11 - zlib
    const compressType = encodeHex(11, 2)
    const batchIndex = encodeHex(nextBatchIndex, 64)
    const l2Start = encodeHex(l2StartBlock, 64)
    const totalElements = encodeHex(blocks.length, 8)

    let encodeBlockData = ''
    blocks.forEach((inboxElement: BatchToInboxElement) => {
      // block encode, [3 txs count] [5 block timestamp]
      // tx[0], [1 type 0 sequencerTx, 1 enqueue] [3 tx data length] [raw tx data] [3 sign length *sequencerTx*] [sign data] [32 l1BlockNumber *enqueue*] [32 l1Origin *enqueue*]
      encodeBlockData += encodeHex(inboxElement.txs.length, 6)
      encodeBlockData += encodeHex(inboxElement.timestamp, 10)

      inboxElement.txs.forEach((inboxTx: BatchToInboxRawTx) => {
        const curTx = inboxTx.rawTransaction
        if (curTx.length % 2 !== 0) {
          throw new Error('Unexpected uneven hex string value!')
        }
        encodeBlockData += encodeHex(inboxTx.isSequencerTx ? 0 : 1, 2)
        encodeBlockData += remove0x(
          BigNumber.from(remove0x(curTx).length / 2).toHexString()
        ).padStart(6, '0')
        encodeBlockData += remove0x(curTx)
        if (inboxTx.isSequencerTx) {
          encodeBlockData += remove0x(
            BigNumber.from(remove0x(inboxTx.seqSign).length / 2).toHexString()
          ).padStart(6, '0')
          encodeBlockData += inboxTx.seqSign
        } else {
          encodeBlockData += encodeHex(inboxTx.l1BlockNumber, 64)
          encodeBlockData += remove0x(inboxTx.l1TxOrigin)
        }
      })
    })
    return {
      inputData: encodeBlockData,
      batch: blocks,
    }
  }

  private async _getL2BatchElement(
    blockNumber: number
  ): Promise<BatchToInboxElement> {
    const block = await this._getBlock(blockNumber)
    this.logger.debug('Fetched L2 block', {
      block,
    })

    const batchElement: BatchToInboxElement = {
      stateRoot: block.stateRoot,
      timestamp: block.timestamp,
      blockNumber: block.number,
      txs: [],
    }
    block.transactions.forEach((l2Tx: L2Transaction) => {
      const batchElementTx: BatchToInboxRawTx = {
        rawTransaction: l2Tx.rawTransaction,
        isSequencerTx: this._isSequencerTx(l2Tx),
        seqSign: '',
        l1BlockNumber: null,
        l1TxOrigin: null,
      }
      if (batchElementTx.isSequencerTx) {
        if (!l2Tx.seqR) {
          batchElementTx.seqSign = ''
        } else {
          let r = remove0x(block.transactions[0].seqR)
          let s = remove0x(block.transactions[0].seqS)
          let v = remove0x(block.transactions[0].seqV)
          if (r === '0') {
            r = '00'
          } else {
            r = this.padZerosToLeft(r)
          }
          if (s === '0') {
            s = '00'
          } else {
            s = this.padZerosToLeft(s)
          }
          if (v.length % 2 === 1) {
            v = `0${v}`
          }
          // restore: '' has no sign, '000000' is zero sign, `{64}{64}{n}` if n is 00, seqV is 0x0
          batchElementTx.seqSign = `${r}${s}${v}`
        }
      } else {
        batchElementTx.l1BlockNumber = l2Tx.l1BlockNumber
        batchElementTx.l1TxOrigin = l2Tx.l1TxOrigin
      }
      batchElement.txs.push(batchElementTx)
    })

    return batchElement
  }

  private async _getBlock(blockNumber: number): Promise<L2Block> {
    const p = this.l2Provider.send('eth_getBlockByNumber', [
      this.toRpcHexString(blockNumber),
      true,
    ])
    return p as Promise<L2Block>
  }

  private _isSequencerTx(tx: L2Transaction): boolean {
    return tx.queueOrigin === QueueOrigin.Sequencer
  }

  private toRpcHexString(n: number): string {
    if (n === 0) {
      return '0x0'
    } else {
      // prettier-ignore
      return '0x' + toHexString(n).slice(2).replace(/^0+/, '')
    }
  }

  private padZerosToLeft(inputString: string): string {
    const targetLength = 64
    if (inputString.length >= targetLength) {
      return inputString
    }

    const zerosToPad = targetLength - inputString.length
    const paddedString = '0'.repeat(zerosToPad) + inputString
    return paddedString
  }
}
