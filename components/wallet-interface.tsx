'use client'

import { useState } from "react"
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
    { emoji: "🎉", category: "Chipi Feria", amount: 100.00, date: "Today", friend: "@dylankugler" },
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

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      toast({
        title: "Address copied!",
        description: "The wallet address has been copied to your clipboard.",
      })
    }
  }

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
              {account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Connect Wallet'}
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
          <Button size="icon" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <MessageCircle className="w-4 h-4" />
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
              className="mt-auto bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
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