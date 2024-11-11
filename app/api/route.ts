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

dotenv.config();

// Constants and provider setup
const CHIPI_ADDRESS = process.env.CHIPI_PUBLIC_KEY;
const CHIPI_PRIVATE_KEY = process.env.CHIPI_PRIVATE_KEY?.replace("0x00", "0x");

const SLINK_HOLDER = process.env.SLINK_HOLDER_PUBLIC_KEY;
const SLINK_PRIVATE_KEY = process.env.SLINK_HOLDER_PRIVATE_KEY;

const ALF_HOLDER = process.env.ALF_HOLDER_PUBLIC_KEY;
const ALF_PRIVATE_KEY = process.env.ALF_HOLDER_PRIVATE_KEY;

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const provider = new RpcProvider({
  nodeUrl: `https://starknet-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
});

export const sendTokensRandomly = async (
  account: Account,
  userAddress: string,
  amount: number,
  eth: Contract,
  contract: Contract,
) => {
  try {
    // aca comienza el random
    const multiCall = await account.execute([
      eth.populate("transfer", [
        userAddress,
        cairo.uint256(0.00003 * 10 ** 18),
      ]),
      contract.populate("transfer", [
        userAddress,
        cairo.uint256(amount * 10 ** 18),
      ]),
    ]);

    return multiCall;
  } catch (error) {
    console.log("❌ Error sending tokens:", error);
  }
};

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
    console.log("🔑 Initializing accounts...");
    if (
      !CHIPI_ADDRESS ||
      !CHIPI_PRIVATE_KEY ||
      !SLINK_HOLDER ||
      !SLINK_PRIVATE_KEY ||
      !ALF_HOLDER ||
      !ALF_PRIVATE_KEY
    ) {
      throw new Error("Missing account credentials");
    }

    const chipi_account = new Account(
      provider,
      CHIPI_ADDRESS,
      CHIPI_PRIVATE_KEY,
    );
    console.log("Chipi Account details:", chipi_account.address);

    const slink_account = new Account(
      provider,
      SLINK_HOLDER,
      SLINK_PRIVATE_KEY,
    );
    console.log("Slink holder Account details:", slink_account.address);

    const alf_account = new Account(provider, ALF_HOLDER, ALF_PRIVATE_KEY);
    console.log("Slink holder Account details:", alf_account.address);

    const eth = new Contract(ERC20, ETH_CONTRACT, provider);
    //eth.connect(chipi_account);

    // Set contracts
    const slink = new Contract(ERC20, SLINK_TOKEN, provider);
    const alf = new Contract(ERC20, ALF_TOKEN, provider);
    const brother = new Contract(ERC20, STARKNET_BROTHER_TOKEN, provider);

    const accounts = [chipi_account, slink_account, alf_account];
    const contracts = [slink, alf, brother];

    // Function to handle token sending
    const handleTokenSending = async (userAddress: string, amount: number) => {
      const randomAccount =
        accounts[Math.floor(Math.random() * accounts.length)];
      const randomContract =
        contracts[Math.floor(Math.random() * contracts.length)];

      // Then check balances
      const ethBalance = await eth.balanceOf(randomAccount.address);
      console.log("ETH Balance", ethBalance);

      // Convert balance to numbers
      const ethBalanceNum = Number(BigInt(ethBalance));

      // Check if we have enough balance
      if (ethBalanceNum < 0.00003 * 10 ** 18) {
        throw new Error("Insufficient ETH balance");
      }

      const multiCallResult = await sendTokensRandomly(
        randomAccount,
        userAddress,
        amount,
        eth,
        randomContract,
      );

      // Wait for confirmation
      console.log("⏳ Waiting for transaction confirmation...");
      if (!multiCallResult || !multiCallResult.transaction_hash) {
        throw new Error("Failed to send tokens");
      }

      const txHash = await provider.waitForTransaction(
        multiCallResult.transaction_hash,
      );
      console.log("✅ Transaction confirmed!", txHash);
    };

    // Handle multiple requests
    const requests = Array.isArray(body.requests) ? body.requests : [body];
    for (const req of requests) {
      const { address: userAddress, amount } = req;
      await handleTokenSending(userAddress, amount);
    }

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
