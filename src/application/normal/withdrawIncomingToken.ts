/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { updateIncomingTransactions } from "features/transactions/transactionsSlice"
import {
  ZebecNativeStream,
  ZebecTokenStream
} from "zebec-anchor-sdk-npmtest/packages/stream"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"

interface WithdrawIncomingTokenProps {
  data: {
    sender: string
    receiver: string
    escrow: string
    token_mint_address?: string
    transaction_kind: string
    transaction_uuid: string
    hasTransactionEnd: boolean
    safe_address?: string
  }
  stream:
    | ZebecNativeStream
    | ZebecTokenStream
    | ZebecNativeTreasury
    | ZebecTokenTreasury
}

export const withdrawIncomingToken =
  ({ data, stream }: WithdrawIncomingTokenProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await stream.withdraw(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Token withdrawn successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(
          updateIncomingTransactions({
            transaction_type: data.transaction_kind,
            transaction_uuid: data.transaction_uuid,
            transaction_hash: response?.data?.transactionHash,
            completed: data.hasTransactionEnd
          })
        )
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(toggleWalletApprovalMessageModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleWalletApprovalMessageModal())
    }
  }
