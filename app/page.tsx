"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useTransactionReceipt } from "@starknet-react/core";
import { connector } from "../lib/providers/StarknetProvider";

import { useRedeemFeriaCard } from "@/features/feria-cards/hooks/use-redeem-feria-card";
import { UserCard } from "@/features/users/components/user.card";
import { InvestmentsSummaryCard } from "@/features/investments/components/investments-summary.card";
import { BalancesSummaryCard } from "@/features/balances/components/balances-summary.card";
import { RedeemFeriaCardButton } from "@/features/feria-cards/components/redeem-feria-card.button";

import { ConnectWalletModal } from "@/components/connect-wallet.modal";
import { SendTokenButton } from "@/features/sends/components/send-token.button";
import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";

export default function HomePage() {
  const searchParams = useSearchParams();
  const { account } = useAccount();
  const { toast } = useToast();
  const { refetchBalancesWithDelay } = useWalletBalances();
  const { mutateAsync: redeemFeriaCard, data: redeemedCard } =
    useRedeemFeriaCard();
  const { data: redeemedCardReceipt } = useTransactionReceipt({
    hash: redeemedCard?.txHash,
    enabled: !!redeemedCard,
  });
  const [redeemMessage, setRedeemMessage] = useState<string>("");

  useEffect(() => {
    const processRedeem = async () => {
      if (!account?.address) return;
      const code = searchParams.get("code");
      if (!code) return;
      const username = await connector.username();
      if (!username) return;
      await redeemFeriaCard(
        {
          cardCode: code,
          walletAddress: account.address,
          username,
        },
        {
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to process rewards. Please try again later.";
            setRedeemMessage(errorMessage);
            toast({
              title: "Redeem failed",
              description: errorMessage,
              variant: "destructive",
            });
          },
        },
      );
    };
    try {
      processRedeem();
    } catch (error) {
      console.error(error);
    }
  }, [account]);

  useEffect(() => {
    const updateBalances = async () => {
      console.log("redeemedCardReceipt activated", redeemedCardReceipt);
      if (redeemedCardReceipt?.isSuccess) {
        setRedeemMessage(
          `You redem code ${redeemedCard?.feriaCardCode} ChipiFeria successfully`,
        );
        toast({
          title: "Redeem successful!",
          description: "Code redeemed successfully",
        });
        refetchBalancesWithDelay(3000);
      }
    };
    updateBalances();
  }, [redeemedCardReceipt]);

  if (!account) {
    return <ConnectWalletModal />;
  }

  return (
    <div className="space-y-6 bg-[#CCF4E8] p-6">
      <UserCard />
      <div className="flex grid grid-cols-2 flex-row flex-col gap-4">
        <BalancesSummaryCard />
        <InvestmentsSummaryCard />
      </div>
      {redeemMessage && (
        <div className="mx-2 flex flex-col rounded-xl border border-2 border-black bg-card p-6 text-card-foreground">
          <p className="text-center text-gray-700">{redeemMessage}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <SendTokenButton />
        <RedeemFeriaCardButton />
      </div>
    </div>
  );
}
