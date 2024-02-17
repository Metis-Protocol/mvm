/* External Imports */
import { Promise as bPromise } from 'bluebird'
import { Contract, ethers, Signer, providers } from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getContractFactory } from '@metis.io/contracts'
import { L2Block, RollupInfo, Bytes32, remove0x } from '@metis.io/core-utils'
import { Logger, Metrics } from '@eth-optimism/common-ts'

/* Internal Imports */
import { BlockRange, BatchSubmitter } from '.'
import { TransactionSubmitter, MpcClient } from '../utils'
import { randomUUID } from 'crypto'

export class StateBatchSubmitter extends BatchSubmitter {
  // TODO: Change this so that we calculate start = scc.totalElements() and end = ctc.totalElements()!
  // Not based on the length of the L2 chain -- that is only used in the batch submitter
  // Note this means we've got to change the state / end calc logic

  protected l2ChainId: number
  protected syncing: boolean
  protected ctcContract: Contract
  private fraudSubmissionAddress: string
  private transactionSubmitter: TransactionSubmitter
  private mpcUrl: string

  constructor(
    signer: Signer,
    l2Provider: providers.StaticJsonRpcProvider,
    minTxSize: number,
    maxTxSize: number,
    maxBatchSize: number,
    maxBatchSubmissionTime: number,
    numConfirmations: number,
    resubmissionTimeout: number,
    finalityConfirmations: number,
    addressManagerAddress: string,
    minBalanceEther: number,
    transactionSubmitter: TransactionSubmitter,
    blockOffset: number,
    logger: Logger,
    metrics: Metrics,
    fraudSubmissionAddress: string,
    mpcUrl: string
  ) {
    super(
      signer,
      l2Provider,
      minTxSize,
      maxTxSize,
      maxBatchSize,
      maxBatchSubmissionTime,
      numConfirmations,
      resubmissionTimeout,
      finalityConfirmations,
      addressManagerAddress,
      minBalanceEther,
      blockOffset,
      logger,
      metrics
    )
    this.fraudSubmissionAddress = fraudSubmissionAddress
    this.transactionSubmitter = transactionSubmitter
    this.mpcUrl = mpcUrl
  }

  /*****************************
   * Batch Submitter Overrides *
   ****************************/

  public async _updateChainInfo(): Promise<void> {
    const info: RollupInfo = await this._getRollupInfo()
    if (info.mode === 'verifier') {
      this.logger.error(
        'Verifier mode enabled! Batch submitter only compatible with sequencer mode'
      )
      process.exit(1)
    }
    this.syncing = info.syncing
    const addrs = await this._getChainAddresses()
    const sccAddress = addrs.sccAddress
    const ctcAddress = addrs.ctcAddress

    if (
      typeof this.chainContract !== 'undefined' &&
      sccAddress === this.chainContract.address &&
      ctcAddress === this.ctcContract.address
    ) {
      this.logger.debug('Chain contract already initialized', {
        sccAddress,
        ctcAddress,
      })
      return
    }

    this.chainContract = (
      await getContractFactory('StateCommitmentChain', this.signer)
    ).attach(sccAddress)
    this.ctcContract = (
      await getContractFactory('CanonicalTransactionChain', this.signer)
    ).attach(ctcAddress)

    this.logger.info('Connected Optimism contracts', {
      stateCommitmentChain: this.chainContract.address,
      canonicalTransactionChain: this.ctcContract.address,
    })
    return
  }

  public async _onSync(): Promise<TransactionReceipt> {
    this.logger.info('Syncing mode enabled! Skipping state batch submission...')
    return
  }

  public async _getBatchStartAndEnd(): Promise<BlockRange> {
    this.logger.info('Getting batch start and end for state batch submitter...')
    const startBlock: number =
      (
        await this.chainContract.getTotalElementsByChainId(this.l2ChainId)
      ).toNumber() + this.blockOffset
    this.logger.info('Retrieved start block number from SCC', {
      startBlock,
    })

    // We will submit state roots for txs which have been in the tx chain for a while.
    const totalElements: number =
      (
        await this.ctcContract.getTotalElementsByChainId(this.l2ChainId)
      ).toNumber() + this.blockOffset
    //this.logger.info('Retrieved total elements from CTC', {
    //  totalElements,
    //})

    const endBlock: number = Math.min(
      startBlock + this.maxBatchSize,
      totalElements
    )

    if (startBlock >= endBlock) {
      if (startBlock > endBlock) {
        this.logger.error(
          'State commitment chain is larger than transaction chain. This should never happen!'
        )
      }
      this.logger.info(
        'No state commitments to submit. Skipping batch submission...'
      )
      return
    }
    return {
      start: startBlock,
      end: endBlock,
    }
  }

