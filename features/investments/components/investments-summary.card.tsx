import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

import { useAccount } from "@starknet-react/core";
import { cairo } from "starknet";
import {
  NIMBORA_STAKING_USDC,
  STRK_FARM_USDC_SENSEI,
  USDC_CONTRACT,
} from "@/features/web3/constants/contracts";

export function InvestmentsSummaryCard() {
  const { balances } = useWalletBalances();
  const { account } = useAccount();
  const [pendingInvestment, setPendingInvestment] = useState(false);

  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
    }>
  >([]);

  useEffect(() => {
    if (balances.investedBalance <= 0) return;

    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 0,
      };

      setParticles((prev) => [...prev, newParticle]);

      // Clean up old particles after 2 seconds (matching animation duration)
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 2000);
    }, 500); // Reduced frequency to every 500ms

    return () => clearInterval(interval);
  }, [balances.investedBalance]);

  const handleInvest = async () => {
    if (!account) return;
    if (balances.eth < 0.0001) {
      toast({
        title: "Insufficient ETH",
        description: "Run out of gas. Send us a message",
        variant: "destructive",
      });
      return;
    }

    if (balances.cashBalance < 0.04) {
      toast({
        title: "Insufficient balance",
        description: "Not enough to invest. Buy more Feria Cards.",
        variant: "destructive",
      });
      return;
    }

    setPendingInvestment(true);

    try {
      if (balances && balances.usdc <= 2) {
        // Nimbora staking
        await account.execute([
          {
            contractAddress: USDC_CONTRACT,
            entrypoint: "approve",
            calldata: [NIMBORA_STAKING_USDC, cairo.uint256(1 * 10 ** 6)],
          },
          {
            contractAddress: NIMBORA_STAKING_USDC,
            entrypoint: "deposit",
            calldata: [
              cairo.uint256(1 * 10 ** 6),
              account.address,
              "0x02aC4A10e11A9DbcDE67cEE0539Ca54aB3c1188C06E3BCa750b0378765b47709",
            ],
          },
        ]);
        toast({
          title: "Investment submitted",
          description: "Your USDC has been deposited in Nimbora.",
        });
      } else {
        // STRK Farm
        await account.execute([
          {
            contractAddress: USDC_CONTRACT,
            entrypoint: "approve",
            calldata: [STRK_FARM_USDC_SENSEI, cairo.uint256(2 * 10 ** 6)],
          },
          {
            contractAddress: STRK_FARM_USDC_SENSEI,
            entrypoint: "deposit",
            calldata: [cairo.uint256(2 * 10 ** 6), account.address],
          },
        ]);
        toast({
          title: "Investment submitted",
          description: "Your USDC has been deposited in STRK Farm.",
        });
      }
    } catch (error: unknown) {
      console.error(error);
      if (
        error instanceof Error &&
        (error.message?.includes("gas") || error.message?.includes("fee"))
      ) {
        toast({
          title: "Insufficient gas",
          description: "Run out of gas. Send us a message",
          variant: "destructive",
        });
        // setShowMessageAlert(true);
        // setTimeout(() => setShowMessageAlert(false), 3000);
      } else {
        toast({
          title: "Investment failed",
          description: "There was an error processing your investment.",
          variant: "destructive",
        });
      }
    } finally {
      setPendingInvestment(false);
    }
  };

  return (
    <Card className="relative h-[200px] overflow-hidden">
      <CardContent className="flex h-full flex-col pt-6">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Invested Balance
        </h3>
        <p className="relative z-10 mb-4 text-2xl font-bold">
          ${balances.investedBalance.toFixed(2)}
        </p>
        <Button
          variant="outline"
          size="sm"
          className={`relative z-10 mt-auto ${
            pendingInvestment
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
          }`}
          onClick={handleInvest}
          disabled={pendingInvestment}
        >
          Invest More
        </Button>

        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-3xl font-bold text-green-500 opacity-30"
            style={{
              left: `${particle.x}%`,
              bottom: "0px",
            }}
            initial={{ y: 0 }}
            animate={{ y: -200 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            $
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
