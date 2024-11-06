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
                    address ? disconnect() : connect({ connector });
                }}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
                {address ? "Disconnect" : "Connect Wallet"}
            </button>
        </div>
    );
}