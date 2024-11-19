"use server";

import { prisma } from "@/lib/prisma-client";
import { ChainEnum, CoinEnum } from "@prisma/client";

export type CreateFeriaCardInput = {
  cardCode: string;
  amount: number;
  name: string;
  maxRedeems: number;
  maxRedeemsPerUser: number;
  chain: ChainEnum;
  coin: CoinEnum;
};

export async function createFeriaCard({
  cardCode,
  amount,
  name,
  maxRedeems,
  maxRedeemsPerUser,
  chain,
  coin,
}: CreateFeriaCardInput) {
  const card = await prisma.feriaCard.create({
    data: {
      cardCode,
      amount,
      name,
      maxRedeems,
      maxRedeemsPerUser,
      chain,
      coin,
      redeems: 0,
    },
  });
  return card;
}
