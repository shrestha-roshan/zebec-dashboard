import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import { Badge, Button, CircularProgress, IconButton } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import { toggleRejectModal } from "features/modals/rejectModalSlice"
import { toggleSignModal } from "features/modals/signModalSlice"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, Fragment, useRef } from "react"
import { formatCurrency, toSubstring } from "utils"

interface WithdrawalTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const returnValidPercentage = (percentage: number) => {
  if (percentage > 0) {
    return percentage
  } else {
    return 0
  }
}

type Confirmations = "pending" | "rejected" | "confirmed"

const confirmationClassesMapping = {
  pending: "info",
  rejected: "error",
  confirmed: "success"
}

const getClassesForConfirmation = (confirmation: Confirmations) => {
  return confirmationClassesMapping[confirmation] as
    | "info"
    | "error"
    | "success"
}

const WithdrawalTableRow: FC<WithdrawalTableRowProps> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow
}) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 min-w-70">
            <div className="flex items-center gap-x-2.5">
              <CircularProgress
                status={transaction.status}
                percentage={returnValidPercentage(
                  parseInt(
                    formatCurrency(
                      (transaction.sent_token * 100) / transaction.amount
                    )
                  )
                )}
              />
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    -
                    {formatCurrency(
                      transaction.sent_token > 0 ? transaction.sent_token : 0
                    )}
                  </span>
                  &nbsp;SOL
                </div>
                <div className="text-caption">
                  {formatCurrency(
                    transaction.sent_token > 0 ? transaction.sent_token : 0
                  )}{" "}
                  of {transaction.amount} SOL
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 min-w-31.25">
            <Badge
              className="capitalize"
              type={getClassesForConfirmation(transaction.confirmation)}
            >
              {transaction.confirmation}
            </Badge>
          </td>
          <td className="min-w-55.5 px-6 py-4">
            <div className="text-caption text-content-primary">
              {transaction.status === "scheduled" && "INI:"} Mar 18, 2022, 12:00
              PM
            </div>
          </td>
          <td className="px-6 py-4 min-w-51">
            <div className="flex gap-x-1 text-body text-content-primary">
              {transaction.is_in_address_book
                ? toSubstring(transaction.name, 25, false)
                : toSubstring(transaction.sender, 5, true)}{" "}
              {!transaction.is_in_address_book && (
                <IconButton
                  icon={<Icons.UserAddIcon />}
                  className="bg-background-primary min-w-7 h-7"
                />
              )}
              <CopyButton className="min-w-7" content={transaction.sender} />
            </div>
          </td>
          <td className="px-6 py-4 w-full float-right">
            <div className="flex items-center float-right gap-x-6">
              <Button
                title="Cancel"
                size="small"
                startIcon={
                  <Icons.CrossIcon className="text-content-contrast" />
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
              className={`bg-background-light rounded-lg overflow-hidden transition-all duration-[400ms] ${
                activeDetailsRow === index ? `ease-in` : "ease-out"
              }`}
              style={styles.detailsRow}
            >
              <div className="pt-4 pr-12 pb-6 pl-6">
                <div className="flex flex-col gap-y-2 pb-6 border-b border-outline">
                  <div className=" text-subtitle-sm font-medium text-content-primary">
                    Feb Salary
                  </div>
                  <div className="text-body text-content-secondary">
                    This is the secondary notes with character limit.
                  </div>
                </div>
                <div className="flex gap-x-44 py-6 text-subtitle-sm font-medium border-b border-outline">
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Sender */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.sender")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Image
                          layout="fixed"
                          alt="Sender Logo"
                          src={Images.Avatar1}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div className="">
                          {toSubstring("0x4f10x4f1U700eU700e", 5, true)}
                        </div>
                        <IconButton icon={<Icons.CopyIcon />} />
                      </div>
                    </div>
                    {/* Receiver */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.receiver")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Image
                          layout="fixed"
                          alt="Sender Logo"
                          src={Images.Avatar3}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div className="">
                          {toSubstring("0x4f10x4f1U700eU700e", 5, true)}
                        </div>
                        <IconButton icon={<Icons.CopyIcon />} />
                      </div>
                    </div>
                    {/* Start Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.start-date")}
                      </div>
                      <div className="text-content-primary">
                        Feb 19, 2022, 09:13 PM
                      </div>
                    </div>
                    {/* End Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.end-date")}
                      </div>
                      <div className="text-content-primary">
                        Feb 29, 2022, 09:13 PM
                      </div>
                    </div>
                    {/* Stream Type */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.stream-type")}
                      </div>
                      <div className="flex items-center gap-x-1 text-content-primary">
                        {index % 2 == 1 ? (
                          <Icons.ThunderIcon className="w-6 h-6" />
                        ) : (
                          <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
                        )}
                        <span>{`${
                          index % 2 == 1 ? "Instant" : "Continuous"
                        }`}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Total Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.total-amount")}
                      </div>
                      <div className="text-content-primary">20,000 SOL</div>
                    </div>
                    {/* Amount Received */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.amount-received")}
                      </div>
                      <div className="text-content-primary">
                        10,000 SOL (50%)
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.status")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        {Math.sign(transaction.sent_token) > 0 ? (
                          <Icons.IncomingIcon className="w-5 h-5" />
                        ) : (
                          <Icons.OutgoingIcon className="w-5 h-5" />
                        )}
                        <span>Ongoing</span>
                      </div>
                    </div>
                    {/* Transaction */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.transaction")}
                      </div>
                      <div className="text-content-primary">
                        <Button
                          title={`${t("table.view-on-explorer")}`}
                          size="small"
                          endIcon={
                            <Icons.OutsideLinkIcon className="text-content-contrast" />
                          }
                        />
                      </div>
                    </div>
                    {/* Reference */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.reference")}
                      </div>
                      <div className="text-content-primary">
                        <Button
                          title={`${t("table.view-reference-file")}`}
                          size="small"
                          endIcon={
                            <Icons.OutsideLinkIcon className="text-content-contrast" />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-32 py-6 text-subtitle-sm font-medium border-b border-outline">
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Signed Owners */}
                    <div className="flex gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.signed-by")}
                      </div>
                      <div className="grid gap-y-4">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="flex items-center  gap-x-2 text-content-primary"
                          >
                            <Image
                              layout="fixed"
                              alt="Owner Logo"
                              src={
                                [
                                  Images.Avatar1,
                                  Images.Avatar2,
                                  Images.Avatar4
                                ][item % 3]
                              }
                              height={24}
                              width={24}
                              className="rounded-full"
                            />
                            <div className="">
                              {toSubstring("0x4f10x4f1U700eU700e", 5, true)}
                            </div>
                            <div className="text-content-tertiary">
                              10 min ago
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Total Amount */}
                    <div className="flex gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.remaining")}
                      </div>

                      <div className="grid gap-y-4">
                        <div className="text-content-primary">
                          3 out of 4 Owners
                        </div>
                        {[1].map((item) => (
                          <div
                            key={item}
                            className="flex items-center  gap-x-2 text-content-primary"
                          >
                            <Image
                              layout="fixed"
                              alt="Owner Logo"
                              src={
                                [
                                  Images.Avatar1,
                                  Images.Avatar2,
                                  Images.Avatar4
                                ][item % 3]
                              }
                              height={24}
                              width={24}
                              className="rounded-full"
                            />
                            <div className="">
                              {toSubstring("0x4f10x4f1U700eU700e", 5, true)}
                            </div>
                            <div className="text-content-tertiary">
                              10 min ago
                            </div>
                          </div>
                        ))}
                        <div className="text-content-primary">
                          <Button
                            title={`${t("table.show-all-remaining")}`}
                            size="small"
                            endIcon={
                              <Icons.ArrowDownIcon className="text-content-contrast" />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-4 py-6">
                  <Button
                    startIcon={<Icons.EditIcon />}
                    variant="gradient"
                    title={t("table.sign-and-approve")}
                    onClick={() => dispatch(toggleSignModal())}
                  />
                  <Button
                    startIcon={<Icons.CrossIcon />}
                    title="Reject"
                    onClick={() => dispatch(toggleRejectModal())}
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  )
}

export default WithdrawalTableRow
