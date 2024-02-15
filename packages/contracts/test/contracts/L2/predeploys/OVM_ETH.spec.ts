import { expect } from '../../../setup'

/* External Imports */
import { ethers } from 'hardhat'
import { ContractFactory, Contract, Signer } from 'ethers'

describe('OVM_ETH', () => {
  let signer1: Signer
  let signer2: Signer
  before(async () => {
    ;[signer1, signer2] = await ethers.getSigners()
  })

  let Factory__OVM_ETH: ContractFactory
  before(async () => {
    Factory__OVM_ETH = await ethers.getContractFactory('OVM_ETH')
  })

  let OVM_ETH: Contract
  beforeEach(async () => {
    OVM_ETH = await Factory__OVM_ETH.deploy()
  })

  describe('transfer', () => {
    it('should revert', async () => {
      await expect(
        OVM_ETH.transfer(await signer2.getAddress(), 100)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })
  })

  describe('approve', () => {
    it('should not revert', async () => {
      await expect(OVM_ETH.approve(await signer2.getAddress(), 100)).to.be.not
        .reverted
    })
  })

  describe('transferFrom', () => {
    it('should revert', async () => {
      await expect(
        OVM_ETH.transferFrom(
          await signer1.getAddress(),
          await signer2.getAddress(),
          100
        )
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })
  })

  describe('increaseAllowance', () => {
    it('should bot revert', async () => {
      await expect(OVM_ETH.increaseAllowance(await signer2.getAddress(), 100))
        .to.be.not.reverted
    })
  })

  describe('decreaseAllowance', () => {
    it('should revert', async () => {
      await expect(
        OVM_ETH.decreaseAllowance(await signer2.getAddress(), 100)
      ).to.be.revertedWith('ERC20: decreased allowance below zero')
    })
  })
})
