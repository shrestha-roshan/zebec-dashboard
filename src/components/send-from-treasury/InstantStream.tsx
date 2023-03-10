/* eslint-disable @next/next/no-img-element */
import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { initInstantStreamTreasury } from "application"
import * as Icons from "assets/icons"
import {
  Button,
  CollapseDropdown,
  EmptyDataState,
  IconButton,
  InputField
} from "components/shared"
import { FileUpload } from "components/shared/FileUpload"
import { Token } from "components/shared/Token"
import {
  fetchFilteredAddressBook,
  setFilteredPagination
} from "features/address-book/addressBookSlice"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { useClickOutside } from "hooks"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { formatCurrency } from "utils/formatCurrency"
import { getBalance } from "utils/getBalance"
import { instantStreamSchema } from "utils/validations/instantStreamSchema"
import { InstantStreamFormData, InstantStreamProps } from "./InstantStream.d"

let searchData = ""
let addressCurrentPage = 1

export const InstantStream: FC<InstantStreamProps> = ({
  setFormValues,
  tokenBalances,
  addFile,
  className
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {
    filteredAddressBooks: addressBook,
    addressBooks: mainAddressBook,
    filteredPagination
  } = useAppSelector((state) => state.address)
  const { isSigned } = useAppSelector((state) => state.common)
  const { treasury, treasuryToken } = useContext(ZebecContext)
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    trigger,
    resetField,
    watch,
    reset
  } = useForm<InstantStreamFormData>({
    mode: "onChange",
    resolver: yupResolver(instantStreamSchema)
  })

  const tokensDropdownWrapper = useRef(null)
  const receiverDropdownWrapper = useRef(null)

  const [tokenSearchData, setTokenSearchData] = useState("")
  const [receiverSearchData, setReceiverSearchData] = useState("")
  const [toggleTokensDropdown, setToggleTokensDropdown] = useState(false)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)
  const [showRemarks, setShowRemarks] = useState(false)
  const [resetFile, setResetFile] = useState(false)

  const { publicKey } = useWallet()

  const { tokens: tokenDetails, prices } = useAppSelector(
    (state) => state.tokenDetails
  )

  const [currentToken, setCurrentToken] = useState(
    tokenDetails[0] || {
      symbol: "",
      image: ""
    }
  )

  const handleTokensClose = () => {
    setToggleTokensDropdown(false)
  }
  const handleReceiverClose = () => {
    setToggleReceiverDropdown(false)
  }

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleTokensClose
  })
  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose
  })

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setCurrentToken(tokenDetails[0])
      setValue("symbol", tokenDetails[0].symbol)
    }
  }, [tokenDetails, setValue])

  useEffect(() => {
    if (isSigned) {
      dispatch(
        setFilteredPagination({
          currentPage: 1,
          limit: 4,
          total: 0
        })
      )
      searchData = receiverSearchData
      addressCurrentPage = 1
      dispatch(
        fetchFilteredAddressBook({
          search: receiverSearchData,
          page: 1,
          append: false
        })
      )
    }
  }, [dispatch, receiverSearchData, isSigned])

  useEffect(() => {
    addressCurrentPage = Number(filteredPagination.currentPage)
  }, [filteredPagination.currentPage])

  useEffect(() => {
    if (toggleReceiverDropdown) {
      // detect end of scroll
      setTimeout(() => {
        const element = document.querySelector(
          ".address-book-list"
        ) as HTMLElement
        element?.addEventListener("scroll", () => {
          if (
            element.scrollTop + element.clientHeight + 5 >=
            element.scrollHeight
          ) {
            dispatch(
              fetchFilteredAddressBook({
                search: searchData,
                page: addressCurrentPage + 1,
                append: true
              })
            )
          }
        })
      }, 200)
    }
    // eslint-disable-next-line
  }, [toggleReceiverDropdown])

  const initInstantStreamCallback = (message: "success" | "error") => {
    if (message === "success") {
      resetForm()
      if (activeTreasury) {
        router.push(`/treasury/${activeTreasury.uuid}/transactions`)
      }
    }
    dispatch(toggleWalletApprovalMessageModal())
  }

  const onSubmit = (data: InstantStreamFormData) => {
    if (activeTreasury) {
      const formattedData = {
        name: data.transaction_name,
        remarks: data.remarks,
        token: data.symbol,
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint,
        sender: data.wallet,
        receiver: data.receiver,
        amount: Number(data.amount),
        file: data.file,
        safe_address: activeTreasury.treasury_address,
        safe_data_account: activeTreasury.treasury_escrow
      }
      dispatch(toggleWalletApprovalMessageModal())
      if (!formattedData.token_mint_address && treasury) {
        dispatch(
          initInstantStreamTreasury({
            data: formattedData,
            callback: initInstantStreamCallback,
            treasury: treasury
          })
        )
      } else if (treasuryToken) {
        dispatch(
          initInstantStreamTreasury({
            data: formattedData,
            callback: initInstantStreamCallback,
            treasuryToken: treasuryToken
          })
        )
      }
    }
  }

  const resetForm = () => {
    reset()
    setCurrentToken(tokenDetails[0])
    setValue("symbol", tokenDetails[0].symbol)
    setResetFile(true)
  }

  useEffect(() => {
    const subscription = watch(() => {
      if (setFormValues) {
        setFormValues(getValues())
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setFormValues, getValues])

  useEffect(() => {
    if (publicKey) {
      setValue("wallet", publicKey.toString())
    }
  }, [publicKey, setValue])

  return (
    <>
      <div
        className={twMerge(
          "bg-background-secondary rounded-[4px] p-10",
          className ?? ""
        )}
      >
        <div className="flex justify-between">
          <div className="text-heading-4 text-content-primary font-semibold">
            {t("send:instant-transfer")}
          </div>
          <IconButton
            icon={<Icons.RefreshIcon />}
            className="w-7 h-7"
            onClick={resetForm}
          />
        </div>

        <div className="text-caption text-content-tertiary font-normal pt-2">
          {t("send:instant-transfer-description")}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Transaction Name and Receiver Wallet */}
          <div className="mt-12 grid lg:grid-cols-2 gap-3">
            <div>
              <InputField
                label={t("send:transaction-name")}
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={t(errors.transaction_name?.message?.toString() ?? "")}
              >
                <div>
                  <input
                    className={`${
                      !showRemarks && "!pr-[124px]"
                    } w-full h-[40px] ${!!errors.transaction_name && "error"}`}
                    placeholder={t("send:transaction-name")}
                    type="text"
                    {...register("transaction_name")}
                  />
                  {!showRemarks && (
                    <Button
                      size="small"
                      title={`${t("send:add-remarks")}`}
                      className="absolute right-[8px] top-[8px] text-content-primary"
                      endIcon={<Icons.PlusIncircleIcon />}
                      onClick={() => setShowRemarks(true)}
                      type="button"
                    />
                  )}
                </div>
              </InputField>
            </div>
            <div className="relative" ref={receiverDropdownWrapper}>
              <label
                className={`ml-3 text-content-primary text-xs font-medium mb-1`}
              >
                {t("send:receiver-wallet")}
              </label>
              <div className="relative text-content-primary">
                <input
                  type="text"
                  className={`h-[40px] w-full !pr-12 ${
                    !!errors.receiver && "error"
                  }`}
                  placeholder={t("send:receiver-wallet-placeholder")}
                  {...register("receiver")}
                />
                <Icons.CheveronDownIcon
                  onClick={() => setToggleReceiverDropdown((prev) => !prev)}
                  className="hover:cursor-pointer absolute w-6 h-6 top-2 right-4"
                />
              </div>
              {!!errors.receiver && (
                <p className="text-error text-xs ml-[12px] mt-1">
                  {t(errors.receiver?.message?.toString() ?? "")}
                </p>
              )}
              <CollapseDropdown
                show={toggleReceiverDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-lg bg-background-primary border border-outline">
                  {mainAddressBook.length > 0 || receiverSearchData ? (
                    <>
                      <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                      <input
                        className="is-search w-full h-[48px] bg-background-primary"
                        placeholder={t("send:search-wallet")}
                        type="text"
                        onChange={(e) => setReceiverSearchData(e.target.value)}
                      />
                      <div className="divide-y address-book-list divide-outline max-h-[206px] overflow-auto">
                        {addressBook.map((user) => (
                          <div
                            key={user.address}
                            onClick={(event) => {
                              event.stopPropagation()
                              setToggleReceiverDropdown(false)
                              setValue("receiver", user.address)
                              trigger("receiver")
                            }}
                            className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light"
                          >
                            <div className="text-sm text-content-primary">
                              {user.name}
                            </div>
                            <div className="text-caption text-content-tertiary">
                              {toSubstring(user.address, 28, false)}
                            </div>
                          </div>
                        ))}
                        {addressBook.length !== filteredPagination.total && (
                          <div className="flex justify-center items-center py-3">
                            <Icons.Loading className="text-content-primary" />
                          </div>
                        )}
                        {addressBook.length === 0 && receiverSearchData && (
                          <div className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center">
                            <div className="text-content-contrast">
                              {t("common:no-receiver-found")}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <EmptyDataState
                      message={t(
                        "createTreasury:second-steper.empty-address-book"
                      )}
                      className="h-fit w-full rounded !px-10 !py-10 bg-background-primary text-center"
                    />
                  )}
                </div>
              </CollapseDropdown>
            </div>
          </div>

          {/* Remarks */}
          {showRemarks && (
            <div className="mt-4">
              <InputField
                label={t("send:remarks")}
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={t(errors.remarks?.message?.toString() ?? "")}
              >
                <div>
                  <input
                    className={`w-full h-[40px] ${!!errors.remarks && "error"}`}
                    placeholder={t("send:remarks-placeholder")}
                    type="text"
                    {...register("remarks")}
                  />
                  <Button
                    size="small"
                    title={`${t("send:remove-remarks")}`}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    endIcon={<Icons.CrossIcon />}
                    onClick={() => setShowRemarks(false)}
                    type="button"
                  />
                </div>
              </InputField>
            </div>
          )}

          {/* Token and amount */}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <div className="relative" ref={tokensDropdownWrapper}>
              <div className="flex justify-between">
                <label className="ml-3 text-content-primary text-xs font-medium mb-1">
                  {t("send:token")}
                </label>
                <label
                  className={`text-content-tertiary text-xs font-normal mb-1`}
                >
                  {t("send:balance")}{" "}
                  {formatCurrency(
                    getBalance(tokenBalances, currentToken.symbol)
                  )}{" "}
                  {currentToken.symbol}
                </label>
              </div>
              <div
                className="relative text-content-primary"
                onClick={() => setToggleTokensDropdown((prev) => !prev)}
              >
                {currentToken.symbol && (
                  <Token
                    symbol={currentToken.symbol}
                    className="w-[18px] h-[18px] absolute top-3 left-5 text-lg"
                  />
                )}
                <input
                  type="text"
                  className={`h-[40px] w-full !pl-11 ${
                    !!errors.symbol && "error"
                  }`}
                  readOnly
                  {...register("symbol")}
                />
                <Icons.CheveronDownIcon className="w-6 h-6 hover:cursor-pointer absolute top-2 right-4" />
              </div>
              {!!errors.symbol && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(errors.symbol?.message?.toString() ?? "")}
                </p>
              )}
              <CollapseDropdown
                show={toggleTokensDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-lg bg-background-primary border border-outline">
                  <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                  <input
                    className="is-search w-full h-[48px] bg-background-primary"
                    placeholder={t("send:search-token")}
                    type="text"
                    onChange={(e) => setTokenSearchData(e.target.value)}
                  />
                  <div className="divide-y divide-outline max-h-[194px] overflow-auto">
                    {tokenDetails
                      .filter((token) =>
                        token.symbol.includes(tokenSearchData.toUpperCase())
                      )
                      .map((item) => (
                        <div
                          key={item.symbol}
                          onClick={(event) => {
                            event.stopPropagation()
                            setToggleTokensDropdown(false)
                            setCurrentToken(item)
                            setValue("symbol", item.symbol)
                            trigger("symbol")
                          }}
                          className="border-outline flex cursor-pointer overflow-hidden py-8 px-5 justify-start items-center hover:bg-background-light h-[40px]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <Token
                            symbol={item.symbol}
                            className="w-[18px] h-[18px] mr-[12px]  text-content-primary"
                          />
                          <div>
                            <div className="text-content-primary ">
                              {item.symbol}
                            </div>
                            <div className="text-caption text-content-tertiary">
                              {item.name}
                            </div>
                          </div>
                          <div className="ml-auto text-caption  text-content-secondary">
                            {getBalance(tokenBalances, item.symbol)}{" "}
                            {item.symbol}
                          </div>
                        </div>
                      ))}
                    {tokenDetails.filter((token) =>
                      token.symbol.includes(tokenSearchData.toUpperCase())
                    ).length === 0 && (
                      <div className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center">
                        <div className="text-content-contrast">
                          {t("common:no-coins-found")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CollapseDropdown>
            </div>
            <div>
              <div className="flex justify-between">
                <label
                  className={`text-content-primary ml-3 text-xs font-medium mb-1`}
                >
                  {t("send:amount")}
                </label>
                <label
                  className={`text-content-tertiary text-xs font-normal mb-1`}
                >
                  {formatCurrency(
                    prices[currentToken.symbol] * Number(getValues().amount) ||
                      0,
                    "$"
                  )}{" "}
                </label>
              </div>
              <InputField
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={t(errors.amount?.message?.toString() || "")}
              >
                <div>
                  <input
                    className={`w-full h-[40px] ${!!errors.amount && "error"}`}
                    placeholder={t("send:amount-placeholder")}
                    type="number"
                    step="any"
                    {...register("amount")}
                  />
                  <Button
                    size="small"
                    title={`${t("send:max")}`}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    onClick={() =>
                      setValue(
                        "amount",
                        getBalance(
                          tokenBalances,
                          currentToken.symbol
                        ).toString()
                      )
                    }
                    type="button"
                  />
                </div>
              </InputField>
            </div>
          </div>

          {/* Add file*/}
          {addFile && (
            <div className="mt-4">
              <FileUpload
                name={"file"}
                setValue={setValue}
                resetField={resetField}
                isReset={resetFile}
              />
            </div>
          )}

          {/* Send button */}
          <div className="mt-12">
            <Button
              className="w-full"
              variant="gradient"
              title={`${t("send:send")}`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}
