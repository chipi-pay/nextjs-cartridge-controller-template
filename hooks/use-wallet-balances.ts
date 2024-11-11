"use client";

import { useAccount, useBalance, useReadContract } from "@starknet-react/core";
import {
  USDC_CONTRACT,
  STRK_FARM_USDC_SENSEI,
  NIMBORA_STAKED_USD,
  STARKNET_BROTHER_TOKEN,
  ALF_TOKEN,
  SLINK_TOKEN,
} from "@/app/constants/contracts";

export function useWalletBalances() {
  const { account } = useAccount();

  const { data: ethBalance } = useBalance({
    address: account?.address as `0x${string}`,
  });

  const { data: usdcBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: USDC_CONTRACT,
  });

  const { data: brotherBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: STARKNET_BROTHER_TOKEN,
  });

  const { data: nstUsdBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: NIMBORA_STAKED_USD,
  });

  const { data: strkBalance } = useReadContract({
    abi: [
      {
        name: "balance_of",
        type: "function",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "balance_of",
    address: STRK_FARM_USDC_SENSEI,
    args: [account?.address],
  });

  const { data: alfBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: ALF_TOKEN,
  });

  const { data: slinkBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: SLINK_TOKEN,
  });

  const ethValue = ethBalance ? Number(ethBalance.formatted) : 0;
  const usdcValue = usdcBalance ? Number(usdcBalance.formatted) : 0;
  const nstUsdValue = nstUsdBalance ? Number(nstUsdBalance.formatted) : 0;
  const strkValue = strkBalance ? Number(strkBalance.toString()) : 0;
  const brotherValue = brotherBalance ? Number(brotherBalance.formatted) : 0;
  const alfValue = alfBalance ? Number(alfBalance.formatted) : 0;
  const slinkValue = slinkBalance ? Number(slinkBalance.formatted) : 0;

  const fetchBalances = () => {
    // Implement your fetch logic here
  };

  return {
    account,
    balances: {
      eth: ethValue,
      usdc: usdcValue,
      brother: brotherValue,
      alf: alfValue,
      slink: slinkValue,
      cashBalance: ethValue + usdcValue,
      investedBalance: nstUsdValue + strkValue,
    },
    refetch: fetchBalances,
  };
}
