'use client'
import { useAccount, useBalance, useReadContract } from "@starknet-react/core";
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI, NIMBORA_STAKED_USD } from "@/app/constants/contracts";

export const Balances = () => {
    const { account } = useAccount();
    const { data: ethBalance } = useBalance({
        address: account?.address as `0x${string}`,
    });

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
        <div className="bg-[#FFFFEE] p-6 rounded-lg shadow-md max-w-md mx-auto border border-[#FFE0D7]">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Wallet Balances
            </h2>
            
            <div className="space-y-4">
                <div className="p-3 bg-[#F9E6B2] rounded">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        ETH Balance
                    </h3>
                    <p className="font-mono text-gray-800">
                        {ethBalance ? Number(ethBalance.formatted).toFixed(4) : '0.0000'} ETH
                    </p>
                </div>

                <div className="p-3 bg-[#F9E6B2] rounded">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        USDC Wallet Balance
                    </h3>
                    <p className="font-mono text-gray-800">
                        {data?.formatted || '0'}
                    </p>
                </div>

                <div className="p-3 bg-[#F9E6B2] rounded">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        Nimbora Staked USD
                    </h3>
                    <p className="font-mono text-gray-800">
                        {nstUsd?.formatted || '0'}
                    </p>
                </div>

                <div className="p-3 bg-[#F9E6B2] rounded">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        STRK Farm Balance
                    </h3>
                    <p className="font-mono text-gray-800">
                        {strk_balance?.toString() || '0'}
                    </p>
                </div>
            </div>
        </div>
    );
}