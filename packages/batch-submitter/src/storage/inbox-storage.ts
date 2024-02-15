/* Imports: External */
import { BigNumber } from 'ethers'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Logger } from '@eth-optimism/common-ts'

const INBOX_OK_FILE = 'inbox_ok.json'
const INBOX_FAIL_FILE = 'inbox_fail.json'

export interface InboxRecordInfo {
  batchIndex: number | BigNumber
  blockNumber: number | BigNumber
  txHash: string
}

export class InboxStorage {
  public storagePath: string
  private logger: Logger

  constructor(storagePath: string, logger: Logger) {
    this.storagePath = storagePath
    this.logger = logger
  }

  public async recordFailedTx(
    batchIndex: number | BigNumber,
    errMsg: string
  ): Promise<boolean> {
    const jsonData = {
      batchIndex: BigNumber.from(batchIndex).toNumber(),
      errMsg,
    }
    const jsonString = JSON.stringify(jsonData, null, 2)
    const filePath = path.join(this.storagePath, INBOX_FAIL_FILE)
    try {
      await fs.writeFile(filePath, jsonString, { flag: 'w' })
      this.logger.info('JSON data has been written to failed tx', { filePath })
      return true
    } catch (writeError) {
      this.logger.error('Error writing to failed tx file:', writeError)
      return false
    }
  }

  public async recordConfirmedTx(inbox: InboxRecordInfo): Promise<boolean> {
    const jsonData = {
      batchIndex: BigNumber.from(inbox.batchIndex).toNumber(),
      number: BigNumber.from(inbox.blockNumber).toNumber(),
      hash: inbox.txHash,
    }
    const jsonString = JSON.stringify(jsonData, null, 2)
    const filePath = path.join(this.storagePath, INBOX_OK_FILE)
    try {
      await fs.writeFile(filePath, jsonString, { flag: 'w' })
      this.logger.info('JSON data has been written to ok_tx file', { filePath })
      return true
    } catch (writeError) {
      this.logger.error('Error writing to ok_tx file:', writeError)
      return false
    }
  }

  public async getLatestConfirmedTx(): Promise<InboxRecordInfo> {
    const filePath = path.join(this.storagePath, INBOX_OK_FILE)
    try {
      const data = await fs.readFile(filePath, 'utf8')
      if (!data) {
        return null
      }
      const readJsonData = JSON.parse(data)
      return {
        batchIndex: readJsonData.batchIndex,
        blockNumber: readJsonData.number,
        txHash: readJsonData.hash,
      }
    } catch (readError) {
      this.logger.error('Error reading ok_tx file:', readError)
    }
    return null
  }
}
