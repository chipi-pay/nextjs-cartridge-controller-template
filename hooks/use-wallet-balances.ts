'use client'

import { useAccount, useBalance, useReadContract } from "@starknet-react/core"
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI, NIMBORA_STAKED_USD } from "@/app/constants/contracts"

export function useWalletBalances() {
  const { account } = useAccount()
  
  const { data: ethBalance } = useBalance({
    address: account?.address as `0x${string}`,
  })

  const { data: usdcBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: USDC_CONTRACT,
  })

  const { data: nstUsdBalance } = useBalance({
    address: account?.address as `0x${string}`,
    token: NIMBORA_STAKED_USD,
  })

  const { data: strkBalance } = useReadContract({
    abi: [
      {
        name: "balance_of",
        type: "function",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress"
          }
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
  })

  const ethValue = ethBalance ? Number(ethBalance.formatted) : 0
  const usdcValue = usdcBalance ? Number(usdcBalance.formatted) : 0
  const nstUsdValue = nstUsdBalance ? Number(nstUsdBalance.formatted) : 0
  const strkValue = strkBalance ? Number(strkBalance.toString()) : 0

  return {
    account,
    balances: {
      eth: ethValue,
      usdc: usdcValue,
      cashBalance: ethValue + usdcValue,
      investedBalance: nstUsdValue + strkValue,
    }
  }
}