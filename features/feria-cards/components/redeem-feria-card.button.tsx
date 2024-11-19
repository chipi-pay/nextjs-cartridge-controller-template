import { useState } from "react";
import { RedeemCodeModal } from "@/components/redeem-code.modal";

export function RedeemFeriaCardButton() {
  const [showRedeemCodeModal, setShowRedeemCodeModal] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <button
        className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-emerald-400 p-2.5 text-center text-xl font-semibold hover:bg-emerald-500 active:bg-emerald-600"
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
