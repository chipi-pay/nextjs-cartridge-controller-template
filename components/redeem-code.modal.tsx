"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRedeemFeriaCard } from "@/features/feria-cards/hooks/use-redeem-feria-card";
import { useAccount } from "@starknet-react/core";

interface RedeemCodeModalProps {
  onBack?: () => void;
}

export function RedeemCodeModal({ onBack = () => {} }: RedeemCodeModalProps) {
  const [code, setCode] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { account } = useAccount();
  const { mutate: redeemFeriaCard, isPending: isRedeemingFeriaCard } =
    useRedeemFeriaCard();

  const handleRedeem = async () => {
    console.log("Redeeming feria card...", code);
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter a code",
        variant: "destructive",
      });
      return;
    }

    redeemFeriaCard(
      {
        cardCode: code,
        walletAddress: account?.address as string,
        username: account?.address as string,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Redeem successful!",
            description: `Code ${data.feriaCardCode} redeemed successfully`,
          });
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to process rewards. Please try again later.";
          toast({
            title: "Redeem failed",
            description: errorMessage,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Card className="relative h-[200px] overflow-hidden" ref={cardRef}>
      {/* {showConfetti && (
        <div className="absolute inset-0">
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )} */}
      <CardContent className="flex h-full flex-col pt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Redeem Code
          </h3>
          <Button variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
        </div>
        <div className="flex-1 space-y-4">
          <Input
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border-muted bg-transparent"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
            onClick={handleRedeem}
            disabled={isRedeemingFeriaCard}
          >
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
