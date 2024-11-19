import { useState } from "react";
import { SendTokenForm } from "@/features/sends/components/send-token.form";

export function SendTokenButton() {
  const [showSendCard, setShowSendCard] = useState(false);
  return (
    <div>
      <button
        className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-amber-400 p-2.5 text-center text-xl font-semibold hover:bg-amber-500 active:bg-amber-600"
        onClick={() => setShowSendCard(!showSendCard)}
      >
        Send Money
      </button>
      {showSendCard && <SendTokenForm onBack={() => setShowSendCard(false)} />}
    </div>
  );
}
