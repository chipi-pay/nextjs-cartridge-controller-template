"use client";

import { WalletInterface } from "@/components/wallet-interface";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFEE] p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <Image
          src="/chipi.png"
          alt="Chipi logo"
          width={72}
          height={15}
          className="md:w-18 w-14 sm:w-16"
        />
      </header>
      <>
        <WalletInterface />
        {/* {isProcessing && (
          <div className="text-center text-gray-600">
            Processing your rewards...
          </div>
        )}
        {message && <p className="text-center text-gray-700">{message}</p>} */}
      </>
    </div>
  );
}
