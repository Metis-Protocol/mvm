/* Imports: External */
import { ethers } from 'ethers'

export const parseSignatureVParam = (
  v: number | ethers.BigNumber,
  chainId: number
): number => {
  const vNumber = ethers.BigNumber.from(v)
  // for non-eip155 transactions
  if (vNumber.eq(27) || vNumber.eq(28)) {
    return vNumber.toNumber()
  }
  return vNumber.toNumber() - 2 * chainId - 35
}
