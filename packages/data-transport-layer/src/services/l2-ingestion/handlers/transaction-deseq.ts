/* Imports: External */
import { BigNumber, ethers } from 'ethers'
import { serialize } from '@ethersproject/transactions'

/* Imports: Internal */
import { TransportDB } from '../../../db/transport-db'
import {
  DecodedSequencerBatchTransaction,
  StateRootEntry,
  TransactionEntry,
  BlockEntry,
} from '../../../types'
import { padHexString, parseSignatureVParam } from '../../../utils'

// de-seq-block higher blocks parse and store
export const handleDeSequencerBlock = {
  parseBlock: async (
    block: any,
    chainId: number
  ): Promise<{
    blockEntry: BlockEntry
    stateRootEntry: StateRootEntry
  }> => {
    const txEntryList = block.transactions.map((transaction) => {
      const transactionIndex =
        transaction.index === null || transaction.index === undefined
          ? BigNumber.from(transaction.blockNumber).toNumber() - 1
          : BigNumber.from(transaction.index).toNumber()

      let transactionEntry: Partial<TransactionEntry> = {
        // Legacy support.
        index: transactionIndex,
        value: transaction.value,
        batchIndex: null,
        blockNumber: BigNumber.from(transaction.l1BlockNumber).toNumber(),
        timestamp: BigNumber.from(transaction.l1Timestamp).toNumber(),
        queueOrigin: transaction.queueOrigin,
        confirmed: false,
      }

      if (transaction.queueOrigin === 'sequencer') {
        const decodedTransaction: DecodedSequencerBatchTransaction = {
          sig: {
            v: parseSignatureVParam(transaction.v, chainId),
            r: padHexString(transaction.r, 32),
            s: padHexString(transaction.s, 32),
          },
          value: transaction.value,
          gasLimit: BigNumber.from(transaction.gas).toString(),
          gasPrice: BigNumber.from(transaction.gasPrice).toString(),
          nonce: BigNumber.from(transaction.nonce).toString(),
          target: transaction.to,
          data: transaction.input,
        }

        transactionEntry = {
          ...transactionEntry,
          gasLimit: BigNumber.from(0).toString(),
          target: ethers.constants.AddressZero,
          origin: null,
          data: serialize(
            {
              value: transaction.value,
              gasLimit: transaction.gas,
              gasPrice: transaction.gasPrice,
              nonce: transaction.nonce,
              to: transaction.to,
              data: transaction.input,
              chainId,
            },
            {
              v: BigNumber.from(transaction.v).toNumber(),
              r: padHexString(transaction.r, 32),
              s: padHexString(transaction.s, 32),
            }
          ),
          decoded: decodedTransaction,
          queueIndex: null,
        }
        // l2 de-seq sign
        if (transaction.seqR) {
          transactionEntry.seqSign = `${transaction.seqR},${transaction.seqS},${transaction.seqV}`
        }
      } else {
        transactionEntry = {
          ...transactionEntry,
          gasLimit: BigNumber.from(transaction.gas).toString(),
          target: ethers.utils.getAddress(transaction.to),
          origin: ethers.utils.getAddress(transaction.l1TxOrigin),
          data: transaction.input,
          decoded: null,
          queueIndex:
            transaction.queueIndex === null ||
            transaction.queueIndex === undefined
              ? BigNumber.from(transaction.nonce).toNumber()
              : BigNumber.from(transaction.queueIndex).toNumber(),
        }
      }
      return transactionEntry as TransactionEntry
    })
    const blockEntry: BlockEntry = {
      index: block.number - 1, // keep same rule as single tx index
      batchIndex: null,
      timestamp: block.timestamp,
      transactions: txEntryList,
      confirmed: false,
    }
    const stateRootEntry: StateRootEntry = {
      index: block.number - 1, // tx0 index
      batchIndex: null,
      value: block.stateRoot,
      confirmed: false,
    }
    return { blockEntry, stateRootEntry }
  },
  storeBlock: async (
    entry: {
      blockEntry: BlockEntry
      stateRootEntry: StateRootEntry
    },
    db: TransportDB
  ): Promise<void> => {
    // Having separate indices for confirmed/unconfirmed means we never have to worry about
    // accidentally overwriting a confirmed transaction with an unconfirmed one. Unconfirmed
    // transactions are purely extra information.
    await db.putUnconfirmedBlockEntries([entry.blockEntry])
    await db.putUnconfirmedStateRootEntries([entry.stateRootEntry])
  },
}
