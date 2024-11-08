'use client'
import { useAccount, useExplorer, useBalance } from "@starknet-react/core";
import { cairo, Uint256 } from "starknet";
import { useCallback, useState } from "react";
import { STARKNET_BROTHER_TOKEN, ETH_CONTRACT } from "@/app/constants/contracts";


export const SendToUserName = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { account } = useAccount();
    const explorer = useExplorer();
    const [txnHash, setTxnHash] = useState<string>();
    const [amount, setAmount] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [wallet, setWallet] = useState<string>('');

    const { data, error } = useBalance({
        address: account?.address as `0x${string}`,
        token: ETH_CONTRACT, //STARKNET_BROTHER_TOKEN,
    });

    const handleUsername = (username: string) => {
        console.log(username);
        setUsername(username);
        //todo fetch wallet address from username
        if (username === '0xvato') {
            setWallet('0x04f905120587e7ff2765ff785415fa582868bcdf8306163f0b05524cc792b51f');
        } else {
            setWallet('');
        }

    }

    const execute = useCallback(
        async (amount: Uint256) => {
            if (!account || error) {
                return;
            }
            setSubmitted(true);
            setTxnHash(undefined);

            if(data && cairo.uint256(data.value) >= amount) {
                account
                .execute([
                    {
                        contractAddress: ETH_CONTRACT, // STARKNET_BROTHER_TOKEN,
                        entrypoint: "transfer",
                        calldata: [wallet, amount],
                    },
                ])
                .then(({ transaction_hash }) => setTxnHash(transaction_hash))
                .catch((e) => console.error(e))
                .finally(() => setSubmitted(false));
            } 
        },
        [account, data, error, wallet]
    );

    if (!account) {
        return null;
    }

    return (
        <div className="bg-[#FFFFEE] p-6 rounded-lg shadow-md max-w-md mx-auto border border-[#FFE0D7]">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Send to a ChipiUser
            </h2>
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Amount to send
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-2 border-black p-2"
                  placeholder="ChipiToken"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <button
                    onClick={() => data && setAmount(Number(data.formatted))}
                    disabled={submitted}
                    className={`w-full py-3 px-4 rounded-md shadow-sm
                        ${submitted 
                            ? 'bg-[#FFC3C3] text-gray-600 cursor-not-allowed' 
                            : 'bg-[#FFAAAA] hover:bg-[#FFE0D7] text-gray-800'
                        } 
                        transition-colors duration-200 font-medium border border-[#FFC3C3]`}
                >
                    Max
                </button>
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">
                User to Send
                <input
                  type="string"
                  className="mt-1 block w-full rounded-md border-2 border-black p-2"
                  placeholder="ChipiWallet"
                  value={username}
                  onChange={(e) => handleUsername(e.target.value)}
                />
              </label>
            </div>
            <button
                onClick={() => execute(cairo.uint256(amount * 10 ** 18))}
                disabled={submitted}
                className={`w-full py-3 px-4 rounded-md shadow-sm
                    ${submitted 
                        ? 'bg-[#FFC3C3] text-gray-600 cursor-not-allowed' 
                        : 'bg-[#FFAAAA] hover:bg-[#FFE0D7] text-gray-800'
                    } 
                    transition-colors duration-200 font-medium border border-[#FFC3C3]`}
            >
                Send
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
