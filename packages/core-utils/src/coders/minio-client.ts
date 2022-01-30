import * as Minio from 'minio'
import hash from 'object-hash'
import { sleep } from '../common'

export interface MinioConfig {
  options: Minio.ClientOptions
  l2ChainId: number
}

export class MinioClient {
  protected client: Minio.Client
  protected options: Minio.ClientOptions
  protected l2ChainId: number

  constructor(config: MinioConfig) {
    this.client = new Minio.Client(config.options)
    // this.client.setRequestOptions({timeout: 2*60*1000})
    this.l2ChainId = config.l2ChainId
    this.options = config.options
  }

  protected async ensureBucket(): Promise<string> {
    const bucketName = `metis-${this.l2ChainId}-tx`
    const hasBucket = await this.client.bucketExists(bucketName)
    if (!hasBucket) {
      await this.client.makeBucket(bucketName, this.options.region || 'us-east-1')
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
      const objInfo = await this.client.putObject(bucketName, objectKey, encodedTransactionData, null, metaData)
      console.log('put object', objInfo)
      if (!objInfo || !objInfo.etag) {
        if (tryCount <= 0) {
          return ''
        }
        tryCount--
        await sleep(1000)
        objectKey = await this.writeObject(startAtElement, totalElements, encodedTransactionData, tryCount)
      }
      console.log('object name', objectKey)
      return objectKey
  }

  public async readObject(objectName: string, tryCount: number): Promise<string> {
    if (!objectName) {
      return ''
    }
    const bucketName = await this.ensureBucket()
    const readable = await this.client.getObject(bucketName, objectName)
    let data = ''
    if (!readable) {
      if (tryCount <= 0) {
        return ''
      }
      tryCount--
      await sleep(1000)
      data = await this.readObject(objectName, tryCount)
    }
    if (data) {
      return data
    }
    if (!readable) {
      return ''
    }
    const buffer = readable.read()
    if (!buffer) {
      if (tryCount <= 0) {
        return ''
      }
      tryCount--
      await sleep(1000)
      data = await this.readObject(objectName, tryCount)
    }
    if (!data && buffer) {
      data = (buffer as Buffer).toString('utf-8')
    }
    return data
  }
}
