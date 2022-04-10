/* Imports: Internal */
import { BigNumber } from 'ethers'
import { AppendBatchElementEntry, EventArgsAppendBatchElement, EventHandlerSet } from '../../../types'
import { MissingElementError } from './errors'

export const handleEventsAppendBatchElement: EventHandlerSet<
  EventArgsAppendBatchElement,
  null,
  AppendBatchElementEntry
> = {
  getExtraData: async () => {
    return null
  },
  parseEvent: async (event) => {
    // console.log(`got event AppendBatchElement: ${JSON.stringify(event.args)}`)
    const eventBlock = await event.getBlock()
    return {
      index: event.args._batchIndex.toNumber(),
      chainId: event.args._chainId.toNumber(),
      batchIndex: event.args._batchIndex.toNumber(),
      shouldStartAtElement: event.args._shouldStartAtElement,
      totalElementsToAppend: event.args._totalElementsToAppend,
      txBatchSize: event.args._txBatchSize.toNumber(),
      txBatchTime: event.args._txBatchTime.toNumber(),
      root: event.args._root,
      l1BlockNumber: BigNumber.from(event.blockNumber).toNumber(),
      timestamp: eventBlock.timestamp,
    }
  },
  storeEvent: async (entry, db) => {
    // console.log(`start save AppendBatchElementEntry ${JSON.stringify(entry)}`)
    if (!entry) {
      return;
    }
    await db.putBatchElementEntries([entry])
  },
}
