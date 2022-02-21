import '../setup'

/* Internal Imports */
import {
  encodeAppendSequencerBatch,
  decodeAppendSequencerBatch,
  sequencerBatch,
} from '../../src'
import chai, { expect, assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

describe('BatchEncoder', () => {
  describe('appendSequencerBatch', () => {
    it('should work with the simple case', async () => {
      const batch = {
        shouldStartAtElement: 0,
        totalElementsToAppend: 0,
        contexts: [],
        transactions: [],
      }
      const encoded = await encodeAppendSequencerBatch(batch)
      const decoded = await decodeAppendSequencerBatch(encoded)
      expect(decoded).to.deep.equal(batch)
    })

    it('should work with more complex case', async () => {
      const batch = {
        shouldStartAtElement: 10,
        totalElementsToAppend: 1,
        contexts: [
          {
            numSequencedTransactions: 2,
            numSubsequentQueueTransactions: 1,
            timestamp: 100,
            blockNumber: 200,
          },
        ],
        transactions: ['0x45423400000011', '0x45423400000012'],
      }
      const encoded = await encodeAppendSequencerBatch(batch)
      const decoded = await decodeAppendSequencerBatch(encoded)
      expect(decoded).to.deep.equal(batch)
    })

    it('should work with mainnet calldata', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const data = require('../fixtures/appendSequencerBatch.json')
      for (const calldata of data.calldata) {
        const decoded = await sequencerBatch.decode(calldata)
        const encoded = await sequencerBatch.encode(decoded)
        expect(encoded).to.deep.equal(calldata)
      }
    })

    it('should throw an error', async () => {
      const batch = {
        shouldStartAtElement: 10,
        totalElementsToAppend: 1,
        contexts: [
          {
            numSequencedTransactions: 2,
            numSubsequentQueueTransactions: 1,
            timestamp: 100,
            blockNumber: 200,
          },
        ],
        transactions: ['0x454234000000112', '0x45423400000012'],
      }
      // expect(async () => await encodeAppendSequencerBatch(batch)).to.throw(
      //   'Unexpected uneven hex string value!'
      // )
      const retrieveException = async () => await encodeAppendSequencerBatch(batch)
      assert.isRejected(retrieveException(), Error)

      // expect(() => sequencerBatch.decode('0x')).to.throw(
      //   'Incorrect function signature'
      // )
      const retrieveException2 = async () => await sequencerBatch.decode('0x')
      assert.isRejected(retrieveException2(), Error)
    })
  })
})
