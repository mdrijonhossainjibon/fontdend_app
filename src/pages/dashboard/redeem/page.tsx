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
      {/* Form Card */}
      <div className="bg-white dark:bg-[#1E2329] border border-gray-200 dark:border-[#2B3139] rounded-lg p-6 shadow-sm dark:shadow-none">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-md bg-amber-50 dark:bg-[#F0B90B]/5 border border-amber-200 dark:border-[#F0B90B]/20">
            <Ticket className="w-5 h-5 text-amber-600 dark:text-[#F0B90B] shrink-0" />
            <p className="text-xs text-gray-600 dark:text-[#848E9C]">
              Got a promo or purchase code? Enter it below to claim your credits.
            </p>
          </div>

          {/* Input */}
          <div>
            <label 
              htmlFor="code" 
              className="text-xs font-medium mb-2 block text-gray-500 dark:text-[#848E9C]"
            >
              Code
            </label>
            <div className="relative">
              <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#848E9C]" />
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE..."
                autoComplete="off"
                className="w-full h-11 pl-10 pr-3.5 rounded-md bg-gray-50 dark:bg-[#0B0E11] border border-gray-200 dark:border-[#2B3139] focus:border-amber-500 dark:focus:border-[#F0B90B] focus:outline-none focus:ring-1 focus:ring-amber-500/30 dark:focus:ring-[#F0B90B]/30 text-sm font-mono font-bold tracking-widest uppercase text-gray-900 dark:text-[#EAECEF] placeholder:text-gray-400 dark:placeholder:text-[#474D57] transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={redeeming || !code.trim()}
            className="w-full h-11 rounded-md text-sm font-semibold gap-2 bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {redeeming ? (
              <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Processing...</>
            ) : (
              <><Gift className="w-4 h-4" /> Redeem <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </Button>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-md bg-red-50 dark:bg-[#F6465D]/5 border border-red-200 dark:border-[#F6465D]/20">
              <div className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-600 dark:text-[#F6465D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-600 dark:text-[#F6465D]">Failed</p>
                  <p className="text-xs text-gray-600 dark:text-[#848E9C] mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {redeemResult && (
            <div className="p-4 rounded-md bg-emerald-50 dark:bg-[#0ECB81]/5 border border-emerald-200 dark:border-[#0ECB81]/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#0ECB81] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-[#0ECB81]">Redeemed!</p>
                  {redeemResult.package ? (
                    <>
                      <p className="text-xs text-gray-600 dark:text-[#848E9C] mt-1">
                        Code <span className="font-mono font-bold text-gray-900 dark:text-[#EAECEF]">{redeemResult.code}</span> unlocked{' '}
                        <span className="font-bold text-amber-600 dark:text-[#F0B90B]">{redeemResult.package.code}</span> package
                      </p>
                      {redeemResult.package.type && (
                        <p className="text-xs text-gray-600 dark:text-[#848E9C] mt-1 flex items-center gap-1.5">
                          <Package className="w-3 h-3" />
                          {redeemResult.package.type}
                          {redeemResult.package.validityDays && (
                            <><Clock className="w-3 h-3 ml-1" />{redeemResult.package.validityDays}d</>
                          )}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-600 dark:text-[#848E9C] mt-1">
                        +<span className="font-bold text-emerald-600 dark:text-[#0ECB81]">{redeemResult.creditsAdded}</span> credits added
                      </p>
                      <p className="text-xs text-gray-600 dark:text-[#848E9C]">
                        Balance: <span className="font-semibold text-gray-900 dark:text-[#EAECEF]">{redeemResult.totalCredits}</span>
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
        <div className="bg-white dark:bg-[#1E2329] border border-gray-200 dark:border-[#2B3139] rounded-lg p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#F0B90B]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#EAECEF]">How to get codes?</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#848E9C] leading-relaxed">
            Redeem codes can be purchased from our website or obtained through promotional events.
            Each code adds a specific amount of credits to your account balance.
          </p>
        </div>
        <div className="bg-white dark:bg-[#1E2329] border border-gray-200 dark:border-[#2B3139] rounded-lg p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Coins className="w-4 h-4 text-amber-500 dark:text-[#F0B90B]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#EAECEF]">Need more credits?</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#848E9C] mb-3 leading-relaxed">
            You can also deposit directly via cryptocurrency through our secure payment gateway.
          </p>
          <a 
            href="/dashboard/topup" 
            className="text-xs text-amber-600 dark:text-[#F0B90B] font-medium hover:underline inline-flex items-center gap-1 transition-colors"
          >
            Go to Top Up <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}