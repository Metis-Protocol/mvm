/* Imports: External */
import { DeployFunction } from 'hardhat-deploy/dist/types'

/* Imports: Internal */
import {
  deployAndRegister,
  getDeployedContract,
} from '../src/hardhat-deploy-ethers'

const deployFn: DeployFunction = async (hre) => {

  const { deployer } = await hre.getNamedAccounts()
  const MVM_AddressManager = await getDeployedContract(
    hre,
    'MVM_AddressManager'
  )

  await deployAndRegister({
    hre,
    name: 'MVM_DiscountOracle',
    args: [MVM_AddressManager.address, '320'],
  })
  
  const MVM_DiscountOracle = await getDeployedContract(
    hre,
    'MVM_DiscountOracle',
    {
      signerOrProvider: deployer,
      iface: 'MVM_DiscountOracle',
    }
  )
  
  const l1bridge = await getDeployedContract(
    hre,
    'Proxy__OVM_L1StandardBridge'
  )
  
  await MVM_DiscountOracle.setWhitelistedXDomainSender(l1bridge.address, true);
  const accessStored =
    await MVM_DiscountOracle.callStatic.isXDomainSenderAllowed(l1bridge.address);
  console.log('l1bridge.address access:', accessStored)
}

deployFn.dependencies = ['Lib_AddressManager']
deployFn.tags = ['OVM_L1DiscountOracle']

export default deployFn