"use client";

import { useCreateFeriaCard } from "@/features/feria/hooks/useCreateFeriaCard";
import { useRedeemFeriaCard } from "@/features/feria/hooks/useRedeemFeriaCard";
import { ChainEnum, CoinEnum } from "@prisma/client";

export default function AdminPage() {
  const { mutate: createFeriaCard, isPending } = useCreateFeriaCard();
  const { mutate: redeemFeriaCard, isPending: isRedeemingFeriaCard } =
    useRedeemFeriaCard();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <button
        disabled={isPending}
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={() =>
          createFeriaCard({ cardCode: "mamitas", amount: 100, name: "Mamitas" })
        }
      >
        {isPending ? "Creating..." : "Create Feria Card"}
      </button>
      <button
        disabled={isRedeemingFeriaCard}
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={() =>
          redeemFeriaCard({
            cardCode: "mamitas",
            redeemedWallet: "0x123",
            redeemedChain: ChainEnum.STARKNET,
            redeemedCoin: CoinEnum.USDC,
          })
        }
      >
        {isRedeemingFeriaCard ? "Redimiendo..." : "Redimir Feria Card"}
      </button>
    </div>
  );
}
