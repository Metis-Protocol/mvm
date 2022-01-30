import '../setup'

/* Internal Imports */
import {
  MinioClient,
  MinioConfig
} from '../../src'
import chai, { expect, assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.should()
chai.use(chaiAsPromised)

describe('MinioClient', () => {
  describe('minioClientPutAndGetObject', () => {
    it('should work with the simple case', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        options: {
          endPoint: '103.39.231.220',
          accessKey: '0x3cd83e9F2340c801d53814a79ad161Ca4890B807',
          secretKey: 'uuiioopp',
          useSSL: false,
          port: 5080,
        }
      }
      const client = new MinioClient(config)
      const input = 'this is a test data'
      const objectName = await client.writeObject(0, 1, input, 3)
      expect(objectName).to.length.gt(0)

      const output = await client.readObject(objectName, 3)
      console.log('object', objectName, 'input', input, 'output', output)
      expect(output).to.length.gt(0)
      expect(output).to.equal(input, `input: ${input}, output: ${output}`)
    })

    it('should throw an error', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        options: {
          endPoint: '103.39.231.220',
          accessKey: '0x3cd83e9F2340c801d53814a79ad161Ca4890B807',
          secretKey: 'uuiioopp',
          useSSL: false,
          port: 5080,
        }
      }
      const client = new MinioClient(config)
      // S3Error: Access Denied.
      const retrieveException = async () => await client.readObject('123', 2)
      assert.isRejected(retrieveException(), Error)
    })
  })
})
