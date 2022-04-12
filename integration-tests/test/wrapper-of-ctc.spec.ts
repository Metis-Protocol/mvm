import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import crypto from "crypto"

/* Imports: External */
import { ethers, BigNumber, Contract, utils, ContractReceipt, ContractTransaction } from 'ethers'
import { sleep } from '@metis.io/core-utils'
import {
  getContractInterface,
  getContractFactory,
} from '@eth-optimism/contracts'

/* Imports: Internal */
import { MvmEnv } from './shared/mvm-env'
import { l1Wallet, l1Wallet2, l1WalletSequencer } from './shared/mvm-utils'
import { cat } from 'shelljs'
import { MerkleTree } from 'merkletreejs'

describe('Mvm CTC wrapper Tests', async () => {
  const gasPrice = BigNumber.from('10000000000')
  const gasLimit = BigNumber.from('0x100000')
  let env: MvmEnv
  const chainId = 1088

  before(async () => {
    env = await MvmEnv.new()
    console.log(`env - mvm ctc: `, env.mvmCTC.address)
    // let tx = await env.mvmCTC.setAddressChainId(env.mvmCTC.address, chainId, {
    //   gasPrice,
    //   gasLimit
    // })
    // console.log('set tx is: ', tx)
  })

  it(`should load settings`, async () => {
    // const res_chainId = await env.mvmCTC.getAddressChainId(env.mvmDiscountOracle.address)
    // console.log(`${env.mvmDiscountOracle.address} mapping chain id is ${res_chainId}`)
    // expect(res_chainId).to.equal(chainId)

    let proofWindow = await env.scc.FRAUD_PROOF_WINDOW()
    console.log(`scc FRAUD_PROOF_WINDOW is ${proofWindow}`)
    if (proofWindow == 0) {
      await env.scc.setFraudProofWindow(7*24*60*60)
    }

    let result = await env.mvmCTC.getStakeBaseCost()
    console.log(`mvm CTC setting: stake base cost is ${result}`)
    expect(result).to.equal('100000000000000000')

    result = await env.mvmCTC.getTxDataSliceSize()
    console.log(`mvm CTC setting: tx data slice size is ${result}`)
    expect(result).to.equal(90000)

    result = await env.mvmCTC.getTxBatchSize()
    console.log(`mvm CTC setting: tx batch size is ${result}`)
    expect(result).to.equal(90000*8)

    result = await env.mvmCTC.getTxDataSliceCount()
    console.log(`mvm CTC setting: tx data slice count is ${result}`)
    expect(result).to.equal(8)

    result = await env.mvmCTC.getStakeSeqSeconds()
    console.log(`mvm CTC setting: stake seq seconds is ${result}`)
    expect(result).to.equal(24 * 60 * 60)

    let eventFilter = env.mvmCTC.filters.AppendBatchElement()
    let events = await env.mvmCTC.queryFilter(eventFilter)
    console.log('AppendBatchElement events', JSON.stringify(events))
  })

  it.skip(`should stake for verify failed with incorrect cost`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.verifierStake(chainId, 5, {
        value: BigNumber.from('200000000000000000')
      })
    }
    catch(x) {
      const ret = x.message.indexOf('stake cost incorrect') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should stake for verify failed with batch element does not exist`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.verifierStake(chainId, 5, {
        value: BigNumber.from('100000000000000000')
      })
    }
    catch(x) {
      const ret = x.message.indexOf('batch element does not exist') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should stake for verify failed with batch index has been staked`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.verifierStake(chainId, 0, {
        value: BigNumber.from('100000000000000000')
      })
    }
    catch(x) {
      const ret = x.message.indexOf('there is a stake for this batch index') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should stake for verify success`, async () => {
    console.log('ver balance 1 : ', (await l1Wallet2.getBalance()).toString())
    const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
    const tx: ContractTransaction = await mvmCTC2.verifierStake(chainId, 1, 21, {
      value: BigNumber.from('100000000000000000')
    })
    let receipt: ContractReceipt = await tx.wait()
    console.log(receipt.events?.filter((x) => {return x.event == "VerifierStake"}))
    console.log(`${env.l1Wallet2.address} stake tx: ${JSON.stringify(tx)}`)
    console.log('ver balance 2 : ', (await l1Wallet2.getBalance()).toString())
  })

  it.skip(`should withdraw stake for verify failed with during protection`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.withdrawStake(chainId, 0)
    }
    catch(x) {
      const ret = x.message.indexOf('can not withdraw during submit protection') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should withdraw stake for verify success`, async () => {
    const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
    const tx: ContractTransaction = await mvmCTC2.withdrawStake(chainId, 1)
    let receipt: ContractReceipt = await tx.wait()
    console.log(`${env.l1Wallet2.address} stake tx: ${JSON.stringify(tx)}`)
  })

  it.skip(`should set batch tx data failed with non-Sequencer`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.setBatchTxDataForStake(chainId, 0, 0, "", false)
    }
    catch(x) {
      const ret = x.message.indexOf('Function can only be called by the Sequencer') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should set batch tx data success`, async () => {
    // batchIndex = 0 with no tx data
    const hash = (el: Buffer | string): Buffer => {
      return Buffer.from(ethers.utils.keccak256(el).slice(2), 'hex')
    }
    const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    console.log('seq balance 1 : ', (await l1WalletSequencer.getBalance()).toString())
    const mvmCtcSeq = env.mvmCTC.connect(l1WalletSequencer)
    const hexData = '0000adf8ab8083e4e1c08409f5222094deaddeaddeaddeaddeaddeaddeaddeaddead000080b844a9059cbb000000000000000000000000420000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000648208a4a007c88534a589c55a624a34751d026cc08527a66cb9461bb576269a34a1a254bfa04af0e8a6ea611a7d870bc9ed31096bd6e76f2b68665da0ff992150ae13ab9b3d'
    const hexData2 = '0000adf8ab0183e4e1c08409f5222094deaddeaddeaddeaddeaddeaddeaddeaddead000080b844a9059cbb000000000000000000000000420000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000648208a4a047d75fbdb44c878a29aee6219eb012798abb437cfc12cb85d94010063fc2b7d4a0607974304486ae87ea4a6feed1fa640cec39f86839448cd1066b9d26e0fde31e'
    let leafs = []
    leafs.push(ethers.utils.keccak256(ethers.utils.solidityPack(['uint256', 'bytes'], [21, fromHexString(hexData)])))
    leafs.push(ethers.utils.keccak256(ethers.utils.solidityPack(['uint256', 'bytes'], [22, fromHexString(hexData2)])))
    const tree = new MerkleTree(leafs, hash)
    console.log('root', tree.getHexRoot())
    let proof = tree.getHexProof(leafs[0], 0)
    console.log('proof', proof)
    console.log('leafs', leafs)
    const bytesProof = []
    for(let i = 0; i < proof.length; i++) {
      bytesProof.push(fromHexString(proof[i].slice(2)))
    }
    // let ooo = await mvmCtcSeq.checkBatchTxHash(chainId, 1, 21, fromHexString(hexData))
    // console.log('check keccak256', ooo)
    let tx: ContractTransaction = await mvmCtcSeq.setBatchTxDataForStake(chainId, 1, 21, fromHexString(hexData), 0, 2, proof)
    let receipt: ContractReceipt = await tx.wait()
    console.log(`set tx data by block number: ${JSON.stringify(tx)}`)
    console.log('seq balance 2 : ', (await l1WalletSequencer.getBalance()).toString())
  })

  it.skip(`should get batch tx data`, async () => {
    // batchIndex = 0 with no tx data
    const mvmCtcSeq = env.mvmCTC.connect(l1WalletSequencer)
    let txData = await mvmCtcSeq.getBatchTxData(chainId, 1, 90)
    console.log(`get tx data: ${txData}`)
    expect(txData[1]).to.true
    expect(txData[0]).to.equal('0x0000adf8ab8083e4e1c08409f5222094deaddeaddeaddeaddeaddeaddeaddeaddead000080b844a9059cbb000000000000000000000000420000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000648208a4a007c88534a589c55a624a34751d026cc08527a66cb9461bb576269a34a1a254bfa04af0e8a6ea611a7d870bc9ed31096bd6e76f2b68665da0ff992150ae13ab9b3d')
  })

  it.skip(`should set batch tx data for verify failed with during protection`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.setBatchTxDataForStake(chainId, 1, 0, '0000adf8ab8083e4e1c08409f5222094deaddeaddeaddeaddeaddeaddeaddeaddead000080b844a9059cbb000000000000000000000000420000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000', false)
    }
    catch(x) {
      const ret = x.message.indexOf('can not submit during sequencer submit protection') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should set batch tx data for verify failed with during protection`, async () => {
    try {
      const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
      const tx: ContractTransaction = await mvmCTC2.setBatchTxDataForVerifier(chainId, 1, 0, '0000adf8ab8083e4e1c08409f5222094deaddeaddeaddeaddeaddeaddeaddeaddead000080b844a9059cbb000000000000000000000000420000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000', false)
    }
    catch(x) {
      const ret = x.message.indexOf('can not submit during sequencer submit protection') >= 0
      expect(ret).to.be.true
    }
  })

  it.skip(`should set batch tx data for verify success after protection`, async () => {
    let result = await env.mvmCTC.getStakeSeqSeconds()
    console.log(`mvm CTC setting: stake seq seconds is ${result}`)

    // batchIndex = 0 with no tx data
    console.log('verifier balance 1 : ', (await l1Wallet2.getBalance()).toString())
    const mvmCTC2 = env.mvmCTC.connect(l1Wallet2)
    let tx: ContractTransaction = await mvmCTC2.setBatchTxDataForVerifier(chainId, 3, 0, '0000adf8ab8083e4e1c08409f5222094deaddeaddeaddeaddeaddeaddeaddeaddead000080b844a9059cbb000000000000000000000000420000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000', false)
    let receipt: ContractReceipt = await tx.wait()
    console.log(`set tx data slice 1: ${JSON.stringify(tx)}`)
    tx = await mvmCTC2.setBatchTxDataForVerifier(chainId, 3, 1, '648208a4a007c88534a589c55a624a34751d026cc08527a66cb9461bb576269a34a1a254bfa04af0e8a6ea611a7d870bc9ed31096bd6e76f2b68665da0ff992150ae13ab9b3d', true)
    receipt = await tx.wait()
    console.log(`set tx data slice 2: ${JSON.stringify(tx)}`)
    console.log('verifier balance 2 : ', (await l1Wallet2.getBalance()).toString())
  })

})

