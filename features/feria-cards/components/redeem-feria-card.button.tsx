import { useState } from "react";
import { RedeemCodeModal } from "@/components/redeem-code.modal";

export function RedeemFeriaCardButton() {
  const [showRedeemCodeModal, setShowRedeemCodeModal] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <button
        className="h-14 border border-input bg-background text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        onClick={() => setShowRedeemCodeModal(!showRedeemCodeModal)}
      >
        Redeem
      </button>
      {showRedeemCodeModal && (
        <RedeemCodeModal onBack={() => setShowRedeemCodeModal(false)} />
      )}
    </div>
  );
}
