// import { ChainId } from "@certusone/wormhole-sdk"
// import { getTokenBridgeAddressForChain } from "zebec-wormhole-sdk-test"
import axios from "axios"

const fetchWormholeTransactionStatus = async (
  sequence: number | string,
  emitterAddress: string,
  chainId: number
) => {
  try {
    const { data } = await axios.get(
      `https://zebec-relayer.alishdahal.com.np/transaction/${chainId}/${emitterAddress.toLowerCase()}/${sequence}`
    )
    if (data.data.status === "success" || data?.transactions?.length >= 3) {
      return "success"
    }
    return "error"
  } catch (e) {
    return "pending"
  }
}

export const listenWormholeTransactionStatus = async (
  sequence: number | string,
  emitterAddress: string,
  chainId = 4
) => {
  let retry = 0
  let response
  do {
    // commented console.log("listening for transaction status")
    response = await fetchWormholeTransactionStatus(
      sequence,
      emitterAddress,
      chainId
    )
    if (response === "error") {
      return "error"
    }
    if (response === "success") {
      // commented console.log("transfer complete")
      return "success"
    }
    await new Promise((resolve) => setTimeout(resolve, 4000))
    retry += 1
  } while (retry++ < 60)
  return "timeout"
}
