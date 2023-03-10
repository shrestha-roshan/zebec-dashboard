import * as Icons from "assets/icons"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import { twMerge } from "tailwind-merge"
import { CollapseDropdown } from "./CollapseDropdown"
import { Token } from "./Token"

interface TokensDropdwonDashboardProps {
  show: boolean
  className?: string
  tokens?: TokenDetails[]
  setCurrentToken?: (arg0: TokenDetails) => void
  toggleShow?: (arg0: boolean) => void
}

export const TokensDropdwonDashboard: FC<TokensDropdwonDashboardProps> = (
  props
) => {
  const { t } = useTranslation()

  const [search, setSearchData] = useState("")
  const { show, className, tokens = [], toggleShow, setCurrentToken } = props

  const filterTokens = () => {
    if (search !== "")
      return tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(search.toLowerCase()) ||
          token.symbol.toLowerCase().includes(search.toLowerCase())
      )
    return tokens
  }

  return (
    <>
      {/* Tokens Dropdown */}
      <CollapseDropdown
        show={show}
        className={twMerge(
          `border border-outline bg-background-primary z-10 max-w-[140px] `,
          className
        )}
      >
        <div className="rounded-lg">
          <div className="flex items-center px-2.5 py-1.5 w-full border-b border-outline">
            <Icons.SearchIcon className="text-base text-content-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearchData(e.target.value)}
              placeholder={`${t("common:eg-sol")}`}
              className="!rounded-b-none !pl-2 !pr-1 !w-[106px] !h-5 !border-0 !ring-0 !text-body !text-content-secondary"
            />
          </div>
          <div className="flex flex-col divide-y divide-outline max-h-[206px] overflow-y-auto">
            {/* SOL */}
            {filterTokens().length > 0 &&
              filterTokens().map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    if (setCurrentToken && toggleShow) {
                      setCurrentToken(token)
                      toggleShow(false)
                    }
                  }}
                  aria-disabled
                  className="px-3.5 py-1 flex items-center gap-x-2.5 transition hover:bg-background-tertiary cursor-pointer"
                >
                  <div className="grid place-content-center w-7 h-7 rounded-full bg-background-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Token
                      symbol={token.symbol}
                      className="w-4 h-4 text-content-primary"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-body text-content-primary">
                      {token.symbol}
                    </div>
                  </div>
                </div>
              ))}

            {filterTokens().length === 0 && (
              <div
                aria-disabled
                className="px-3.5 py-2 text-center text-content-contrast text-caption"
              >
                {t("common:no-tokens-found")}
              </div>
            )}
          </div>
        </div>
      </CollapseDropdown>
    </>
  )
}
