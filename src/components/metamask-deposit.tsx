"use client"

import { useState, useEffect } from "react"
import {
    Wallet,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Sparkles,
    Loader2,
    ExternalLink,
    Copy,
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Web3 from "web3"
import { notification } from "antd"

interface MetaMaskDepositProps {
    onSuccess?: (txHash: string) => void
    onError?: (error: string) => void
}

export function MetaMaskDeposit({ onSuccess, onError }: MetaMaskDepositProps) {
    const [web3, setWeb3] = useState<Web3 | null>(null)
    const [account, setAccount] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [depositAmount, setDepositAmount] = useState<string>("")
    const [isDepositing, setIsDepositing] = useState(false)
    const [txHash, setTxHash] = useState<string>("")
    const [copied, setCopied] = useState(false)
    const [networkName, setNetworkName] = useState<string>("")
    const [chainId, setChainId] = useState<string>("")

    // Your platform's deposit address (replace with your actual address)
    const DEPOSIT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

    useEffect(() => {
        // Check if MetaMask is installed
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            const web3Instance = new Web3(window.ethereum)
            setWeb3(web3Instance)

            // Check if already connected
            checkConnection(web3Instance)

            // Listen for account changes
            window.ethereum.on("accountsChanged", handleAccountsChanged)
            window.ethereum.on("chainChanged", handleChainChanged)
        }

        return () => {
            if (typeof window !== "undefined" && window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
                window.ethereum.removeListener("chainChanged", handleChainChanged)
            }
        }
    }, [])

    const checkConnection = async (web3Instance: Web3) => {
        try {
            const accounts = await web3Instance.eth.getAccounts()
            if (accounts.length > 0) {
                setAccount(accounts[0])
                setIsConnected(true)
                await updateBalance(web3Instance, accounts[0])
                await updateNetworkInfo(web3Instance)
            }
        } catch (error) {
            console.error("Error checking connection:", error)
        }
    }

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            // User disconnected
            setAccount("")
            setIsConnected(false)
            setBalance("")
        } else if (accounts[0] !== account) {
            setAccount(accounts[0])
            if (web3) {
                updateBalance(web3, accounts[0])
            }
        }
    }

    const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
    }

    const updateBalance = async (web3Instance: Web3, address: string) => {
        try {
            const balanceWei = await web3Instance.eth.getBalance(address)
            const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether")
            setBalance(parseFloat(balanceEth).toFixed(4))
        } catch (error) {
            console.error("Error fetching balance:", error)
        }
    }

    const updateNetworkInfo = async (web3Instance: Web3) => {
        try {
            const chainIdHex = await web3Instance.eth.getChainId()
            const chainIdNum = Number(chainIdHex)
            setChainId(chainIdNum.toString())

            // Map chain ID to network name
            const networkNames: { [key: number]: string } = {
                1: "Ethereum Mainnet",
                5: "Goerli Testnet",
                11155111: "Sepolia Testnet",
                56: "BSC Mainnet",
                97: "BSC Testnet",
                137: "Polygon Mainnet",
                80001: "Mumbai Testnet",
            }

            setNetworkName(networkNames[chainIdNum] || `Chain ID: ${chainIdNum}`)
        } catch (error) {
            console.error("Error fetching network info:", error)
        }
    }

    const connectWallet = async () => {
        if (!web3) {
            notification.error({
                message: 'MetaMask Not Found',
                description: 'Please install MetaMask to continue with the deposit.',
            })
            window.open("https://metamask.io/download/", "_blank")
            return
        }

        setIsConnecting(true)

        try {
            const accounts = await (window.ethereum as any).request({
                method: "eth_requestAccounts",
            })

            setAccount(accounts[0])
            setIsConnected(true)
            await updateBalance(web3, accounts[0])
            await updateNetworkInfo(web3)
        } catch (error: any) {
            console.error("Error connecting wallet:", error)
            if (onError) {
                onError(error.message || "Failed to connect wallet")
            }
        } finally {
            setIsConnecting(false)
        }
    }

    const disconnectWallet = () => {
        setAccount("")
        setIsConnected(false)
        setBalance("")
        setDepositAmount("")
        setTxHash("")
    }

    const handleDeposit = async () => {
        if (!web3 || !account || !depositAmount) return

        const amount = parseFloat(depositAmount)
        if (isNaN(amount) || amount <= 0) {
            if (onError) onError("Please enter a valid amount")
            return
        }

        if (amount > parseFloat(balance)) {
            if (onError) onError("Insufficient balance")
            return
        }

        setIsDepositing(true)

        try {
            const amountWei = web3.utils.toWei(depositAmount, "ether")

            const tx = await web3.eth.sendTransaction({
                from: account,
                to: DEPOSIT_ADDRESS,
                value: amountWei,
            })

            const hash = tx.transactionHash.toString()
            setTxHash(hash)
            notification.success({
                message: 'Deposit Successful',
                description: 'Your deposit has been processed! Transaction hash: ' + hash.substring(0, 10) + '...',
            })

            if (onSuccess) {
                onSuccess(hash)
            }

            // Update balance after deposit
            await updateBalance(web3, account)
            setDepositAmount("")

            // You can also call your backend API here to record the deposit
            await recordDeposit(hash, depositAmount, account)

        } catch (error: any) {
            console.error("Error sending transaction:", error)
            if (onError) {
                onError(error.message || "Transaction failed")
            }
        } finally {
            setIsDepositing(false)
        }
    }

    const recordDeposit = async (txHash: string, amount: string, fromAddress: string) => {
        try {
            // Call your backend API to record the deposit
            const response = await fetch("/api/crypto/deposits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    txHash,
                    amount,
                    fromAddress,
                    method: "metamask",
                    network: networkName,
                    chainId,
                }),
            })

            if (!response.ok) {
                console.error("Failed to record deposit")
            }
        } catch (error) {
            console.error("Error recording deposit:", error)
        }
    }

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address)
        setCopied(true)
        notification.success({
            message: 'Address Copied',
            description: 'The wallet address has been copied to your clipboard.',
        })
        setTimeout(() => setCopied(false), 2000)
    }

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    if (!web3) {
        return (
            <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-border/50 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6 text-center">
                    <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border-2 border-red-500/30">
                        <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                            MetaMask Not Detected
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Please install MetaMask to use this feature
                        </p>
                        <Button
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold"
                            onClick={() => window.open("https://metamask.io/download/", "_blank")}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Install MetaMask
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Connection Card */}
            <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border border-border/50 hover:border-yellow-500/40 transition-all duration-500 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                    {/* MetaMask Icon & Title */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center border-2 border-orange-500/30 shadow-lg">
                            <Wallet className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isConnected
                                    ? "Send crypto instantly from your MetaMask wallet"
                                    : "Connect MetaMask to deposit crypto instantly"}
                            </p>
                        </div>
                    </div>

                    {/* Connection Status */}
                    {!isConnected ? (
                        <Button
                            className="w-full h-14 text-base md:text-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={connectWallet}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-5 h-5 mr-2" />
                                    Connect MetaMask
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            {/* Account Info */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-sm border border-border/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-muted-foreground font-medium">Connected Account</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-semibold">
                                        {networkName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-sm font-mono text-foreground bg-secondary/50 px-3 py-2 rounded-lg">
                                        {formatAddress(account)}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyAddress(account)}
                                        className={`${copied ? 'bg-green-500/20 text-green-500' : ''}`}
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Balance</span>
                                    <span className="text-lg font-bold text-foreground">{balance} ETH</span>
                                </div>
                            </div>

                            {/* Deposit Amount Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                                    Deposit Amount (ETH)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 focus:border-yellow-500/50 focus:outline-none text-foreground font-semibold transition-all"
                                    />
                                    <button
                                        onClick={() => setDepositAmount(balance)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 rounded-lg transition-all"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            {/* Deposit Button */}
                            <Button
                                className="w-full h-12 font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={handleDeposit}
                                disabled={isDepositing || !depositAmount || parseFloat(depositAmount) <= 0}
                            >
                                {isDepositing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Deposit Now
                                    </>
                                )}
                            </Button>

                            {/* Transaction Hash */}
                            {txHash && (
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-green-500 mb-1">Deposit Successful!</p>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono text-green-600 dark:text-green-400 break-all">
                                                    {formatAddress(txHash)}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyAddress(txHash)}
                                                    className="flex-shrink-0"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Disconnect Button */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={disconnectWallet}
                            >
                                Disconnect Wallet
                            </Button>
                        </div>
                    )}

                    {/* Features List */}
                    <div className="grid gap-3 md:gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50">
                            <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Instant Deposit</p>
                                <p className="text-xs text-muted-foreground">Funds credited immediately after confirmation</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50">
                            <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                                <Shield className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Secure & Safe</p>
                                <p className="text-xs text-muted-foreground">Your wallet, your keys, your crypto</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50">
                            <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">No Manual Entry</p>
                                <p className="text-xs text-muted-foreground">No need to copy addresses or scan QR codes</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
                                <strong>Note:</strong> Make sure you have MetaMask installed and are connected to the correct network before proceeding.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
