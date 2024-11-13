"use server";

import { prisma } from "@/lib/prisma-client";
import { v4 as uuidv4 } from "uuid";

export type RedeemFeriaCardInput = {
  cardCode: string;
  walletAddress: string;
  username: string;
};

export async function redeemFeriaCard({
  cardCode,
  walletAddress,
  username,
}: RedeemFeriaCardInput) {
  // check if the card is already redeemed

  // const chooseRandomCoin = () => {
  //   const coins = ["ALF", "BROTHER", "SLINK"];
  //   return coins[Math.floor(Math.random() * coins.length)];
  // };

  const existingCard = await prisma.feriaCard.findUnique({
    where: {
      cardCode,
    },
  });
  if (!existingCard) throw new Error("Feria card not found");
  if (existingCard.maxRedeems === existingCard.redeems)
    throw new Error("Feria card has reached its maximum redeem limit");

  // find the first n redeems for this user
  const existingRedeems = await prisma.feriaCardRedeem.findMany({
    where: {
      walletAddress,
    },
    take: existingCard.maxRedeemsPerUser,
  });

  if (existingRedeems.length >= existingCard.maxRedeemsPerUser)
    throw new Error("User has reached the maximum redeem limit");

  const apiUrl = new URL(`/api`, process.env.BASE_URL!);
  apiUrl.searchParams.append("code", cardCode);

  const response = await fetch(apiUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: walletAddress,
      amount: existingCard.amount,
      coin: existingCard.coin,
    }),
  });

  const data = await response.json();
  console.log(data);
  if (data.error) throw new Error(data.error);

  const updatedCard = await prisma.feriaCard.update({
    where: {
      cardCode,
    },
    data: {
      redeems: existingCard.redeems + 1,
    },
  });

  await prisma.feriaCardRedeem.create({
    data: {
      id: `redeem-${uuidv4()}`,
      feriaCardCode: cardCode,
      walletAddress,
      username,
    },
  });

  return updatedCard;
}
