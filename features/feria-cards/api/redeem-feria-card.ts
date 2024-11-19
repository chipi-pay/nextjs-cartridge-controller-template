"use server";

import { prisma } from "@/lib/prisma-client";
import { v4 as uuidv4 } from "uuid";
import { sendCardFunds } from "./send-card-funds";

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
  try {
    const existingCard = await prisma.feriaCard.findUnique({
      where: {
        cardCode,
      },
    });
    if (!existingCard) throw new Error("Feria card code is invalid");
    if (existingCard.maxRedeems === existingCard.redeems)
      throw new Error("Feria card has reached its maximum redeem limit");

    // find the first n redeems for this user and this specific card
    const existingRedeems = await prisma.feriaCardRedeem.findMany({
      where: {
        walletAddress,
        feriaCardCode: cardCode,
      },
      take: existingCard.maxRedeemsPerUser,
    });

    if (existingRedeems.length >= existingCard.maxRedeemsPerUser)
      throw new Error(
        "You have already reached the maximum redeem limit for this Card",
      );

    // normalize the wallet address
    const cleanAddress = walletAddress.replace("0x", "");
    const paddingNeeded = 64 - cleanAddress.length;
    const normalizedWalletAddress =
      "0x" + "0".repeat(paddingNeeded) + cleanAddress;

    const txHash = await sendCardFunds({
      code: cardCode,
      userAddress: normalizedWalletAddress,
      amount: existingCard.amount,
      coin: existingCard.coin,
    });

    console.log("txHash in redeemFeriaCard", txHash);

    await prisma.feriaCard.update({
      where: {
        cardCode,
      },
      data: {
        redeems: existingCard.redeems + 1,
      },
    });

    const redeemedCard = await prisma.feriaCardRedeem.create({
      data: {
        id: `redeem-${uuidv4()}`,
        feriaCardCode: cardCode,
        walletAddress,
        username,
        txHash,
      },
    });

    return redeemedCard;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
