'use client'
import { ConnectWallet } from "@/app/components/ConnectWallet";
import { TransferEth } from "@/app/components/TransferEth";
import { InvestUsdc } from "@/app/components/InvestUsdc";
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { account } = useAccount();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      if (account) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          
          const apiUrl = code ? `/api?code=${code}` : '/api';
          
          const response = await fetch(apiUrl);
          const data = await response.json();
          setMessage(data.message);
        } catch (error) {
          console.error('Error fetching message:', error);
        }
      }
    };

    fetchMessage();
  }, [account]);

  return (
    <div className="min-h-screen bg-[#FFFFEE] p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <Image
          src="/chipi.png"
          alt="Chipi logo"
          width={72}
          height={15}
          className="w-14 sm:w-16 md:w-18"
        />
      </header>
      <main className="flex flex-col items-center justify-center gap-6">
        <ConnectWallet />
        {account && message && (
          <p className="text-center text-gray-700">{message}</p>
        )}
        <InvestUsdc />
        <TransferEth />
      </main>
    </div>
  );
}
