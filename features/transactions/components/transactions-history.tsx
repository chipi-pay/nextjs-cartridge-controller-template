import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Transaction = {
  emoji: string;
  category: string;
  amount: number;
  date: string;
  friend: string;
};

export function TransactionsHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Earnings
            </h3>
            <p className="text-xl font-bold">$2,150.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Spendings
            </h3>
            <p className="text-xl font-bold">$171.25</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium">Transactions</h3>
          <span className="text-sm text-muted-foreground">
            116 transactions
          </span>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {transactions.map((transaction, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{transaction.emoji}</span>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {transaction.friend}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={
                    transaction.amount > 0
                      ? "font-medium text-green-600"
                      : "font-medium text-red-600"
                  }
                >
                  {transaction.amount > 0 ? "+" : "-"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
