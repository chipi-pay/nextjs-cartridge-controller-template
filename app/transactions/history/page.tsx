import { TransactionsHistory } from "@/features/transactions/components/transactions-history";
import { DummyTransactions } from "@/features/transactions/utils/dummy-transactions";
import React from "react";

export default function TransactionsHistoryPage() {
  return <TransactionsHistory transactions={DummyTransactions} />;
}
