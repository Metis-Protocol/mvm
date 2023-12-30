import { Signer, utils, ethers, PopulatedTransaction } from 'ethers'
import {
  TransactionReceipt,
  TransactionResponse,
  Provider,
} from '@ethersproject/abstract-provider'
import * as ynatm from '@eth-optimism/ynatm'

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
  txSigned: string,
  provider: Provider,
  config: ResubmissionConfig,
  numConfirmations: number,
  hooks: TxSubmissionHooks
): Promise<TransactionReceipt> => {
  // TODO config.maxGasPriceInGwei compare to tx.gasPrice
  const sendTxAndWaitForReceipt = async (): Promise<TransactionReceipt> => {
    hooks.beforeSendTransaction(tx)
    const txResponse = await provider.sendTransaction(txSigned)
    hooks.onTransactionResponse(txResponse)
    return provider.waitForTransaction(txResponse.hash, numConfirmations)
  }

  return sendTxAndWaitForReceipt()
}

export interface TransactionSubmitter {
  submitTransaction(
    tx: PopulatedTransaction,
    hooks?: TxSubmissionHooks
  ): Promise<TransactionReceipt>

  submitSignedTransaction(
    tx: PopulatedTransaction,
    txSigned: string,
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
    txSigned: string,
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
      txSigned,
      this.signer.provider,
      this.ynatmConfig,
      this.numConfirmations,
      hooks
    )
  }
}
