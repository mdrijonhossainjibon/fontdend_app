"use client"

import { useState, useEffect } from "react"
import {
  Coins,
  Bitcoin,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  QrCode,
  Clock,
  Shield,
  TrendingUp,
  Zap,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const depositAmounts = [
  { usd: 10, popular: false },
  { usd: 25, popular: false },
  { usd: 50, popular: true },
  { usd: 100, popular: false },
  { usd: 250, popular: false },
  { usd: 500, popular: false },
]

const cryptoOptions = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    iconPath: "../node_modules/cryptocurrency-icons/svg/color/btc.svg",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    networks: [
      {
        id: "btc-mainnet",
        name: "Bitcoin Network",
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        confirmations: 3,
        fee: "0.5%",
        avgTime: "30-60 min",
      },
    ],
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    iconPath: "../node_modules/cryptocurrency-icons/svg/color/eth.svg",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    networks: [
      {
        id: "eth-mainnet",
        name: "Ethereum (ERC-20)",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 12,
        fee: "0.3%",
        avgTime: "10-20 min",
      },
      {
        id: "eth-arbitrum",
        name: "Arbitrum One",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 1,
        fee: "0.1%",
        avgTime: "2-5 min",
      },
      {
        id: "eth-polygon",
        name: "Polygon",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 128,
        fee: "0.1%",
        avgTime: "5-10 min",
      },
    ],
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    iconPath: "../node_modules/cryptocurrency-icons/svg/color/usdt.svg",
    color: "text-green-500",
    bg: "bg-green-500/10",
    borderColor: "border-green-500/30",
    networks: [
      {
        id: "usdt-erc20",
        name: "Ethereum (ERC-20)",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 12,
        fee: "0.2%",
        avgTime: "10-20 min",
      },
      {
        id: "usdt-trc20",
        name: "Tron (TRC-20)",
        address: "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6",
        confirmations: 19,
        fee: "0.1%",
        avgTime: "3-5 min",
      },
      {
        id: "usdt-bep20",
        name: "BSC (BEP-20)",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 15,
        fee: "0.1%",
        avgTime: "3-5 min",
      },
    ],
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    iconPath: "../node_modules/cryptocurrency-icons/svg/color/usdc.svg",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    borderColor: "border-blue-600/30",
    networks: [
      {
        id: "usdc-erc20",
        name: "Ethereum (ERC-20)",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 12,
        fee: "0.2%",
        avgTime: "10-20 min",
      },
      {
        id: "usdc-polygon",
        name: "Polygon",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 128,
        fee: "0.1%",
        avgTime: "5-10 min",
      },
      {
        id: "usdc-arbitrum",
        name: "Arbitrum One",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        confirmations: 1,
        fee: "0.1%",
        avgTime: "2-5 min",
      },
    ],
  },
]

const exchangeRates = {
  btc: 43250.5,
  eth: 2280.75,
  usdt: 1.0,
  usdc: 1.0,
}

