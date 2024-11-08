'use client'
import { WalletInterface } from "@/components/wallet-interface"
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export default function Pro() {
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
              setMessage(data.error);
            } else if (data.message) {
              setMessage(data.message);
            }
          } catch (error: unknown) {
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
    <>
      <WalletInterface />
      {isProcessing && (
        <div className="text-center text-gray-600">
          Processing your rewards...
        </div>
      )}
      {message && (
        <p className="text-center text-gray-700">{message}</p>
      )}
    </>
  );
}
