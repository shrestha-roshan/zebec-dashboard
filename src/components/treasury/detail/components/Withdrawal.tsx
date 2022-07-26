import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { getBalance } from "utils/getBalance"

export const Withdrawal = () => {
  const { t } = useTranslation()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []

  const {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    errors,
    register,
    handleSubmit,
    setValue,
    trigger,
    setError
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "withdraw"
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitWitdrawal = (data: any) => {
    if (Number(data.amount) > getBalance(treasuryTokens, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "transactions:deposit.max-amount" },
        { shouldFocus: true }
      )
      return
    }
    // handle withdrawal
  }

  const setMaxAmount = () => {
    setValue("amount", getBalance(treasuryTokens, currentToken.symbol))
    trigger("amount")
  }

  return (
    <>
      <p className="leading-4 text-xs font-normal text-content-contrast mb-6">
        {t("treasuryOverview:withdraw-description")}
      </p>
      <form
        onSubmit={handleSubmit(submitWitdrawal)}
        className="flex flex-col gap-y-6"
      >
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          errorMessage={`${errors.amount?.message?.toString() || ""}`}
          {...register("amount")}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={treasuryTokens}
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>

        <Button
          title={`${t("treasuryOverview:withdraw")}`}
          variant="gradient"
          className="w-full"
        />
      </form>
    </>
  )
}
