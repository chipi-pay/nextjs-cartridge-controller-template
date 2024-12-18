"use client";

import { Copy } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { connector } from "@/app/providers/StarknetProvider";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function UserCard() {
  const { account } = useAccount();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = async () => {
      const foundUsername = await connector.username();
      if (foundUsername) setUsername(foundUsername);
    };
    username();
  }, [account]);

  const copyAddress = () => {
    if (account?.address) {
      // Pad the address to 66 characters (including 0x)
      const paddedAddress = "0x" + account.address.slice(2).padStart(64, "0");
      navigator.clipboard.writeText(paddedAddress);
      toast({
        title: "Address copied!",
        description: "The wallet address has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary">
        <img
          src="/sherk.jpeg?height=48&width=48"
          alt="@wellsja"
          className="aspect-square h-full w-full"
        />
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          JW
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{username || "Wallet User"}</h2>
        </div>
        {/* Replace Button with direct button element */}
        <button
          onClick={copyAddress}
          className="inline-flex h-auto items-center justify-center gap-2 rounded-md p-0 text-sm font-normal text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          disabled={!account}
        >
          <Copy className="mr-1 h-3 w-3" />
          {account
            ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
            : "0x0000...0000"}
        </button>
      </div>

      {/* <div className="flex gap-2">
        <Link
          href="/pro"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="h-4 w-4" />
        </Link>
        <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
          <MessageCircle className="h-4 w-4 transition-colors duration-300" />
        </button>
      </div> */}
    </div>
  );
}
