'use client'
import { ConnectWallet } from "@/app/components/ConnectWallet";
import { TransferEth } from "@/app/components/TransferEth";
import { InvestUsdc } from "@/app/components/InvestUsdc";
import { Balances } from "@/app/components/Balances";
import { SendToUserName } from "@/app/components/SendToChipiUser";
import { SendToWallet } from "@/app/components/SendToWallet";

import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { account } = useAccount();
  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      if (account && !isProcessing && !hasProcessed) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          try {
            setIsProcessing(true);
            console.log('🚀 Fetching rewards...', {
              code,
              address: account.address
            });

            const response = await fetch(`/api?code=${code}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                address: account.address
              })
            });

            const data = await response.json();
            
            if (data.error) {
              console.error('❌ Error:', data.error);
              setMessage(data.error);
            } else if (data.message) {
              console.log('✅ Success:', data);
              setMessage(data.message);
            }
          } catch (error) {
            console.error('❌ Fetch error:', error);
            setMessage('Failed to process rewards. Please try again later.');
          } finally {
            setIsProcessing(true);
            setHasProcessed(true);
          }
        }
      }
    };

    fetchRewards();
  }, [account, isProcessing, hasProcessed]);

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
        <Balances />
        {isProcessing && (
          <div className="text-center text-gray-600">
            Processing your rewards...
          </div>
        )}
        {message && (
          <p className="text-center text-gray-700">{message}</p>
        )}
        <InvestUsdc />
        <TransferEth />
        <SendToUserName />
        <SendToWallet />
      </main>
    </div>
  );
}
