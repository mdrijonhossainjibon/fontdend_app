"use client"

import { useState, useEffect } from "react"
import {
    ArrowUpRight,
    Wallet,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Copy,
    Info,
    TrendingDown
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Network {
    id: string
    name: string
    fee: string
    time: string
    confirmations: number
    minDeposit: string
    address: string
    badge?: string
    badgeColor?: string
    isActive: boolean
}

interface Crypto {
    id: string
    name: string
    fullName: string
    icon: string
    color: string
    bg: string
    borderGlow: string
    networks: Network[]
    isActive: boolean
}

interface PayoutFormProps {
    userBalance?: number
    onSuccess?: (txHash: string) => void
    onError?: (error: string) => void
}

export function CryptoPayoutForm({ userBalance = 0, onSuccess, onError }: PayoutFormProps) {
    const [cryptos, setCryptos] = useState<Crypto[]>([])
    const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
    const [amount, setAmount] = useState("")
    const [toAddress, setToAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Fetch crypto configurations
    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await fetch("/api/crypto/config")
                const data = await response.json()
                if (data.success) {
                    setCryptos(data.data)
                    // Auto-select Secto if available
                    const secto = data.data.find((c: Crypto) => c.id === "sect")
                    if (secto) {
                        setSelectedCrypto(secto)
                        setSelectedNetwork(secto.networks[0])
                    }
                }
            } catch (error) {
                console.error("Error fetching crypto configs:", error)
            }
        }
        fetchCryptos()
    }, [])

    const handlePayout = async () => {
        setError("")
        setSuccess("")

        if (!selectedCrypto || !selectedNetwork) {
            setError("Please select a cryptocurrency and network")
            return
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount")
            return
        }

        if (!toAddress) {
            setError("Please enter a withdrawal address")
            return
        }

        const parsedAmount = parseFloat(amount)
        const minAmount = parseFloat(selectedNetwork.minDeposit.split(" ")[0])

        if (parsedAmount < minAmount) {
            setError(`Minimum withdrawal amount is ${selectedNetwork.minDeposit}`)
            return
        }

        if (parsedAmount > userBalance) {
            setError("Insufficient balance")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/crypto/payout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cryptoId: selectedCrypto.id,
                    networkId: selectedNetwork.id,
                    amount: parsedAmount,
                    toAddress,
                    userId: "current-user-id", // Replace with actual user ID from session
                }),
            })

            const data = await response.json()

            if (data.success) {
                setSuccess(`Payout request submitted successfully! ID: ${data.data.id}`)
                setAmount("")
                setToAddress("")
                if (onSuccess) {
                    onSuccess(data.data.id)
                }
            } else {
                setError(data.error || "Failed to process payout")
                if (onError) {
                    onError(data.error)
                }
            }
        } catch (error: any) {
            console.error("Error processing payout:", error)
            setError("Failed to process payout request")
            if (onError) {
                onError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const calculateFee = () => {
        if (!selectedNetwork) return "0"
        return selectedNetwork.fee
    }

    const calculateTotal = () => {
        if (!amount || !selectedNetwork) return "0"
        const amountNum = parseFloat(amount)
        const feeNum = parseFloat(selectedNetwork.fee.split(" ")[0])
        return (amountNum - feeNum).toFixed(4)
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Main Card */}
            <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-border/50 hover:border-red-500/40 transition-all duration-500 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border-2 border-red-500/30 shadow-lg">
                            <ArrowUpRight className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                Crypto Withdrawal
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Withdraw your crypto to any wallet address
                            </p>
                        </div>
                    </div>

                    {/* Balance Display */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-sm border border-border/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Available Balance</span>
                            <span className="text-2xl font-bold text-foreground">
                                ${userBalance.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Crypto Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-red-500" />
                            Select Cryptocurrency
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {cryptos.map((crypto) => (
                                <button
                                    key={crypto.id}
                                    onClick={() => {
                                        setSelectedCrypto(crypto)
                                        setSelectedNetwork(crypto.networks[0])
                                    }}
                                    className={`p-3 rounded-xl border transition-all ${selectedCrypto?.id === crypto.id
                                            ? "border-red-500 bg-red-500/10"
                                            : "border-border/50 hover:border-border"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full ${crypto.bg} flex items-center justify-center text-sm font-bold ${crypto.color}`}>
                                            {crypto.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold">{crypto.name}</div>
                                            <div className="text-xs text-muted-foreground">{crypto.fullName}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Network Selection */}
                    {selectedCrypto && selectedCrypto.networks.length > 1 && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Network</label>
                            <div className="space-y-2">
                                {selectedCrypto.networks.map((network) => (
                                    <button
                                        key={network.id}
                                        onClick={() => setSelectedNetwork(network)}
                                        className={`w-full p-3 rounded-xl border transition-all text-left ${selectedNetwork?.id === network.id
                                                ? "border-red-500 bg-red-500/10"
                                                : "border-border/50 hover:border-border"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-sm">{network.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Fee: {network.fee} • {network.time}
                                                </div>
                                            </div>
                                            {network.badge && (
                                                <span className={`text-xs px-2 py-1 rounded-full border ${network.badgeColor}`}>
                                                    {network.badge}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            Withdrawal Amount
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.0001"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 focus:border-red-500/50 focus:outline-none text-foreground font-semibold transition-all"
                            />
                            <button
                                onClick={() => setAmount(userBalance.toString())}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-all"
                            >
                                MAX
                            </button>
                        </div>
                        {selectedNetwork && (
                            <p className="text-xs text-muted-foreground">
                                Minimum: {selectedNetwork.minDeposit}
                            </p>
                        )}
                    </div>

                    {/* Withdrawal Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Withdrawal Address
                        </label>
                        <input
                            type="text"
                            value={toAddress}
                            onChange={(e) => setToAddress(e.target.value)}
                            placeholder="Enter wallet address"
                            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 focus:border-red-500/50 focus:outline-none text-foreground font-mono text-sm transition-all"
                        />
                    </div>

                    {/* Fee Summary */}
                    {amount && selectedNetwork && (
                        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-semibold">{amount} {selectedCrypto?.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Network Fee</span>
                                <span className="font-semibold text-red-500">-{calculateFee()}</span>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">You'll Receive</span>
                                <span className="text-lg font-bold text-green-500">
                                    {calculateTotal()} {selectedCrypto?.name}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-500">{success}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        className="w-full h-12 font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handlePayout}
                        disabled={loading || !selectedCrypto || !selectedNetwork || !amount || !toAddress}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <ArrowUpRight className="w-5 h-5 mr-2" />
                                Withdraw Now
                            </>
                        )}
                    </Button>

                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
                                <strong>Important:</strong> Please double-check the withdrawal address and network. Sending to the wrong address or network may result in permanent loss of funds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
