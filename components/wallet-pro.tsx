'use client'

import { useState, useEffect } from "react"
import { useAccount } from "@starknet-react/core"
import { ArrowUp, Copy, Home, Clock, MessageCircle, Plus, Gift } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import { USDC_CONTRACT, STRK_FARM_USDC_SENSEI, NIMBORA_STAKING_USDC } from "@/app/constants/contracts"
import { connector } from "@/app/providers/StarknetProvider"
import { ConnectWallet } from "@/app/components/ConnectWallet"
import Link from "next/link"

// Add these before the WalletPro component
const friends = [
  { id: 1, name: "Alex", image: "/avatar1.jpeg" },
  { id: 2, name: "Maria", image: "/avatar2.jpeg" },
  { id: 3, name: "John", image: "/avatar1.jpeg" },
]

const buyOptions = [
  { title: "Muay Thai class", image: "/muaythai.jpeg", price: 500 },
  { title: "5x5 tattoo", image: "/tattoo.jpeg", price: 2000 },
  { title: "Pad Thai", image: "/padthai.webp", price: 120 },
  { title: "UFC fight", image: "/placeholder.png?height=80&width=160", price: 1500 },
  { title: "More", image: "/placeholder.png?height=80&width=160", price: 0 },
]

const transactions = [
  { emoji: "🎉", category: "Chipi Feria", amount: 100.00, date: "Today", friend: "@dylankugler" },
  { emoji: "🍜", category: "Food", amount: -25.50, date: "Yesterday", friend: "@chirry18" },
  { emoji: "💼", category: "Salary", amount: 2000.00, date: "Nov 5", friend: "@espejelomar" },
  { emoji: "🚕", category: "Transport", amount: -15.75, date: "Nov 4", friend: "@annabel" },
  { emoji: "🎁", category: "Gift", amount: 50.00, date: "Nov 3", friend: "@haycarlitos" },
  { emoji: "📚", category: "Education", amount: -100.00, date: "Nov 2", friend: "@0xvato" },
  { emoji: "🏋️", category: "Gym", amount: -30.00, date: "Nov 1", friend: "@carldlfr" },
]

export function WalletPro() {
  const [activeTab, setActiveTab] = useState("home")
  const { account } = useAccount()
  const [showMessageAlert, setShowMessageAlert] = useState(false)

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
              <HomeView showMessageAlert={showMessageAlert} setShowMessageAlert={setShowMessageAlert} />
            </TabsContent>
            <TabsContent value="history">
              <HistoryView />
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

type HomeViewProps = {
  showMessageAlert: boolean;
  setShowMessageAlert: (show: boolean) => void;
}

const HomeView = ({ showMessageAlert, setShowMessageAlert }: HomeViewProps) => {
  const { balances } = useWalletBalances()
  const { account } = useAccount()
  const { toast } = useToast()
  const [username, setUsername] = useState<string>()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!account?.address) return
    connector.username()?.then((n) => setUsername(n))
  }, [account?.address])

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      toast({
        title: "Address copied!",
        description: "The wallet address has been copied to your clipboard.",
      })
    }
  }

  const handleInvest = async () => {
    const amount = BigInt(2000000)

    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (balances.eth < 0.01) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-12 h-12 border-2 border-primary">
          <AvatarImage src="/sherk.jpeg" alt="@wellsja" />
          <AvatarFallback>JW</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {username || 'Wallet User'}
            </h2>
            <Badge variant="secondary" className="bg-pink-100 text-pink-500 hover:bg-pink-100">
              Pro
            </Badge>
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
          <Link href="/basic">
            <Button size="icon" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            size="icon" 
            variant="ghost"
            className={`relative ${showMessageAlert ? 'animate-bounce' : ''}`}
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
        <Card>
          <CardContent className="pt-6 flex flex-col h-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Invested Balance</h3>
            <p className="text-2xl font-bold mb-4">${balances.investedBalance.toFixed(2)}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className={`mt-auto ${
                submitted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
              }`}
              onClick={handleInvest}
              disabled={submitted}
            >
              Invest More
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-14 text-lg font-medium" variant="outline" onClick={() => console.log("Send clicked")}>
          <ArrowUp className="w-5 h-5 mr-2" />
          Send
        </Button>
        <Button className="h-14 text-lg font-medium" variant="outline" onClick={() => console.log("Redeem clicked")}>
          <Gift className="w-5 h-5 mr-2" />
          Redeem
        </Button>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Friends</h3>
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            {friends.map((friend) => (
              <Avatar key={friend.id} className="border-2 border-background">
                <AvatarImage src={friend.image} alt={friend.name} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">8 friends</span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Buy</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {buyOptions.map((option, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image 
                        src={option.image} 
                        alt={option.title} 
                        height={80}
                        width={160}
                        className="w-full h-20 object-cover" 
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-sm mb-1">{option.title}</h4>
                        <p className="text-muted-foreground text-xs mb-2">{option.price > 0 ? `฿${option.price}` : 'Various prices'}</p>
                        <Button size="sm" className="w-full bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600">
                          Buy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

const HistoryView = () => (
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