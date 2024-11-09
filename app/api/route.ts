import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import dotenv from "dotenv";
import { Account, cairo, RpcProvider, Contract } from "starknet";
import { ETH_CONTRACT, USDC_CONTRACT } from "@/app/constants/contracts";
import { ERC20 } from "../ABIs/erc20";

dotenv.config();

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
    const { address: userAddress, amount } = body;

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
    console.log("🔑 Initializing account...");
    if (!CHIPI_PRIVATE_KEY || !CHIPI_ADDRESS) {
      throw new Error("Missing account credentials");
    }

    const chipi_account = new Account(
      provider,
      CHIPI_ADDRESS,
      CHIPI_PRIVATE_KEY,
    );

    console.log("👤 Account details:", chipi_account.address);

    // Calculate USDC amount first
    const usdcAmount = cairo.uint256(amount * 10 ** 6);
    console.log("💰 Calculated amounts:", {
      eth: "0.00002",
      usdc: amount,
      usdcInSmallestUnit: usdcAmount,
    });

    const usdc = new Contract(ERC20, USDC_CONTRACT, provider);

    //  usdc.connect(chipi_account);

    const eth = new Contract(ERC20, ETH_CONTRACT, provider);
    //eth.connect(chipi_account);
    // Then check balances
    const ethBalance = await eth.balanceOf(chipi_account.address);
    console.log("ETH Balance", ethBalance);

    const usdcBalance = await usdc.balanceOf(chipi_account.address);
    console.log("USDC Balance", usdcBalance);

    // Convert balance to numbers
    const ethBalanceNum = Number(BigInt(ethBalance));
    const usdcBalanceNum = Number(BigInt(usdcBalance));

    // Check if we have enough balance
    if (ethBalanceNum < 0.00002 * 10 ** 18) {
      throw new Error("Insufficient ETH balance");
    }
    if (cairo.uint256(usdcBalanceNum) < usdcAmount) {
      throw new Error("Insufficient USDC balance");
    }

    const multiCall = await chipi_account.execute([
      eth.populate("transfer", [
        userAddress,
        cairo.uint256(0.00002 * 10 ** 18),
      ]),
      usdc.populate("transfer", [userAddress, cairo.uint256(amount * 10 ** 6)]),
    ]);

    // Wait for confirmation
    console.log("⏳ Waiting for transaction confirmation...");
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
