"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Coins,
  Bitcoin,
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
  ExternalLink,
  TrendingUp,
  History,
  ArrowDown,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardDepositCrypto } from "@/components/dashboard-deposit-crypto"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import {
  fetchActivePackageRequest,
  buyCreditsRequest,
  redeemCodeRequest,
  clearRedeemResult,
  fetchHistoryRequest,
} from "@/modules/topup/actions"

// ─── Credit Packages ───
const creditPackages = [
  { credits: 1000, price: 4.99, popular: false, bonus: 0 },
  { credits: 5000, price: 19.99, popular: true, bonus: 500 },
  { credits: 10000, price: 34.99, popular: false, bonus: 1500 },
  { credits: 50000, price: 149.99, popular: false, bonus: 10000 },
]

const tabs = [
  { id: "crypto", label: "Crypto Deposit", icon: Bitcoin },
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

  useEffect(() => {
    dispatch(fetchActivePackageRequest())
  }, [dispatch])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text })
    setTimeout(() => setToastMsg(null), 4000)
  }

  const handleBuy = () => {
    const pkg = creditPackages[selectedPackage]
    dispatch(buyCreditsRequest({ credits: pkg.credits + pkg.bonus, price: pkg.price }))
  }

  const handleRedeem = () => {
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
          {activePackage?.activePackage ? (
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
                disabled={buying || activePackage.balance < pkg.price}
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
                disabled={!activePackage?.activePackage}
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
              return (
                <div
                  key={tx.id}
                  className={cn("flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors", isVisible ? "opacity-100" : "opacity-0")}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", typeIcon.bg)}>
                    <Icon className={cn("w-5 h-5", typeIcon.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{getTypeLabel(tx)}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isPositive ? <ArrowDown className="w-3.5 h-3.5 text-green-500" /> : <ArrowUp className="w-3.5 h-3.5 text-red-500" />}
                        <p className={cn("text-sm font-bold", isPositive ? "text-green-500" : "text-foreground")}>
                          {isPositive ? "+" : ""}{tx.credits.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.label || ''}
                        {tx.amount && ` · $${tx.amount}`}
                        {tx.meta && ` · ${tx.meta}`}
                      </p>
                      <p className="text-xs text-muted-foreground shrink-0">{tx.date} {tx.time}</p>
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

// ─── Main Page ───
export default function DashboardTopupPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam === "credits" || tabParam === "history" ? tabParam : "crypto")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Top Up</h1>
        </div>
        <p className="text-sm text-muted-foreground">Add credits to your account via crypto or card payment</p>
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
        {activeTab === "crypto" && (
          <Suspense fallback={null}>
            <DashboardDepositCrypto />
          </Suspense>
        )}
        {activeTab === "credits" && <BuyCreditsTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  )
}
