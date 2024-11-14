"use client";

import { STARKNET_BROTHER_TOKEN } from "@/app/constants/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export function BalancesSummaryCard() {
  const { account } = useAccount();
  const { balances } = useWalletBalances();
  const [brotherBalance, setBrotherBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBrotherBalance = async () => {
      if (!account?.address) return;

      try {
        const response = await account.callContract({
          contractAddress: STARKNET_BROTHER_TOKEN,
          entrypoint: "balanceOf",
          calldata: [account.address],
        });

        // Convert balance from felt to number and update state
        const balance = Number(response[0]) / 10 ** 18;
        setBrotherBalance(balance);
      } catch (error) {
        console.error("Failed to fetch Brother balance:", error);
        setBrotherBalance(0);
      }
    };

    fetchBrotherBalance();
  }, [account]);

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
          <div>STARKNET BROTHER: {brotherBalance.toFixed(2)}</div>
          <div>ALF: {balances.alf.toFixed(2)}</div>
          <div>SLINK: {balances.slink.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
