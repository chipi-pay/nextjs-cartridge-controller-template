'use client'
import { useAccount, useBalance, useReadContract } from "@starknet-react/core";
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI, NIMBORA_STAKED_USD } from "@/app/constants/contracts";

export const Balances = () => {
    const { account } = useAccount();
    const { data, error } = useBalance({
        address: account?.address as `0x${string}`,
        token: USDC_CONTRACT,
    });

    const { data: nstUsd, error: nstUsdError } = useBalance({
        address: account?.address as `0x${string}`,
        token: NIMBORA_STAKED_USD,
    });

    const { data: strk_balance, error: strk_error } = useReadContract({
        abi: [
        {
            name: "balance_of",
            type: "function",
            inputs: [
                {
                    "name": "account",
                    "type": "core::starknet::contract_address::ContractAddress"
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
    }); 

    console.log(strk_balance, strk_error);
    console.log(nstUsdError)
    console.log(data, error)

    if (!account) {
        return null;
    }

  return (
    <div>
        <div>
            <h2>USDC Wallet Balance</h2>
            <p>{data?.value.toString()}</p>
        </div>
        <div>
            <h2>Nimbora Staked USD</h2>
            <p>{nstUsd?.value.toString()}</p>
        </div>
        <div>
            <h2>STRK Farm Balance</h2>
            <p>{strk_balance?.toString()}</p>
        </div>
    </div>
  )
}