"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSendToWallet } from "@/hooks/use-sender";
import {
  useSendBrotherToken,
  useSendSlink,
  useSendAlf,
} from "@/hooks/use-sender";

interface SendTokenProps {
  onBack: () => void;
}

export function SendToken({ onBack }: SendTokenProps) {
  const [selectedToken, setSelectedToken] = useState("usdc");
  const usdcSender = useSendToWallet();
  const brotherSender = useSendBrotherToken();
  const slinkSender = useSendSlink();
  const alfSender = useSendAlf();

  // Get the active sender based on selected token
  const getActiveSender = () => {
    switch (selectedToken) {
      case "usdc":
        return usdcSender;
      case "brother":
        return brotherSender;
      case "slink":
        return slinkSender;
      case "alf":
        return alfSender;
      default:
        return usdcSender;
    }
  };

  const sender = getActiveSender();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sender.execute({ low: sender.amount, high: 0 });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">Send Token</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usdc">USDC</SelectItem>
              <SelectItem value="brother">STARKNET BROTHER</SelectItem>
              <SelectItem value="slink">SLINK</SelectItem>
              <SelectItem value="alf">ALF</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Recipient Address"
            value={sender.wallet}
            onChange={(e) => sender.setWallet(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={sender.amount}
            onChange={(e) => sender.setAmount(Number(e.target.value))}
          />
          <Button type="submit" className="w-full" disabled={sender.submitted}>
            {sender.submitted ? "Sending..." : "Send"}
          </Button>

          {sender.errorMessage && (
            <p className="text-sm text-red-500">{sender.errorMessage}</p>
          )}
          {sender.txnHash && (
            <p className="text-sm text-green-500">
              Transaction submitted! View on{" "}
              <a
                href={`${sender.explorer}/tx/${sender.txnHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Explorer
              </a>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