  public async _submitBatch(
    startBlock: number,
    endBlock: number
  ): Promise<TransactionReceipt> {
    // eslint-disable-next-line radix
    const proposer = parseInt(this.l2ChainId.toString()) + '_MVM_Proposer'
    const batch = await this._generateStateCommitmentBatch(startBlock, endBlock)
    const calldata = this.chainContract.interface.encodeFunctionData(
      'appendStateBatchByChainId',
      [this.l2ChainId, batch, startBlock, proposer]
    )
    const batchSizeInBytes = remove0x(calldata).length / 2
    this.logger.debug('State batch generated', {
      batchSizeInBytes,
      calldata,
    })

    if (!this._shouldSubmitBatch(batchSizeInBytes)) {
      return
    }

    const offsetStartsAtIndex = startBlock - this.blockOffset
    this.logger.debug('Submitting batch.', { calldata })

    // Generate the transaction we will repeatedly submit
    const nonce = await this.signer.getTransactionCount() //mpc address , 2 mpc addresses
    // state ctc are different signer addresses.
    const tx =
      await this.chainContract.populateTransaction.appendStateBatchByChainId(
        this.l2ChainId,
        batch,
        offsetStartsAtIndex,
        proposer,
        { nonce }
      )

    // MPC enabled: prepare nonce, gasPrice
    if (this.mpcUrl) {
      this.logger.info('submitter state with mpc', { url: this.mpcUrl })
      const mpcClient = new MpcClient(this.mpcUrl)
      const mpcInfo = await mpcClient.getLatestMpc('1')
      if (!mpcInfo || !mpcInfo.mpc_address) {
        throw new Error('MPC 1 info get failed')
      }
      const mpcAddress = mpcInfo.mpc_address
      tx.nonce = await this.signer.provider.getTransactionCount(mpcAddress)
      tx.gasLimit = await this.signer.provider.estimateGas({
        to: tx.to,
        from: mpcAddress,
        data: tx.data,
      })
      tx.value = ethers.utils.parseEther('0')
      // mpc model can't use ynatm, set more gas price?
      const gasPrice = await this.signer.provider.getGasPrice()
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
        throw new Error('MPC 1 propose sign failed')
      }

      const signedTx = await mpcClient.getMpcSign(signId)
      if (!signedTx) {
        throw new Error('MPC 1 get sign failed')
      }

      const submitSignedTransaction = (): Promise<TransactionReceipt> => {
        return this.transactionSubmitter.submitSignedTransaction(
          tx,
          signedTx,
          this._makeHooks('appendSequencerBatch')
        )
      }
      return this._submitAndLogTx(
        submitSignedTransaction,
        'Submitted state root batch with MPC!'
      )
    }

    this.logger.info('Submitting batch.', {
      chainId: this.l2ChainId,
      proposer,
    })
    const submitTransaction = (): Promise<TransactionReceipt> => {
      return this.transactionSubmitter.submitTransaction(
        tx,
        this._makeHooks('appendStateBatch')
      )
    }
    return this._submitAndLogTx(
      submitTransaction,
      'Submitted state root batch!'
    )
  }

  /*********************
   * Private Functions *
   ********************/

  private async _generateStateCommitmentBatch(
    startBlock: number,
    endBlock: number
  ): Promise<Bytes32[]> {
    const blockRange = endBlock - startBlock
    const batch: Bytes32[] = await bPromise.map(
      [...Array(blockRange).keys()],
      async (i: number) => {
        this.logger.debug('Fetching L2BatchElement', {
          blockNo: startBlock + i,
        })
        const block = (await this.l2Provider.getBlockWithTransactions(
          startBlock + i
        )) as L2Block
        const blockTx = block.transactions[0]
        if (blockTx.from === this.fraudSubmissionAddress) {
          this.logger.warn('Found transaction from fraud submission address', {
            txHash: blockTx.hash,
            fraudSubmissionAddress: this.fraudSubmissionAddress,
          })
          this.fraudSubmissionAddress = 'no fraud'
          return '0xbad1bad1bad1bad1bad1bad1bad1bad1bad1bad1bad1bad1bad1bad1bad1bad1'
        }
        return block.stateRoot
      },
      { concurrency: 100 }
    )

    const proposer = parseInt(this.l2ChainId.toString()) + '_MVM_Proposer'
    let tx = this.chainContract.interface.encodeFunctionData(
      'appendStateBatchByChainId',
      [this.l2ChainId, batch, startBlock, proposer]
    )
    while (remove0x(tx).length / 2 > this.maxTxSize) {
      batch.splice(Math.ceil((batch.length * 2) / 3)) // Delete 1/3rd of all of the batch elements
      this.logger.debug('Splicing batch...', {
        batchSizeInBytes: tx.length / 2,
      })
      tx = this.chainContract.interface.encodeFunctionData(
        'appendStateBatchByChainId',
        [this.l2ChainId, batch, startBlock, proposer]
      )
    }

    this.logger.info('Generated state commitment batch', {
      batch, // list of stateRoots
    })
    return batch
  }
}
