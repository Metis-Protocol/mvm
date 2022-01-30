import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import crypto from "crypto"

/* Imports: External */
import { ethers, BigNumber, Contract, utils } from 'ethers'
import { sleep } from '@metis.io/core-utils'
import {
  getContractInterface,
  getContractFactory,
} from '@eth-optimism/contracts'

/* Imports: Internal */
import { MvmEnv } from './shared/mvm-env'
import { l1Wallet2 } from './shared/mvm-utils'

describe('Fraud proof verifier Tests', async () => {
  const gasPrice = BigNumber.from(0)
  const gasLimit = BigNumber.from('0x100000')
  let proposedKey: Buffer
  let keyHash: Buffer
  let proposedKeyVerify1: Buffer
  let keyHashVerify1: Buffer
  let env: MvmEnv

  before(async () => {
    env = await MvmEnv.new()
    console.log(`env`, env.mvmVerifer)
    proposedKey = crypto.randomBytes(32)
    keyHash = crypto.createHash("sha256").update(proposedKey).digest()
    proposedKeyVerify1 = crypto.randomBytes(32)
    keyHashVerify1 = crypto.createHash("sha256").update(proposedKeyVerify1).digest()

    // add l1Wallet, l1Wallet2 to whitelist
    env.mvmVerifer.setWhiteList(env.l1Wallet.address, true, {
      gasPrice,
      gasLimit
    })
    await sleep(2000)
    env.mvmVerifer.setWhiteList(env.l1Wallet2.address, true, {
      gasPrice,
      gasLimit
    })
    await sleep(2000)
  })

  it(`should in whitelist`, async () => {
    const result = await env.mvmVerifer.isWhiteListed(env.l1Wallet.address)
    console.log(`${env.l1Wallet.address} whitelist status ${result}`)
    expect(result).to.equal(true)
  })

  it(`should not in whitelist`, async () => {
    const result = await env.mvmVerifer.isWhiteListed(env.l2Messenger.address)
    console.log(`${env.l2Messenger.address} whitelist status ${result}`)
    expect(result).to.equal(false)
  })

  it(`should be sufficiently staked`, async () => {
    let result = await env.mvmVerifer.isSufficientlyStaked(env.l1Wallet.address)
    console.log(`${env.l1Wallet.address} stake status ${result}`)
    if (!result) {
      console.log(`${env.l1Wallet.address} has not staked yet, starting stake`)
      const balance = await env.l1Wallet.getBalance()
      console.log(`${env.l1Wallet.address} balance is ${balance}`)
      const tx = await env.mvmVerifer.verifierStake(
        ethers.utils.parseEther("200"),
        {
          gasPrice,
          gasLimit
        })
      console.log(`${env.l1Wallet.address} verifier stake tx ${tx}`)
      await sleep(2000)
      result = await env.mvmVerifer.isSufficientlyStaked(env.l1Wallet.address)
      console.log(`${env.l1Wallet.address} stake status ${result}`)
    }

    // ensure wallet2 staked
    result = await env.mvmVerifer.isSufficientlyStaked(env.l1Wallet2.address)
    console.log(`${env.l1Wallet2.address} stake status ${result}`)
    if (!result) {
      console.log(`${env.l1Wallet2.address} has not staked yet, starting stake`)
      const balance = await env.l1Wallet2.getBalance()
      console.log(`${env.l1Wallet2.address} balance is ${balance}`)
      if (balance.gt(ethers.utils.parseEther("200"))) {
        const tx = await env.l1Wallet.sendTransaction({
          to: env.l1Wallet2.address,
          value: ethers.utils.parseEther("200"),
          gasPrice,
          gasLimit,
        })
        console.log('transfer tx', tx)
      }
      await sleep(2000)
      const tx = await env.mvmVerifer.connect(env.l1Wallet2).verifierStake(
        ethers.utils.parseEther("200"),
        {
          gasPrice,
          gasLimit
        })
      console.log(`${env.l1Wallet2.address} verifier stake tx ${tx}`)
      await sleep(2000)
      result = await env.mvmVerifer.isSufficientlyStaked(env.l1Wallet2.address)
      console.log(`${env.l1Wallet2.address} stake status ${result}`)
    }
    expect(result).to.equal(true)
  })

  it(`get merkle root`, async () => {
    const expectRoot = '0xb1b634495025fde2f5379f90ecd87f55e3e59fea9b0d02a99edcbdc0c724e4a4'
    const stateRoots = ["0x0a766e138b5da6849daaaf0b3800c8de839a6532546b3e7ba301fad36b328815","0x8489c9a72c65a52b37b5a43e96cdd89b63865b2941871478a05ae6bff8edcf08","0x3af39e6eb99334fdc1fb84383dc1423f82244c9b9469047aa9143dc56f64f0e2","0x1f834501625de1b2b3500731f705cdb1759fcb6a6691b0e270ab55625489ac21","0xf837b681ddf52807d0c866d8e9f640bd539450e652ebbdf6e701f1ac3811f38f","0x0aa3216aa14949442afbb2a9d01330425c5084804e08515338096f4b0a7557fc","0x91b81d28980f84e85168e91a875232081f46a714038041394ac271fb9badff7a","0xca991e23d338fa185947bb64a6ea046ea022750b0155082d6dc84bf7da412aba","0x16abd98e4b07dcf252fd452621c80adc540f76a0b6f60898206db241d9d913c4","0xa0da3476dca34cb9adcb1d5ba9ffe9391fd1635dbaaf1cd1d343ac5bb45e42a0","0xf1c9bd07497ac6ad74d53ef7ccf976ee36caf6e77648f67835e99edc1f1a6b70","0xe9a37875d4cfa76b252f409e699ce7880f72b900cb5de6f4cf2168c9486f1e38","0xc29849ea6f238d6c0c97f0cdea44bfa2c43d0402f565e25b4340c9338dadb0fa","0x2e5d568e91236a0b64de41f7afc5b937027eb9941d919db68697cf6be9ebb2a4","0x99e5042fc7641d40f88efc549bf978bc75856a8866a74427332dd316fff121db","0xa9476df03e3adafe4923e8e64486f65ae9ac9b8ce6ebe8201268f636f889d490","0x6298f375780ef22ae9462e764b01204a8c66de2b57efb2b33b5a23762dc9c7ad","0xe92dc50b79810dbdbf15dd1f33e2657642d3f3156ccd824952bf7c0dceec7648","0xcb5a2973fd3ad9920d4ad9b0d3282419601e830ca6fd8b3622fc14d0dbd0f075","0x1ab6c5c829fdae9281a18912ae587e5dcd850bdd229b14b8b1266802fdd1d3eb"]

    const calcRoot = await env.mvmVerifer.getMerkleRoot(stateRoots)
    await expect(calcRoot).to.equal(expectRoot)
  })

  it(`new challenge`, async () => {
    const stateRoots = ["0x0a766e138b5da6849daaaf0b3800c8de839a6532546b3e7ba301fad36b3288FF","0x8489c9a72c65a52b37b5a43e96cdd89b63865b2941871478a05ae6bff8edcf08","0x3af39e6eb99334fdc1fb84383dc1423f82244c9b9469047aa9143dc56f64f0e2","0x1f834501625de1b2b3500731f705cdb1759fcb6a6691b0e270ab55625489ac21","0xf837b681ddf52807d0c866d8e9f640bd539450e652ebbdf6e701f1ac3811f38f","0x0aa3216aa14949442afbb2a9d01330425c5084804e08515338096f4b0a7557fc","0x91b81d28980f84e85168e91a875232081f46a714038041394ac271fb9badff7a","0xca991e23d338fa185947bb64a6ea046ea022750b0155082d6dc84bf7da412aba","0x16abd98e4b07dcf252fd452621c80adc540f76a0b6f60898206db241d9d913c4","0xa0da3476dca34cb9adcb1d5ba9ffe9391fd1635dbaaf1cd1d343ac5bb45e42a0","0xf1c9bd07497ac6ad74d53ef7ccf976ee36caf6e77648f67835e99edc1f1a6b70","0xe9a37875d4cfa76b252f409e699ce7880f72b900cb5de6f4cf2168c9486f1e38","0xc29849ea6f238d6c0c97f0cdea44bfa2c43d0402f565e25b4340c9338dadb0fa","0x2e5d568e91236a0b64de41f7afc5b937027eb9941d919db68697cf6be9ebb2a4","0x99e5042fc7641d40f88efc549bf978bc75856a8866a74427332dd316fff121db","0xa9476df03e3adafe4923e8e64486f65ae9ac9b8ce6ebe8201268f636f889d490","0x6298f375780ef22ae9462e764b01204a8c66de2b57efb2b33b5a23762dc9c7ad","0xe92dc50b79810dbdbf15dd1f33e2657642d3f3156ccd824952bf7c0dceec7648","0xcb5a2973fd3ad9920d4ad9b0d3282419601e830ca6fd8b3622fc14d0dbd0f075","0x1ab6c5c829fdae9281a18912ae587e5dcd850bdd229b14b8b1266802fdd1d3eb"]

    const calcRoot = await env.mvmVerifer.getMerkleRoot(stateRoots)
    const proposeHash = await env.mvmVerifer.encrypt(
      calcRoot,
      proposedKey
    )
    const batch = {
      "batchIndex": 0,
      "batchSize": 20,
      "batchRoot": "0xb1b634495025fde2f5379f90ecd87f55e3e59fea9b0d02a99edcbdc0c724e4a4",
      "prevTotalElements": 0,
      "extraData": "0x0000000000000000000000000000000000000000000000000000000061a2f19500000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8"
    }
    console.log(`start new challenge..`)
    await env.mvmVerifer.newChallenge(
      1088,
      batch,
      proposeHash,
      keyHash,
      {
        gasPrice,
        gasLimit
      }
    )
  })

  it(`verify1`, async () => {
    env.mvmVerifer.on('NewChallenge', async(cIndex, chainID, header, timestamp) => {
      expect(ethers.BigNumber.from(chainID)).to.equal(chainID)
      expect(cIndex).to.not.below(0)

      const stateRoots = ["0x0a766e138b5da6849daaaf0b3800c8de839a6532546b3e7ba301fad36b3288FF","0x8489c9a72c65a52b37b5a43e96cdd89b63865b2941871478a05ae6bff8edcf08","0x3af39e6eb99334fdc1fb84383dc1423f82244c9b9469047aa9143dc56f64f0e2","0x1f834501625de1b2b3500731f705cdb1759fcb6a6691b0e270ab55625489ac21","0xf837b681ddf52807d0c866d8e9f640bd539450e652ebbdf6e701f1ac3811f38f","0x0aa3216aa14949442afbb2a9d01330425c5084804e08515338096f4b0a7557fc","0x91b81d28980f84e85168e91a875232081f46a714038041394ac271fb9badff7a","0xca991e23d338fa185947bb64a6ea046ea022750b0155082d6dc84bf7da412aba","0x16abd98e4b07dcf252fd452621c80adc540f76a0b6f60898206db241d9d913c4","0xa0da3476dca34cb9adcb1d5ba9ffe9391fd1635dbaaf1cd1d343ac5bb45e42a0","0xf1c9bd07497ac6ad74d53ef7ccf976ee36caf6e77648f67835e99edc1f1a6b70","0xe9a37875d4cfa76b252f409e699ce7880f72b900cb5de6f4cf2168c9486f1e38","0xc29849ea6f238d6c0c97f0cdea44bfa2c43d0402f565e25b4340c9338dadb0fa","0x2e5d568e91236a0b64de41f7afc5b937027eb9941d919db68697cf6be9ebb2a4","0x99e5042fc7641d40f88efc549bf978bc75856a8866a74427332dd316fff121db","0xa9476df03e3adafe4923e8e64486f65ae9ac9b8ce6ebe8201268f636f889d490","0x6298f375780ef22ae9462e764b01204a8c66de2b57efb2b33b5a23762dc9c7ad","0xe92dc50b79810dbdbf15dd1f33e2657642d3f3156ccd824952bf7c0dceec7648","0xcb5a2973fd3ad9920d4ad9b0d3282419601e830ca6fd8b3622fc14d0dbd0f075","0x1ab6c5c829fdae9281a18912ae587e5dcd850bdd229b14b8b1266802fdd1d3eb"]

      const calcRoot = await env.mvmVerifer.getMerkleRoot(stateRoots)
      const proposeHash = await env.mvmVerifer.encrypt(
        calcRoot,
        proposedKeyVerify1
      )
      console.log(`start verify1..`)
      // connect as Verify1 user
      await env.mvmVerifer.connect(l1Wallet2).verify1(
        cIndex,
        proposeHash,
        keyHashVerify1,
        {
          gasPrice,
          gasLimit
        });
    })
  })

  it(`verify2`, async () => {
    env.mvmVerifer.on('Verify1', async(cIndex, sender) => {
      expect(cIndex).to.not.below(0)
      console.log(`start verify2..`)
      await env.mvmVerifer.verify2(
        cIndex,
        proposedKey,
        {
          gasPrice,
          gasLimit
        })
    })
  })

})

