import {
  Breadcrumb,
  EmptyDataState,
  Pagination,
  RowsPerPage,
  Table,
  TableBody
} from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import FilterTabs from "./FilterTabs"
import OutgoingTableRow from "./OutgoingTableRow"
import ExportModal from "components/modals/export-report/ExportModal"
// import { useWallet } from "@solana/wallet-adapter-react"
import {
  fetchOutgoingTransactions,
  setLimit,
  setOutgoingCurrentPage
} from "features/transactions/transactionsSlice"
import { TransactionSkeleton } from "./transactionSkeleton"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  // const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { outgoingTransactions, limit, loading } = useAppSelector(
    (state) => state.transactions
  )

  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noOfOptions = [10, 20, 30, 40]

  const headers = [
    { label: "transactions:table.progress", width: "85" },
    { label: "transactions:table.transaction-date", width: "61" },
    { label: "transactions:table.receiver", width: "61" },
    { label: "" }
  ]

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("")
    else setActiveDetailsRow(index)
  }

  return (
    <>
      <Breadcrumb title={`${t("outgoing-transactions")}`} />

      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {loading && !outgoingTransactions.results.length && (
            <TransactionSkeleton />
          )}
          {outgoingTransactions.results.length === 0 && !loading ? (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState message="There are no outgoing transactions. The transactions you received will appear here." />
              </td>
            </tr>
          ) : (
            outgoingTransactions.results.map((transaction, index) => {
              return (
                <OutgoingTableRow
                  key={index}
                  index={index}
                  transaction={transaction}
                  activeDetailsRow={activeDetailsRow}
                  handleToggleRow={() => handleToggleRow(index)}
                />
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between text-caption pt-5">
        <RowsPerPage
          noOfRows={limit}
          noOfOptions={noOfOptions}
          onChange={(noOfRows) => dispatch(setLimit(noOfRows))}
        />
        <Pagination
          pages={Math.ceil(outgoingTransactions.count / limit)}
          onChange={(page: number) => {
            dispatch(setOutgoingCurrentPage(page))
            dispatch(fetchOutgoingTransactions())
          }}
        />
      </div>

      <ExportModal />
    </>
  )
}

export default Outgoing
