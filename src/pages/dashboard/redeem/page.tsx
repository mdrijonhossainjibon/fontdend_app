"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import {
  redeemCodeRequest,
  clearRedeemResult,
} from "@/modules/topup/actions"
import {
  Gift,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Ticket,
  Coins,
  Package,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function RedeemCodePage() {
  const dispatch = useDispatch()
  const { redeeming, redeemResult, error } = useSelector((state: RootState) => state.topup)

  const [code, setCode] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (redeemResult) {
      setCode("")
      const t = setTimeout(() => dispatch(clearRedeemResult()), 6000)
      return () => clearTimeout(t)
    }
  }, [redeemResult, dispatch])

  // Auto-clear error after 6s using same action (it clears both redeemResult and error)
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearRedeemResult()), 6000)
      return () => clearTimeout(t)
    }
  }, [error, dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    dispatch(redeemCodeRequest({ code: code.trim() }))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-purple-500/10">
            <Gift className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Redeem Code</h1>
            <p className="text-sm text-muted-foreground">Enter your credit code to add funds</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl">
        {/* Form */}
        <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          style={{ transitionDelay: "100ms" }}>
          <form onSubmit={handleSubmit}
            className="rounded-2xl bg-card border border-border p-6 space-y-5"
          >
            <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <Ticket className="w-10 h-10 text-purple-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Got a code?</p>
                <p className="text-xs text-muted-foreground">Enter your redeem code below to add credits to your account</p>
              </div>
            </div>

            <div>
              <label htmlFor="code" className="text-sm font-medium mb-1.5 block">Redeem Code</label>
              <div className="relative">
                <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter your code..."
                  autoComplete="off"
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-2 border-border focus:border-purple-500/50 focus:outline-none text-base font-mono font-bold tracking-widest uppercase transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={redeeming || !code.trim()}
              className="w-full h-14 rounded-xl text-base font-semibold gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {redeeming ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Redeeming...</>
              ) : (
                <><Gift className="w-5 h-5" /> Redeem Code <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-red-500/20 shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-500">Redeem Failed</p>
                    <p className="text-xs text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success */}
            {redeemResult && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-green-500/20 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-500">Code Redeemed!</p>

                    {redeemResult.package ? (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">
                          Code <span className="font-mono font-bold text-foreground">{redeemResult.code}</span> unlocked{' '}
                          <span className="font-bold text-purple-500">{redeemResult.package.code}</span> package!
                        </p>
                        {redeemResult.package.type && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <Package className="w-3 h-3 inline mr-1" />
                            Type: {redeemResult.package.type}
                            {redeemResult.package.validityDays && (
                              <><Clock className="w-3 h-3 inline ml-2 mr-1" />{redeemResult.package.validityDays} days</>
                            )}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">
                          Code <span className="font-mono font-bold text-foreground">{redeemResult.code}</span> added{' '}
                          <span className="font-bold text-green-500">+{redeemResult.creditsAdded} credits</span> to your account.
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Total balance: <span className="font-semibold text-foreground">{redeemResult.totalCredits} credits</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Info cards */}
        <div className={cn("grid gap-4 mt-6 transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          style={{ transitionDelay: "200ms" }}>
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">How to get codes?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Redeem codes can be purchased from our website or obtained through promotional events.
              Each code adds a specific amount of credits to your account balance.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Coins className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Need more credits?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              You can also deposit directly via cryptocurrency through our secure payment gateway.
            </p>
            <a href="/dashboard/topup" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              Go to Top Up <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
