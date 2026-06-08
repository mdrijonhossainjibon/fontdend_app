"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    Wallet,
    CheckCircle2,
    Shield,
    Sparkles,
    Loader2,
    TrendingUp,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Web3 from 'web3'
import { RootState } from "@/modules/rootReducer"
import { fetchSettingsRequest } from "@/modules/settings/actions"
import * as cryptoActions from "@/modules/crypto/actions"

// ERC20 ABI for token transfers
const ERC20_ABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "success", "type": "bool" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    }
]

interface CustomWalletDepositProps {
    onSuccess?: (txHash: string) => void
    onError?: (error: string) => void
}

interface Network {
    id: string
    name: string
    fee: string
    time: string
    confirmations: number
    minDeposit: string
    address: string
    tokenAddress?: string
    badge?: string
    badgeColor?: string
    isActive: boolean
    chainId?: number
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

// Chain ID mapping
const CHAIN_IDS: Record<string, number> = {
    'ethereum': 1,
    'bsc': 56,
    'polygon': 137,
    'arbitrum': 42161,
    'optimism': 10,
    'avalanche': 43114
}

export function CustomWalletDeposit({ onSuccess, onError }: CustomWalletDepositProps) {
    const dispatch = useDispatch()
    const { data: settings, loading: isLoadingSettings } = useSelector((state: RootState) => state.settings)
    const { configs: cryptoOptions, prices, loading: isLoadingConfigs } = useSelector((state: RootState) => state.crypto)

    const adminWalletAddress = settings.mainWalletAddress || '0x526823aaaAAc6B7448baa0912a53218c25762604';

    const [web3, setWeb3] = useState<Web3 | null>(null)
    const [userAddress, setUserAddress] = useState<string>("")
    const [isConnected, setIsConnected] = useState(false)
    const [currentChainId, setCurrentChainId] = useState<number | null>(null)

    const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
    const [depositAmount, setDepositAmount] = useState<string>("")
    const [isSending, setIsSending] = useState(false)

    const cryptoPrice = selectedCrypto ? prices[selectedCrypto.id] : null

    // Check if MetaMask is installed
    const isMetaMaskInstalled = () => {
        return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined'
    }

    // Connect wallet
    const connectWallet = async () => {
        if (!isMetaMaskInstalled()) {
            toast.error('MetaMask Not Found', { description: 'Please install MetaMask or another Web3 wallet to continue.' })
            return
        }

        try {
            const ethereum = (window as any).ethereum
            const web3Instance = new Web3(ethereum)

            // Request account access
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            const chainId = await ethereum.request({ method: 'eth_chainId' })

            setWeb3(web3Instance)
            setUserAddress(accounts[0])
            setCurrentChainId(parseInt(chainId, 16))
            setIsConnected(true)

            toast.success('Wallet Connected', { description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}` })
        } catch (error: any) {
            console.error('Connection error:', error)
            toast.error('Connection Failed', { description: error.message || 'Failed to connect wallet' })
        }
    }

    // Disconnect wallet
    const disconnectWallet = () => {
        setWeb3(null)
        setUserAddress("")
        setIsConnected(false)
        setCurrentChainId(null)
        toast.info('Wallet Disconnected')
    }

    // Switch network
    const switchNetwork = async (targetChainId: number) => {
        if (!isMetaMaskInstalled()) return

        try {
            const ethereum = (window as any).ethereum
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            })
            setCurrentChainId(targetChainId)
        } catch (error: any) {
            console.error('Network switch error:', error)
            toast.error('Network Switch Failed', { description: error.message || 'Failed to switch network' })
        }
    }

    // Fetch crypto price
    useEffect(() => {
        if (!selectedCrypto) return

        const fetchPrice = () => {
            dispatch(cryptoActions.fetchCryptoPriceRequest(selectedCrypto.id))
        }

        fetchPrice()
        const interval = setInterval(fetchPrice, 60000)
        return () => clearInterval(interval)
    }, [selectedCrypto, dispatch])

    // Fetch configurations
    useEffect(() => {
        if (!isLoadingSettings && (!settings.mainWalletAddress || settings.mainWalletAddress === '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')) {
            dispatch(fetchSettingsRequest())
        }
        if (!isLoadingConfigs && cryptoOptions.length === 0) {
            dispatch(cryptoActions.fetchCryptoConfigRequest())
        }
    }, [dispatch, isLoadingConfigs, cryptoOptions.length, isLoadingSettings, settings.mainWalletAddress])

    // Set default selection when configs load
    useEffect(() => {
        if (cryptoOptions.length > 0 && !selectedCrypto) {
            const defaultCrypto = cryptoOptions[0]
            setSelectedCrypto(defaultCrypto)
            setSelectedNetwork(defaultCrypto.networks[0])
        }
    }, [cryptoOptions, selectedCrypto])

    // Listen for account changes
    useEffect(() => {
        if (!isMetaMaskInstalled()) return

        const ethereum = (window as any).ethereum

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnectWallet()
            } else {
                setUserAddress(accounts[0])
            }
        }

        const handleChainChanged = (chainId: string) => {
            setCurrentChainId(parseInt(chainId, 16))
        }

        ethereum.on('accountsChanged', handleAccountsChanged)
        ethereum.on('chainChanged', handleChainChanged)

        return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged)
            ethereum.removeListener('chainChanged', handleChainChanged)
        }
    }, [])

    // Handle deposit
    const handleDeposit = async () => {
        if (!web3 || !userAddress || !depositAmount || !selectedNetwork || !selectedCrypto) {
            toast.warning('Missing Data', { description: 'Please ensure wallet is connected and amount is selected.' })
            return
        }

        const targetChainId = selectedNetwork.chainId || CHAIN_IDS[selectedNetwork.id] || 1
        const isWrongNetwork = currentChainId !== targetChainId

        // Switch network if needed
        if (isWrongNetwork) {
            toast.info('Switch Network', { description: `Please switch to ${selectedNetwork.name} network.` })
            await switchNetwork(targetChainId)
            return
        }

        setIsSending(true)

        try {
            // Sanitize address to avoid validation errors
            const cleanAdminAddress = web3.utils.toChecksumAddress(adminWalletAddress.trim())
            let txHash: string

            if (selectedNetwork.tokenAddress) {
                // Token transfer (USDT, USDC, etc.)
                const isBsc = currentChainId === 56
                const decimals = isBsc ? 18 : (selectedCrypto.id === 'usdt' || selectedCrypto.id === 'usdc' ? 6 : 18)
                const amount = BigInt(depositAmount) * BigInt(Math.pow(10, decimals))

                const contract = new web3.eth.Contract(ERC20_ABI as any, selectedNetwork.tokenAddress)
                const receipt: any = await contract.methods
                    .transfer(cleanAdminAddress, amount.toString())
                    .send({ from: userAddress })

                txHash = receipt.transactionHash
            } else {
                // Native transfer (ETH, BNB, etc.)
                const sendAmount = cryptoPrice ? (parseFloat(depositAmount) / cryptoPrice).toFixed(8) : "0"
                const amountWei = web3.utils.toWei(sendAmount, 'ether')

                const receipt: any = await web3.eth.sendTransaction({
                    from: userAddress,
                    to: cleanAdminAddress,
                    value: amountWei
                })

                txHash = receipt.transactionHash
            }

            toast.success('Transaction Sent', { description: 'Your deposit is being processed on-chain.' })

            if (onSuccess) onSuccess(txHash)

            // Record deposit via Redux
            dispatch(cryptoActions.recordDepositRequest({
                cryptoId: selectedCrypto.id,
                cryptoName: selectedCrypto.name,
                networkId: selectedNetwork.id,
                networkName: selectedNetwork.name,
                amount: parseFloat(depositAmount) / (cryptoPrice || 1),
                amountUSD: parseFloat(depositAmount),
                txHash,
                address: cleanAdminAddress,
                requiredConfirmations: selectedNetwork.confirmations || 1,
                fee: selectedNetwork.fee || "0",
                method: 'custom_wallet',
                fromAddress: userAddress,
                chainId: currentChainId?.toString() || '',
            }))

            setDepositAmount("")

        } catch (error: any) {
            console.error("Transaction error:", error)
            toast.error('Transaction Failed', { description: error.message || 'Failed to process transaction' })
            if (onError) onError(error.message)
        } finally {
            setIsSending(false)
        }
    }

    if (isLoadingConfigs && cryptoOptions.length === 0) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-cyan-500" /></div>
    }

    const targetChainId = selectedNetwork?.chainId || CHAIN_IDS[selectedNetwork?.id || ''] || 1
    const isWrongNetwork = isConnected && currentChainId !== targetChainId

    return (
        <div className="space-y-6">
            {!isConnected ? (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                            <Wallet className="w-10 h-10 text-cyan-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect Your Wallet</h3>
                            <p className="text-sm text-muted-foreground mt-2">Connect with MetaMask, Trust Wallet, Coinbase Wallet, or any Web3 wallet</p>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <Button
                        onClick={connectWallet}
                        className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 text-base group"
                    >
                        <Wallet className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Connect Wallet
                        <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                    </Button>

                    {/* Security Notice */}
                    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-cyan-500 mb-1">Secure Connection</p>
                                <p className="text-xs text-muted-foreground">
                                    We never store your private keys. Your wallet connection is encrypted and secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Connected Wallet Info */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-500 shadow-lg shadow-cyan-500/10">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-opacity-70">Connected Wallet</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold font-mono tracking-tight text-foreground">
                                            {userAddress.substring(0, 6)}...{userAddress.substring(38)}
                                        </p>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-tight">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Account Active
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={disconnectWallet}
                                    className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 rounded-xl border border-transparent hover:border-red-400/20"
                                >
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </div>


                    {/* Step 1: Select Coin */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">1</div>
                            Select Asset
                        </label>
                        <Select
                            value={selectedCrypto?.id || ""}
                            onValueChange={(value) => {
                                const crypto = cryptoOptions.find((c: any) => c.id === value)
                                if (crypto) {
                                    setSelectedCrypto(crypto)
                                    setSelectedNetwork(crypto.networks[0])
                                }
                            }}
                        >
                            <SelectTrigger className="w-full h-12">
                                <SelectValue placeholder="Select a cryptocurrency" />
                            </SelectTrigger>
                            <SelectContent>
                                {cryptoOptions.map((crypto: any) => (
                                    <SelectItem key={crypto.id} value={crypto.id}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg ${crypto.bg} flex items-center justify-center font-bold ${crypto.color} overflow-hidden`}>
                                                {crypto.id === 'sect' ? (
                                                    'S'
                                                ) : (
                                                    <img
                                                        src={require(`../node_modules/cryptocurrency-icons/svg/color/${crypto.id}.svg`)}
                                                        alt={crypto.name}
                                                        style={{ width: 20 }}
                                                    />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold">{crypto.name}</p>
                                                <p className="text-xs text-muted-foreground">{crypto.fullName}</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2: Select Network */}
                    {selectedCrypto && (
                        <div className="space-y-3">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">2</div>
                                Select Network
                            </label>
                            <Select
                                value={selectedNetwork?.id || ""}
                                onValueChange={(value) => {
                                    const network = selectedCrypto.networks.find((n: any) => n.id === value)
                                    if (network) setSelectedNetwork(network)
                                }}
                            >
                                <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Select a network" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCrypto.networks.map((network: any) => (
                                        <SelectItem key={network.id} value={network.id}>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold">{network.name}</span>
                                                    {network.badge && (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${network.badgeColor} font-semibold`}>
                                                            {network.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{network.fee} • {network.time}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Step 3: Select Amount */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">3</div>
                            Select Amount (USD)
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                            {[1, 4, 9, 14, 22, 30, 34, 48, 76, 93, 100].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setDepositAmount(amt.toString())}
                                    className={`relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1 group overflow-hidden ${depositAmount === amt.toString()
                                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                                        : 'border-border/50 bg-secondary/20 hover:border-cyan-500/30'
                                        }`}
                                >
                                    <span className={`text-xl font-black ${depositAmount === amt.toString() ? 'text-cyan-400' : 'text-foreground'}`}>
                                        ${amt}
                                    </span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Credits</span>
                                    {depositAmount === amt.toString() && (
                                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                                    )}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    const rand = (Math.floor(Math.random() * (500 - 1 + 1)) + 1).toString();
                                    setDepositAmount(rand);
                                }}
                                className={`relative py-4 rounded-2xl border border-dashed transition-all duration-300 flex flex-col items-center gap-1 group ${(!['1', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "")
                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                                    : 'border-border/50 bg-secondary/20 hover:border-cyan-500/30'
                                    }`}
                            >
                                <span className={`text-xl font-black ${(!['1', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "") ? 'text-cyan-400' : 'text-foreground'}`}>
                                    {(!['1', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "") ? `$${depositAmount}` : <Sparkles className="w-5 h-5" />}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                    {(!['1', '4', '9', '14', '22', '30', '34', '48', '76', '93', '100'].includes(depositAmount) && depositAmount !== "") ? 'Random' : 'Surprise'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Price Rate Info */}
                    {depositAmount && selectedCrypto && (
                        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-between text-[10px] font-bold">
                            <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                                <TrendingUp className="w-3 h-3 text-cyan-500" />
                                Exchange Rate
                            </div>
                            <div className="text-right">
                                <p className="text-foreground">1 {selectedCrypto.name} ≈ ${cryptoPrice?.toLocaleString() || '...'}</p>
                                <p className="text-cyan-400">Pay: {(parseFloat(depositAmount) / (cryptoPrice || 1)).toFixed(6)} {selectedCrypto.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Pay Button */}
                    <Button
                        disabled={isSending || (!isWrongNetwork && (!depositAmount || parseFloat(depositAmount) <= 0))}
                        onClick={handleDeposit}
                        className={`w-full h-14 transition-all duration-300 flex items-center justify-center gap-2 group text-lg font-bold rounded-xl shadow-xl ${isWrongNetwork
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20 text-white'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/20 text-white'
                            }`}
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Transaction...
                            </>
                        ) : isWrongNetwork ? (
                            <>
                                <TrendingUp className="w-5 h-5 group-hover:animate-bounce" />
                                Switch to {selectedNetwork?.name}
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 fill-current group-hover:animate-pulse" />
                                Confirm & Pay
                            </>
                        )}
                    </Button>

                </div>
            )}
        </div>
    )
}