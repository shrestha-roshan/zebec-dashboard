import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, IconButton } from "components/shared"
import { Token } from "components/shared/Token"
import { toggleHarvestModal } from "features/modals/harvestSlice"
import { toggleStakeModal } from "features/modals/stakeSlice"
import { toggleUnStakeModal } from "features/modals/unStakeSlice"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { FC, Fragment, useEffect, useRef } from "react"
import ReactTooltip from "react-tooltip"
import { formatCurrency } from "utils"

interface FarmsTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liquidity: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
  disableOthers?: boolean
}

// const returnValidPercentage = (percentage: number) => {
//   if (percentage > 0) {
//     return percentage
//   } else {
//     return 0
//   }
// }

const FarmsTableRow: FC<FarmsTableRowProps> = ({
  index,
  liquidity,
  activeDetailsRow,
  handleToggleRow,
  disableOthers = false
}) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const style = {
    detailsRowStyles: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 min-w-59.5">
            <div className="flex items-center gap-x-2.5 text-base font-semibold text-content-primary">
              <div className="grid place-content-center w-7 h-7 bg-background-primary rounded-lg">
                <Token
                  symbol={liquidity.baseToken}
                  className="w-4 h-4 text-lg"
                />
              </div>
              <div className="grid place-content-center w-7 h-7 bg-background-primary rounded-lg">
                <Token
                  symbol={liquidity.mintToken}
                  className="w-4 h-4 text-lg"
                />
              </div>
              {`${liquidity.baseToken}-${liquidity.mintToken}`}
            </div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">-</div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">-</div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">
              ~{liquidity.apy}%
            </div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    ~{formatCurrency(liquidity.tvl, "$")}
                  </span>
                </div>
                <div className="text-caption">
                  ~{formatCurrency(liquidity.tvl)} LP
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 w-full float-right">
            <div className="flex items-center float-right gap-x-6">
              <Button
                title="Add Liquidity"
                size="small"
                startIcon={
                  <Icons.PlusIncircleIcon className="text-content-contrast" />
                }
                onClick={() =>
                  router.push(
                    `/farming/add-liquidity?token0=${liquidity.baseToken}&token1=${liquidity.mintToken}`
                  )
                }
              />
              <IconButton
                variant="plain"
                icon={<Icons.CheveronDownIcon />}
                onClick={handleToggleRow}
              />
            </div>
          </td>
        </tr>
        {/* Table Body Details Row */}
        <tr>
          <td colSpan={4}>
            <div
              ref={detailsRowRef}
              className={`bg-background-light rounded-lg overflow-y-hidden  transition-all duration-[400ms] ${
                activeDetailsRow === index ? `ease-in` : "ease-out"
              }`}
              style={style.detailsRowStyles}
            >
              <div className="pt-4 pr-12 pb-6 pl-6">
                <div className="flex gap-x-24 py-6 text-subtitle-sm font-medium">
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.deposited")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        -
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Button
                        startIcon={<Icons.PlusIncircleIcon />}
                        title={`${t("yeildFarming:add-liquidity")}`}
                        variant="gradient"
                        onClick={() =>
                          router.push(
                            `/farming/add-liquidity?token0=${liquidity.baseToken}&token1=${liquidity.mintToken}`
                          )
                        }
                      />
                      <Button
                        startIcon={<Icons.LockIcon />}
                        className="text-content-primary"
                        disabled={disableOthers}
                        title={`${t("yeildFarming:stake")}`}
                        onClick={() => {
                          dispatch(toggleStakeModal())
                        }}
                      />
                      <Button
                        className="text-content-primary"
                        disabled={disableOthers}
                        startIcon={<Icons.ArrowDownLeft />}
                        title={`${t("yeildFarming:unstake")}`}
                        onClick={() => {
                          dispatch(toggleUnStakeModal())
                        }}
                      />
                    </div>
                  </div>
                  {/* Right Column */}

                  <div className="flex flex-col gap-y-4">
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.pending-rewards")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        -
                      </div>
                    </div>
                    <div>
                      <Button
                        startIcon={<Icons.ArrowDownLeft />}
                        className="text-content-primary"
                        disabled={disableOthers}
                        title={`${t("yeildFarming:harvest")}`}
                        onClick={() => {
                          dispatch(toggleHarvestModal())
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  )
}

export default FarmsTableRow
