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
    it.skip('hash sha256', ()=>{
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'maticuser',
          secretKey: 'door*three3',
          useSSL: true,
          port: 6080,
        }
      }
      const client = new MinioClient(config)
      const hash = client.sha256Hash('123456')
      expect(hash).to.equal('8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'sha256 incorrect')
    })
    
    it.skip('should work with the simple case', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'maticuser',
          secretKey: 'door*three3',
          useSSL: true,
          port: 6080,
        }
      }
      const client = new MinioClient(config)
      const input = 'this is a test data'
      const objectName = await client.writeObject(0, 1, input, 2)
      expect(objectName).to.length.gt(0)

      const config2: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'readonly',
          secretKey: 'read888&',
          useSSL: true,
          port: 6081,
        }
      }
      const client2 = new MinioClient(config2)
      const output = await client2.readObject(objectName, 2)
      console.log('object', objectName, 'input', input, 'output', output)
      const verified = await client2.verifyObject(objectName, output, 2)
      expect(output).to.length.gt(0)
      expect(output).to.equal(input, `input: ${input}, output: ${output}`)
      expect(verified).to.be.true
    })

    it.skip('should throw an error when writing with readonly account', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'readonly',
          secretKey: 'read888&',
          useSSL: true,
          port: 6081,
        }
      }
      const client = new MinioClient(config)
      const input = 'this is a test data'
      try{
        const objectName = await client.writeObject(0, 1, input, 2)
        expect(objectName).to.length.lte(0)
      }
      catch(x) {
        console.log('write obj error: ', x.message)
        expect(x.message).to.equal('Access Denied.', x.message)
      }
    })
    
    it.skip('should throw an error when read a file not exists', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'readonly',
          secretKey: 'read888&',
          useSSL: true,
          port: 6081,
        }
      }
      const client = new MinioClient(config)
      // S3Error: Access Denied.
      try{
        await client.readObject('123', 2)
      }
      catch(x) {
        console.log('read obj error: ', x.message)
        expect(x.message).to.equal('The specified key does not exist.')
      }
    })

    it.skip('test an exist object', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'readonly',
          secretKey: 'read888&',
          useSSL: true,
          port: 6081,
        }
      }
      const client = new MinioClient(config)
      // S3Error: Access Denied.
      try {
        const objectName = '16454988508790000021a5f8d7508995929b6b0302603c8bdb38abe1613737611c04874f0a3e0ab2e4'
        const calldata = await client.readObject(objectName, 2)
        const verified = await client.verifyObject(objectName, calldata, 2)
        expect(verified).to.be.true
      }
      catch(x) {
        console.log('read obj error: ', x.message)
        expect(x.message).to.equal('The specified key does not exist.')
      }
    })
  })
})
