/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import * as Icons from "assets/icons"
import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import {
  FC,
  FormEvent,
  FormEventHandler,
  useContext,
  useEffect,
  useState
} from "react"
import { twMerge } from "tailwind-merge"
import { DepositNFTProps } from "./DepositNFT.d"
import { initDepositNft } from "application"
import { useWallet } from "@solana/wallet-adapter-react"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { useRouter } from "next/router"
import { fetchAssociatedNfts } from "features/treasuryNft/treasuryNftSlice"

const StepsList = [
  {
    name: "first-step.title",
    subHeading: "first-step.description"
  },
  {
    name: "second-step.title",
    subHeading: "second-step.description"
  }
]

export const DepositNFTLeft: FC<DepositNFTProps> = ({ className, nft }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { token } = useContext(ZebecContext)
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(false)

  const depositNftCallback = (message: "success" | "error") => {
    if (message === "success") {
      if (activeTreasury && publicKey) {
        router.push(`/treasury/${activeTreasury.uuid}/nft`)
        fetchAssociatedNfts({
          address: activeTreasury.treasury_address,
          type: "treasury"
        })
        fetchAssociatedNfts({
          address: publicKey.toString(),
          type: "wallet"
        })
      }
    }
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    if (currentStep === 0) {
      if (nft) {
        setCurrentStep(1)
        error && setError(false)
      } else {
        setError(true)
      }
    } else {
      if (publicKey && activeTreasury && nft && token) {
        const data = {
          sender: publicKey.toString(),
          receiver: activeTreasury.treasury_address,
          token_mint_address: nft.address,
          amount: 1
        }
        dispatch(toggleWalletApprovalMessageModal())
        dispatch(
          initDepositNft({
            data,
            token,
            callback: depositNftCallback
          })
        )
      }
      error && setError(false)
    }
  }

  useEffect(() => {
    if (nft && error) setError(false)
  }, [nft, error])

  const getStepState = (index: number, isIcon = false) => {
    if (index === currentStep) {
      return isIcon ? index + 1 : "bg-primary"
    }
    if (index < currentStep) {
      return isIcon ? <Icons.CheckIcon /> : "bg-success"
    }
    return isIcon ? index + 1 : "bg-content-contrast"
  }

  return (
    <>
      <div className={twMerge("p-10", className ?? "")}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
          {StepsList.map((step, index: number) => (
            <div
              className={`steps-container flex mb-[64px] ${
                StepsList.length - 1 === index ? "last" : ""
              }`}
              key={`steps-${index}`}
            >
              <div
                className={`w-[26px] flex justify-center items-center text-center h-[26px] self-center mr-2 rounded-full ${getStepState(
                  index
                )} text-xs text-content-primary`}
              >
                {getStepState(index, true)}
              </div>
              <div className="w-4/5">
                <h4 className="leading-6 font-medium text-sm text-content-primary">
                  {t(`treasury:steps.${step.name}`)}
                </h4>
                <p
                  className={`${
                    index === 0 && error
                      ? "text-error"
                      : "text-content-secondary"
                  }`}
                >
                  {t(`treasury:steps.${step.subHeading}`)}
                </p>
              </div>
            </div>
          ))}
          {/* Send button */}
          <div>
            <Button
              className="w-full"
              variant="gradient"
              title={`${t(
                currentStep === 0
                  ? "common:buttons.continue"
                  : "common:buttons.deposit"
              )}${currentStep !== 0 && nft ? ` - ${nft.name}` : ""}`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}
