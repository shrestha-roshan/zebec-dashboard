import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import DepositedAssets from "components/home/DepositedAssets"
import {
  ActivityThisWeek,
  DepositedBalance,
  DepositWithdraw,
  SupportCardComponents,
  Tokens
} from "components/shared"
import { tokenBalances, weeklyBalances } from "fakedata"
import { useState } from "react"
import { Deposit } from "./Deposit"
import { Withdrawal } from "./Withdrawal"

const fundTransferTabs = [
  {
    title: "common:buttons.deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Deposit />
  },
  {
    title: "common:buttons.withdraw",
    icon: <Icons.ArrowUpRightIcon />,
    count: 0,
    Component: <Withdrawal />
  }
]

const Overview = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  const [currentToken, setCurrentToken] = useState<
    keyof typeof tokenBalances | keyof typeof weeklyBalances
  >("SOL")
  const treasuryBalance = useAppSelector(
    (state) => state.treasuryBalance.treasury?.tokens
  )
  const prices = useAppSelector((state) => state.tokenDetails.prices)
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/**
       * First Column
       *    1. Safe Balance
       *    2. Incoming/ Outgoing
       *    3. Activity this Week
       */}
      <div className="grid gap-y-6">
        {/**
         * Safe Balance
         */}
        <DepositedBalance
          balance={treasuryBalance?.reduce(
            (a, b) => a + (prices[b.symbol] * b.balance || 0),
            0
          )}
        />
        {/**
         * Incoming/ Outgoing
         */}
        <Tokens currentToken={currentToken} setCurrentToken={setCurrentToken} />
        {/**
         * Activity this week
         */}
        <ActivityThisWeek currentToken={currentToken} />
      </div>
      {/**
       * Second Column
       *   1. Deposited Assets
       * **/}
      <div>
        <DepositedAssets
          tableMaxHeight={554}
          balanceTokens={treasuryTokens}
          tokens={tokenDetails}
        />
      </div>
      <div className="grid gap-y-6">
        <DepositWithdraw tabs={fundTransferTabs} />
        {/**
         * Zebec Treasury Help
         */}
        <SupportCardComponents.ZebecHelp page="treasury" />
        <SupportCardComponents.SendFeedback />
      </div>
    </div>
  )
}

export default Overview
