import { useState } from "react";
import { Redeem } from "@/components/redeem";

export function RedeemFeriaCardButton() {
  const [showRedeemCard, setShowRedeemCard] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <button
        className="h-14 border border-input bg-background text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        onClick={() => setShowRedeemCard(!showRedeemCard)}
      >
        Redeem
      </button>
      {showRedeemCard && <Redeem onBack={() => setShowRedeemCard(false)} />}
    </div>
  );
}
