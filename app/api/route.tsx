import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import dotenv from 'dotenv';
import { Account, CallData, cairo, RpcProvider } from 'starknet';

dotenv.config();

// Constants and provider setup
const BLAST_KEY = process.env.BLAST_KEY;
const CHIPI_PRIVATE_KEY = process.env.CHIPI_PRIVATE_KEY;
const CHIPI_PUBLIC_KEY = process.env.CHIPI_PUBLIC_KEY;
const ETH_SEPOLIA_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const provider = new RpcProvider({ nodeUrl: `https://starknet-sepolia.blastapi.io/${BLAST_KEY}` });

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const userAddress = searchParams.get('address');

  if (!code || !userAddress) {
    return NextResponse.json({ 
      error: 'Missing required parameters: code and address' 
    }, { status: 400 });
  }

  try {
    // Initialize account
    const chipi_account = new Account(provider, CHIPI_PUBLIC_KEY!, CHIPI_PRIVATE_KEY!);

    // Send 0.001 ETH (expressed in wei)
    const sendEth = await chipi_account.execute([{
      contractAddress: ETH_SEPOLIA_ADDRESS,
      entrypoint: 'transfer',
      calldata: CallData.compile({
        recipient: userAddress,
        amount: cairo.uint256(1000000000000000), // 0.001 ETH in wei
      }),
    }]);

    // Wait for transaction confirmation
    await provider.waitForTransaction(sendEth.transaction_hash);

    return NextResponse.json({ 
      message: `You have redeemed $10. (Code: ${code})`,
      txHash: sendEth.transaction_hash,
      recipientAddress: userAddress
    });

  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ 
      error: 'Failed to process transaction' 
    }, { status: 500 });
  }
}