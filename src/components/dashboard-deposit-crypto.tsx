"use client"

import { useState, useEffect } from "react"
import {
    ChevronDown,
    Copy,
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
    Sparkles,
    Clock,
    Shield,
    TrendingUp,
    Loader2,
    Coins
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCode, Select } from "antd"
import { Popup } from "antd-mobile"
import { Link } from 'react-router-dom'
import { ManualCryptoDeposit } from "./manual-crypto-deposit"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import { fetchCryptoConfigRequest } from "@/modules/crypto/actions"
 
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

interface CryptoOption {
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

const faqs = [
    {
        question: "How to deposit crypto?",
        answer: "Select coin and network, then send to the provided address.",
    },
    {
        question: "Why is my deposit pending?",
        answer: "Deposits require network confirmations before being credited.",
    },
    {
        question: "What is the minimum deposit?",
        answer: "Minimum varies by coin. Check the deposit page for details.",
    },
]

export function DashboardDepositCrypto() {
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    const dispatch = useDispatch()
    const { configs, loading: isLoading, error } = useSelector((state: RootState) => state.crypto)
    const cryptoOptions = configs as CryptoOption[]


    // Fetch crypto configurations from API
    useEffect(() => {
        if (!isLoading && configs.length === 0) {
            dispatch(fetchCryptoConfigRequest())
        }
    }, [dispatch, isLoading, configs.length])

    // Set default selections when data is loaded
    useEffect(() => {
        if (cryptoOptions && cryptoOptions.length > 0 && !selectedCrypto) {
            setSelectedCrypto(cryptoOptions[0])
            setSelectedNetwork(cryptoOptions[0].networks[0])
        }
    }, [cryptoOptions, selectedCrypto])

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleCryptoSelect = (crypto: CryptoOption) => {
        setSelectedCrypto(crypto)
        setSelectedNetwork(crypto.networks[0])
    }

    const handleNetworkSelect = (network: Network) => {
        setSelectedNetwork(network)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4 md:p-6 min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto" />
                    <p className="text-muted-foreground">Loading cryptocurrencies...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !selectedCrypto || !selectedNetwork) {
        return (
            <div className="p-4 md:p-6 min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-muted-foreground">{error || 'Failed to load data'}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        )
    }


    return (
        <div className="p-4 md:p-6 min-h-screen ">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-4 md:gap-6">
                {/* Left Side - Main Deposit Form */}
                <div className="space-y-4 md:space-y-6">
                    {/* Header with Gradient */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-transparent rounded-2xl blur-xl" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Deposit Crypto
                                </h1>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Select your cryptocurrency and network to get started
                            </p>
                        </div>
                    </div>



                    {/* Crypto Deposit Content */}
                    <div className="mt-6 space-y-4 md:space-y-6 relative">
                        <ManualCryptoDeposit
                            cryptoOptions={cryptoOptions}
                            selectedCrypto={selectedCrypto}
                            selectedNetwork={selectedNetwork}
                            onCryptoSelect={handleCryptoSelect}
                            onNetworkSelect={handleNetworkSelect}
                        />
                    </div>
                </div>

                {/* Right Side - Enhanced FAQ & Support */}
                <div className="space-y-4 md:space-y-6">
                    {/* FAQ Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                        <div className="relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border shadow-lg">
                            <h2 className="text-base md:text-lg font-bold text-foreground mb-4 md:mb-5 flex items-center gap-2">
                                <ExternalLink className="w-5 h-5 text-yellow-500" />
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-3 md:space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="p-2.5 md:p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 hover:border-yellow-500/30 transition-all duration-300">
                                        <h3 className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2">{faq.question}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-4 md:mt-6 rounded-lg gap-2 hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all duration-300 text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View All FAQs
                            </Button>
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border shadow-lg">
                            <div className="flex items-center gap-1.5 md:gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <h3 className="text-sm font-semibold text-foreground">Need help?</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 md:mb-4">
                                Our support team is available 24/7 to assist you
                            </p>
                            <Link href="https://t.me/CaptchaMasterBangladesh" target="_blank" className="w-full">
                                <Button className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base">
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl blur-lg transition-all duration-300" />
                        <div className="relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border shadow-lg">
                            <h3 className="text-xs md:text-sm font-semibold text-foreground mb-3 md:mb-4">Network Stats</h3>
                            <div className="space-y-2 md:space-y-3">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                    <span className="text-xs text-muted-foreground">Processing Time</span>
                                    <span className="text-xs font-bold text-foreground">{selectedNetwork.time}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                    <span className="text-xs text-muted-foreground">Network Fee</span>
                                    <span className="text-xs font-bold text-foreground">{selectedNetwork.fee}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                    <span className="text-xs text-muted-foreground">Confirmations</span>
                                    <span className="text-xs font-bold text-foreground">{selectedNetwork.confirmations}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
