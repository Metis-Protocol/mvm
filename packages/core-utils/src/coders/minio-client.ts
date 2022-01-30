import * as Minio from 'minio'
import hash from 'object-hash'
import { sleep } from '../common'

export interface MinioConfig {
  options: Minio.ClientOptions
  l2ChainId: number,
  bucket: string,
}

export class MinioClient {
  protected client: Minio.Client
  protected options: Minio.ClientOptions
  protected l2ChainId: number
  protected bucket: string

  constructor(config: MinioConfig) {
    this.client = new Minio.Client(config.options)
    // this.client.setRequestOptions({timeout: 2*60*1000})
    this.l2ChainId = config.l2ChainId
    this.options = config.options
    this.bucket = config.bucket
  }

  protected async ensureBucket(): Promise<string> {
    // const bucketName = `metis-${this.l2ChainId}-tx`
    const bucketName = this.bucket
    try {
      const hasBucket = await this.client.bucketExists(bucketName)
      if (!hasBucket) {
        await this.client.makeBucket(bucketName, this.options.region || 'us-east-1')
      }
    }
    catch(x) {
      console.log('bucket exists check', x.message)
    }
    return bucketName
  }

  public async writeObject(
    startAtElement: number,
    totalElements: number,
    encodedTransactionData: string,
    tryCount: number): Promise<string> {
      if (!encodedTransactionData || startAtElement < 0 || totalElements <= 0) {
        return ''
      }
      const bucketName = await this.ensureBucket()
      const calcHash = [startAtElement, totalElements, new Date().getTime(), encodedTransactionData]
      const metaData = {
          'Content-Type': 'application/octet-stream',
          'X-Metis-Meta-Tx-Start': startAtElement,
          'X-Metis-Meta-Tx-Total': totalElements,
          'X-Metis-Meta-Tx-Timestamp': calcHash[2]
      }
      let objectKey = `${hash(calcHash)}_${calcHash[2]}`
      try {
        await this.client.putObject(bucketName, objectKey, encodedTransactionData, null, metaData)
      }
      catch(x) {
        console.log('write object err', x.message)
        if (tryCount <= 0) {
          return ''
        }
        tryCount--
        await sleep(1000)
        objectKey = await this.writeObject(startAtElement, totalElements, encodedTransactionData, tryCount)
      }
      return objectKey
  }

  public async readObject(objectName: string, tryCount: number): Promise<string> {
    if (!objectName) {
      return ''
    }
    const bucketName = await this.ensureBucket()
    let data = ''
    try {
      const readable = await this.client.getObject(bucketName, objectName)
      if (!readable) {
        throw 'getObject err: readable'
      }
      const buffer = readable.read()
      if (!buffer) {
        throw 'getObject err: readable.read'
      }
      data = (buffer as Buffer).toString('utf-8')
    }
    catch(x) {
      console.log('read object err', x.message)
      if (tryCount <= 0) {
        return ''
      }
      tryCount--
      await sleep(1000)
      data = await this.readObject(objectName, tryCount)
    }
    return data
  }
}
