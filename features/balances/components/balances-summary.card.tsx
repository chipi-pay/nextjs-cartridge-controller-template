"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";

export function BalancesSummaryCard() {
  const { balances } = useWalletBalances();

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Cash Balance
        </h3>
        <p className="text-2xl font-bold">${balances.cashBalance.toFixed(2)}</p>
        <div className="mt-2 text-sm text-muted-foreground">
          <div>ETH: {balances.eth.toFixed(5)}</div>
          <div>USDC: ${balances.usdc.toFixed(2)}</div>
          <div>STARKNET BROTHER: {balances.brother.toFixed(2)}</div>
          <div>ALF: {balances.alf.toFixed(2)}</div>
          <div>SLINK: {balances.slink.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
