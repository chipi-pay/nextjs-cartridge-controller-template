import dotenv from "dotenv";
import { Account, cairo, RpcProvider, Contract } from "starknet";
import {
  ETH_CONTRACT,
  SLINK_TOKEN,
  STARKNET_BROTHER_TOKEN,
  ALF_TOKEN,
} from "@/app/constants/contracts";
import { ERC20 } from "@/lib/ABIs/erc20";
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

export type SendCardFundsInput = {
  code: string;
  userAddress: string;
  amount: number; // This is wrong!!! It should fetch the amount from the card
  coin: keyof typeof CoinEnum;
};

export async function sendCardFunds(
  input: SendCardFundsInput,
): Promise<string> {
  try {
    console.log("🚀 Starting new request...");
    const { code, userAddress, amount, coin } = input;

    // Initialize account with specific version and class
    console.log("🔑 Initializing accounts...");
    if (!CHIPI_ADDRESS || !CHIPI_PRIVATE_KEY) {
      throw new Error("Missing account credentials");
    }

    const chipiAccount = new Account(
      provider,
      CHIPI_ADDRESS,
      CHIPI_PRIVATE_KEY,
    );
    console.log("Chipi Account details:", chipiAccount.address);

    const eth = new Contract(ERC20, ETH_CONTRACT, provider);
    //eth.connect(chipi_account);

    // Set contracts
    const coinAddress = COIN_ADDRESS[coin];
    if (!coinAddress) {
      throw new Error(`Invalid coin type: ${coin}`);
    }
    const contract = new Contract(ERC20, coinAddress, provider);

    // Then check balances
    const ethBalance = await eth.balanceOf(chipiAccount.address);
    const memeBalance = await contract.balanceOf(chipiAccount.address);
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

    const multiCall = await chipiAccount.execute([
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

    // const txHash = await provider.waitForTransaction(
    //   multiCall.transaction_hash,
    // );
    // console.log("✅ Transaction confirmed!", txHash);

    return multiCall.transaction_hash;
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
    throw error;
  }
}
