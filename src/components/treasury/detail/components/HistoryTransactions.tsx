import { Table, TableBody } from "components/shared";
import { historyTransactions } from "fakedata";
import { useState } from "react";
import HistoryTableRow from "./HistoryTableRow";

export const HistoryTransactions = () => {
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("");

  const headers = [
    {
      label: "progress",
      width: '340px',
    },
    {
      label: "transaction-date",
      width: '200px',

    },
    {
      label: "sender-or-receiver",
      width: '200px',

    },
    {
      label: "",
      width: '200px',

    },
  ];

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("");
    else setActiveDetailsRow(index);
  };
  return (
    <Table headers={headers}>
      <TableBody>
        {historyTransactions.map((transaction, index) => {
          return (
            <HistoryTableRow
              key={index}
              index={index}
              transaction={transaction}
              activeDetailsRow={activeDetailsRow}
              handleToggleRow={() => handleToggleRow(index)}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};