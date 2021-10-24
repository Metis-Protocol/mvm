/* Imports: External */
import { DeployFunction } from 'hardhat-deploy/dist/types'

/* Imports: Internal */
import { getDeployedContract } from '../src/hardhat-deploy-ethers'

const deployFn: DeployFunction = async (hre) => {
  const { deploy } = hre.deployments
  const { deployer } = await hre.getNamedAccounts()

  const Lib_AddressManager = await getDeployedContract(
    hre,
    'Lib_AddressManager',
    {
      signerOrProvider: deployer,
    }
  )
  const MVM_AddressManager = await getDeployedContract(
    hre,
    'MVM_AddressManager',
    {
      signerOrProvider: deployer,
    }
  )

  console.log(MVM_AddressManager.address,Lib_AddressManager.address)
  
  const result = await deploy('mockOVM_BondManager', {
    from: deployer,
    args: [MVM_AddressManager.address,Lib_AddressManager.address],
    log: true,
  })

  if (!result.newlyDeployed) {
    return
  }

  await Lib_AddressManager.setAddress('OVM_BondManager', result.address)
}

deployFn.dependencies = ['Lib_AddressManager']
deployFn.tags = ['mockOVM_BondManager']

export default deployFn
