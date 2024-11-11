import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import dotenv from "dotenv";
import { Account, cairo, RpcProvider, Contract } from "starknet";
import {
  ETH_CONTRACT,
  SLINK_TOKEN,
  STARKNET_BROTHER_TOKEN,
  ALF_TOKEN,
} from "@/app/constants/contracts";
import { ERC20 } from "../ABIs/erc20";
import { CoinEnum } from "@prisma/client";

dotenv.config();

const COIN_ADDRESS: Partial<Record<CoinEnum, string>> = {
  [CoinEnum.ALF]: ALF_TOKEN,
  [CoinEnum.BROTHER]: STARKNET_BROTHER_TOKEN,
  [CoinEnum.SLINK]: SLINK_TOKEN,
};
// Constants and provider setup
const CHIPI_ADDRESS = process.env.CHIPI_PUBLIC_KEY;
const CHIPI_PRIVATE_KEY = process.env.CHIPI_PRIVATE_KEY?.replace("0x00", "0x");

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const provider = new RpcProvider({
  nodeUrl: `https://starknet-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
});

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting new request...");

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code")?.toLowerCase();
    const body = await request.json();
    const {
      address: userAddress,
      amount,
      coin,
    }: { address: string; amount: number; coin: keyof typeof CoinEnum } = body;

    console.log("📝 Request parameters:", {
      code,
      userAddress,
      normalizedUserAddress: userAddress,
    });

    // Validate required parameters
    if (!code || !userAddress) {
      console.log("❌ Missing required parameters");
      return NextResponse.json({});
    }

    // Initialize account with specific version and class
    console.log("🔑 Initializing accounts...");
    if (!CHIPI_ADDRESS || !CHIPI_PRIVATE_KEY) {
      throw new Error("Missing account credentials");
    }

    const chipi_account = new Account(
      provider,
      CHIPI_ADDRESS,
      CHIPI_PRIVATE_KEY,
    );
    console.log("Chipi Account details:", chipi_account.address);

    const eth = new Contract(ERC20, ETH_CONTRACT, provider);
    //eth.connect(chipi_account);

    // Set contracts
    const coinAddress = COIN_ADDRESS[coin];
    if (!coinAddress) {
      throw new Error(`Invalid coin type: ${coin}`);
    }
    const contract = new Contract(ERC20, coinAddress, provider);

    // Then check balances
    const ethBalance = await eth.balanceOf(chipi_account.address);
    const memeBalance = await contract.balanceOf(chipi_account.address);
    console.log("ETH Balance", ethBalance);

    // Convert balance to numbers
    const ethBalanceNum = Number(BigInt(ethBalance));

    // Check if we have enough balance
    if (ethBalanceNum < 0.00003 * 10 ** 18) {
      throw new Error("Insufficient ETH balance");
    }

    if (memeBalance < 1 * 10 ** 18) {
      throw new Error(`Insufficient MEME balance for coin: ${coin}`);
    }

    const multiCall = await chipi_account.execute([
      eth.populate("transfer", [
        userAddress,
        cairo.uint256(0.00003 * 10 ** 18),
      ]),
      contract.populate("transfer", [
        userAddress,
        cairo.uint256(amount * 10 ** 18),
      ]),
    ]);

    // Wait for confirmation
    console.log("⏳ Waiting for transaction confirmation...");
    if (!multiCall || !multiCall.transaction_hash) {
      throw new Error("Failed to send tokens");
    }

    const txHash = await provider.waitForTransaction(
      multiCall.transaction_hash,
    );
    console.log("✅ Transaction confirmed!", txHash);

    return NextResponse.json(
      { message: "Transaction successful" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Transaction error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      accountDetails: {
        address: CHIPI_ADDRESS,
        privateKeyLength: CHIPI_PRIVATE_KEY?.length,
      },
    });

    return NextResponse.json(
      {
        error: "Failed to process transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
