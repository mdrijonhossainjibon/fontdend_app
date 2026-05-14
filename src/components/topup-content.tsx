"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Coins, CreditCard, Zap, Gift, CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
const creditPackages = [
  { credits: 1000, price: 4.99, popular: false, bonus: 0 },
  { credits: 5000, price: 19.99, popular: true, bonus: 500 },
  { credits: 10000, price: 34.99, popular: false, bonus: 1500 },
  { credits: 50000, price: 149.99, popular: false, bonus: 10000 },
]

const transactionHistory = [
  { id: 1, type: "purchase", credits: 5000, amount: 19.99, date: "2024-01-15", status: "success" },
  { id: 2, type: "usage", credits: -150, site: "google.com", date: "2024-01-15", status: "success" },
  { id: 3, type: "usage", credits: -80, site: "twitter.com", date: "2024-01-14", status: "success" },
  { id: 4, type: "purchase", credits: 1000, amount: 4.99, date: "2024-01-10", status: "success" },
  { id: 5, type: "usage", credits: -200, site: "discord.com", date: "2024-01-10", status: "success" },
  { id: 6, type: "refund", credits: 500, amount: 2.5, date: "2024-01-08", status: "pending" },
]

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  pending: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  failed: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
}

export function TopupContent() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get("tab") === "history" ? "history" : "topup"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-[360px] min-h-[600px] bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Link
            to="/extension"
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold">Credits & History</h1>
            <p className="text-[10px] text-muted-foreground">Manage your balance</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 px-4 pb-3">
          <button
            onClick={() => setActiveTab("topup")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
              activeTab === "topup"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Coins className="w-3 h-3 inline mr-1.5" />
            Top Up
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3 h-3 inline mr-1.5" />
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`p-4 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {activeTab === "topup" ? (
          <div className="space-y-4">
            {/* Current Balance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">2,847</p>
                </div>
              </div>
            </div>

            {/* Credit Packages */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3">Select Package</p>
              <div className="space-y-2">
                {creditPackages.map((pkg, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPackage(index)}
                    className={`w-full p-3 rounded-xl border transition-all duration-300 text-left relative overflow-hidden ${
                      selectedPackage === index
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">
                        POPULAR
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selectedPackage === index ? "bg-primary/20" : "bg-secondary"
                          }`}
                        >
                          <Zap
                            className={`w-5 h-5 ${selectedPackage === index ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{pkg.credits.toLocaleString()} Credits</p>
                          {pkg.bonus > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-green-500">
                              <Gift className="w-3 h-3" />
                              <span>+{pkg.bonus.toLocaleString()} bonus</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-lg font-bold">${pkg.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <Link to={selectedPackage !== null ? `/extension/payment?package=${selectedPackage}` : "#"}>
              <Button
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-sm font-semibold"
                disabled={selectedPackage === null}
              >
                <CreditCard className="w-4 h-4" />
                Continue to Payment
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>

            <p className="text-[10px] text-center text-muted-foreground">
              Secure payment powered by Stripe. Cancel anytime.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactionHistory.map((tx, index) => {
              const config = statusConfig[tx.status as keyof typeof statusConfig]
              const isPositive = tx.credits > 0

              return (
                <div
                  key={tx.id}
                  className={`p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold capitalize">{tx.type}</p>
                        <p className={`text-sm font-bold ${isPositive ? "text-green-500" : "text-foreground"}`}>
                          {isPositive ? "+" : ""}
                          {tx.credits.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[10px] text-muted-foreground">
                          {tx.type === "usage" ? tx.site : tx.amount ? `$${tx.amount}` : ""}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{tx.date}</p>
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
