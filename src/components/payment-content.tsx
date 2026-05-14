"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle2,
  Loader2,
  Shield,
  Zap,
  Gift,
  Sparkles,
  Apple,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
const creditPackages = [
  { credits: 1000, price: 4.99, popular: false, bonus: 0 },
  { credits: 5000, price: 19.99, popular: true, bonus: 500 },
  { credits: 10000, price: 34.99, popular: false, bonus: 1500 },
  { credits: 50000, price: 149.99, popular: false, bonus: 10000 },
]

export function PaymentContent() {
  const [searchParams] = useSearchParams()
  const packageIndex = Number.parseInt(searchParams.get("package") || "1")
  const selectedPackage = creditPackages[packageIndex] || creditPackages[1]

  const [isVisible, setIsVisible] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "crypto">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2500)
  }

  if (isSuccess) {
    return (
      <div className="w-[360px] min-h-[600px] bg-background text-foreground flex flex-col items-center justify-center p-6">
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-6">Payment Successful!</h2>
        <p className="text-sm text-muted-foreground text-center mt-2">
          {selectedPackage.credits.toLocaleString()} credits have been added to your account
        </p>

        {selectedPackage.bonus > 0 && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
            <Gift className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">
              +{selectedPackage.bonus.toLocaleString()} bonus credits!
            </span>
          </div>
        )}

        <div className="mt-8 p-4 rounded-2xl bg-card border border-border w-full">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Credits</span>
            <span className="font-bold">{(selectedPackage.credits + selectedPackage.bonus).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-bold">${selectedPackage.price}</span>
          </div>
        </div>

        <Link to="/extension" className="w-full mt-6">
          <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-[360px] min-h-[600px] bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Link
            to="/extension/topup"
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold">Payment</h1>
            <p className="text-[10px] text-muted-foreground">Complete your purchase</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-green-500">
            <Lock className="w-3 h-3" />
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`p-4 space-y-4 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Order Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20">
          <p className="text-xs text-muted-foreground mb-3">Order Summary</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{selectedPackage.credits.toLocaleString()} Credits</p>
                {selectedPackage.bonus > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-green-500">
                    <Gift className="w-3 h-3" />
                    <span>+{selectedPackage.bonus.toLocaleString()} bonus</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xl font-bold">${selectedPackage.price}</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-3">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <CreditCard
                className={`w-5 h-5 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`}
              />
              <span className="text-[10px] font-medium">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod("apple")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === "apple"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <Apple className={`w-5 h-5 ${paymentMethod === "apple" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-[10px] font-medium">Apple Pay</span>
            </button>
            <button
              onClick={() => setPaymentMethod("crypto")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === "crypto"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <Wallet className={`w-5 h-5 ${paymentMethod === "crypto" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-[10px] font-medium">Crypto</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        {paymentMethod === "card" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm transition-colors"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={4}
                  className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none text-sm transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "apple" && (
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <Apple className="w-12 h-12 mx-auto text-foreground" />
            <p className="text-sm font-medium mt-3">Apple Pay</p>
            <p className="text-xs text-muted-foreground mt-1">Click pay to continue with Apple Pay</p>
          </div>
        )}

        {paymentMethod === "crypto" && (
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <Wallet className="w-12 h-12 mx-auto text-primary" />
            <p className="text-sm font-medium mt-3">Crypto Payment</p>
            <p className="text-xs text-muted-foreground mt-1">BTC, ETH, USDT accepted</p>
          </div>
        )}

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-sm font-semibold disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${selectedPackage.price}
            </>
          )}
        </Button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-[10px] text-muted-foreground">256-bit SSL encryption • Powered by Stripe</span>
        </div>
      </div>
    </div>
  )
}
