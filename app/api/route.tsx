import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import dotenv from 'dotenv';
import { Account, CallData, cairo, RpcProvider } from 'starknet';
import { ETH_CONTRACT, USDC_CONTRACT } from '@/app/constants/contracts';

dotenv.config();

// Temporary code database
const VALID_CODES = {
  'starknet': { amount: 1, description: 'Starknet Rewards' },
  'morralla': { amount: 0.5, description: 'Morralla Rewards' }
} as const;

// Constants and provider setup
const CHIPI_ADDRESS = process.env.CHIPI_PUBLIC_KEY;
const CHIPI_PRIVATE_KEY = process.env.CHIPI_PRIVATE_KEY?.replace('0x00', '0x');

const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7' });

// Helper function to normalize addresses
function normalizeAddress(address: string): string {
  // Remove '0x' prefix if exists and ensure lowercase
  const stripped = address.toLowerCase().replace('0x', '');
  // Add leading zeros if needed (for 64 chars total)
  const padded = stripped.padStart(64, '0');
  // Always return with '0x' prefix
  return '0x' + padded;
}

// Add this helper function near the top
async function validateAccount(account: Account, provider: RpcProvider) {
  try {
    const normalizedAddress = normalizeAddress(account.address);
    const accountClass = await provider.getClassAt(normalizedAddress);
    const nonce = await account.getNonce();
    console.log('✅ Account validation:', {
      address: normalizedAddress,
      nonce: nonce,
      classHash: accountClass.abi
    });
    return true;
  } catch (error) {
    console.error('❌ Account validation failed:', error);
    throw new Error('Account validation failed - please check account status');
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting new request...');
    
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code')?.toLowerCase();
    const body = await request.json();
    const userAddress = normalizeAddress(body.address);

    console.log('📝 Request parameters:', { 
      code, 
      userAddress,
      normalizedUserAddress: userAddress
    });

    // Validate required parameters
    if (!code || !userAddress) {
      console.log('❌ Missing required parameters');
      return NextResponse.json({});
    }

    // Validate code exists in database
    const codeData = VALID_CODES[code as keyof typeof VALID_CODES];
    if (!codeData) {
      console.log('❌ Invalid code:', code);
      return NextResponse.json({ 
        error: 'Invalid code' 
      }, { status: 400 });
    }

    console.log('✅ Valid code found:', { 
      code, 
      amount: codeData.amount, 
      description: codeData.description 
    });

    // Initialize account with specific version and class
    console.log('🔑 Initializing account...');
    if (!CHIPI_PRIVATE_KEY || !CHIPI_ADDRESS) {
      throw new Error('Missing account credentials');
    }

    console.log('🔑 Account credentials:', {
      address: CHIPI_ADDRESS,
      privateKeyLength: CHIPI_PRIVATE_KEY
    });

    const chipi_account = new Account(
      provider,
      CHIPI_ADDRESS,
      CHIPI_PRIVATE_KEY
    );
    
    console.log('👤 Account details:', {
      accountAddress: chipi_account.address,
      contractAddresses: {
        eth: ETH_CONTRACT,
        usdc: USDC_CONTRACT
      }
    });

    // Verify account before executing
    await validateAccount(chipi_account, provider);

    // Calculate USDC amount first
    const usdcAmount = codeData.amount * 1_000_000;
    console.log('💰 Calculated amounts:', {
      eth: '0.00002',
      usdc: codeData.amount,
      usdcInSmallestUnit: usdcAmount
    });

    // Then check balances
    const ethBalance = await provider.callContract({
      contractAddress: normalizeAddress(ETH_CONTRACT),
      entrypoint: 'balanceOf',
      calldata: CallData.compile({ account: chipi_account.address })
    });

    const usdcBalance = await provider.callContract({
      contractAddress: normalizeAddress(USDC_CONTRACT),
      entrypoint: 'balanceOf',
      calldata: CallData.compile({ account: chipi_account.address })
    });

    // Convert balance to numbers
    const ethBalanceNum = Number(BigInt(ethBalance[0]));
    const usdcBalanceNum = Number(BigInt(usdcBalance[0]));

    // Check if we have enough balance
    if (ethBalanceNum < 20000000000000) {
      throw new Error('Insufficient ETH balance');
    }
    if (usdcBalanceNum < usdcAmount) {
      throw new Error('Insufficient USDC balance');
    }

    console.log('💰 Account balances:', {
      eth: ethBalanceNum,
      usdc: usdcBalanceNum
    });

    console.log('📄 Contract addresses:', {
      ETH_CONTRACT,
      USDC_CONTRACT,
      ETH_CONTRACT_LENGTH: ETH_CONTRACT.length,
      USDC_CONTRACT_LENGTH: USDC_CONTRACT.length
    });

    // Verify contracts with normalized addresses
    try {
      const normalizedEthContract = normalizeAddress(ETH_CONTRACT);
      const normalizedUsdcContract = normalizeAddress(USDC_CONTRACT);
      
      console.log('📄 Normalized contract addresses:', {
        ETH_CONTRACT: normalizedEthContract,
        USDC_CONTRACT: normalizedUsdcContract
      });

      await provider.getClassAt(normalizedEthContract);
      await provider.getClassAt(normalizedUsdcContract);
      console.log('✅ Contract verification successful');
    } catch (error) {
      console.error('❌ Contract verification failed:', error);
      throw new Error('Contract verification failed');
    }

    // Add these checks before executing the multicall
    const nonce = await chipi_account.getNonce();
    const estimatedFee = await chipi_account.estimateInvokeFee([
      {
        contractAddress: normalizeAddress(ETH_CONTRACT),
        entrypoint: 'transfer',
        calldata: CallData.compile({
          recipient: userAddress,
          amount: cairo.uint256(20000000000000),
        }),
      },
      {
        contractAddress: normalizeAddress(USDC_CONTRACT),
        entrypoint: 'transfer',
        calldata: CallData.compile({
          recipient: userAddress,
          amount: cairo.uint256(usdcAmount),
        }),
      },
    ]);

    console.log('💰 Estimated fee:', {
      overall_fee: estimatedFee.overall_fee,
      nonce: nonce
    });

    // Simplify pre-execution check
    console.log('🔑 Pre-execution check:', {
      accountAddress: chipi_account.address,
      nonce: await chipi_account.getNonce()
    });

    // Send multicall with normalized contract addresses
    const multiCall = await chipi_account.execute([
      {
        contractAddress: normalizeAddress(ETH_CONTRACT),
        entrypoint: 'transfer',
        calldata: CallData.compile({
          recipient: userAddress,
          amount: cairo.uint256(20000000000000),
        }),
      },
      {
        contractAddress: normalizeAddress(USDC_CONTRACT),
        entrypoint: 'transfer',
        calldata: CallData.compile({
          recipient: userAddress,
          amount: cairo.uint256(usdcAmount),
        }),
      },
    ]);

    console.log('🔍 Transaction hash:', multiCall.transaction_hash);

    // Wait for confirmation
    console.log('⏳ Waiting for transaction confirmation...');
    await provider.waitForTransaction(multiCall.transaction_hash);
    console.log('✅ Transaction confirmed!');

    const response = { 
      message: `You have redeemed 0.00002 ETH and ${codeData.amount} USDC. (${codeData.description})`,
      txHash: multiCall.transaction_hash,
      recipientAddress: userAddress,
      code: code,
      usdcAmount: codeData.amount
    };
    
    console.log('📤 Sending response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Transaction error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      accountDetails: {
        address: CHIPI_ADDRESS,
        privateKeyLength: CHIPI_PRIVATE_KEY?.length
      }
    });
    
    return NextResponse.json({ 
      error: 'Failed to process transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}