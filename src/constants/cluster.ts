//Wallet Adapter
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl, Connection } from "@solana/web3.js"

//getRPC
export const getRPCNetwork = () => {
  if (process.env.RPC_NETWORK === "devnet") return WalletAdapterNetwork.Devnet
  if (
    process.env.RPC_NETWORK === "mainnet" ||
    process.env.RPC_NETWORK === "mainnet-beta"
  )
    return WalletAdapterNetwork.Mainnet
  if (process.env.RPC_NETWORK === "testnet") return WalletAdapterNetwork.Testnet
  return WalletAdapterNetwork.Devnet
}

//getClusterApiUrl
const getClusterApiUrl = () => {
  if (process.env.RPC_NETWORK === "devnet") return clusterApiUrl("devnet")
  if (
    process.env.RPC_NETWORK === "mainnet" ||
    process.env.RPC_NETWORK === "mainnet-beta"
  )
    return process.env.SYNDICA_API
      ? process.env.SYNDICA_API
      : clusterApiUrl("mainnet-beta")
  if (process.env.RPC_NETWORK === "testnet") return clusterApiUrl("testnet")
  return clusterApiUrl("devnet")
}

//connection
export const connection = new Connection(getClusterApiUrl())

//Constants
export const RPC_NETWORK = getRPCNetwork()
export const CLUSTER_API_URL = getClusterApiUrl()
