'use client';
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { connector } from "@/app/providers/StarknetProvider";
import { useEffect, useState } from "react";
export function ConnectWallet() {
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const [username, setUsername] = useState<string>();
    useEffect(() => {
        if (!address) return;
        connector.username()?.then((n) => setUsername(n));
    }, [address]);
    return (
        <div className="flex flex-col items-center gap-4">
            {address && (
                <div className="text-sm font-mono">
                    <p className="mb-2">Account: {address}</p>
                    {username && <p>Username: {username}</p>}
                </div>
            )}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    address ? disconnect() : connect({connector});
                }}
                className={`py-3 px-4 rounded-md shadow-sm
                    bg-[#FFAAAA] hover:bg-[#FFE0D7] text-gray-800
                    transition-colors duration-200 font-medium border border-[#FFC3C3]`}
            >
                {address ? "Disconnect" : "Connect Wallet"}
            </button>
        </div>
    );
}