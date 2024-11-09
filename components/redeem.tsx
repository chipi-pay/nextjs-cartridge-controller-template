'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Confetti from 'react-confetti'

interface RedeemProps {
  onBack?: () => void
}

export function Redeem({ onBack = () => {} }: RedeemProps) {
  const [code, setCode] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Update dimensions when component mounts
  useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      })
    }
  }, [])

  // Hardcoded valid code for testing
  const VALID_CODE = "CHIPI123"

  const handleRedeem = async () => {
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter a code",
        variant: "destructive",
      })
      return
    }

    // Simulate API call with hardcoded validation
    if (code === VALID_CODE) {
      setShowConfetti(true)
      toast({
        title: "Success!",
        description: "Code redeemed successfully",
      })
      // Hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000)
    } else {
      toast({
        title: "Error",
        description: "Invalid code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="relative overflow-hidden h-[200px]" ref={cardRef}>
      {showConfetti && (
        <div className="absolute inset-0">
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Redeem Code</h3>
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
        </div>
        <div className="space-y-4 flex-1">
          <Input
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-transparent border-muted"
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600"
            onClick={handleRedeem}
          >
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
