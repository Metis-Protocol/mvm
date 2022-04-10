/* Imports: Internal */
import { BigNumber } from 'ethers'
import { EventArgsVerifierStake, EventHandlerSet, VerifierStakeEntry } from '../../../types'
import { MissingElementError } from './errors'

export const handleEventsVerifierStake: EventHandlerSet<
  EventArgsVerifierStake,
  null,
  VerifierStakeEntry
> = {
  getExtraData: async () => {
    return null
  },
  parseEvent: async (event) => {
    // console.log(`got event VerifierStake: ${JSON.stringify(event.args)}`)
    const eventBlock = await event.getBlock()
    return {
      index: event.args._batchIndex.toNumber(),
      sender: event.args._sender,
      chainId: event.args._chainId.toNumber(),
      batchIndex: event.args._batchIndex.toNumber(),
      blockNumber: event.args._blockNumber.toNumber(),
      amount: event.args._amount.toString(),
      l1BlockNumber: BigNumber.from(event.blockNumber).toNumber(),
      timestamp: eventBlock.timestamp,
    }
  },
  storeEvent: async (entry, db) => {
    // console.log(`start save VerifierStakeEntry ${JSON.stringify(entry)}`)
    if (!entry) {
      return;
    }
    await db.putVerifierStakeEntries([entry])
  },
}
