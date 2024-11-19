import { useState } from "react";
import { SendTokenForm } from "@/features/sends/components/send-token.form";

export function SendTokenButton() {
  const [showSendCard, setShowSendCard] = useState(false);
  return (
    <div>
      <button
        className="h-14 border border-input bg-background text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        onClick={() => setShowSendCard(!showSendCard)}
      >
        Send
      </button>
      {showSendCard && <SendTokenForm onBack={() => setShowSendCard(false)} />}
    </div>
  );
}
