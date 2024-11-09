'use client'

import { useState, useEffect } from "react"
import { useAccount } from "@starknet-react/core"
import { ConnectWallet } from "@/app/components/ConnectWallet"
import { ArrowUp, Copy, Home, Clock, MessageCircle, Plus, Gift } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI, NIMBORA_STAKING_USDC } from "@/app/constants/contracts"
import Link from "next/link"
import { connector } from "@/app/providers/StarknetProvider"
import { motion } from "framer-motion"
import confetti from 'canvas-confetti';
import { SendCash } from "@/components/send-cash"

type Transaction = {
  emoji: string
  category: string
  amount: number
  date: string
  friend: string
}


export function WalletInterface() {
  const [activeTab, setActiveTab] = useState("home")
  const { account } = useAccount()

  // If not connected, show connect wallet screen
  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-6">
        <div className="mb-8">
          <Image 
            src="/chipi.png" 
            alt="Company Logo" 
            height={40} 
            width={120} 
          />
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <ConnectWallet />
          </CardContent>
        </Card>
      </div>
    )
  }

  const transactions = [
    { emoji: "🎉", category: "Chipi cards", amount: 100.00, date: "Today", friend: "@dylankugler" },
    { emoji: "🍜", category: "Food", amount: -25.50, date: "Yesterday", friend: "@chirry18" },
    { emoji: "💼", category: "Salary", amount: 2000.00, date: "Nov 5", friend: "@espejelomar" },
    { emoji: "🚕", category: "Transport", amount: -15.75, date: "Nov 4", friend: "@annabel" },
    { emoji: "🎁", category: "Gift", amount: 50.00, date: "Nov 3", friend: "@haycarlitos" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Toaster />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-screen flex flex-col">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <Image 
                src="/chipi.png" 
                alt="Company Logo" 
                height={40} 
                width={120} 
              />
            </div>
            <TabsContent value="home">
              <HomeView />
            </TabsContent>
            <TabsContent value="history">
              <HistoryView transactions={transactions} />
            </TabsContent>
          </CardContent>
        </Card>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home" className="py-2.5">
            <Home className="w-5 h-5 mr-2" />
            Home
          </TabsTrigger>
          <TabsTrigger value="history" className="py-2.5">
            <Clock className="w-5 h-5 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

const HomeView = () => {
  const { balances } = useWalletBalances()
  const { account } = useAccount()
  const { toast } = useToast()
  const [username, setUsername] = useState<string>()
  const [showMessageAlert, setShowMessageAlert] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
  }>>([])
  const [isProcessing, setIsProcessing] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>();
  const [normalizedUserAddress, setNormalizedUserAddress] = useState<string>();
  const [showSendCard, setShowSendCard] = useState(false)

  useEffect(() => {
    if (!account?.address) return;
    
    connector.username()?.then((n) => setUsername(n));
    
    // Format and store the padded address
    const cleanAddress = account.address.replace('0x', '');
    const paddingNeeded = 64 - cleanAddress.length;
    const paddedAddress = '0x' + '0'.repeat(paddingNeeded) + cleanAddress;
    
    // Set both addresses
    setUserAddress(paddedAddress);
    setNormalizedUserAddress(paddedAddress);
    
    // Debug log addresses
    console.log('🔍 Addresses:', {
      accountAddress: account.address,
      cleanAddress,
      paddingNeeded,
      paddedAddress,
      length: paddedAddress.length
    });
  }, [account?.address]);

  useEffect(() => {
    if (balances.investedBalance <= 0) return;

    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 0,
      };
      
      setParticles(prev => [...prev, newParticle]);

      // Clean up old particles after 2 seconds (matching animation duration)
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 2000);
    }, 500); // Reduced frequency to every 500ms

    return () => clearInterval(interval);
  }, [balances.investedBalance]);

  useEffect(() => {
  }, [particles]);

  const copyAddress = () => {
    if (account?.address) {
      // Pad the address to 66 characters (including 0x)
      const paddedAddress = '0x' + account.address.slice(2).padStart(64, '0');
      navigator.clipboard.writeText(paddedAddress);
      toast({
        title: "Address copied!",
        description: "The wallet address has been copied to your clipboard.",
      });
    }
  }

  const handleInvest = async () => {
    const amount = BigInt(2000000) // Convert number to BigInt

    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (balances.eth < 0.0001) {
      toast({
        title: "Insufficient ETH",
        description: "Run out of gas. Send us a message",
        variant: "destructive",
      })
      setShowMessageAlert(true)
      setTimeout(() => setShowMessageAlert(false), 3000)
      return
    }

    if (balances.cashBalance < 0.04) {
      toast({
        title: "Insufficient balance",
        description: "Not enough to invest. Buy more Feria Cards.",
        variant: "destructive",
      })
      return
    }

    setSubmitted(true)

    try {
      if (balances && balances.usdc >= 2) {
        // Nimbora staking
        await account.execute([
          {
            contractAddress: USDC_CONTRACT,
            entrypoint: "approve",
            calldata: [NIMBORA_STAKING_USDC, amount],
          },
          {
            contractAddress: NIMBORA_STAKING_USDC,
            entrypoint: "deposit",
            calldata: [amount, account.address, "0x02aC4A10e11A9DbcDE67cEE0539Ca54aB3c1188C06E3BCa750b0378765b47709"],
          },
        ])
        toast({
          title: "Investment submitted",
          description: "Your USDC has been invested in Nimbora.",
        })
      } else {
        // STRK Farm
        await account.execute([
          {
            contractAddress: USDC_CONTRACT,
            entrypoint: "approve",
            calldata: [STRK_FARM_USDC_SENSEI, amount],
          },
          {
            contractAddress: STRK_FARM_USDC_SENSEI,
            entrypoint: "deposit",
            calldata: [amount, account.address],
          },
        ])
        toast({
          title: "Investment submitted",
          description: "Your USDC has been invested in STRK Farm.",
        })
      }
    } catch (error: unknown) {
      console.error(error)
      if (error instanceof Error && (error.message?.includes('gas') || error.message?.includes('fee'))) {
        toast({
          title: "Insufficient gas",
          description: "Run out of gas. Send us a message",
          variant: "destructive",
        })
        setShowMessageAlert(true)
        setTimeout(() => setShowMessageAlert(false), 3000)
      } else {
        toast({
          title: "Investment failed",
          description: "There was an error processing your investment.",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitted(false)
    }
  }

  const handleRedeem = async () => {
    if (!account || !userAddress || !normalizedUserAddress) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
      toast({
        title: "No code found",
        description: "Please use a valid redeem link",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const requestBody = {
        code,
        userAddress,
        normalizedUserAddress
      };
      
      // Debug log before sending request
      console.log('🚀 Sending Request:', requestBody);

      const response = await fetch(`/api?code=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      // Debug response
      console.log('📡 Response:', data);
      
      if (data.error) {
        console.error('❌ Error:', data.error);
        setRedeemMessage(data.error);
        toast({
          title: "Redeem failed",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.message) {
        console.log('✅ Success:', data);
        setRedeemMessage(data.message);
        toast({
          title: "Redeem successful!",
          description: data.message,
        });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        await balances.refetch();
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process rewards. Please try again later.';
      setRedeemMessage(errorMessage);
      toast({
        title: "Redeem failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(true);
      setHasProcessed(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-12 h-12 border-2 border-primary">
          <AvatarImage src="/sherk.jpeg?height=48&width=48" alt="@wellsja" />
          <AvatarFallback>JW</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {username || 'Wallet User'}
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyAddress} 
            className="p-0 h-auto font-normal text-muted-foreground"
            disabled={!account}
          >
            <Copy className="w-3 h-3 mr-1" />
            {account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : '0x0000...0000'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Link href="/pro">
            <Button 
              size="icon" 
              variant="outline"
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            size="icon" 
            variant="outline"
            className={`relative h-8 w-8 ${
              showMessageAlert ? 'animate-bounce' : ''
            }`}
          >
            <MessageCircle 
              className={`w-4 h-4 transition-colors duration-300 ${
                showMessageAlert ? 'text-red-500' : ''
              }`} 
            />
            {showMessageAlert && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Cash Balance</h3>
            <p className="text-2xl font-bold">${balances.cashBalance.toFixed(2)}</p>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>ETH: {balances.eth.toFixed(4)}</div>
              <div>USDC: ${balances.usdc.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden h-[200px]">
          <CardContent className="pt-6 flex flex-col h-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Invested Balance</h3>
            <p className="text-2xl font-bold mb-4 relative z-10">${balances.investedBalance.toFixed(2)}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className={`mt-auto relative z-10 ${
                submitted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
              }`}
              onClick={handleInvest}
              disabled={submitted}
            >
              Invest More
            </Button>

            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute text-green-500 font-bold text-3xl opacity-30"
                style={{
                  left: `${particle.x}%`,
                  bottom: '0px',
                }}
                initial={{ y: 0 }}
                animate={{ y: -200 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                $
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
      {redeemMessage && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-700">{redeemMessage}</p>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-14 text-lg font-medium" 
          variant="outline" 
          onClick={() => setShowSendCard(!showSendCard)}
        >
          <ArrowUp className="w-5 h-5 mr-2" />
          Send
        </Button>
        <Button 
          className="h-14 text-lg font-medium" 
          variant="outline" 
          onClick={handleRedeem}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⚡</span>
              Processing...
            </span>
          ) : (
            <>
              <Gift className="w-5 h-5 mr-2" />
              Redeem
            </>
          )}
        </Button>
      </div>

      {showSendCard && (
        <SendCash onBack={() => setShowSendCard(false)} />
      )}
    </div>
  )
}

const HistoryView = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Earnings</h3>
            <p className="text-xl font-bold">$2,150.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Spendings</h3>
            <p className="text-xl font-bold">$171.25</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Transactions</h3>
          <span className="text-sm text-muted-foreground">116 transactions</span>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {transactions.map((transaction, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{transaction.emoji}</span>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{transaction.friend}</p>
                    </div>
                  </div>
                </div>
                <span className={transaction.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}