/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction
} from "@reduxjs/toolkit"
import addressBookSlice from "features/address-book/addressBookSlice"
import commonSlice from "features/common/commonSlice"
import counterSlice from "features/count/counterSlice"
import exportSlice from "features/export-report/exportSlice"
import layoutSlice from "features/layout/layoutSlice"
import cancelModalSlice from "features/modals/cancelModalSlice"
import harvestSlice from "features/modals/harvestSlice"
import pauseModalSlice from "features/modals/pauseModalSlice"
import rejectModalSlice from "features/modals/rejectModalSlice"
import resumeModalSlice from "features/modals/resumeModalSlice"
import signModalSlice from "features/modals/signModalSlice"
import stakeSlice from "features/modals/stakeSlice"
import unStakeSlice from "features/modals/unStakeSlice"
import walletApprovalMessageSlice from "features/modals/walletApprovalMessageSlice"
import xWalletApprovalMessageSlice from "features/modals/xWalletApprovalMessageSlice"
import settingsSlice from "features/settings/settingsSlice"
import streamSlice from "features/stream/streamSlice"
import toastsSlice from "features/toasts/toastsSlice"
import tokenDetailsSlice from "features/tokenDetails/tokenDetailsSlice"
import tranasctionsSlice from "features/transactions/transactionsSlice"
import treasurySlice from "features/treasury/treasurySlice"
import treasuryBalanceSlice from "features/treasuryBalance/treasuryBalanceSlice"
import treasurySettingsSlice from "features/treasurySettings/treasurySettingsSlice"
import treasuryStreamingSlice from "features/treasuryStreamingBalance/treasuryStreamingSlice"
import userSlice from "features/user/userSlice"
import walletBalanceSlice from "features/walletBalance/walletBalanceSlice"
import zebecBalanceSlice from "features/zebecBalance/zebecBalanceSlice"
import zebecStreamingSlice from "features/zebecStreamingBalance/zebecStreamingSlice"
import treasuryVaultBalanceSlice from "features/treasuryBalance/treasuryVaultBalanceSlice"
import withdrawFromTreasurySlice from "features/modals/withdrawFromTreasurySlice"
import transferToVaultModalSlice from "features/modals/transferToVaultModalSlice"
import transferToTreasuryModalSlice from "features/modals/transferToTreasuryModalSlice"
import treasuryTransactionsSlice from "features/treasuryTransactions/treasuryTransactionsSlice"
import pdaBalanceSlice from "features/pdaBalance/pdaBalanceSlice"
import pdaInitializeModalSlice from "features/modals/pdaInitializeModalSlice"
import treasuryNftSlice from "features/treasuryNft/treasuryNftSlice"

const combineReducer = combineReducers({
  counter: counterSlice,
  user: userSlice,
  tokenDetails: tokenDetailsSlice,
  walletBalance: walletBalanceSlice,
  treasuryBalance: treasuryBalanceSlice,
  treasurySettings: treasurySettingsSlice,
  zebecBalance: zebecBalanceSlice,
  pdaBalance: pdaBalanceSlice,
  zebecStreamingBalance: zebecStreamingSlice,
  treasuryStreamingBalance: treasuryStreamingSlice,
  layout: layoutSlice,
  toasts: toastsSlice,
  common: commonSlice,
  exportReport: exportSlice,
  pause: pauseModalSlice,
  cancel: cancelModalSlice,
  resume: resumeModalSlice,
  address: addressBookSlice,
  rejectTransaction: rejectModalSlice,
  signTransaction: signModalSlice,
  treasurysettings: treasurySettingsSlice,
  stream: streamSlice,
  stake: stakeSlice,
  unstake: unStakeSlice,
  harvest: harvestSlice,
  transactions: tranasctionsSlice,
  walletApprovalMessage: walletApprovalMessageSlice,
  xWalletApprovalMessage: xWalletApprovalMessageSlice,
  treasury: treasurySlice,
  settings: settingsSlice,
  treasuryVaultBalance: treasuryVaultBalanceSlice,
  withdrawFromTreasury: withdrawFromTreasurySlice,
  transferToVault: transferToVaultModalSlice,
  transferToTreasury: transferToTreasuryModalSlice,
  treasuryTransactions: treasuryTransactionsSlice,
  pdaInitialize: pdaInitializeModalSlice,
  treasuryNft: treasuryNftSlice
})

const rootReducer = (state: any, action: any) => {
  if (action.type === "user/logout") {
    state = {
      layout: state.layout,
      tokenDetails: state.tokenDetails
    }
  }
  return combineReducer(state, action)
}
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production"
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
