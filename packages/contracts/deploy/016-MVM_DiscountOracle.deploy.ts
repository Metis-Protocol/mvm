/* Imports: External */
import { DeployFunction } from 'hardhat-deploy/dist/types'

/* Imports: Internal */
import {
  deployAndRegister,
  getDeployedContract,
} from '../src/hardhat-deploy-ethers'

const deployFn: DeployFunction = async (hre) => {
  const Lib_AddressManager = await getDeployedContract(
    hre,
    'Lib_AddressManager'
  )

  await deployAndRegister({
    hre,
    name: 'MVM_DiscountOracle',
    args: ['3200'],
  })
}

deployFn.dependencies = ['Lib_AddressManager']
deployFn.tags = ['OVM_L1MultiMessageRelayer']

export default deployFn
