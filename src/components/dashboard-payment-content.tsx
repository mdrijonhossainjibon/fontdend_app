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
  Wallet,
  Copy,
  Clock,
  AlertCircle,
  RefreshCw,
  Bitcoin,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
const creditPackages = [
  { credits: 1000, price: 4.99, popular: false, bonus: 0, perCredit: "0.005" },
  { credits: 5000, price: 19.99, popular: true, bonus: 500, perCredit: "0.004" },
  { credits: 10000, price: 34.99, popular: false, bonus: 1500, perCredit: "0.003" },
  { credits: 50000, price: 149.99, popular: false, bonus: 10000, perCredit: "0.002" },
  { credits: 100000, price: 249.99, popular: false, bonus: 25000, perCredit: "0.002" },
]

const cryptoCurrencies = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: Bitcoin, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "usdt", name: "Tether", symbol: "USDT", icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "ltc", name: "Litecoin", symbol: "LTC", icon: Wallet, color: "text-gray-500", bg: "bg-gray-500/10" },
]

export function DashboardPaymentContent() {
  const [searchParams] = useSearchParams()
  const packageIndex = Number.parseInt(searchParams.get("package") || "1")
  const methodParam = searchParams.get("method") || "card"
  const selectedPackage = creditPackages[packageIndex] || creditPackages[1]

  const [isVisible, setIsVisible] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "crypto" | "metamask">(
    methodParam as "card" | "paypal" | "crypto" | "metamask",
  )
  const [selectedCrypto, setSelectedCrypto] = useState("btc")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [metamaskConnected, setMetamaskConnected] = useState(false)
  const [metamaskAddress, setMetamaskAddress] = useState("")
  const [metamaskConnecting, setMetamaskConnecting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (paymentMethod === "crypto" && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [paymentMethod, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f8a3d1"

  const connectMetamask = async () => {
    setMetamaskConnecting(true)
    setTimeout(() => {
      setMetamaskConnected(true)
      setMetamaskAddress("0x742d...f8a3d1")
      setMetamaskConnecting(false)
    }, 1500)
  }

  const handleMetamaskPayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 3000)
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-6">
        <div
          className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse mx-auto">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8">Payment Successful!</h2>
          <p className="text-muted-foreground mt-2">
            {selectedPackage.credits.toLocaleString()} credits have been added to your account
          </p>

          {selectedPackage.bonus > 0 && (
            <div className="mt-6 px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 inline-flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">
                +{selectedPackage.bonus.toLocaleString()} bonus credits!
              </span>
            </div>
          )}

          <div className="mt-8 p-6 rounded-2xl bg-card border border-border max-w-sm mx-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Credits</span>
              <span className="font-bold text-lg">
                {(selectedPackage.credits + selectedPackage.bonus).toLocaleString()}
              </span>
            </div>
            <div className="h-px bg-border my-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-bold text-lg">${selectedPackage.price}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/dashboard">
              <Button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/dashboard/topup">
              <Button variant="outline" className="h-12 px-6 rounded-xl bg-transparent">
                Buy More Credits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div
        className={`flex items-center gap-4 mb-8 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <Link
          to="/dashboard/topup"
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
          <p className="text-sm text-muted-foreground">Secure checkout powered by Stripe</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <Lock className="w-4 h-4 text-green-500" />
          <span className="text-sm font-semibold">256-bit SSL</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Payment Form */}
        <div
          className={`lg:col-span-3 space-y-6 transition-all duration-500 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Payment Method Selection */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Select Payment Method
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === "card"
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/30"
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === "card" ? "bg-primary/20" : "bg-secondary"}`}
                >
                  <CreditCard
                    className={`w-6 h-6 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <span className="text-xs font-medium">Credit Card</span>
                <span className="text-[10px] text-muted-foreground">Visa, Mastercard</span>
              </button>
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === "paypal"
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/30"
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === "paypal" ? "bg-primary/20" : "bg-secondary"}`}
                >
                  <Wallet
                    className={`w-6 h-6 ${paymentMethod === "paypal" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <span className="text-xs font-medium">PayPal</span>
                <span className="text-[10px] text-muted-foreground">Fast checkout</span>
              </button>
              <button
                onClick={() => setPaymentMethod("crypto")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === "crypto"
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/30"
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === "crypto" ? "bg-primary/20" : "bg-secondary"}`}
                >
                  <Bitcoin
                    className={`w-6 h-6 ${paymentMethod === "crypto" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <span className="text-xs font-medium">Crypto</span>
                <span className="text-[10px] text-muted-foreground">BTC, ETH, USDT</span>
              </button>
              <button
                onClick={() => setPaymentMethod("metamask")}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 relative overflow-hidden ${paymentMethod === "metamask"
                    ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10"
                    : "border-border hover:border-orange-500/30"
                  }`}
              >
                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-500 text-white">
                  WEB3
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === "metamask" ? "bg-orange-500/20" : "bg-secondary"}`}
                >
                  <svg
                    viewBox="0 0 35 33"
                    className={`w-6 h-6 ${paymentMethod === "metamask" ? "text-orange-500" : "text-muted-foreground"}`}
                    fill="currentColor"
                  >
                    <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" />
                    <path d="M2.66296 1L15.6799 10.809L13.3544 4.99098L2.66296 1Z" />
                    <path d="M28.2295 23.5334L24.7346 28.872L32.2172 30.932L34.3482 23.6501L28.2295 23.5334Z" />
                    <path d="M1.27271 23.6501L3.39379 30.932L10.8764 28.872L7.38144 23.5334L1.27271 23.6501Z" />
                    <path d="M10.4706 14.5149L8.39001 17.6507L15.8015 17.9888L15.5481 9.94141L10.4706 14.5149Z" />
                    <path d="M25.1504 14.5149L19.9959 9.85059L19.8242 17.9888L27.231 17.6507L25.1504 14.5149Z" />
                    <path d="M10.8765 28.8721L15.3541 26.7173L11.4736 23.6973L10.8765 28.8721Z" />
                    <path d="M20.2669 26.7173L24.7347 28.8721L24.1474 23.6973L20.2669 26.7173Z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">MetaMask</span>
                <span className="text-[10px] text-muted-foreground">Web3</span>
              </button>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <h3 className="text-sm font-semibold mb-2">Card Details</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={4}
                    className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal */}
          {paymentMethod === "paypal" && (
            <div className="p-8 rounded-2xl bg-card border border-border text-center">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto">
                <Wallet className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mt-6">PayPal Checkout</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You will be redirected to PayPal to complete your purchase securely.
              </p>
            </div>
          )}

          {/* Crypto Payment */}
          {paymentMethod === "crypto" && (
            <div className="space-y-4">
              {/* Crypto Selection */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4">Select Cryptocurrency</h3>
                <div className="grid grid-cols-4 gap-3">
                  {cryptoCurrencies.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => setSelectedCrypto(crypto.id)}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedCrypto === crypto.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${crypto.bg} flex items-center justify-center`}>
                        <crypto.icon className={`w-5 h-5 ${crypto.color}`} />
                      </div>
                      <span className="text-xs font-medium">{crypto.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                {/* Timer Warning */}
                <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-500">Payment expires in</span>
                  </div>
                  <span className="text-lg font-bold text-amber-500 font-mono">{formatTime(timeLeft)}</span>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-48 h-48 rounded-2xl bg-white p-4 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-[url('/qr-code-for-crypto-payment.jpg')] bg-cover bg-center" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Scan QR code to pay</p>
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Send exactly to this address:</label>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                    <code className="text-xs font-mono flex-1 truncate">{walletAddress}</code>
                    <button
                      onClick={() => copyToClipboard(walletAddress)}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="mt-4 p-4 rounded-xl bg-card border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount to send</span>
                    <div className="text-right">
                      <p className="text-lg font-bold">0.00052 BTC</p>
                      <p className="text-xs text-muted-foreground">≈ ${selectedPackage.price}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center justify-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Waiting for payment...</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-transparent gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-transparent gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </Button>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Important</p>
                  <p>
                    Send only {cryptoCurrencies.find((c) => c.id === selectedCrypto)?.symbol} to this address. Sending
                    any other cryptocurrency may result in permanent loss.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MetaMask Payment Section */}
          {paymentMethod === "metamask" && (
            <div className="space-y-4">
              {/* MetaMask Connection Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 35 33" className="w-8 h-8 text-orange-500" fill="currentColor">
                      <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" />
                      <path d="M2.66296 1L15.6799 10.809L13.3544 4.99098L2.66296 1Z" />
                      <path d="M28.2295 23.5334L24.7346 28.872L32.2172 30.932L34.3482 23.6501L28.2295 23.5334Z" />
                      <path d="M1.27271 23.6501L3.39379 30.932L10.8764 28.872L7.38144 23.5334L1.27271 23.6501Z" />
                      <path d="M10.4706 14.5149L8.39001 17.6507L15.8015 17.9888L15.5481 9.94141L10.4706 14.5149Z" />
                      <path d="M25.1504 14.5149L19.9959 9.85059L19.8242 17.9888L27.231 17.6507L25.1504 14.5149Z" />
                      <path d="M10.8765 28.8721L15.3541 26.7173L11.4736 23.6973L10.8765 28.8721Z" />
                      <path d="M20.2669 26.7173L24.7347 28.8721L24.1474 23.6973L20.2669 26.7173Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">MetaMask Wallet</h3>
                    <p className="text-sm text-muted-foreground">Connect your wallet to pay with ETH or tokens</p>
                  </div>
                  {metamaskConnected && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-500 font-medium">Connected</span>
                    </div>
                  )}
                </div>

                {!metamaskConnected ? (
                  <div className="space-y-4">
                    <Button
                      onClick={connectMetamask}
                      disabled={metamaskConnecting}
                      className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base gap-3"
                    >
                      {metamaskConnecting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          Connect MetaMask
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Make sure you have MetaMask extension installed in your browser
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Connected Address */}
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Connected Address</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono">{metamaskAddress}</code>
                          <button
                            onClick={() => copyToClipboard(metamaskAddress)}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                          >
                            {copied ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Token Selection */}
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <label className="text-xs text-muted-foreground mb-3 block">Pay with</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "eth", name: "ETH", icon: "Ξ", color: "text-blue-500", bg: "bg-blue-500/10" },
                          { id: "usdt", name: "USDT", icon: "$", color: "text-green-500", bg: "bg-green-500/10" },
                          { id: "usdc", name: "USDC", icon: "$", color: "text-blue-400", bg: "bg-blue-400/10" },
                        ].map((token) => (
                          <button
                            key={token.id}
                            className="p-3 rounded-xl border border-primary bg-primary/5 flex items-center justify-center gap-2"
                          >
                            <div className={`w-8 h-8 rounded-full ${token.bg} flex items-center justify-center`}>
                              <span className={`text-sm font-bold ${token.color}`}>{token.icon}</span>
                            </div>
                            <span className="text-sm font-medium">{token.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Amount */}
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">You will pay</span>
                        <div className="text-right">
                          <p className="text-xl font-bold">0.0025 ETH</p>
                          <p className="text-xs text-muted-foreground">≈ ${selectedPackage.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Gas Estimate */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <span className="text-xs text-muted-foreground">Estimated Gas Fee</span>
                      <span className="text-xs font-medium">~$0.50</span>
                    </div>

                    {/* Pay Button */}
                    <Button
                      onClick={handleMetamaskPayment}
                      disabled={isProcessing}
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base gap-3"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Confirming Transaction...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Pay ${selectedPackage.price} with MetaMask
                        </>
                      )}
                    </Button>

                    {/* Disconnect */}
                    <button
                      onClick={() => {
                        setMetamaskConnected(false)
                        setMetamaskAddress("")
                      }}
                      className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>

              {/* MetaMask Benefits */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Shield className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-medium">Non-Custodial</p>
                  <p className="text-[10px] text-muted-foreground">You control keys</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-medium">Instant</p>
                  <p className="text-[10px] text-muted-foreground">Fast settlement</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Lock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-medium">Secure</p>
                  <p className="text-[10px] text-muted-foreground">Blockchain verified</p>
                </div>
              </div>
            </div>
          )}

          {/* Pay Button for Card/PayPal */}
          {(paymentMethod === "card" || paymentMethod === "paypal") && (
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base font-semibold disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ${selectedPackage.price}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div
          className={`lg:col-span-2 transition-all duration-500 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="sticky top-6 space-y-4">
            {/* Package Summary */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20">
              <h3 className="text-sm font-semibold mb-4">Order Summary</h3>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedPackage.credits.toLocaleString()} Credits</p>
                  {selectedPackage.bonus > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-500">
                      <Gift className="w-3 h-3" />
                      <span>+{selectedPackage.bonus.toLocaleString()} bonus</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Credits</span>
                  <span>{selectedPackage.credits.toLocaleString()}</span>
                </div>
                {selectedPackage.bonus > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Bonus Credits</span>
                    <span>+{selectedPackage.bonus.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per Credit</span>
                  <span>${selectedPackage.perCredit}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">${selectedPackage.price}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold">Secure Payment</span>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>Instant credit delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
              <p className="text-xs text-muted-foreground">
                Need help?{" "}
                <Link to="https://t.me/CaptchaMasterBangladesh" target="_blank" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
