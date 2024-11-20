import { useState } from "react";
import { SendTokenModal } from "@/features/sends/components/send-token.modal";

export function SendTokenButton() {
  const [showSendModal, setShowSendModal] = useState(false);
  return (
    <div>
      <button
        className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-emerald-400 p-2.5 text-center text-xl font-medium hover:bg-emerald-500 active:bg-emerald-600"
        onClick={() => setShowSendModal(!showSendModal)}
      >
        Send Money
      </button>
      {showSendModal && (
        <SendTokenModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          onBack={() => setShowSendModal(false)}
        />
      )}
    </div>
  );
}
