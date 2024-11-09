"use server";

import { prisma } from "@/lib/prisma-client";

export type CreateFeriaCardInput = {
  cardCode: string;
  amount: number;
  name: string;
};


export async function createFeriaCard({
  cardCode,
  amount,
  name,
}: CreateFeriaCardInput) {
  const card = await prisma.feriaCard.create({
    data: { cardCode, amount, name, redeemed: false },
  });
  return card;
}
