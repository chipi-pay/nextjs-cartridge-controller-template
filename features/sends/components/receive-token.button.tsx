import { useState } from "react";

export function ReceiveTokenButton() {
  const [showReceiveCard, setShowReceiveCard] = useState(false);
  return (
    <div>
      <button
        className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-amber-400 p-2.5 text-center text-xl font-medium hover:bg-amber-500 active:bg-amber-600"
        onClick={() => setShowReceiveCard(!showReceiveCard)}
      >
        Receive Money
      </button>
      {/* {showReceiveCard && (
        <ReceiveTokenForm onBack={() => setShowReceiveCard(false)} />
      )} */}
    </div>
  );
}
