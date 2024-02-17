import * as zlib from 'zlib'
import { promisify } from 'util'

// compress method
const deflateAsync = promisify(zlib.deflate)
// decompress method
const inflateAsync = promisify(zlib.inflate)

export const zlibCompressHexString = async (
  hexStr: string
): Promise<string> => {
  const inBuffer = Buffer.from(hexStr, 'hex')
  const outBuffer = await deflateAsync(inBuffer)
  return outBuffer.toString('hex')
}

export const zlibDecompressHexString = async (
  hexStr: string
): Promise<string> => {
  const inBuffer = Buffer.from(hexStr, 'hex')
  const outBuffer = await inflateAsync(inBuffer)
  return outBuffer.toString('hex')
}
