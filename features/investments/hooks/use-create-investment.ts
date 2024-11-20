import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";
import {
  NIMBORA_STAKING_USDC,
  STRK_FARM_USDC_SENSEI,
  USDC_CONTRACT,
} from "@/features/web3/constants/contracts";
import { toast } from "@/hooks/use-toast";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { cairo } from "starknet";

export function useInvest() {
  const { balances } = useWalletBalances();
  const { account } = useAccount();
  const [pendingInvestment, setPendingInvestment] = useState(false);

  const invest = async () => {
    if (!account) return;
    if (balances.eth < 0.0001) {
      return toast({
        title: "Insufficient ETH",
        description: "Run out of gas. Send us a message",
        variant: "destructive",
      });
    }
    if (balances.cashBalance < 0.04) {
      return toast({
        title: "Insufficient balance",
        description: "Not enough to invest. Buy more Feria Cards.",
        variant: "destructive",
      });
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

  return {
    invest,
    pendingInvestment,
  };
}
