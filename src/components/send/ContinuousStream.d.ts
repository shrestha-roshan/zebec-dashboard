import { WalletToken } from "features/walletBalanceSlice/walletBalanceSlice.d"

export interface ContinuousStreamFormData {
  wallet: string
  transaction_name: string
  receiver: string
  remarks?: string
  showRemarks?: boolean
  amount: string
  symbol: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  enableStreamRate?: boolean
  noOfTimes?: string
  tokenAmount?: string
  interval?: string
  file?: string
}

export type FormKeys = keyof ContinuousStreamFormData

export interface ContinuousStreamProps {
  setFormValues?: (values: ContinuousStreamFormData) => void
  tokenBalances: WalletToken[]
  addFile?: boolean
  className?: string
  type?: "send" | "treasury"
}
