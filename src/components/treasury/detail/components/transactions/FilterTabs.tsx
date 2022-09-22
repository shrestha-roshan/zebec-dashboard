import { useAppDispatch } from "app/hooks"
import { Button, Tab } from "components/shared"
import { toggleExportModal } from "features/export-report/exportSlice"
// import ExportModal from "components/modals/export-report/ExportModal"

import { useTranslation } from "next-i18next"
import { FC } from "react"

export interface Tab {
  title: string
  icon?: JSX.Element
  count?: number
  component: JSX.Element
}

export interface FilterTabProps {
  tabs: Tab[]
  activeTab: number
  setActiveTab: (index: number) => void
}

export const FilterTabs: FC<FilterTabProps> = ({
  tabs,
  activeTab,
  setActiveTab
}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")

  return (
    <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4 pb-4">
      {/* Filter */}
      <div className="flex gap-x-2 items-center overflow-x-auto">
        {tabs.map((filterTab, index) => {
          return (
            <Tab
              key={filterTab.title}
              isActive={activeTab === index}
              title={`${t(filterTab.title.toLowerCase())}`}
              type="solid"
              count={filterTab.count}
              startIcon={filterTab.icon}
              onClick={() => setActiveTab(index)}
            />
          )
        })}
      </div>
      {/* Export */}

      <Button
        title={`${t("export-report")}`}
        onClick={() => {
          dispatch(toggleExportModal())
        }}
      />
      {/* <ExportModal /> */}
    </div>
  )
}
