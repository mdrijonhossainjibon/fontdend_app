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
  Ticket,
  ArrowRight,
  Package,
  Clock,
  Sparkles,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function RedeemCodePage() {
  const dispatch = useDispatch()
  const { redeeming, redeemResult, error } = useSelector((state: RootState) => state.topup)

  const [code, setCode] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => { setIsVisible(true) }, [])

  useEffect(() => {
    if (redeemResult) {
      setCode("")
      const t = setTimeout(() => dispatch(clearRedeemResult()), 6000)
      return () => clearTimeout(t)
    }
  }, [redeemResult, dispatch])

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
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-tight">Redeem Code</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Enter your code to add credits</p>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Info banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <Ticket className="w-5 h-5 text-purple-500 shrink-0" />
            <p className="text-xs text-muted-foreground">Got a promo or purchase code? Enter it below to claim your credits.</p>
          </div>

          {/* Input */}
          <div>
            <label htmlFor="code" className="text-xs font-medium mb-1.5 block text-muted-foreground">Code</label>
            <div className="relative">
              <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code..."
                autoComplete="off"
                className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-secondary/50 border border-border focus:border-purple-500/50 focus:outline-none text-sm font-mono font-bold tracking-widest uppercase transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={redeeming || !code.trim()}
            className="w-full h-10 rounded-lg text-sm font-medium gap-2 bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-all"
          >
            {redeeming ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Redeeming...</>
            ) : (
              <><Gift className="w-4 h-4" /> Redeem <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </Button>

          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-500">Failed</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {redeemResult && (
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-500">Redeemed!</p>
                  {redeemResult.package ? (
                    <>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Code <span className="font-mono font-bold text-foreground">{redeemResult.code}</span> unlocked{' '}
                        <span className="font-bold text-purple-500">{redeemResult.package.code}</span> package
                      </p>
                      {redeemResult.package.type && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <Package className="w-3 h-3 inline mr-1" />
                          {redeemResult.package.type}
                          {redeemResult.package.validityDays && (
                            <><Clock className="w-3 h-3 inline ml-2 mr-1" />{redeemResult.package.validityDays}d</>
                          )}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        +<span className="font-bold text-green-500">{redeemResult.creditsAdded}</span> credits added
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance: <span className="font-semibold text-foreground">{redeemResult.totalCredits}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">How to get codes?</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Redeem codes can be purchased from our website or obtained through promotional events.
            Each code adds a specific amount of credits to your account balance.
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Coins className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-semibold">Need more credits?</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">
            You can also deposit directly via cryptocurrency through our secure payment gateway.
          </p>
          <a href="/dashboard/topup" className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1">
            Go to Top Up <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
