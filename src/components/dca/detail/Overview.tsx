import * as Icons from "assets/icons"
import { IconButton } from "components/shared"
import { Token } from "components/shared/Token"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { formatCurrency } from "utils"

interface GeneralObject {
  id: number
  token0: string
  token1: string
  refresh: string
  balance: number
  next: string
  token0PercentageChange: number
  token1PercentageChange: number
  token0AmountChange: number
  token1AmountChange: number
}

export const Overview: FC<{
  dca: GeneralObject
}> = ({ dca }) => {
  const { t } = useTranslation()
  return (
    <div className="p-6 pb-8 bg-background-secondary rounded cursor-pointer">
      <div className="flex flex-col">
        <div className="relative flex items-center text-base text-content-primary font-semibold">
          <div className="w-12">
            <IconButton
              className="absolute top-0 left-0 h-6 w-6"
              icon={<Token symbol={dca.token0} className="text-base" />}
            />
            <IconButton
              className="absolute top-0 left-3.5 h-6 w-6"
              icon={<Token symbol={dca.token1} className="text-base" />}
            />
          </div>
          {dca.token0}/{dca.token1}
        </div>
        <div className="mt-4 text-heading-3 text-content-primary font-semibold">
          {formatCurrency(dca.balance, "$", 2)}
        </div>
        <div className="flex items-center gap-1 mt-3 text-xs text-content-primary">
          <Token symbol={dca.token0} className="text-content-primary w-4 h-4" />
          <span>
            {formatCurrency(
              dca.token0AmountChange < 0
                ? -1 * dca.token0AmountChange
                : dca.token0AmountChange,
              dca.token0AmountChange < 0 ? "-$" : "+$"
            )}{" "}
          </span>
          <div
            className={`flex items-center ${
              dca.token0AmountChange < 0 ? "text-error" : "text-success"
            }`}
          >
            {dca.token0AmountChange < 0 ? (
              <Icons.ArrowDownIcon className="w-4 h-4" />
            ) : (
              <Icons.ArrowDownIcon className="w-4 h-4 transform -rotate-180" />
            )}
            {dca.token0PercentageChange < 0
              ? dca.token0PercentageChange * -1
              : dca.token0PercentageChange}
            %{" "}
          </div>
          /
          <Token symbol={dca.token1} className="text-content-primary w-4 h-4" />
          <span>
            {formatCurrency(
              dca.token1AmountChange < 0
                ? -1 * dca.token1AmountChange
                : dca.token1AmountChange,
              dca.token1AmountChange < 0 ? "-$" : "+$"
            )}{" "}
          </span>
          <div
            className={`flex items-center ${
              dca.token1AmountChange < 0 ? "text-error" : "text-success"
            }`}
          >
            {dca.token1AmountChange < 0 ? (
              <Icons.ArrowDownIcon className="w-4 h-4" />
            ) : (
              <Icons.ArrowDownIcon className="w-4 h-4 transform -rotate-180" />
            )}
            {dca.token1PercentageChange < 0
              ? dca.token1PercentageChange * -1
              : dca.token1PercentageChange}
            %{" "}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-3 text-md text-content-primary">
        <div className="flex gap-[6px] items-center">
          <Icons.CalenderIcon className="h-4 w-4" />
          {t("dca:next-investment-on")}: {dca.next}
        </div>
        <div className="gap-[6px] flex items-center">
          <Icons.RefreshIcon className="h-4 w-4" />
          {t("dca:frequency")}: {dca.refresh}
        </div>
      </div>
    </div>
  )
}
