"use client";

import { useCreateFeriaCard } from "@/features/feria/hooks/useCreateFeriaCard";
import { useRedeemFeriaCard } from "@/features/feria/hooks/useRedeemFeriaCard";
import { ChainEnum, CoinEnum } from "@prisma/client";

export default function AdminPage() {
  const { mutate: createFeriaCard, isPending } = useCreateFeriaCard();
  const {
    mutate: redeemFeriaCard,
    isPending: isRedeemingFeriaCard,
    error: redeemFeriaCardError,
  } = useRedeemFeriaCard();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <button
        disabled={isPending}
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={() =>
          createFeriaCard({
            cardCode: "chipilinos",
            amount: 1,
            name: "chipilinos",
            maxRedeems: 100,
            maxRedeemsPerUser: 1,
            chain: ChainEnum.STARKNET,
            coin: CoinEnum.USDC,
          })
        }
      >
        {isPending ? "Creating..." : "Create Feria Card"}
      </button>
      <button
        disabled={isRedeemingFeriaCard}
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={() =>
          redeemFeriaCard({
            cardCode: "chipilinos",
            walletAddress: "0x123",
          })
        }
      >
        {isRedeemingFeriaCard ? "Redimiendo..." : "Redimir Feria Card"}
      </button>
      {redeemFeriaCardError && (
        <p className="text-red-500">{redeemFeriaCardError.message}</p>
      )}
    </div>
  );
}
