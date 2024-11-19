import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { connector } from "@/lib/providers/StarknetProvider";
import { useEffect, useState } from "react";

export function ConnectWalletModal() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="mb-8">
        <Link href="/">
          <Image src="/chipi.png" alt="Company Logo" height={40} width={120} />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <h2 className="mb-4 text-xl font-semibold">Connect Your Wallet</h2>
          <ConnectWallet />
        </CardContent>
      </Card>
    </div>
  );
}

function ConnectWallet() {
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
        <div className="font-mono text-sm text-gray-800">
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
        className={`rounded-md border border-[#FFC3C3] bg-[#FFAAAA] px-4 py-3 font-medium text-gray-800 shadow-sm transition-colors duration-200 hover:bg-[#FFE0D7]`}
      >
        {address ? "Disconnect" : "Connect Wallet"}
      </button>
    </div>
  );
}
