import { useState } from "react";
import { RedeemCodeModal } from "@/components/redeem-code.modal";

export function RedeemFeriaCardButton() {
  const [showRedeemCodeModal, setShowRedeemCodeModal] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <button
        className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-white p-2.5 text-center text-xl font-medium hover:bg-rose-50 active:bg-rose-100"
        onClick={() => setShowRedeemCodeModal(!showRedeemCodeModal)}
      >
        Redeem Code
      </button>
      {showRedeemCodeModal && (
        <RedeemCodeModal onBack={() => setShowRedeemCodeModal(false)} />
      )}
    </div>
  );
}
