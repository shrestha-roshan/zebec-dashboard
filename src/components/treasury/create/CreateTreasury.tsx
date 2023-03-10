import { NextPage } from "next"
import React from "react"
import * as Icons from "assets/icons"
import { Step, Treasury } from "./CreateTreasury.d"
import CreatingTreasury from "./steps/CreatingTreasury"
import { StepsList } from "./steps/data"
import { useTranslation } from "next-i18next"

const CreateTreasury: NextPage = () => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const { t } = useTranslation()

  const [treasury, setTreasury] = React.useState<Treasury>({
    name: "",
    owners: [],
    minValidator: 0
  })

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
    <div className="bg-background-secondary rounded-[4px] py-[76px] px-5 sm:px-10 md:px-20 xl:px-[120px]">
      <div className="flex flex-wrap">
        <div className="flex-none sm:w-1/2 w-full">
          {StepsList.map((step: Step, index: number) => (
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
                  {t(`createTreasury:${step.name}`)}
                </h4>
                <p className="text-content-secondary">
                  {t(`createTreasury:${step.subHeading}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-auto sm:w-1/2 w-full">
          <div className="bg-background-light rounded-[4px] py-[48px] px-[32px]">
            {currentStep < StepsList.length ? (
              StepsList[currentStep].component({
                setCurrentStep,
                setTreasury,
                treasury
              })
            ) : (
              <CreatingTreasury
                treasury={treasury}
                setCurrentStep={setCurrentStep}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTreasury
