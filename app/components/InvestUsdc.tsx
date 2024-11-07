'use client'
import { useAccount, useExplorer, useBalance } from "@starknet-react/core";
import { cairo, Uint256 } from "starknet";
import { useCallback, useState } from "react";
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI, NIMBORA_STAKING_USDC } from "@/app/constants/contracts";

export const InvestUsdc = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { account } = useAccount();
    const explorer = useExplorer();
    const [txnHash, setTxnHash] = useState<string>();

    const { data, error } = useBalance({
        address: account?.address as `0x${string}`,
        token: USDC_CONTRACT,
    });

    const execute = useCallback(
        async (amount: Uint256) => {
            if (!account || error) {
                return;
            }
            setSubmitted(true);
            setTxnHash(undefined);

            if(data && Number(data.formatted) >= 2) {
                account
                .execute([
                    {
                        contractAddress: USDC_CONTRACT,
                        entrypoint: "approve",
                        calldata: [NIMBORA_STAKING_USDC, amount],
                    },
                    {
                        contractAddress: NIMBORA_STAKING_USDC,
                        entrypoint: "deposit",
                        calldata: [amount, account?.address, "0x02aC4A10e11A9DbcDE67cEE0539Ca54aB3c1188C06E3BCa750b0378765b47709"],
                    },
                ])
                .then(({ transaction_hash }) => setTxnHash(transaction_hash))
                .catch((e) => console.error(e))
                .finally(() => setSubmitted(false));
            } else {
            account
                .execute([
                    {
                        contractAddress: USDC_CONTRACT,
                        entrypoint: "approve",
                        calldata: [STRK_FARM_USDC_SENSEI, amount],
                    },
                    {
                        contractAddress: STRK_FARM_USDC_SENSEI,
                        entrypoint: "deposit",
                        calldata: [amount, account?.address],
                    },
                ])
                .then(({ transaction_hash }) => setTxnHash(transaction_hash))
                .catch((e) => console.error(e))
                .finally(() => setSubmitted(false));
            }
        },
        [account, data, error]
    );

    if (!account) {
        return null;
    }

    return (
        <div className="bg-[#FFFFEE] p-6 rounded-lg shadow-md max-w-md mx-auto border border-[#FFE0D7]">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Invest your USDC
            </h2>
            <button
                onClick={() => execute(cairo.uint256(1*10**6))}
                disabled={submitted}
                className={`w-full py-3 px-4 rounded-md shadow-sm
                    ${submitted 
                        ? 'bg-[#FFC3C3] text-gray-600 cursor-not-allowed' 
                        : 'bg-[#FFAAAA] hover:bg-[#FFE0D7] text-gray-800'
                    } 
                    transition-colors duration-200 font-medium border border-[#FFC3C3]`}
            >
                Invest my USDC
            </button>
            {txnHash && (
                <p className="mt-4 p-3 bg-[#FFFDD0] rounded-md">
                    Transaction hash:{" "}
                    <a
                        href={explorer.transaction(txnHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FFAAAA] hover:text-[#FFC3C3] underline break-all"
                    >
                        {txnHash}
                    </a>
                </p>
            )}
        </div>
    );
};
