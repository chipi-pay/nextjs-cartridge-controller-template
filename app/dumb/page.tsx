"use client";

import { useAccount, useConnect } from "@starknet-react/core";
import { connector } from "@/app/providers/StarknetProvider";

export default function Dumb() {
  const { account } = useAccount();
  const { connect } = useConnect();

  const trigger = async () => {
    const username = await connector.username();
    const available = connector.available();
    console.log("username", username);
    console.log("available", available);
    connect({ connector });
  };
  return (
    <div className="flex flex-col gap-4">
      <h1>Dumb</h1>
      <button
        className="rounded-md border border-[#FFC3C3] bg-[#FFAAAA] px-4 py-3 font-medium text-gray-800 shadow-sm transition-colors duration-200 hover:bg-[#FFE0D7]"
        onClick={trigger}
      >
        Display connector username
      </button>
      <pre>{account ? JSON.stringify(account, null, 2) : "Not connected"}</pre>
    </div>
  );
}
