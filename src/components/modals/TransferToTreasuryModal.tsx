import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  Button,
  Modal,
  TokensDropdown,
  WithdrawDepositInput
} from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { getBalance } from "utils/getBalance"
import {
  setLoading,
  toggleTransferToTreasuryModal
} from "features/modals/transferToTreasuryModalSlice"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useContext, useState } from "react"
import ZebecContext from "app/zebecContext"
import { withdrawFromTreasuryVault } from "application"
import { CallbackMessageType } from "components/treasury/treasury"
import * as Icons from "assets/icons"
import { displayExponentialNumber } from "utils"

const TransferToTreasuryModal = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const { treasury, treasuryToken } = useContext(ZebecContext)
  const transferToTreasuryStates = useAppSelector(
    (state) => state.transferToTreasury
  )
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryVaultBalance =
    useAppSelector((state) => state.treasuryVaultBalance.treasury?.tokens) || []
  const treasuryVaultStreamingTokensBalance =
    useAppSelector((state) => state.treasuryStreamingBalance?.tokens) || []
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const [showMaxInfo, setShowMaxInfo] = useState<boolean>(false)

  const {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    setValue,
    errors,
    register,
    handleSubmit,
    setError,
    trigger,
    reset
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "withdraw"
  })

  const withdrawFromTreasuryCallback = (message: CallbackMessageType) => {
    if (message === "success") {
      reset()
      dispatch(toggleTransferToTreasuryModal())
    } else {
      dispatch(setLoading(false))
    }
  }

  const submit = (data: { amount: string }) => {
    if (
      Number(data.amount) >
      getBalance(treasuryVaultBalance, currentToken.symbol)
    ) {
      setError(
        "amount",
        { type: "custom", message: "validation:max" },
        { shouldFocus: true }
      )
      return
    } else {
      if (activeTreasury) {
        dispatch(setLoading(true))
        const transferData = {
          sender: (publicKey as PublicKey).toString(),
          safe_address: activeTreasury.treasury_address,
          safe_data_account: activeTreasury.treasury_escrow,
          receiver: activeTreasury.treasury_address,
          amount: Number(data.amount),
          token_mint_address:
            currentToken.symbol === "SOL" ? "" : currentToken.mint
        }
        if (!transferData.token_mint_address) {
          treasury &&
            dispatch(
              withdrawFromTreasuryVault({
                data: transferData,
                callback: withdrawFromTreasuryCallback,
                treasury: treasury
              })
            )
        } else {
          treasuryToken &&
            dispatch(
              withdrawFromTreasuryVault({
                data: transferData,
                callback: withdrawFromTreasuryCallback,
                treasuryToken: treasuryToken
              })
            )
        }
      }
    }
  }

  const setMaxAmount = () => {
    const balance =
      getBalance(treasuryVaultBalance, currentToken.symbol) -
      getBalance(treasuryVaultStreamingTokensBalance, currentToken.symbol)

    if (
      getBalance(treasuryVaultStreamingTokensBalance, currentToken.symbol) > 0
    ) {
      setShowMaxInfo(true)
    } else {
      setShowMaxInfo(false)
    }

    setValue(
      "amount",
      displayExponentialNumber(balance < 0 ? "0" : balance.toString())
    )
    trigger("amount")
  }

  return (
    <Modal
      show={transferToTreasuryStates.show}
      toggleModal={() => {
        dispatch(toggleTransferToTreasuryModal())
        reset()
      }}
      className="rounded"
      hasCloseIcon={true}
      size="small"
    >
      <>
        <div className="text-content-primary text-subtitle font-semibold mb-1">
          {t("treasuryOverview:transfer-to-treasury")}
        </div>
        <div className="text-content-secondary text-caption mb-6">
          {t("treasuryOverview:transfer-to-treasury-detail")}
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col"
          autoComplete="off"
        >
          <WithdrawDepositInput
            token={currentToken}
            setMaxAmount={setMaxAmount}
            toggle={toggle}
            setToggle={setToggle}
            {...register("amount")}
            errorMessage={`${errors.amount?.message || ""}`}
          >
            {/* Tokens Dropdown */}
            <TokensDropdown
              walletTokens={treasuryVaultBalance || []}
              tokens={tokenDetails}
              show={show}
              toggleShow={setToggle}
              setCurrentToken={setCurrentToken}
            />
          </WithdrawDepositInput>

          {showMaxInfo && (
            <div className="mt-2 text-caption text-content-tertiary flex items-start gap-x-1">
              <Icons.InformationIcon className="w-5 h-5 flex-shrink-0" />
              <span>
                {t("treasuryOverview:max-transfer-to-treasury-message")}
              </span>
            </div>
          )}

          <Button
            title={`${t("treasuryOverview:transfer")}`}
            variant="gradient"
            className="w-full mt-6"
            loading={transferToTreasuryStates.loading}
            disabled={transferToTreasuryStates.loading}
          />
        </form>
      </>
    </Modal>
  )
}

export default TransferToTreasuryModal
