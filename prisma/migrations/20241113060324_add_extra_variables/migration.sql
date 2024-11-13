-- CreateEnum
CREATE TYPE "ChainEnum" AS ENUM ('STARKNET');

-- CreateEnum
CREATE TYPE "CoinEnum" AS ENUM ('USDC', 'ETH', 'STRK', 'SLINK', 'ALF', 'BROTHER');

-- CreateTable
CREATE TABLE "FeriaCard" (
    "cardCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "maxRedeems" INTEGER NOT NULL,
    "maxRedeemsPerUser" INTEGER NOT NULL,
    "redeems" INTEGER NOT NULL DEFAULT 0,
    "chain" "ChainEnum" NOT NULL,
    "coin" "CoinEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeriaCard_pkey" PRIMARY KEY ("cardCode")
);

-- CreateTable
CREATE TABLE "FeriaCardRedeem" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "feriaCardCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeriaCardRedeem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeriaCardRedeem" ADD CONSTRAINT "FeriaCardRedeem_feriaCardCode_fkey" FOREIGN KEY ("feriaCardCode") REFERENCES "FeriaCard"("cardCode") ON DELETE RESTRICT ON UPDATE CASCADE;
