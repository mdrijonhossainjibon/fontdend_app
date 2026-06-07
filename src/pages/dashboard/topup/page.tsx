"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import {
  Coins,
  CheckCircle2,
  Copy,
  Clock,
  Shield,
  ChevronDown,
  Search,
  Globe,
  XCircle,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Empty } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import {
  fetchActivePackageRequest,
  createCryptomusInvoiceRequest,
  resetCryptomusStatus,
  startCryptomusPolling,
  stopCryptomusPolling,
} from "@/modules/topup/actions"
import { fetchCryptoConfigRequest } from "@/modules/crypto/actions"
import { CryptoIcon } from "@/components/CryptoIcon"
import { QRCodeSVG } from 'qrcode.react'

function getNetworkCoinId(networkName: string): string {
  const n = (networkName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (n.includes('bsc') || n.includes('bnb') || n.includes('binance')) return 'bnb'
  if (n.includes('erc20') || n.includes('eth') || n === 'ethereum') return 'eth'
  if (n.includes('polygon') || n.includes('matic')) return 'matic'
  if (n.includes('arbitrum')) return 'eth'
  if (n.includes('optimism')) return 'eth'
  if (n.includes('avalanche') || n.includes('avax')) return 'avax'
  if (n.includes('trc20') || n.includes('tron')) return 'trx'
  if (n.includes('solana') || n.includes('sol')) return 'sol'
  if (n.includes('bitcoin') || n === 'btc') return 'btc'
  if (n.includes('litecoin') || n === 'ltc') return 'ltc'
  if (n.includes('doge')) return 'doge'
  return 'btc'
}

const depositAmounts = [2, 5, 10, 25, 50, 100]

export default function DashboardTopupPage() {
  const dispatch = useDispatch()
  const topupState = useSelector((state: RootState) => state.topup)
  const pendingDeposit = topupState.activePackage?.pendingDeposit
  const {
    cryptomusCreating, cryptomusUrl, cryptomusInvoiceId, cryptomusError,
    cryptomusStatus, cryptomusWalletAddress, cryptomusNetwork, cryptomusPaymentAmount,
  } = topupState
  const { configs: cryptoConfigs, loading: configsLoading } = useSelector(
    (state: RootState) => state.crypto
  )

  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [coinSearch, setCoinSearch] = useState('')
  const [networkSearch, setNetworkSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<HTMLDivElement>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expiryTime, setExpiryTime] = useState<number | null>(null)
  const [countdown, setCountdown] = useState('')
  const [pendingCountdown, setPendingCountdown] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Countdown for pending deposit
  useEffect(() => {
    if (!pendingDeposit?.expiresAt) return
    const tick = () => {
      const now = Date.now()
      const end = new Date(pendingDeposit.expiresAt).getTime()
      const diff = end - now
      if (diff <= 0) {
        setPendingCountdown('Expired')
        dispatch(fetchActivePackageRequest())
        return
      }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setPendingCountdown(`${m}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [pendingDeposit?.expiresAt, dispatch])

  useEffect(() => {
    dispatch(fetchCryptoConfigRequest())
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(stopCryptomusPolling())
      dispatch(resetCryptomusStatus())
    }
  }, [dispatch])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (networkRef.current && !networkRef.current.contains(e.target as Node)) {
        setNetworkOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (cryptomusInvoiceId) {
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      setExpiryTime(expiry)
      dispatch(startCryptomusPolling(cryptomusInvoiceId))
    }
  }, [cryptomusInvoiceId, dispatch])

  useEffect(() => {
    if (!expiryTime) return
    const tick = () => {
      const remaining = Math.max(0, expiryTime - Date.now())
      if (remaining <= 0) {
        setCountdown('Expired')
        return
      }
      const h = Math.floor(remaining / 3600000)
      const m = Math.floor((remaining % 3600000) / 60000)
      const s = Math.floor((remaining % 60000) / 1000)
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiryTime])

  const activeConfigs = cryptoConfigs.filter((c: any) => c.isActive)
  const selectedCoinConfig = activeConfigs.find((c: any) => c.id === selectedCoin)
  const activeNetworks = selectedCoinConfig?.networks || []

  useEffect(() => {
    if (!selectedCoin && activeConfigs.length > 0) {
      const first = activeConfigs[0]
      setSelectedCoin(first.id)
      const nets = first.networks || []
      if (nets.length > 0) setSelectedNetwork(nets[0].id)
    }
  }, [activeConfigs, selectedCoin])

  const getEffectiveAmount = () => {
    if (customAmount) return parseFloat(customAmount)
    return selectedAmount ?? 0
  }

  const handleDeposit = () => {
    const amount = getEffectiveAmount()
    if (amount <= 0) return
    const needsNetwork = activeNetworks.length > 0 && !selectedNetwork
    if (needsNetwork) return
    dispatch(createCryptomusInvoiceRequest({ amount, currency: selectedCoinConfig?.name, network: selectedNetwork }))
  }

  const canDeposit = () => {
    if (getEffectiveAmount() <= 0) return false
    if (activeNetworks.length > 0 && !selectedNetwork) return false
    return true
  }

  const handleCopyAddress = () => {
    const text = cryptomusWalletAddress || cryptomusUrl
    if (text) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Awaiting Payment', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    paid: { label: 'Payment Completed', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    expired: { label: 'Expired', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  }

  const currentStatus = cryptomusStatus ? statusConfig[cryptomusStatus] : null

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      {/* Header */}
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <h1 className="text-xl font-semibold tracking-tight">Top Up</h1>
        <p className="text-sm text-muted-foreground mt-1">Deposit funds using cryptocurrency</p>
      </div>

      {/* Pending Deposit View */}
      {pendingDeposit && pendingCountdown !== 'Expired' ? (
        <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <div className="max-w-xl mx-auto space-y-4">
            <div className="rounded-xl bg-card border border-amber-500/20 p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold">Awaiting Payment</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete your deposit to receive credits</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold tabular-nums">${pendingDeposit.amountUSD.toFixed(2)}</div>
                  {pendingCountdown && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-medium mt-0.5 justify-end">
                      <Clock className="w-3 h-3" />
                      <span className="tabular-nums font-mono">{pendingCountdown}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border overflow-hidden">
              {pendingDeposit.address && (
                <div className="flex justify-center py-4 px-4 bg-secondary/20">
                  <div className="p-3 bg-white rounded-lg">
                    <QRCodeSVG value={pendingDeposit.address} size={160} level="M" />
                  </div>
                </div>
              )}
              <div className="px-4 py-3 flex items-center justify-center gap-3 border-t border-border bg-muted/20">
                {pendingDeposit.cryptoName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border">
                    <CryptoIcon coinId={pendingDeposit.cryptoName.toLowerCase()} className="w-5 h-5" name={pendingDeposit.cryptoName} />
                    <span className="text-xs font-semibold">{pendingDeposit.cryptoName.toUpperCase()}</span>
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                {pendingDeposit.networkName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border">
                    <CryptoIcon coinId={getNetworkCoinId(pendingDeposit.networkName)} className="w-5 h-5" name={pendingDeposit.networkName} />
                    <span className="text-xs font-semibold">{pendingDeposit.networkName.toUpperCase()}</span>
                  </div>
                )}
              </div>
              {pendingDeposit.address && (
                <div className="p-4 border-t border-border">
                  <p className="text-[11px] text-muted-foreground mb-2 text-center uppercase tracking-wider">Send to this address</p>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                    <code className="flex-1 text-xs font-mono break-all text-foreground/80 select-all leading-relaxed">
                      {pendingDeposit.address}
                    </code>
                    <Button
                      variant={copied ? "default" : "outline"}
                      size="sm"
                      onClick={() => { navigator.clipboard.writeText(pendingDeposit.address); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                      className="h-8 rounded-lg gap-1.5 shrink-0 text-xs"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground text-center px-2">
              Send <span className="font-semibold text-foreground">${pendingDeposit.amountUSD.toFixed(2)}</span> in {pendingDeposit.cryptoName} via {pendingDeposit.networkName} network. Payment detected automatically.
            </p>
          </div>
        </div>
      ) : cryptomusInvoiceId ? (
        /* Invoice Created View */
        <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <div className="max-w-xl mx-auto space-y-5">
            <div className={cn("rounded-xl bg-card border p-5 text-center", currentStatus?.border || "border-amber-500/20")}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                {cryptomusStatus === 'paid' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                ) : cryptomusStatus === 'expired' || cryptomusStatus === 'failed' ? (
                  <XCircle className="w-8 h-8 text-red-400" />
                ) : (
                  <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{currentStatus?.label || 'Awaiting Payment'}</h3>
              <p className="text-sm text-muted-foreground mb-1">Invoice #{cryptomusInvoiceId?.slice(0, 12)}...</p>
              {cryptomusPaymentAmount && (
                <p className="text-sm text-muted-foreground mb-4">
                  Amount: <span className="font-semibold text-foreground">${cryptomusPaymentAmount.toFixed(2)}</span>
                </p>
              )}
              {countdown && cryptomusStatus !== 'paid' && cryptomusStatus !== 'expired' && cryptomusStatus !== 'failed' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-xs font-mono">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Expires in {countdown}</span>
                </div>
              )}
              {cryptomusStatus === 'paid' && (
                <p className="text-sm text-green-400 mt-3">Funds have been credited to your balance!</p>
              )}
            </div>

            {cryptomusStatus !== 'paid' && cryptomusStatus !== 'expired' && cryptomusStatus !== 'failed' && (
              <div className="rounded-xl bg-card border border-border p-4 space-y-4">
                {(cryptomusWalletAddress || cryptomusUrl) && (
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg">
                      <QRCodeSVG value={cryptomusWalletAddress || cryptomusUrl || ''} size={180} level="M" />
                    </div>
                  </div>
                )}
                {cryptomusNetwork && (
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {cryptomusNetwork.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    {cryptomusWalletAddress ? 'Send to this address' : 'Scan QR to pay'}
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                    <code className="flex-1 text-xs font-mono break-all text-foreground">
                      {cryptomusWalletAddress || cryptomusUrl}
                    </code>
                    <Button variant="outline" size="sm" onClick={handleCopyAddress} className="h-8 rounded-lg gap-1.5 shrink-0">
                      {copied ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {cryptomusPaymentAmount != null && (
                    <>Send exactly <span className="font-semibold text-foreground">${cryptomusPaymentAmount.toFixed(2)}</span>{cryptomusWalletAddress ? ' to the address above. ' : '. '}</>
                  )}
                  Your payment will be detected automatically.
                </p>
              </div>
            )}

            {cryptomusStatus !== 'paid' && (
              <Button
                variant="ghost"
                onClick={() => { dispatch(stopCryptomusPolling()); dispatch(resetCryptomusStatus()) }}
                className="h-10 rounded-xl text-sm w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Make a different deposit
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Main Deposit Form */
        <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Coin Selection */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="font-semibold text-sm mb-1">Select Cryptocurrency</h3>
                <p className="text-xs text-muted-foreground mb-3">Choose a coin to deposit with CryptoMus</p>
                {configsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : activeConfigs.length === 0 ? (
                  <Empty description="No cryptocurrencies available" />
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => { setDropdownOpen(!dropdownOpen); setCoinSearch('') }}
                      className="w-full flex items-center gap-3 h-11 px-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
                    >
                      {selectedCoin ? (
                        (() => {
                          const coin = activeConfigs.find((c: any) => c.id === selectedCoin)
                          if (!coin) return <span className="text-muted-foreground">Select coin</span>
                          return (
                            <>
                              <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
                                <CryptoIcon coinId={coin.id} className="w-5 h-5" name={coin.name} />
                              </div>
                              <span className="flex-1 min-w-0 text-sm font-semibold truncate">{coin.name}</span>
                            </>
                          )
                        })()
                      ) : (
                        <>
                          <Coins className="w-5 h-5 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">Select coin</span>
                        </>
                      )}
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground ml-auto transition-transform", dropdownOpen && "rotate-180")} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
                        <div className="relative p-3 border-b border-border">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="text" value={coinSearch} onChange={(e) => setCoinSearch(e.target.value)} placeholder="Search coins..." autoFocus
                            className="w-full h-9 pl-9 pr-4 rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none text-sm" />
                        </div>
                        <div className="max-h-72 overflow-y-auto p-2">
                          {(() => {
                            const filtered = activeConfigs.filter((c: any) => {
                              if (!coinSearch.trim()) return true
                              const q = coinSearch.toLowerCase()
                              return c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
                            })
                            if (filtered.length === 0) return <div className="text-center py-6 text-muted-foreground text-sm">No coins match "{coinSearch}"</div>
                            return filtered.map((coin: any) => {
                              const nets = coin.networks || []
                              return (
                                <button key={coin.id} onClick={() => { setSelectedCoin(coin.id); setDropdownOpen(false); setCoinSearch(''); const nets = (coin.networks || []); setSelectedNetwork(nets.length > 0 ? nets[0].id : null) }}
                                  className={cn("w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/30 text-left", selectedCoin === coin.id && "bg-secondary/30")}>
                                  <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
                                    <CryptoIcon coinId={coin.id} className="w-5 h-5" name={coin.name} />
                                  </div>
                                  <div className="flex-1 min-w-0 flex items-center gap-2">
                                    <span className="text-sm font-semibold truncate">{coin.name}</span>
                                    {nets.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{nets.length} net{nets.length > 1 ? 's' : ''}</span>}
                                  </div>
                                  {selectedCoin === coin.id && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                              )
                            })
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Network Selection */}
              {selectedCoin && activeNetworks.length > 0 ? (
                <div className="rounded-xl bg-card border border-border p-4">
                  <h3 className="font-semibold text-sm mb-1">Select Network</h3>
                  <p className="text-xs text-muted-foreground mb-3">Choose a network for your deposit</p>
                  <div className="relative" ref={networkRef}>
                    <button type="button" onClick={() => { setNetworkOpen(!networkOpen); setNetworkSearch('') }}
                      className="w-full flex items-center gap-3 h-11 px-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left">
                      {selectedNetwork ? (
                        (() => {
                          const net = activeNetworks.find((n: any) => n.id === selectedNetwork)
                          if (!net) return <span className="text-muted-foreground">Select network</span>
                          return (
                            <>
                              <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
                                <CryptoIcon coinId={getNetworkCoinId(net.name)} className="w-5 h-5" name={net.name} />
                              </div>
                              <span className="flex-1 min-w-0 text-sm font-semibold truncate">{net.name}</span>
                            </>
                          )
                        })()
                      ) : (
                        <><Globe className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground text-sm">Select network</span></>
                      )}
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground ml-auto transition-transform", networkOpen && "rotate-180")} />
                    </button>
                    {networkOpen && (
                      <div className="absolute z-50 mt-2 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
                        <div className="relative p-3 border-b border-border">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="text" value={networkSearch} onChange={(e) => setNetworkSearch(e.target.value)} placeholder="Search networks..." autoFocus
                            className="w-full h-9 pl-9 pr-4 rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none text-sm" />
                        </div>
                        <div className="max-h-72 overflow-y-auto p-2">
                          {(() => {
                            const filtered = activeNetworks.filter((n: any) => {
                              if (!networkSearch.trim()) return true
                              const q = networkSearch.toLowerCase()
                              return n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
                            })
                            if (filtered.length === 0) return <div className="text-center py-6 text-muted-foreground text-sm">No networks match "{networkSearch}"</div>
                            return filtered.map((net: any) => (
                              <button key={net.id} onClick={() => { setSelectedNetwork(net.id); setNetworkOpen(false); setNetworkSearch('') }}
                                className={cn("w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/30 text-left", selectedNetwork === net.id && "bg-secondary/30")}>
                                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
                                  <CryptoIcon coinId={getNetworkCoinId(net.name)} className="w-5 h-5" name={net.name} />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                  <span className="text-sm font-semibold truncate">{net.name}</span>
                                  {net.badge && <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-blue-500/10 text-blue-500 shrink-0">{net.badge}</span>}
                                </div>
                                {selectedNetwork === net.id && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                              </button>
                            ))
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedCoin ? (
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
                  <p className="text-sm text-amber-400 flex items-center gap-2"><Shield className="w-4 h-4" />No networks configured for {selectedCoinConfig?.name}. Contact support.</p>
                </div>
              ) : null}

              {/* Amount Selection */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="font-semibold text-sm mb-1">Amount</h3>
                <p className="text-xs text-muted-foreground mb-4">Enter the amount you want to deposit</p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {depositAmounts.map((amount) => (
                    <button key={amount} onClick={() => { setSelectedAmount(amount); setCustomAmount(String(amount)) }}
                      className={cn("h-12 rounded-lg border text-sm font-semibold transition-all",
                        selectedAmount === amount && customAmount === String(amount)
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-foreground hover:border-primary/40 active:bg-secondary/30")}>
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-muted-foreground">$</span>
                  <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                    placeholder="Enter amount" min="1" step="0.01"
                    className="w-full h-12 pl-9 pr-4 rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none text-base font-semibold" />
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">You will deposit</span>
                  <span className="text-xl font-bold">${getEffectiveAmount().toFixed(2)}</span>
                </div>
                <Button onClick={handleDeposit} disabled={cryptomusCreating || !canDeposit()}
                  className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {cryptomusCreating ? (
                    <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />Creating Invoice...</>
                  ) : (
                    <><Globe className="w-4 h-4 mr-2" />Deposit ${getEffectiveAmount().toFixed(2)}<ArrowUpRight className="w-3.5 h-3.5 ml-1" /></>
                  )}
                </Button>
                {cryptomusError && (
                  <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 shrink-0" /><span>{cryptomusError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-4">
                <h4 className="font-semibold text-sm mb-3">Available Coins</h4>
                <div className="space-y-1">
                  {configsLoading ? (
                    <div className="flex items-center justify-center py-4"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                  ) : activeConfigs.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">No coins available</p>
                  ) : (
                    activeConfigs.map((coin: any) => (
                      <button key={coin.id} onClick={() => { setSelectedCoin(coin.id); const nets = coin.networks || []; setSelectedNetwork(nets.length > 0 ? nets[0].id : null) }}
                        className={cn("w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-colors hover:bg-secondary/20", selectedCoin === coin.id && "bg-secondary/30")}>
                        <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden">
                          <CryptoIcon coinId={coin.id} className="w-5 h-5" name={coin.name} />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium">{coin.name}</span>
                          <span className="text-[10px] text-muted-foreground block">{coin.fullName}</span>
                        </div>
                        {selectedCoin === coin.id && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-card border border-border p-4">
                <h4 className="font-semibold text-sm mb-3">Why Deposit?</h4>
                <div className="space-y-2.5">
                  {['Supports multiple cryptocurrencies', 'Secure Cryptomus payment gateway', 'Automatic credit to your balance', '24/7 support available'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-card border border-border p-4">
                <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-3">If you experience any issues with your deposit, contact our support team.</p>
                <Link to="/contact" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  Contact Support <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
