'use client'
import { useAccount, useExplorer } from "@starknet-react/core";
import { useCallback, useState } from "react";
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI } from "@/app/constants/contracts";

export const InvestUsdc = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { account } = useAccount();
    const explorer = useExplorer();
    const [txnHash, setTxnHash] = useState<string>();

    const execute = useCallback(
        async (amount: string) => {
            if (!account) {
                return;
            }
            setSubmitted(true);
            setTxnHash(undefined);

            account
                .execute([
                    {
                        contractAddress: USDC_CONTRACT,
                        entrypoint: "approve",
                        calldata: [STRK_FARM_USDC_SENSEI, amount, "0x0"],
                    },
                    {
                        contractAddress: STRK_FARM_USDC_SENSEI,
                        entrypoint: "deposit",
                        calldata: [amount, "0x0", account?.address],
                    },
                ])
                .then(({ transaction_hash }) => setTxnHash(transaction_hash))
                .catch((e) => console.error(e))
                .finally(() => setSubmitted(false));
        },
        [account]
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
                onClick={() => execute("0x0f4240")}
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