export function DashboardTopupContent() {
  const [selectedAmount, setSelectedAmount] = useState<number>(2)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [selectedCrypto, setSelectedCrypto] = useState<string>("btc")
  const [selectedNetwork, setSelectedNetwork] = useState<string>("btc-mainnet")
  const [step, setStep] = useState<"select" | "deposit">("select")
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const currentAmount = customAmount ? parseFloat(customAmount) : depositAmounts[selectedAmount].usd
  const selectedCryptoData = cryptoOptions.find((c) => c.id === selectedCrypto)
  const selectedNetworkData = selectedCryptoData?.networks.find((n) => n.id === selectedNetwork) || selectedCryptoData?.networks[0]
  const cryptoAmount = (currentAmount / exchangeRates[selectedCrypto as keyof typeof exchangeRates]).toFixed(8)

  const handleCopyAddress = () => {
    if (selectedNetworkData) {
      navigator.clipboard.writeText(selectedNetworkData.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCryptoSelect = (cryptoId: string) => {
    setSelectedCrypto(cryptoId)
    const crypto = cryptoOptions.find((c) => c.id === cryptoId)
    if (crypto && crypto.networks.length > 0) {
      setSelectedNetwork(crypto.networks[0].id)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getCurrentDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Title and Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {getGreeting()}, <span className="text-primary">User</span>
          </h1>
          <p className="text-sm text-muted-foreground">{getCurrentDate()}</p>
        </div>

        {/* Deposit Info Card */}
        <div
          className={`p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center relative">
                <Wallet className="w-8 h-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Crypto Deposit</h2>
                <p className="text-sm text-muted-foreground">Add funds to your account using cryptocurrency</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-muted-foreground">Secure & Fast</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-muted-foreground">10-30 min processing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Min Deposit</p>
                <p className="text-lg font-bold text-foreground">$10</p>
              </div>
              <div className="w-px bg-border"></div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Network Fee</p>
                <p className="text-lg font-bold text-green-500">0.2-0.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator - Only show on select screen */}
      {step === "select" && (
        <div
          className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10" />
              <div
                className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
                style={{
                  width: selectedCrypto && selectedNetwork
                    ? '100%'
                    : selectedCrypto
                      ? '66%'
                      : currentAmount >= 10
                        ? '33%'
                        : '0%'
                }}
              />

              {/* Step 1: Amount */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${currentAmount >= 10
                    ? 'bg-primary border-primary shadow-lg shadow-primary/30'
                    : 'bg-card border-border'
                  }`}>
                  {currentAmount >= 10 ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">1</span>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${currentAmount >= 10 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Amount
                  </p>
                  {currentAmount >= 10 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">${currentAmount.toFixed(0)}</p>
                  )}
                </div>
              </div>

              {/* Step 2: Cryptocurrency */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedCrypto
                    ? 'bg-primary border-primary shadow-lg shadow-primary/30'
                    : currentAmount >= 10
                      ? 'bg-card border-primary animate-pulse'
                      : 'bg-card border-border'
                  }`}>
                  {selectedCrypto ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className={`text-sm font-bold ${currentAmount >= 10 ? 'text-primary' : 'text-muted-foreground'}`}>2</span>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${selectedCrypto ? 'text-primary' : currentAmount >= 10 ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Crypto
                  </p>
                  {selectedCrypto && selectedCryptoData && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{selectedCryptoData.symbol}</p>
                  )}
                </div>
              </div>

              {/* Step 3: Network */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedNetwork
                    ? 'bg-primary border-primary shadow-lg shadow-primary/30'
                    : selectedCrypto
                      ? 'bg-card border-primary animate-pulse'
                      : 'bg-card border-border'
                  }`}>
                  {selectedNetwork ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className={`text-sm font-bold ${selectedCrypto ? 'text-primary' : 'text-muted-foreground'}`}>3</span>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${selectedNetwork ? 'text-primary' : selectedCrypto ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Network
                  </p>
                  {selectedNetwork && selectedNetworkData && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[80px] truncate">
                      {selectedNetworkData.name.split(' ')[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 4: Confirm */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedCrypto && selectedNetwork && currentAmount >= 10
                    ? 'bg-card border-primary animate-pulse'
                    : 'bg-card border-border'
                  }`}>
                  <span className={`text-sm font-bold ${selectedCrypto && selectedNetwork && currentAmount >= 10 ? 'text-primary' : 'text-muted-foreground'}`}>4</span>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${selectedCrypto && selectedNetwork && currentAmount >= 10 ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Confirm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "select" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Amount Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Amount */}
            <div
              className={`p-6 rounded-2xl bg-card border border-border transition-all duration-500 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Select Amount
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {depositAmounts.map((amount, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAmount(index)
                      setCustomAmount("")
                    }}
                    className={`relative p-4 rounded-xl border transition-all duration-300 ${selectedAmount === index && !customAmount
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                      }`}
                  >
                    {amount.popular && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        POPULAR
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-2xl font-bold">${amount.usd}</p>
                      <p className="text-xs text-muted-foreground mt-1">USD</p>
                    </div>
                    {selectedAmount === index && !customAmount && (
                      <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 left-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full h-14 pl-8 pr-4 rounded-xl bg-secondary/50 border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Minimum deposit: $10 USD</p>
              </div>
            </div>

            {/* Select Cryptocurrency */}
            <div
              className={`p-6 rounded-2xl bg-card border border-border transition-all duration-500 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-primary" />
                Select Cryptocurrency
              </h2>

              {/* Crypto Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cryptoOptions.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => handleCryptoSelect(crypto.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 text-center relative overflow-hidden group ${selectedCrypto === crypto.id
                      ? `${crypto.borderColor} bg-gradient-to-br ${crypto.bg} shadow-lg shadow-primary/10`
                      : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                      }`}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-xl ${crypto.bg} flex items-center justify-center border ${crypto.borderColor} mx-auto mb-3`}>
                        <span className={`text-2xl font-bold ${crypto.color}`}>
                          {crypto.symbol.charAt(0)}
                        </span>
                      </div>
                      <p className="font-bold text-sm mb-1">{crypto.symbol}</p>
                      <p className="text-xs text-muted-foreground">{crypto.name}</p>
                      {selectedCrypto === crypto.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className={`w-4 h-4 ${crypto.color}`} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Network - Only shows after crypto is selected */}
            {selectedCrypto && selectedCryptoData && (
              <div
                className={`p-6 rounded-2xl bg-card border border-border transition-all duration-500 animate-in slide-in-from-top-4 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Select Network
                </h2>

                <div className="space-y-3">
                  {selectedCryptoData.networks.map((network) => {
                    const isSelected = selectedNetwork === network.id
                    return (
                      <button
                        key={network.id}
                        onClick={() => setSelectedNetwork(network.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group ${isSelected
                          ? `${selectedCryptoData.borderColor} bg-gradient-to-r ${selectedCryptoData.bg} shadow-lg`
                          : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                          }`}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                        <div className="relative z-10">
                          {/* Network Name & Selection */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              )}
                              <p className="text-base font-bold">{network.name}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className={`w-5 h-5 ${selectedCryptoData.color}`} />
                            )}
                          </div>

                          {/* Network Details */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                              <span className="text-xs font-semibold text-green-500">Fee: {network.fee}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                              <span className="text-xs font-medium text-muted-foreground">
                                {network.confirmations} confirmations
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                              <Clock className="w-3 h-3 text-primary" />
                              <span className="text-xs font-medium text-primary">{network.avgTime}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Network Info */}
                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Make sure to select the correct network. Sending {selectedCryptoData.symbol} to the wrong network may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Summary */}
          <div
            className={`space-y-4 transition-all duration-500 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* Deposit Summary */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <h3 className="text-sm font-semibold mb-4">Deposit Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount (USD)</span>
                  <span className="font-bold text-lg">${currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cryptocurrency</span>
                  <span className="font-medium">{selectedCryptoData?.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium text-primary">{selectedNetworkData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-medium text-green-500">{selectedNetworkData?.fee}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">You'll send</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">{cryptoAmount}</p>
                    <p className="text-xs text-muted-foreground">{selectedCryptoData?.symbol}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep("deposit")}
                disabled={currentAmount < 10}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-4 font-semibold"
              >
                Continue to Deposit
                <ArrowUpRight className="w-4 h-4" />
              </Button>

              {currentAmount < 10 && (
                <div className="flex items-center gap-2 mt-3 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>Minimum deposit is $10 USD</span>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Secure & Fast</p>
                  <ul className="space-y-1">
                    <li>• Deposits are processed automatically</li>
                    <li>• Funds credited after {selectedNetworkData?.confirmations} confirmations</li>
                    <li>• Average processing time: {selectedNetworkData?.avgTime}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Deposit Instructions */
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep("select")}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            ← Back to selection
          </button>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${selectedCryptoData?.bg} flex items-center justify-center mx-auto mb-4 p-3`}>
                {/*  {selectedCryptoData && (
                  <img                     src={require(selectedCryptoData.iconPath)}
                    alt={selectedCryptoData.name}
                    style={{ width: 48 }}
                    
                    className="w-12 h-12"
                  />
                )} */}
              </div>
              <h2 className="text-2xl font-bold mb-2">Send {selectedCryptoData?.name}</h2>
              <p className="text-muted-foreground">Send exactly {cryptoAmount} {selectedCryptoData?.symbol} to the address below</p>
            </div>

            {/* Amount to Send */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground mb-1">Amount to Send</p>
              <p className="text-3xl font-bold text-primary">{cryptoAmount} {selectedCryptoData?.symbol}</p>
              <p className="text-sm text-muted-foreground mt-1">≈ ${currentAmount.toFixed(2)} USD</p>
            </div>

            {/* Deposit Address */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Deposit Address ({selectedNetworkData?.name})</label>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-sm font-mono break-all mb-3">{selectedNetworkData?.address}</p>
                <Button
                  onClick={handleCopyAddress}
                  variant="outline"
                  className="w-full rounded-lg gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="p-6 rounded-xl bg-secondary/30 border border-border text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-3">
                <QrCode className="w-32 h-32 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Scan QR code with your crypto wallet</p>
            </div>

            {/* Important Notes */}
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-foreground">Important Notes:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Only send {selectedCryptoData?.symbol} to this address on {selectedNetworkData?.name}</li>
                    <li>• Sending any other cryptocurrency will result in permanent loss</li>
                    <li>• Minimum deposit: $10 USD</li>
                    <li>• Funds will be credited after {selectedNetworkData?.confirmations} network confirmations</li>
                    <li>• Network fee: {selectedNetworkData?.fee}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Waiting for payment</p>
                    <p className="text-xs text-muted-foreground">We'll notify you once received</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl gap-2"
                onClick={() => window.open(`https://blockchain.com/explorer`, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </Button>
              <Button
                onClick={() => setStep("select")}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              >
                New Deposit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
