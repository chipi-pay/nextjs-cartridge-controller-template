"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSendToUsername, useSendToWallet } from "@/hooks/use-sender";
import { cairo } from "starknet";

interface SendCashProps {
  onBack?: () => void;
}

export function SendCash({ onBack = () => {} }: SendCashProps) {
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState("");
  const [isChipiFriend, setIsChipiFriend] = useState<boolean | null>(null);
  const { toast } = useToast();

  const {
    submitted: submittedUsername,
    txnHash: txnHashUsername,
    handleUsername,
    execute: executeUsername,
    errorMessage: usernameError,
  } = useSendToUsername();

  const {
    submitted: submittedWallet,
    txnHash: txnHashWallet,
    setWallet,
    execute: executeWallet,
    errorMessage: walletError,
  } = useSendToWallet();

  useEffect(() => {
    if (recipient.startsWith("0x") && recipient.length === 66) {
      setIsChipiFriend(false);
      setWallet(recipient);
    } else if (recipient.length > 0) {
      setIsChipiFriend(true);
      handleUsername(recipient);
    } else {
      setIsChipiFriend(null);
    }
  }, [recipient, setWallet, handleUsername]);

  const handleSend = async () => {
    const amountNum = parseFloat(amount);
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please enter both recipient and amount",
        variant: "destructive",
      });
      return;
    }

    if (amountNum <= 0 || isNaN(amountNum)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isChipiFriend) {
        await executeUsername(cairo.uint256(amountNum * 1e18));
        toast({
          title: "Success",
          description: "Transaction submitted successfully",
        });
      } else {
        await executeWallet(cairo.uint256(amountNum * 1e6));
        toast({
          title: "Success",
          description: "Transaction submitted successfully",
        });
      }
    } catch {
      toast({
        title: "Error",
        description:
          (isChipiFriend ? usernameError : walletError) || "Transaction failed",
        variant: "destructive",
      });
    }
  };

  const handleSetMaxAmount = () => {
    setAmount("100"); // Replace with actual max amount logic
  };

  const submitted = submittedUsername || submittedWallet;

  return (
    <Card className="relative h-[200px] overflow-hidden">
      <CardContent className="flex h-full flex-col pt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Send Cash
          </h3>
          <Button variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
        </div>
        <div className="flex-1 space-y-4">
          <Input
            placeholder="Enter recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border-muted bg-transparent"
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setAmount(value);
                  }
                }}
                className="border-muted bg-transparent"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-purple-500 hover:text-purple-600"
                onClick={handleSetMaxAmount}
              >
                MAX
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
              onClick={handleSend}
              disabled={submitted}
            >
              Send
            </Button>
          </div>
        </div>
        {(txnHashUsername || txnHashWallet) && (
          <p className="mt-4 rounded-md bg-gray-100 p-3">
            Transaction hash:{" "}
            <a
              href={`https://starkscan.co/tx/${txnHashUsername || txnHashWallet}`}
              target="_blank"
              rel="noreferrer"
              className="break-all text-blue-500 underline hover:text-blue-600"
            >
              {txnHashUsername || txnHashWallet}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
