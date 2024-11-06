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
                <div className="p-3 bg-[#F9E6B2] rounded-md text-gray-800 font-mono text-sm">
                    <p className="mb-2">Account: {address}</p>
                    {username && <p>Username: {username}</p>}
                </div>
            )}

            <button
                onClick={() => {
                    address ? disconnect() : connect({ connector });
                }}
                className={`px-6 py-3 rounded-md shadow-sm font-medium
                    ${address 
                        ? 'bg-[#FFC3C3] hover:bg-[#FFE0D7]' 
                        : 'bg-[#FFAAAA] hover:bg-[#FFE0D7]'
                    }
                    text-gray-800 transition-colors duration-200 border border-[#FFC3C3]`}
            >
                {address ? "Disconnect" : "Connect Wallet"}
            </button>
        </div>
    );
}
