"use client";
import { WalletPro } from "@/components/wallet-pro";
import Link from "next/link";

export default function Pro() {
  return (
    <div>
      <WalletPro />
      <div>
        <Link href="/dumb">Dumb</Link>
      </div>
    </div>
  );
}
