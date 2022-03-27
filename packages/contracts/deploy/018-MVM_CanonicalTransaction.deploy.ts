/* Imports: External */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'ethers'
import { hexStringEquals, registerAddress } from '../src/hardhat-deploy-ethers'
/* Imports: Internal */
import { predeploys } from '../src/predeploys'
import {
  getContractInterface,
  getContractDefinition,
} from '../src/contract-defs'
import {
  getDeployedContract,
  waitUntilTrue,
  getAdvancedContract,
  deployAndRegister,
} from '../src/hardhat-deploy-ethers'

const deployFn: DeployFunction = async (hre) => {
  const { deployer } = await hre.getNamedAccounts()

  const txDataSliceSize = 90000
  const stakeSeqSeconds = 24 * 60 * 60
  const stakeCost = '100000000000000000'
  const txBatchSize = 90000 * 5
  const txDataSliceCount = 5

  const Lib_AddressManager = await getDeployedContract(
    hre,
    'Lib_AddressManager'
  )

// Set up a reference to the proxy as if it were the L1StandardBridge contract.
  const contract = await getDeployedContract(
    hre,
    'Proxy__MVM_CanonicalTransaction',
    {
      iface: 'MVM_CanonicalTransaction',
      signerOrProvider: deployer,
    }
  )

  // Because of the `iface` parameter supplied to the deployment function above, the `contract`
  // variable that we here will have the interface of the L1StandardBridge contract. However,
  // we also need to interact with the contract as if it were a L1ChugSplashProxy contract so
  // we instantiate a new ethers.Contract object with the same address and signer but with the
  // L1ChugSplashProxy interface.
  const proxy = getAdvancedContract({
    hre,
    contract: new ethers.Contract(
      contract.address,
      getContractInterface('L1ChugSplashProxy'),
      contract.signer
    ),
  })

  // First we need to set the correct implementation code. We'll set the code and then check
  // that the code was indeed correctly set.
  const managerArtifact = getContractDefinition('MVM_CanonicalTransaction')
  const managerCode = managerArtifact.deployedBytecode

  console.log(`Setting verifier code...`)
  await proxy.setCode(managerCode)

  console.log(`Confirming that verifier code is correct...`)
  await waitUntilTrue(async () => {
    const implementation = await proxy.callStatic.getImplementation()
    return (
      !hexStringEquals(implementation, ethers.constants.AddressZero) &&
      hexStringEquals(
        await contract.provider.getCode(implementation),
        managerCode
      )
    )
  })

  console.log(`Setting addressmgr address to ${Lib_AddressManager.address}...`)
  // Set Slot 1 to the Address Manager Address
  await proxy.setStorage(
    hre.ethers.utils.hexZeroPad('0x00', 32),
    hre.ethers.utils.hexZeroPad(Lib_AddressManager.address, 32)
  )

  console.log(`Confirming that addressmgr address was correctly set...`)
  console.log(await contract.libAddressManager())
  await waitUntilTrue(async () => {
    return hexStringEquals(
      await contract.libAddressManager(),
      Lib_AddressManager.address
    )
  })

  console.log(
    `Setting txDataSliceSize to ${txDataSliceSize}...`
  )
  // Set Slot 2 to the txDataSliceSize
  await proxy.setStorage(
    hre.ethers.utils.hexZeroPad('0x01', 32),
    hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexValue(txDataSliceSize), 32)
  )

  console.log(`Confirming that txDataSliceSize was correctly set...`)
  await waitUntilTrue(async () => {
    return await contract.txDataSliceSize() == txDataSliceSize
  })

  console.log(
    `Setting stakeSeqSeconds to ${stakeSeqSeconds}...`
  )
  // Set Slot 3 to the stakeSeqSeconds
  await proxy.setStorage(
    hre.ethers.utils.hexZeroPad('0x02', 32),
    hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexValue(stakeSeqSeconds), 32)
  )

  console.log(`Confirming that stakeSeqSeconds was correctly set...`)
  await waitUntilTrue(async () => {
    return await contract.stakeSeqSeconds() == stakeSeqSeconds
  })

  console.log(
    `Setting stakeCost to ${stakeCost}...`
  )
  // Set Slot 4 to the stakeCost
  await proxy.setStorage(
    hre.ethers.utils.hexZeroPad('0x03', 32),
    hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexValue(hre.ethers.BigNumber.from(stakeCost).toBigInt()), 32)
  )

  console.log(`Confirming that stakeCost was correctly set...`)
  await waitUntilTrue(async () => {
    return await contract.stakeCost() == stakeCost
  })

  console.log(
    `Setting txDataSliceCount to ${txDataSliceCount}...`
  )
  // Set Slot 5 to the txDataSliceCount
  await proxy.setStorage(
    hre.ethers.utils.hexZeroPad('0x04', 32),
    hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexValue(txDataSliceCount), 32)
  )

  console.log(`Confirming that txDataSliceCount was correctly set...`)
  await waitUntilTrue(async () => {
    return await contract.txDataSliceCount() == txDataSliceCount
  })

  console.log(
    `Setting txBatchSize to ${txBatchSize}...`
  )
  // Set Slot 6 to the txBatchSize
  await proxy.setStorage(
    hre.ethers.utils.hexZeroPad('0x05', 32),
    hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexValue(txBatchSize), 32)
  )

  console.log(`Confirming that txBatchSize was correctly set...`)
  await waitUntilTrue(async () => {
    return await contract.txBatchSize() == txBatchSize
  })

  // console.log(
  //   `Setting useWhiteList to ${true}...`
  // )
  // // Set Slot 7 to the useWhiteList
  // await proxy.setStorage(
  //   hre.ethers.utils.hexZeroPad('0x06', 32),
  //   hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexValue(1), 32)
  // )

  // console.log(`Confirming that useWhiteList was correctly set...`)
  // await waitUntilTrue(async () => {
  //   return await contract.useWhiteList() == true
  // })

  // Finally we transfer ownership of the proxy to the ovmAddressManagerOwner address.
  const owner = (hre as any).deployConfig.mvmMetisManager
  console.log(`Setting owner address to ${owner}...`)
  await proxy.setOwner(owner)

  console.log(`Confirming that owner address was correctly set...`)
  await waitUntilTrue(async () => {
    return hexStringEquals(
      await proxy.connect(proxy.signer.provider).callStatic.getOwner({
        from: ethers.constants.AddressZero,
      }),
      owner
    )
  })

  await registerAddress({
    hre,
    name: (hre as any).deployConfig.l2chainid + '_MVM_CanonicalTransaction',
    address: contract.address,
  })

  console.log(`Deploying MVM_CanonicalTransaction...`)
  await deployAndRegister({
    hre,
    name: 'MVM_CanonicalTransaction',
    contract: 'MVM_CanonicalTransaction',
    args: [Lib_AddressManager.address, txDataSliceSize, stakeSeqSeconds, stakeCost],
  })

  // register the {l2chainId}_MVM_Sequencer with this contract address
  const MVM_CanonicalTransaction = await getDeployedContract(
    hre,
    'MVM_CanonicalTransaction',
    {
      signerOrProvider: deployer,
    }
  )
  await registerAddress({
    hre,
    name: (hre as any).deployConfig.l2chainid + '_MVM_Sequencer',
    address: proxy.address,
  })

  /**
  const MVM_DiscountOracle = await getDeployedContract(
    hre,
    'MVM_DiscountOracle',
    {
      signerOrProvider: deployer,
      iface: 'MVM_DiscountOracle',
    }
  )
  
  // setAddressChainId discountOracle to l2chainid
  await MVM_CanonicalTransaction.setAddressChainId(MVM_DiscountOracle.address, (hre as any).deployConfig.l2chainid)
  console.log(`set MVM_DiscountOracle address ${MVM_DiscountOracle.address} to l2chainid ${(hre as any).deployConfig.l2chainid}`)
  
  // setAddressChainId discountOracle to l2chainid
  await contract.setAddressChainId(MVM_DiscountOracle.address, (hre as any).deployConfig.l2chainid)
  console.log(`Proxy set MVM_DiscountOracle address ${MVM_DiscountOracle.address} to l2chainid ${(hre as any).deployConfig.l2chainid}`)
  */
}

deployFn.tags = ['MVM_CanonicalTransaction', 'upgrade', 'storage']

export default deployFn
