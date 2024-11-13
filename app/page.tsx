"use client";

import { WalletInterface } from "@/components/wallet-interface";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <WalletInterface />
      </div>
      <div className="flex flex-row gap-4">
        <Link href="/pro">Pro</Link>
        <Link href="/dumb">Dumb</Link>
      </div>
    </div>
  );
}
