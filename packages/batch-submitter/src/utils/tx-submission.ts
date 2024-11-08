import { Signer, utils, ethers, PopulatedTransaction } from 'ethers'
import {
  TransactionReceipt,
  TransactionResponse,
  Provider,
} from '@ethersproject/abstract-provider'
import * as ynatm from '@eth-optimism/ynatm'

import { YnatmAsync } from '../utils'

export interface ResubmissionConfig {
  resubmissionTimeout: number
  minGasPriceInGwei: number
  maxGasPriceInGwei: number
  gasRetryIncrement: number
}

export type SubmitTransactionFn = (
  tx: PopulatedTransaction
) => Promise<TransactionReceipt>

export interface TxSubmissionHooks {
  beforeSendTransaction: (tx: PopulatedTransaction) => void
  onTransactionResponse: (txResponse: TransactionResponse) => void
}

const getGasPriceInGwei = async (signer: Signer): Promise<number> => {
  return parseInt(
    ethers.utils.formatUnits(await signer.getGasPrice(), 'gwei'),
    10
  )
}

export const submitTransactionWithYNATM = async (
  tx: PopulatedTransaction,
  signer: Signer,
  config: ResubmissionConfig,
  numConfirmations: number,
  hooks: TxSubmissionHooks
): Promise<TransactionReceipt> => {
  const sendTxAndWaitForReceipt = async (
    gasPrice
  ): Promise<TransactionReceipt> => {
    const fullTx = {
      ...tx,
      gasPrice,
    }
    hooks.beforeSendTransaction(fullTx)
    const txResponse = await signer.sendTransaction(fullTx)
    hooks.onTransactionResponse(txResponse)
    return signer.provider.waitForTransaction(txResponse.hash, numConfirmations)
  }

  const minGasPrice = await getGasPriceInGwei(signer)
  const receipt = await ynatm.send({
    sendTransactionFunction: sendTxAndWaitForReceipt,
    minGasPrice: ynatm.toGwei(minGasPrice),
    maxGasPrice: ynatm.toGwei(config.maxGasPriceInGwei),
    gasPriceScalingFunction: ynatm.LINEAR(config.gasRetryIncrement),
    delay: config.resubmissionTimeout,
  })
  return receipt
}

export const submitSignedTransactionWithYNATM = async (
  tx: PopulatedTransaction,
  signFunction: Function,
  signer: Signer,
  config: ResubmissionConfig,
  numConfirmations: number,
  hooks: TxSubmissionHooks
): Promise<TransactionReceipt> => {
  const sendTxAndWaitForReceipt = async (
    signedTx
  ): Promise<TransactionReceipt> => {
    hooks.beforeSendTransaction(tx)
    const txResponse = await signer.provider.sendTransaction(signedTx)
    hooks.onTransactionResponse(txResponse)
    return signer.provider.waitForTransaction(txResponse.hash, numConfirmations)
  }

  const ynatmAsync = new YnatmAsync()
  const minGasPrice = await getGasPriceInGwei(signer)
  const receipt = await ynatmAsync.sendAfterSign({
    sendSignedTransactionFunction: sendTxAndWaitForReceipt,
    signFunction,
    minGasPrice: ynatmAsync.toGwei(minGasPrice),
    maxGasPrice: ynatmAsync.toGwei(config.maxGasPriceInGwei),
    gasPriceScalingFunction: ynatm.LINEAR(config.gasRetryIncrement),
    delay: config.resubmissionTimeout,
  })
  return receipt
}

export interface TransactionSubmitter {
  submitTransaction(
    tx: PopulatedTransaction,
    hooks?: TxSubmissionHooks
  ): Promise<TransactionReceipt>

  submitSignedTransaction(
    tx: PopulatedTransaction,
    signFunction: Function,
    hooks?: TxSubmissionHooks
  ): Promise<TransactionReceipt>
}

export class YnatmTransactionSubmitter implements TransactionSubmitter {
  constructor(
    readonly signer: Signer,
    readonly ynatmConfig: ResubmissionConfig,
    readonly numConfirmations: number
  ) {}

  public async submitTransaction(
    tx: PopulatedTransaction,
    hooks?: TxSubmissionHooks
  ): Promise<TransactionReceipt> {
    if (!hooks) {
      hooks = {
        beforeSendTransaction: () => undefined,
        onTransactionResponse: () => undefined,
      }
    }
    return submitTransactionWithYNATM(
      tx,
      this.signer,
      this.ynatmConfig,
      this.numConfirmations,
      hooks
    )
  }

  public async submitSignedTransaction(
    tx: PopulatedTransaction,
    signFunction: Function,
    hooks?: TxSubmissionHooks
  ): Promise<TransactionReceipt> {
    if (!hooks) {
      hooks = {
        beforeSendTransaction: () => undefined,
        onTransactionResponse: () => undefined,
      }
    }
    return submitSignedTransactionWithYNATM(
      tx,
      signFunction,
      this.signer,
      this.ynatmConfig,
      this.numConfirmations,
      hooks
    )
  }
}
