import { expect } from '../setup'
import { MpcClient } from '../../src/utils/index'
import { randomUUID } from 'crypto'
import { utils, ethers } from 'ethers'

describe('MpcClient Test', async () => {
  let mpcClient: MpcClient
  let signId: string
  let mpcId: string
  let mpcAddress: string

  before(async () => {
    mpcClient = new MpcClient('http://3.213.188.165:1317')
    signId = randomUUID()
  })

  it('should get mpc info', async () => {
    const mpcInfo = await mpcClient.getLatestMpc()
    console.log('mpc info = ', mpcInfo)
    expect(mpcInfo).to.not.equal(null)
    mpcId = mpcInfo.mpc_id
    mpcAddress = mpcInfo.mpc_address
  })

  it('should post data', async () => {
    // make a tx
    const transaction = {
      nonce: 1,
      gasPrice: ethers.utils.parseUnits('30', 'gwei'),
      gasLimit: ethers.utils.parseUnits('21000', 'wei'),
      to: '0x388C818CA8B9251b393131C08a736A67ccB19297',
      value: ethers.utils.parseEther('0.0'),
      data: '0x00000b',
    }

    try{
      const serializedTransaction = ethers.utils.RLP.encode([
        ethers.utils.hexlify(transaction.nonce),
        transaction.gasPrice.toHexString(),
        transaction.gasLimit.toHexString(),
        transaction.to.toLowerCase(),
        transaction.value.toHexString(),
        transaction.data,
      ])

      const transactionHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes'],
          [
            transaction.to,
            transaction.value.toHexString(),
            transaction.nonce,
            transaction.gasPrice.toHexString(),
            transaction.gasLimit.toHexString(),
            transaction.data || '0x',
          ]
        )
      )

      const postData = {
        "sign_id": signId,
        "mpc_id": mpcId,
        "sign_type": "0",
        "sign_data": serializedTransaction,
        "sign_msg": transactionHash
      }
      const signResp = await mpcClient.proposeMpcSign(postData)
      console.log('sign resp = ', signResp)
      expect(signResp).to.not.equal(null)
    }
    catch(x) {
      console.error(x)
    }
  })

  it('should get signed tx', async () => {
    const signedTx = await mpcClient.getMpcSignWithTimeout(signId, 300*1000, 15*1000)
    console.log('signed tx = ', signedTx)
    expect(signedTx).to.not.equal('')
  })

})
