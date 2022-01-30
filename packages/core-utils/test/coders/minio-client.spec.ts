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
        bucket: 'mefstest',
        options: {
          endPoint: '45.113.32.39',
          accessKey: 'maticuser',
          secretKey: 'door*three3',
          useSSL: false,
          port: 5080,
        }
      }
      const client = new MinioClient(config)
      const input = 'this is a test data'
      const objectName = await client.writeObject(0, 1, input, 3)
      expect(objectName).to.length.gt(0)

      const config2: MinioConfig = {
        l2ChainId: 488,
        bucket: 'mefstest',
        options: {
          endPoint: '45.113.32.39',
          accessKey: 'readonly',
          secretKey: 'read888&',
          useSSL: false,
          port: 5080,
        }
      }
      const client2 = new MinioClient(config2)
      const output = await client2.readObject(objectName, 3)
      console.log('object', objectName, 'input', input, 'output', output)
      expect(output).to.length.gt(0)
      expect(output).to.equal(input, `input: ${input}, output: ${output}`)
    })

    it.skip('should throw an error', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'mefstest',
        options: {
          endPoint: '45.113.32.39',
          accessKey: 'readonly',
          secretKey: 'read888&',
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
