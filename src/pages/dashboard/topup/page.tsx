"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Coins,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Clock,
  Shield,
  Sparkles,
  Gift,
  Zap,
  CreditCard,
  TrendingUp,
  History,
  ArrowDown,
  ArrowUp,
  Landmark,
  ArrowLeft,
  XCircle,
  Search,
  ChevronDown,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import {
  fetchActivePackageRequest,
  buyCreditsRequest,
  redeemCodeRequest,
  clearRedeemResult,
  fetchHistoryRequest,
  createCryptomusInvoiceRequest,
  resetCryptomusStatus,
  startCryptomusPolling,
  stopCryptomusPolling,
} from "@/modules/topup/actions"
import { fetchCryptoConfigRequest } from "@/modules/crypto/actions"
import { CryptoIcon } from "@/components/CryptoIcon"
import { QRCodeSVG } from 'qrcode.react'

// ─── helpers ───
function getNetworkCoinId(networkName: string): string {
  const n = (networkName || '').toLowerCase()
  if (n.includes('bsc') || n.includes('bnb') || n.includes('binance')) return 'bnb'
  if (n.includes('eth') || n === 'ethereum') return 'eth'
  if (n.includes('polygon') || n.includes('matic')) return 'matic'
  if (n.includes('arbitrum')) return 'eth'
  if (n.includes('optimism')) return 'eth'
  if (n.includes('avalanche') || n.includes('avax')) return 'avax'
  if (n.includes('tron') || n.includes('trc20')) return 'trx'
  if (n.includes('solana') || n.includes('sol')) return 'sol'
  if (n.includes('bitcoin') || n === 'btc') return 'btc'
  if (n.includes('litecoin') || n === 'ltc') return 'ltc'
  if (n.includes('doge')) return 'doge'
  return 'btc'
}

// ─── Credit Packages ───
const creditPackages = [
  { credits: 1000, price: 4.99, popular: false, bonus: 0 },
  { credits: 5000, price: 19.99, popular: true, bonus: 500 },
  { credits: 10000, price: 34.99, popular: false, bonus: 1500 },
  { credits: 50000, price: 149.99, popular: false, bonus: 10000 },
]

const tabs = [
  { id: "crypto", label: "Deposit", icon: Landmark },
  { id: "credits", label: "Buy Credits", icon: CreditCard },
  { id: "history", label: "History", icon: History },
]

