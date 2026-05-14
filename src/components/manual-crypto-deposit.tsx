"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import { fetchDepositAddressRequest, startDepositPolling, stopDepositPolling } from "@/modules/crypto/actions"
import {
    Copy,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Clock,
    Shield,
    TrendingUp,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCode, Select } from "antd"
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

interface ManualCryptoDepositProps {
    cryptoOptions: CryptoOption[]
    selectedCrypto: CryptoOption
    selectedNetwork: Network
    onCryptoSelect: (crypto: CryptoOption) => void
    onNetworkSelect: (network: Network) => void
}

export function ManualCryptoDeposit({
    cryptoOptions,
    selectedCrypto,
    selectedNetwork,
    onCryptoSelect,
    onNetworkSelect
}: ManualCryptoDepositProps) {
    const dispatch = useDispatch()
    const { depositAddress, fetchingAddress } = useSelector((state: RootState) => state.crypto)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (selectedCrypto?.id && selectedNetwork?.id) {
            dispatch(fetchDepositAddressRequest(selectedCrypto.id, selectedNetwork.id))
        }
    }, [selectedCrypto?.id, selectedNetwork?.id, dispatch])

    useEffect(() => {
        const addressToCheck = depositAddress || selectedNetwork?.address
        if (addressToCheck) {
            dispatch(startDepositPolling(addressToCheck))
        }
        return () => {
            dispatch(stopDepositPolling())
        }
    }, [dispatch, depositAddress, selectedNetwork?.address])

    const handleCopyAddress = () => {
        const addressToCopy = depositAddress || selectedNetwork?.address
        if (addressToCopy) {
            navigator.clipboard.writeText(addressToCopy)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Connecting Line - Hidden on mobile */}
            <div className="hidden md:block absolute left-3 top-10 bottom-10 w-0.5 bg-gradient-to-b from-yellow-500 via-yellow-500/50 to-yellow-500/20" />

            {/* Step 1: Select Coin */}
            <div className="relative space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <span className="text-xs font-bold text-black">1</span>
                    </div>
                    <h2 className="text-sm md:text-base font-semibold text-foreground">Select Coin</h2>
                </div>

                <div className="relative ml-0 md:ml-10">
                    <Select
                        value={selectedCrypto.id}
                        onChange={(value) => {
                            const crypto = cryptoOptions.find(c => c.id === value)
                            if (crypto) onCryptoSelect(crypto)
                        }}
                        className="w-full"
                        size="large"
                        style={{ width: '100%' }}
                        popupClassName="crypto-select-dropdown"
                    >
                        {cryptoOptions.map((crypto) => (
                            <Select.Option key={crypto.id} value={crypto.id}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${crypto.bg} flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                                        {crypto.id === 'sect' ? (
                                            <span className="text-lg font-bold text-cyan-400">S</span>
                                        ) : (
                                            <span className="text-lg font-bold">{crypto.name[0]}</span>
                                        )}
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-bold ${crypto.id === 'sect' ? 'text-cyan-400' : ''}`}>
                                                {crypto.name}
                                            </p>
                                            {crypto.id === 'sect' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs ${crypto.id === 'sect' ? 'text-cyan-400/70' : 'text-muted-foreground'}`}>
                                            {crypto.fullName}
                                        </p>
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Step 2: Select Network */}
            <div className="relative space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <span className="text-xs font-bold text-black">2</span>
                    </div>
                    <h2 className="text-sm md:text-base font-semibold text-foreground">Select Network</h2>
                </div>

                <div className="relative ml-0 md:ml-10">
                    <Select
                        value={selectedNetwork.id}
                        onChange={(value) => {
                            const network = selectedCrypto.networks.find(n => n.id === value)
                            if (network) onNetworkSelect(network)
                        }}
                        className="w-full"
                        size="large"
                        style={{ width: '100%' }}
                        popupClassName="network-select-dropdown"
                    >
                        {selectedCrypto.networks.map((network) => (
                            <Select.Option key={network.id} value={network.id}>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-bold">{network.name}</p>
                                            {network.badge && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${network.badgeColor} font-semibold`}>
                                                    {network.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>Fee: {network.fee}</span>
                                            <span>•</span>
                                            <span>{network.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Step 3: Deposit Address - Enhanced Professional Design */}
            <div className="relative space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <span className="text-xs font-bold text-black">3</span>
                    </div>
                    <h2 className="text-sm md:text-base font-semibold text-foreground">Deposit Address</h2>
                </div>

                {/* Main Card Container */}
                <div className="ml-0 md:ml-10 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-border/50 hover:border-yellow-500/40 transition-all duration-500 shadow-2xl overflow-hidden group">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* QR Code Section */}
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                                <div className="relative">
                                    {/* Animated Glow Effect */}
                                    <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-yellow-400/20 rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

                                    {/* QR Code Container */}
                                    <div className="relative">
                                        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-4 md:p-5 shadow-2xl border-2 border-white/50 backdrop-blur-sm">
                                            {fetchingAddress ? (
                                                <div className="w-[120px] h-[120px] flex items-center justify-center bg-secondary/20 rounded-xl">
                                                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                                                </div>
                                            ) : (
                                                <QRCode
                                                    value={depositAddress || selectedNetwork.address}
                                                    size={120}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                    errorLevel="H"
                                                    bordered={false}
                                                    style={{ borderRadius: '12px' }}
                                                />
                                            )}
                                        </div>

                                        {/* Scan Instruction */}
                                        <div className="mt-3 text-center">
                                            <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
                                                {fetchingAddress ? 'Generating address...' : 'Scan to deposit'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address & Details Section */}
                            <div className="flex-1 space-y-4 md:space-y-5">
                                {/* Address Block */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
                                            Deposit Address
                                        </p>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-semibold">
                                            {selectedNetwork.name}
                                        </span>
                                    </div>

                                    <div className="relative group/address">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1 min-w-0">
                                                <code className="block text-[10px] sm:text-xs font-mono text-foreground bg-gradient-to-br from-secondary/90 to-secondary/70 backdrop-blur-sm px-3 py-3 rounded-xl break-all border border-border/50 hover:border-yellow-500/50 transition-all duration-300 shadow-sm min-h-[40px] flex items-center">
                                                    {fetchingAddress ? (
                                                        <span className="flex items-center gap-2 text-muted-foreground">
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            Generating...
                                                        </span>
                                                    ) : (
                                                        depositAddress || selectedNetwork.address
                                                    )}
                                                </code>
                                            </div>
                                            <Button
                                                onClick={handleCopyAddress}
                                                variant="ghost"
                                                size="sm"
                                                className={`flex-shrink-0 gap-2 transition-all duration-300 rounded-xl ${copied
                                                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-500 border-green-500/30'
                                                    : 'hover:bg-yellow-500/20 border-yellow-500/30'
                                                    } border`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span className="text-xs font-semibold">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span className="text-xs font-semibold hidden sm:inline">Copy</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div className="relative group/stat overflow-hidden rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-sm border border-border/50 hover:border-yellow-500/40 transition-all duration-300 p-3 md:p-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                                        <div className="relative">
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 font-medium">
                                                <div className="p-1 rounded-md bg-yellow-500/10">
                                                    <TrendingUp className="w-3 h-3 text-yellow-500" />
                                                </div>
                                                <span className="truncate">Minimum Deposit</span>
                                            </p>
                                            <p className="text-sm md:text-base font-bold text-foreground truncate">{selectedNetwork.minDeposit}</p>
                                        </div>
                                    </div>

                                    <div className="relative group/stat overflow-hidden rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-sm border border-border/50 hover:border-blue-500/40 transition-all duration-300 p-3 md:p-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                                        <div className="relative">
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 font-medium">
                                                <div className="p-1 rounded-md bg-blue-500/10">
                                                    <Clock className="w-3 h-3 text-blue-500" />
                                                </div>
                                                <span className="truncate">Expected Arrival</span>
                                            </p>
                                            <p className="text-sm md:text-base font-bold text-foreground truncate">
                                                {selectedNetwork.confirmations} blocks
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Network Info Badge */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/20">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] md:text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                                            Network Fee: {selectedNetwork.fee} • Processing: {selectedNetwork.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Warning */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative p-4 md:p-5 rounded-xl backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/30 shadow-lg">
                    <div className="flex items-start gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-lg bg-yellow-500/20 backdrop-blur-sm flex-shrink-0">
                            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                        </div>
                        <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm flex-1">
                            <p className="font-bold text-yellow-500 flex items-center gap-2">
                                Important Security Notice
                                <Shield className="w-4 h-4" />
                            </p>
                            <ul className="space-y-1 text-yellow-500/90">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">•</span>
                                    <span>Send only <strong>{selectedCrypto.name}</strong> to this deposit address</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">•</span>
                                    <span>Ensure the network is <strong>{selectedNetwork.name}</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">•</span>
                                    <span>Sending any other coin may result in <strong>permanent loss</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
