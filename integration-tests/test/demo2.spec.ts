import { Contract, ContractFactory, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { TxGasLimit, TxGasPrice } from '@metis.io/core-utils'
import chai, { expect } from 'chai'
import { GWEI } from './shared/utils'
import { OptimismEnv } from './shared/env'
import { solidity } from 'ethereum-waffle'
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
import { Watcher } from '@metis.io/core-utils'

chai.use(solidity)


let l1Provider: JsonRpcProvider
let l2Provider: JsonRpcProvider
let l2PeerProvider: JsonRpcProvider
let l1Wallet: Wallet
let l2Wallet: Wallet
let l2PeerWallet: Wallet
let AddressManager: Contract
let watcher: Watcher
export const getEnvironment = async (): Promise<{
    l1Provider: JsonRpcProvider,
    l2Provider: JsonRpcProvider,
    l2PeerProvider: JsonRpcProvider,
    l1Wallet: Wallet,
    l2Wallet: Wallet,
    l2PeerWallet: Wallet
}> => {
    l1Provider = new JsonRpcProvider("http://localhost:9545")
    l2Provider = new JsonRpcProvider("http://localhost:8545")
    l2PeerProvider = new JsonRpcProvider("http://localhost:10545")

    l1Wallet = new Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", l1Provider)
    l2Wallet = new Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", l2Provider)
    l2PeerWallet = new Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", l2PeerProvider)


    return {
        l1Provider,
        l2Provider,
        l2PeerProvider,
        l1Wallet,
        l2Wallet,
        l2PeerWallet
    }
}

describe('Basic ERC20 interactions', async () => {
  const initialAmount = 1000
  const tokenName = 'OVM Test'
  const tokenDecimals = 8
  const TokenSymbol = 'OVM'

  let wallet: Wallet
  let other: Wallet
  let Factory__ERC20: ContractFactory
  let ERC20: Contract

  before(async () => {
    const system = await getEnvironment()
    l1Provider = system.l1Provider
    l2Provider = system.l2Provider
    l2PeerProvider = system.l2Provider
    l1Wallet = system.l1Wallet
    l2Wallet = system.l2Wallet
    l2PeerWallet = system.l2Wallet

    wallet = l2Wallet
    other = Wallet.createRandom().connect(l2Provider)
    Factory__ERC20 = await ethers.getContractFactory('ERC20', wallet)

  })

  beforeEach(async () => {
    // ERC20 = Factory__ERC20.connect(l2Wallet).attach("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
    ERC20 = await Factory__ERC20.deploy(
      initialAmount,
      tokenName,
      tokenDecimals,
      TokenSymbol,
      {
        gasLimit:645490000,
        gasPrice:15000000
      }
    )
    console.log(ERC20.address)
  })

  it.skip('should set the total supply', async () => {
    const totalSupply = await ERC20.totalSupply()
    expect(totalSupply.toNumber()).to.equal(initialAmount)
  })

  it.skip('should get the token name', async () => {
    const name = await ERC20.name()
    expect(name).to.equal(tokenName)

    const peerErc20=Factory__ERC20.connect(l2PeerWallet).attach(ERC20.address)
    console.log(await peerErc20.name())
  })

  it.skip('should get the token decimals', async () => {
    const decimals = await ERC20.decimals()
    expect(decimals).to.equal(tokenDecimals)
  })

  it.skip('should get the token symbol', async () => {
    const symbol = await ERC20.symbol()
    expect(symbol).to.equal(TokenSymbol)
  })

  it.skip('should assign initial balance', async () => {
    const balance = await ERC20.balanceOf(wallet.address)
    expect(balance.toNumber()).to.equal(initialAmount)
  })

  it.skip('should transfer amount to destination account', async () => {

    const peerErc20=Factory__ERC20.connect(l2PeerWallet).attach(ERC20.address)
    console.log("token:"+await ERC20.balanceOf(l2Wallet.address)+","+await peerErc20.balanceOf(l2PeerWallet.address))
    const transfer = await ERC20.transfer(other.address, 100)
    const receipt = await transfer.wait()
    console.log("token:"+await ERC20.balanceOf(l2Wallet.address)+","+await peerErc20.balanceOf(l2PeerWallet.address))

    // // The expected fee paid is the value returned by eth_estimateGas
    // const gasLimit = await ERC20.estimateGas.transfer(other.address, 100)
    // const gasPrice = await wallet.getGasPrice()
    // expect(gasPrice).to.deep.equal(TxGasPrice)
    // const expectedFeePaid = gasLimit.mul(gasPrice)

    // // There are two events from the transfer with the first being
    // // the ETH fee paid and the second of the value transfered (100)
    // expect(receipt.events.length).to.equal(2)
    // expect(receipt.events[0].args._value).to.deep.equal(expectedFeePaid)
    // expect(receipt.events[1].args._from).to.equal(wallet.address)
    // expect(receipt.events[1].args._value.toNumber()).to.equal(100)

    // const receiverBalance = await ERC20.balanceOf(other.address)
    // const senderBalance = await ERC20.balanceOf(wallet.address)

    // expect(receiverBalance.toNumber()).to.equal(100)
    // expect(senderBalance.toNumber()).to.equal(900)
  })

  it.skip('should revert if trying to transfer too much', async () => {
    await expect(
      ERC20.transfer(other.address, initialAmount * 2)
    ).to.be.revertedWith('insufficient balance')
  })
})