// ─── Buy Credits Tab ───
function BuyCreditsTab() {
  const dispatch = useDispatch()
  const { activePackage, loading, error, buying, redeeming, redeemResult } = useSelector(
    (state: RootState) => state.topup
  )

  const [selectedPackage, setSelectedPackage] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text })
    setTimeout(() => setToastMsg(null), 4000)
  }

  const handleBuy = () => {
    if (activePackage?.pendingDeposit) {
      showToast('error', 'Please complete or wait for your pending deposit to expire.')
      return
    }
    const pkg = creditPackages[selectedPackage]
    dispatch(buyCreditsRequest({ credits: pkg.credits + pkg.bonus, price: pkg.price }))
  }

  const handleRedeem = () => {
    if (activePackage?.pendingDeposit) {
      showToast('error', 'Please complete or wait for your pending deposit to expire.')
      return
    }
    if (!redeemCode.trim()) return
    dispatch(redeemCodeRequest({ code: redeemCode.trim() }))
    setRedeemCode('')
  }

  const pkg = creditPackages[selectedPackage]

  return (
    <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      {/* Toast */}
      {toastMsg && (
        <div className={cn(
          "fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-top-2 transition-all",
          toastMsg.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
        )}>
          <div className="flex items-center gap-2">
            {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {toastMsg.text}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error && !activePackage ? (
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center">
          {error}
        </div>
      ) : (
        <>
          {/* Active Package Info */}
          {activePackage?.pendingDeposit ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Deposit</p>
                    <p className="text-lg font-bold">{activePackage.pendingDeposit.amountUSD} USD</p>
                    <p className="text-xs text-muted-foreground">
                      {activePackage.pendingDeposit.cryptoName} ({activePackage.pendingDeposit.networkName})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Expires</p>
                  <p className="text-lg font-bold text-yellow-500">
                    {new Date(activePackage.pendingDeposit.expiresAt).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Please complete the deposit</p>
                </div>
              </div>
            </div>
          ) : activePackage?.activePackage ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Coins className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Package</p>
                    <p className="text-lg font-bold">{activePackage.activePackage.code} — {activePackage.activePackage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activePackage.activePackage.creditsUsed.toLocaleString()} used / {activePackage.activePackage.credits.toLocaleString()} total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold text-green-500">${activePackage.balance.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Available to spend</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (activePackage.activePackage.creditsUsed / activePackage.activePackage.credits) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
              <p className="text-destructive font-medium">No active package found.</p>
              <p className="text-sm text-destructive/70 mt-1">Please subscribe to a plan first from the Pricing page.</p>
            </div>
          )}

          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {creditPackages.map((pkgItem, index) => (
              <button
                key={index}
                onClick={() => setSelectedPackage(index)}
                className={cn(
                  "relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group",
                  selectedPackage === index
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                )}
              >
                {pkgItem.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    BEST VALUE
                  </div>
                )}
                <div className="relative z-10">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", selectedPackage === index ? "bg-primary/20" : "bg-secondary/50")}>
                    <Zap className={cn("w-6 h-6", selectedPackage === index ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <p className="text-2xl font-bold mb-1">{pkgItem.credits.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mb-3">Credits</p>
                  {pkgItem.bonus > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 rounded-lg px-2 py-1 w-fit mb-3">
                      <Gift className="w-3 h-3" />
                      <span className="font-semibold">+{pkgItem.bonus.toLocaleString()} free</span>
                    </div>
                  )}
                  <div className="h-px bg-border my-3" />
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">${pkgItem.price}</span>
                    {selectedPackage === index && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Buy Button */}
          {activePackage?.activePackage && (
            <div className="flex flex-col items-center gap-3 mb-8">
              <Button
                onClick={handleBuy}
                disabled={buying || activePackage.balance < pkg.price || !!activePackage?.pendingDeposit}
                className="h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base font-semibold w-full md:w-auto"
              >
                {buying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {buying ? 'Processing...' : pkg.price > 0 ? `Buy $${pkg.price} — Extend Current Package` : 'Extend Package'}
                {!buying && <Sparkles className="w-4 h-4" />}
              </Button>
              {activePackage.balance < pkg.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Insufficient balance. Please deposit funds first.
                </p>
              )}
              {activePackage.balance > 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  Balance: ${activePackage.balance.toFixed(2)} • Credits added instantly to your package
                </p>
              )}
            </div>
          )}

          {/* Redeem Code Section */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Have a Redeem Code?</h3>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="Enter your code..."
                className="flex-1 h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                disabled={!activePackage?.activePackage || !!activePackage?.pendingDeposit}
              />
              <Button
                onClick={handleRedeem}
                disabled={redeeming || !redeemCode.trim() || !activePackage?.activePackage}
                className="h-12 px-6 rounded-xl gap-2"
              >
                {redeeming ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gift className="w-4 h-4" />
                )}
                {redeeming ? 'Redeeming...' : 'Redeem'}
              </Button>
            </div>
            {!activePackage?.activePackage && (
              <p className="text-xs text-destructive mt-2">Subscribe to a plan first to redeem codes.</p>
            )}
          </div>

          {/* 🎉 Congratulations Overlay */}
          {redeemResult && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => dispatch(clearRedeemResult())}>
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              {/* Confetti particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-float-up"
                    style={{
                      left: `${5 + Math.random() * 90}%`,
                      top: `100%`,
                      width: `${6 + Math.random() * 8}px`,
                      height: `${6 + Math.random() * 8}px`,
                      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                      background: ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f8', '#ef4444'][Math.floor(Math.random() * 8)],
                      animationDuration: `${2 + Math.random() * 3}s`,
                      animationDelay: `${Math.random() * 0.8}s`,
                      opacity: 0.9,
                    }}
                  />
                ))}
              </div>
              {/* Card */}
              <div
                className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-1">Congratulations!</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Redeem code <span className="font-mono font-bold text-primary">{redeemResult.code}</span>
                </p>
                <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-xl p-6 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Free Credits Added</p>
                  <p className="text-4xl font-extrabold text-primary">+{redeemResult.creditsAdded.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-3 mb-6">
                  <span>Total Credits</span>
                  <span className="font-bold text-foreground">{redeemResult.totalCredits.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => dispatch(clearRedeemResult())}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Awesome!
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── History Tab ───
function HistoryTab() {
  const dispatch = useDispatch()
  const { history, historyLoading: loading } = useSelector(
    (state: RootState) => state.topup
  )

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    dispatch(fetchHistoryRequest())
  }, [dispatch])

  const getTypeLabel = (tx: any) => {
    if (tx.type === "purchase") return "Credit Purchase"
    if (tx.type === "deposit") return "Crypto Deposit"
    if (tx.type === "redeem") return "Promo Redeem"
    if (tx.type === "usage") return "API Usage"
    return tx.type
  }

  const getTypeIcon = (type: string) => {
    if (type === "purchase") return { icon: Coins, bg: "bg-primary/10", color: "text-primary" }
    if (type === "deposit") return { icon: TrendingUp, bg: "bg-green-500/10", color: "text-green-500" }
    if (type === "redeem") return { icon: Gift, bg: "bg-purple-500/10", color: "text-purple-500" }
    return { icon: ArrowUp, bg: "bg-orange-500/10", color: "text-orange-500" }
  }

  // Parse deposit label like "BNB (BSC) Top-up" → { crypto: "BNB", coinId: "bnb", network: "BSC" }
  const parseDepositLabel = (label: string) => {
    if (!label) return null
    const m = label.match(/^([^\s(]+)\s*(?:\(([^)]+)\))?\s*(.*)$/)
    if (!m) return null
    const crypto = m[1]
    const network = m[2] || ''
    const coinId = crypto.toLowerCase()
    return { crypto, network, coinId }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending:   { label: 'Pending',   cls: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
      confirming:{ label: 'Confirming',cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      completed: { label: 'Completed', cls: 'bg-green-500/10 text-green-600 border-green-500/20' },
      failed:    { label: 'Failed',    cls: 'bg-red-500/10 text-red-600 border-red-500/20' },
      expired:   { label: 'Expired',   cls: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
      rejected:  { label: 'Rejected',  cls: 'bg-red-500/10 text-red-600 border-red-500/20' },
      approved:  { label: 'Approved',  cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    }
    const s = map[status] || { label: status, cls: 'bg-muted text-muted-foreground border-border' }
    return <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", s.cls)}>{s.label}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = history?.stats
  const transactions = history?.transactions || []

  return (
    <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Spent", value: stats ? `$${stats.totalSpent.toFixed(2)}` : "$0", icon: TrendingUp, color: "text-green-500" },
          { label: "Total Credits", value: stats ? stats.totalCreditsAdded.toLocaleString() : "0", icon: Coins, color: "text-primary" },
          { label: "This Month", value: stats ? `$${stats.thisMonthSpent.toFixed(2)}` : "$0", icon: Wallet, color: "text-blue-500" },
          { label: "Transactions", value: stats ? stats.transactionCount.toLocaleString() : "0", icon: History, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Claimed Codes Summary */}
      {stats && stats.redeemCount > 0 && (
        <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Gift className="w-5 h-5 text-purple-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-500">
              {stats.redeemCount} promo code{stats.redeemCount > 1 ? 's' : ''} claimed
            </p>
            <p className="text-xs text-muted-foreground">Credits added from promo codes</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Transaction History</h3>
          {stats && (
            <span className="text-xs text-muted-foreground">
              {stats.totalCreditsUsed.toLocaleString()} credits used
            </span>
          )}
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((tx: any, index: number) => {
              const typeIcon = getTypeIcon(tx.type)
              const isPositive = tx.credits > 0
              const Icon = typeIcon.icon
              const depositInfo = tx.type === 'deposit' ? parseDepositLabel(tx.label) : null
              const isPending = tx.status === 'pending' || tx.status === 'confirming'
              const isDepositTx = tx.type === 'deposit'

              return (
                <div
                  key={tx.id}
                  className={cn("flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors", isVisible ? "opacity-100" : "opacity-0")}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative", typeIcon.bg)}>
                    {(depositInfo && depositInfo.crypto) ? (
                      <CryptoIcon coinId={depositInfo.coinId} className="w-5 h-5" name={depositInfo.crypto} />
                    ) : (
                      <Icon className={cn("w-5 h-5", typeIcon.color)} />
                    )}
                    {isPending && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-card animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-medium truncate">{getTypeLabel(tx)}</p>
                        {depositInfo && depositInfo.network && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0 hidden sm:inline">
                            {depositInfo.network}
                          </span>
                        )}
                        {tx.status && statusBadge(tx.status)}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isPositive ? <ArrowDown className="w-3.5 h-3.5 text-green-500" /> : <ArrowUp className="w-3.5 h-3.5 text-red-500" />}
                        <p className={cn("text-sm font-bold", isPositive ? "text-green-500" : "text-foreground")}>
                          {isPositive ? "+" : ""}{tx.credits.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          {depositInfo && depositInfo.crypto ? depositInfo.crypto : (tx.label || '')}
                          {tx.amount && ` · $${tx.amount}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isDepositTx && tx.invoiceId && (tx.status === 'pending' || tx.status === 'confirming') && (
                          <Button
                            size="sm"
                            className="h-7 text-xs rounded-lg gap-1 bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() => window.open(`/topup?invoice=${tx.invoiceId}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Pay Now
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground">{tx.date} {tx.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Cryptomus Deposit Tab (Binance-style) ───
const depositAmounts = [2, 5, 10, 25, 50, 100]

function CryptomusDepositTab() {
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
        // Trigger backend to mark deposit as failed in DB
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

  // Fetch crypto configs on mount
  useEffect(() => {
    dispatch(fetchCryptoConfigRequest())
  }, [dispatch])

  // Reset status when navigating away
  useEffect(() => {
    return () => {
      dispatch(stopCryptomusPolling())
      dispatch(resetCryptomusStatus())
    }
  }, [dispatch])

  // Close dropdowns on outside click
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

  // Start polling when invoice is created
  useEffect(() => {
    if (cryptomusInvoiceId) {
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      setExpiryTime(expiry)
      dispatch(startCryptomusPolling(cryptomusInvoiceId))
    }
  }, [cryptomusInvoiceId, dispatch])

  // Expiry countdown
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
  const activeNetworks = (selectedCoinConfig?.networks || []).filter((n: any) => n.isActive)

  // Auto-select first coin + first network on load
  useEffect(() => {
    if (!selectedCoin && activeConfigs.length > 0) {
      const first = activeConfigs[0]
      setSelectedCoin(first.id)
      const nets = (first.networks || []).filter((n: any) => n.isActive)
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

  if (pendingDeposit && pendingCountdown !== 'Expired') {
    const networkCoin = getNetworkCoinId(pendingDeposit.networkName || '')

    return (
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="max-w-xl mx-auto space-y-4">
          {/* ── Status Header ── */}
          <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.04] to-transparent p-5 overflow-hidden">
            <div className="absolute -top-8 right-4 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold">Awaiting Payment</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete your deposit to receive credits
                </p>
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

          {/* ── QR + Network Info ── */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            {/* QR */}
            {pendingDeposit.address && (
              <div className="flex justify-center py-6 px-4 bg-muted/30">
                <div className="p-3 bg-white rounded-2xl shadow-lg ring-1 ring-black/10">
                  <QRCodeSVG value={pendingDeposit.address} size={160} level="M" />
                </div>
              </div>
            )}

            {/* Network + Coin Badges */}
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
                  <CryptoIcon coinId={networkCoin} className="w-5 h-5" name={pendingDeposit.networkName} />
                  <span className="text-xs font-semibold">{pendingDeposit.networkName.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Address */}
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
    )
  }

  // Invoice created view — inline payment with QR code
  if (cryptomusInvoiceId) {
    return (
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="max-w-xl mx-auto space-y-5">
          {/* Status Banner */}
          <div className={cn("rounded-2xl border p-6 text-center", currentStatus?.bg || "bg-amber-500/10 border-amber-500/20")}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              {cryptomusStatus === 'paid' ? (
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              ) : cryptomusStatus === 'expired' || cryptomusStatus === 'failed' ? (
                <XCircle className="w-8 h-8 text-red-400" />
              ) : (
                <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
              )}
            </div>
            <h3 className="text-xl font-bold mb-1">
              {currentStatus?.label || 'Awaiting Payment'}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              Invoice #{cryptomusInvoiceId?.slice(0, 12)}...
            </p>
            {cryptomusPaymentAmount && (
              <p className="text-sm text-muted-foreground mb-4">
                Amount: <span className="font-semibold text-foreground">${cryptomusPaymentAmount.toFixed(2)}</span>
              </p>
            )}

            {/* Countdown */}
            {countdown && cryptomusStatus !== 'paid' && cryptomusStatus !== 'expired' && cryptomusStatus !== 'failed' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-sm font-mono">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Expires in {countdown}</span>
              </div>
            )}

            {cryptomusStatus === 'paid' && (
              <p className="text-sm text-green-400 mt-3">Funds have been credited to your balance!</p>
            )}
          </div>

          {/* QR Code + Payment Info — show while pending */}
          {cryptomusStatus !== 'paid' && cryptomusStatus !== 'expired' && cryptomusStatus !== 'failed' && (
            <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
              {/* QR Code — wallet address if available, otherwise payment URL */}
              {(cryptomusWalletAddress || cryptomusUrl) && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-2xl">
                    <QRCodeSVG
                      value={cryptomusWalletAddress || cryptomusUrl || ''}
                      size={180}
                      level="M"
                    />
                  </div>
                </div>
              )}

              {/* Network Badge */}
              {cryptomusNetwork && (
                <div className="flex justify-center">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {cryptomusNetwork.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Address / Link */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  {cryptomusWalletAddress ? 'Send to this address' : 'Scan QR to pay'}
                </p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                  <code className="flex-1 text-xs font-mono break-all text-foreground">
                    {cryptomusWalletAddress || cryptomusUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-8 rounded-lg gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
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

          {/* Back button — only show if not paid */}
          {cryptomusStatus !== 'paid' && (
            <Button
              variant="ghost"
              onClick={() => {
                dispatch(stopCryptomusPolling())
                dispatch(resetCryptomusStatus())
              }}
              className="h-10 rounded-xl text-sm w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Make a different deposit
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Deposit Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coin Selection — Binance-style Dropdown */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="font-semibold text-lg mb-1">Select Cryptocurrency</h3>
            <p className="text-sm text-muted-foreground mb-4">Choose a coin to deposit with CryptoMus</p>

            {configsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => { setDropdownOpen(!dropdownOpen); setCoinSearch('') }}
                  className="w-full flex items-center gap-3 h-14 px-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors text-left"
                >
                  {selectedCoin ? (
                    (() => {
                      const coin = activeConfigs.find((c: any) => c.id === selectedCoin)
                      if (!coin) return <span className="text-muted-foreground">Select coin</span>
                      return (
                        <>
                          <CryptoIcon coinId={coin.id} className="w-7 h-7" color={coin.color} bg={coin.bg} name={coin.name} />
                          <div className="flex-1">
                            <span className="text-sm font-semibold block">{coin.name}</span>
                            <span className="text-[10px] text-muted-foreground">{coin.fullName}</span>
                          </div>
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

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
                    {/* Search inside dropdown */}
                    <div className="relative p-3 border-b border-border">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={coinSearch}
                        onChange={(e) => setCoinSearch(e.target.value)}
                        placeholder="Search coins..."
                        autoFocus
                        className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                      />
                    </div>

                    {/* Coin List */}
                    <div className="max-h-72 overflow-y-auto p-2">
                      {(() => {
                        const filtered = activeConfigs.filter((c: any) => {
                          if (!coinSearch.trim()) return true
                          const q = coinSearch.toLowerCase()
                          return c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
                        })
                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-6 text-muted-foreground text-sm">
                              No coins match "{coinSearch}"
                            </div>
                          )
                        }
                        return filtered.map((coin: any) => {
                          const activeNets = (coin.networks || []).filter((n: any) => n.isActive)
                          return (
                            <button
                              key={coin.id}
                              onClick={() => {
                                setSelectedCoin(coin.id)
                                setDropdownOpen(false)
                                setCoinSearch('')
                                const nets = (coin.networks || []).filter((n: any) => n.isActive)
                                setSelectedNetwork(nets.length > 0 ? nets[0].id : null)
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/50 text-left",
                                selectedCoin === coin.id && "bg-primary/10 border border-primary/20"
                              )}
                            >
                              <CryptoIcon coinId={coin.id} className="w-7 h-7" color={coin.color} bg={coin.bg} name={coin.name} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">{coin.name}</span>
                                  {activeNets.length > 0 && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                      {activeNets.length} network{activeNets.length > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{coin.fullName}</span>
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

          {/* Network Selection — Binance-style Dropdown */}
          {selectedCoin && activeNetworks.length > 0 ? (
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-semibold text-lg mb-1">Select Network</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose a network for your deposit</p>

              <div className="relative" ref={networkRef}>
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => { setNetworkOpen(!networkOpen); setNetworkSearch('') }}
                  className="w-full flex items-center gap-3 h-14 px-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors text-left"
                >
                  {selectedNetwork ? (
                    (() => {
                      const net = activeNetworks.find((n: any) => n.id === selectedNetwork)
                      if (!net) return <span className="text-muted-foreground">Select network</span>
                      return (
                        <>
                          <CryptoIcon coinId={getNetworkCoinId(net.name)} className="w-7 h-7" name={net.name} />
                          <div className="flex-1">
                            <span className="text-sm font-semibold block">{net.name}</span>
                            <span className="text-[10px] text-muted-foreground">Fee: {net.fee} · {net.time}</span>
                          </div>
                        </>
                      )
                    })()
                  ) : (
                    <>
                      <Landmark className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">Select network</span>
                    </>
                  )}
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground ml-auto transition-transform", networkOpen && "rotate-180")} />
                </button>

                {/* Dropdown */}
                {networkOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
                    <div className="relative p-3 border-b border-border">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={networkSearch}
                        onChange={(e) => setNetworkSearch(e.target.value)}
                        placeholder="Search networks..."
                        autoFocus
                        className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                      />
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                      {(() => {
                        const filtered = activeNetworks.filter((n: any) => {
                          if (!networkSearch.trim()) return true
                          const q = networkSearch.toLowerCase()
                          return n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
                        })
                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-6 text-muted-foreground text-sm">
                              No networks match "{networkSearch}"
                            </div>
                          )
                        }
                        return filtered.map((net: any) => (
                          <button
                            key={net.id}
                            onClick={() => {
                              setSelectedNetwork(net.id)
                              setNetworkOpen(false)
                              setNetworkSearch('')
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/50 text-left",
                              selectedNetwork === net.id && "bg-primary/10 border border-primary/20"
                            )}
                          >
                            <CryptoIcon coinId={getNetworkCoinId(net.name)} className="w-7 h-7" name={net.name} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{net.name}</span>
                                {net.badge && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-blue-500/10 text-blue-500">
                                    {net.badge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>Fee: {net.fee}</span>
                                <span>·</span>
                                <span>{net.time}</span>
                                <span>·</span>
                                <span>Min: {net.minDeposit}</span>
                              </div>
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
            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4">
              <p className="text-sm text-amber-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                No active networks configured for {selectedCoinConfig?.name}. Contact support.
              </p>
            </div>
          ) : null}

          {/* Amount Selection */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="font-semibold text-lg mb-1">Amount</h3>
            <p className="text-sm text-muted-foreground mb-6">Enter the amount you want to deposit</p>

            {/* Preset Amounts */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
              {depositAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  className={cn(
                    "h-14 rounded-xl border-2 font-semibold text-base transition-all duration-200",
                    selectedAmount === amount && !customAmount
                      ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10"
                      : "border-border bg-card hover:border-primary/30 text-foreground"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full h-14 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-lg font-semibold"
              />
            </div>

            {/* Summary */}
            <div className="h-px bg-border my-6" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">You will deposit</span>
              <span className="text-xl font-bold">${getEffectiveAmount().toFixed(2)}</span>
            </div>

            {/* Deposit Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              <Button
                onClick={handleDeposit}
                disabled={cryptomusCreating || !canDeposit()}
                className="relative w-full h-14 rounded-xl text-base font-semibold gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {cryptomusCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Invoice...
                  </>
                ) : (
                  <>
                    <Landmark className="w-5 h-5" />
                    Deposit ${getEffectiveAmount().toFixed(2)}
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Error */}
            {cryptomusError && (
              <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{cryptomusError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Available Coins List */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h4 className="font-semibold text-sm mb-3">Available Coins</h4>
            <div className="space-y-1">
              {configsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activeConfigs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No coins available</p>
              ) : (
                activeConfigs.map((coin: any) => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin.id)
                      const nets = (coin.networks || []).filter((n: any) => n.isActive)
                      setSelectedNetwork(nets.length > 0 ? nets[0].id : null)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-colors hover:bg-secondary/50",
                      selectedCoin === coin.id && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden">
                      <CryptoIcon coinId={coin.id} className="w-5 h-5" color={coin.color} bg={coin.bg} name={coin.name} />
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

          {/* Why Deposit */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h4 className="font-semibold text-sm mb-3">Why Deposit?</h4>
            <div className="space-y-2.5">
              {[
                'Supports multiple cryptocurrencies',
                'Secure Cryptomus payment gateway',
                'Automatic credit to your balance',
                '24/7 support available',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5">
            <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
            <p className="text-xs text-muted-foreground mb-3">
              If you experience any issues with your deposit, contact our support team.
            </p>
            <Link
              to="/contact"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              Contact Support
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───
export default function DashboardTopupPage() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam === "credits" || tabParam === "history" ? tabParam : "crypto")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    dispatch(fetchActivePackageRequest())
  }, [dispatch])

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Top Up</h1>
        </div>
        <p className="text-sm text-muted-foreground">Deposit funds or buy credits with your balance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-secondary/50 border border-border w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                isActive ? "bg-card text-foreground shadow-lg shadow-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {isActive && <div className="absolute inset-0 rounded-xl border border-primary/20" />}
              <Icon className={cn("w-4 h-4 relative z-10", isActive && "text-primary")} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="mt-2">
        {activeTab === "crypto" && <CryptomusDepositTab />}
        {activeTab === "credits" && <BuyCreditsTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  )
}
