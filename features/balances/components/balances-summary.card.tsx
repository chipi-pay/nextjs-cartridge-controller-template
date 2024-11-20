"use client";

import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";
import { RedeemFeriaCardButton } from "@/features/feria-cards/components/redeem-feria-card.button";

export function BalancesSummaryCard() {
  const { balances } = useWalletBalances();

  return (
    <div className="flex flex-col justify-between rounded-xl border-2 border-black bg-white p-6">
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex flex-col text-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            CASH BALANCE
          </h3>
          <p className="text-5xl font-bold">
            ${balances.cashBalance.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            LATEST REDEEM
          </h3>
          <div className="flex inline-flex w-fit flex-row items-center justify-center gap-2 p-2">
            <p className="flex items-center justify-center text-xl font-medium">
              Bangalore, India | 12/12/2024 | $100
            </p>
          </div>
        </div>
        <RedeemFeriaCardButton />
      </div>
    </div>
  );
}
