import { WalletToken } from "features/walletBalanceSlice/walletBalanceSlice.d"

export interface ContinuousStreamFormData {
  transactionName: string
  receiverWallet: string
  remarks?: string
  amount: string
  token: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  noOfTimes?: string
  tokenAmount?: string
  interval?: string
  file?: string
}

export type FormKeys =
  | "transactionName"
  | "receiverWallet"
  | "remarks"
  | "amount"
  | "token"
  | "startDate"
  | "endDate"
  | "startTime"
  | "endTime"
  | "noOfTimes"
  | "tokenAmount"
  | "interval"

export interface ContinuousStreamProps {
  setFormValues?: (values: ContinuousStreamFormData) => void
  tokenBalances: WalletToken[]
  addFile?: boolean
  className?: string
}
