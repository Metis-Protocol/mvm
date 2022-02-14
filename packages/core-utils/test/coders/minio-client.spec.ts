import '../setup'

/* Internal Imports */
import {
  MinioClient,
  MinioConfig
} from '../../src'
import sha256 from 'fast-sha256'
import chai, { expect, assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.should()
chai.use(chaiAsPromised)

describe('MinioClient', () => {
  describe('minioClientPutAndGetObject', () => {
    it('hash sha256', ()=>{
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
    
    it('should work with the simple case', async () => {
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
      const objectName = await client.writeObject(0, 1, input, 3)
      expect(objectName).to.length.gt(0)

      const config2: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'maticuser',
          secretKey: 'door*three3',
          useSSL: true,
          port: 6081,
        }
      }
      const client2 = new MinioClient(config2)
      const output = await client2.readObject(objectName, 2)
      console.log('object', objectName, 'input', input, 'output', output)
      expect(output).to.length.gt(0)
      expect(output).to.equal(input, `input: ${input}, output: ${output}`)
    })

    it('should throw an error when writing with readonly account', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'maticuser',
          secretKey: 'door*three3',
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
    
    it('should throw an error when read a file not exists', async () => {
      const config: MinioConfig = {
        l2ChainId: 488,
        bucket: 'metis-1088-tx',
        options: {
          endPoint: 'metis.memosync.org',
          accessKey: 'maticuser',
          secretKey: 'door*three3',
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
  })
})
