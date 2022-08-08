import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch } from "app/hooks"
import ExportModal from "components/modals/export-report/ExportModal"
import {
  Breadcrumb,
  Pagination,
  RowsPerPage,
  Table,
  TableBody
} from "components/shared"
import { incomingTransactions } from "fakedata"
import { fetchIncomingTransactions } from "features/transactions/transactionsSlice"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import FilterTabs from "./FilterTabs"
import IncomingTableRow from "./IncomingTableRow"

const Incoming: FC = () => {
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")
  const { publicKey } = useWallet()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const [noOfRows, setNoOfRows] = useState(10)

  const headers = [
    {
      label: "transactions:table.progress",
      width: "85"
    },
    {
      label: "transactions:table.transaction-date",
      width: "60"
    },
    {
      label: "transactions:table.sender",
      width: "60"
    },
    {
      label: ""
    }
  ]

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("")
    else setActiveDetailsRow(index)
  }

  useEffect(() => {
    dispatch(fetchIncomingTransactions(publicKey?.toString()))
  }, [dispatch, publicKey])

  return (
    <>
      <Breadcrumb title={`${t("incoming-transactions")}`} />
      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {incomingTransactions.data.map((transaction, index) => {
            return (
              <IncomingTableRow
                key={index}
                index={index}
                transaction={transaction}
                activeDetailsRow={activeDetailsRow}
                handleToggleRow={() => handleToggleRow(index)}
              />
            )
          })}
        </TableBody>
      </Table>
      <div className="flex pt-5">
        <RowsPerPage setNoOfRows={setNoOfRows} noOfRows={noOfRows} />
        <div className="ml-auto">
          <Pagination
            pages={100}
            setCurrentPage={setCurrentPage}
            setNoOfRows={setNoOfRows}
          />
        </div>
      </div>

      <ExportModal />
    </>
  )
}

export default Incoming
