"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useTransactionReceipt } from "@starknet-react/core";
import { connector } from "./providers/StarknetProvider";

import { useRedeemFeriaCard } from "@/features/feria-cards/hooks/use-redeem-feria-card";
import { UserCard } from "@/features/users/components/user.card";
import { InvestmentsSummaryCard } from "@/features/investments/components/investments-summary.card";
import { BalancesSummaryCard } from "@/features/balances/components/balances-summary.card";
import { RedeemFeriaCardButton } from "@/features/feria-cards/components/redeem-feria-card.button";

import confetti from "canvas-confetti";

import { ConnectWalletModal } from "@/components/connect-wallet.modal";
import { Card, CardContent } from "@/components/ui/card";
import { SendTokenButton } from "@/features/sends/components/send-token.button";
import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";
import { SuccessfulTransactionReceiptResponse } from "starknet";

export default function HomePage() {
  const searchParams = useSearchParams();
  const { account } = useAccount();
  const { toast } = useToast();
  const { refetchBalances } = useWalletBalances();
  const { mutate: redeemFeriaCard, data: redeemedCard } = useRedeemFeriaCard();
  const { data: redeemedCardReceipt } = useTransactionReceipt({
    hash: redeemedCard?.txHash,
    enabled: !!redeemedCard,
  });

  const [redeemMessage, setRedeemMessage] = useState<string>("");

  useEffect(() => {
    const processRedeem = async () => {
      if (!account?.address) return;

      const code = searchParams.get("code");
      if (!code) {
        console.log("❌ No redeem code found");
        return;
      }

      if (!account?.address) {
        console.log("⏳ Waiting for addresses to be set...");
        return;
      }

      const username = await connector.username();

      if (!username) {
        return;
      }

      try {
        redeemFeriaCard(
          {
            cardCode: code,
            walletAddress: account.address,
            username,
          },
          {
            onSuccess: async (redeemedCard) => {
              const { transaction_hash: transactionHash, execution_status } =
                (await account?.waitForTransaction(
                  redeemedCard.txHash,
                )) as SuccessfulTransactionReceiptResponse;

              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
              setRedeemMessage(
                `You redem code ${redeemedCard.amount} ChipiFeria successfully`,
              );
              toast({
                title: "Redeem successful!",
                description: "Code redeemed successfully",
              });
              setTimeout(() => {
                window.location.href = "/";
              }, 2000);
              return;
            },
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
      } catch (error) {
        console.error("❌ Fetch error:", error);
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
      }
    };
    processRedeem();
  }, [account]);

  if (!account) {
    return <ConnectWalletModal />;
  }

  return (
    <div className="space-y-6">
      <UserCard />
      <div className="grid grid-cols-2 gap-4">
        <BalancesSummaryCard />
        <InvestmentsSummaryCard />
      </div>
      {redeemMessage && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-700">{redeemMessage}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-2 gap-4">
        <SendTokenButton />
        <RedeemFeriaCardButton />
      </div>
    </div>
  );
}
