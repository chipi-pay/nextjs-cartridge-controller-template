"use server";

import { prisma } from "@/lib/prisma-client";
import { ChainEnum } from "@prisma/client";
import { CoinEnum } from "@prisma/client";

export type RedeemFeriaCardInput = {
  cardCode: string;
  redeemedWallet: string;
  redeemedChain: ChainEnum;
  redeemedCoin: CoinEnum;
};

export async function redeemFeriaCard({
  cardCode,
  redeemedWallet,
  redeemedChain,
  redeemedCoin,
}: RedeemFeriaCardInput) {
  // check if the card is already redeemed

  const existingCard = await prisma.feriaCard.findUnique({
    where: {
      cardCode,
    },
  });
  if (!existingCard) throw new Error("Feria card not found");
  if (existingCard.redeemed) throw new Error("Feria card already redeemed");

  const updatedCard = await prisma.feriaCard.update({
    where: {
      cardCode,
    },
    data: {
      redeemed: true,
      redeemedWallet,
      redeemedChain,
      redeemedCoin,
      redeemedAt: new Date(),
    },
  });

  if (!updatedCard.cardCode) throw new Error("Failed to redeem feria card");

  return updatedCard;
}