"use client"

import { useState, useEffect } from "react"
import { Coins, Plus, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
export function ExtensionBalance() {
  const [isVisible, setIsVisible] = useState(false)
  const balance = 2847
  const maxBalance = 5000

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 350)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`mx-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 transition-all duration-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Credit Balance</p>
            <p className="text-xl font-bold text-foreground">{balance.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 bg-transparent" asChild>
            <Link to="/extension/topup?tab=history">
              <History className="w-3 h-3" />
              History
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-7 px-2 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link to="/extension/topup">
              <Plus className="w-3 h-3" />
              Add
            </Link>
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Daily usage</span>
          <span className="text-foreground font-medium">{Math.round((balance / maxBalance) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
            style={{ width: `${(balance / maxBalance) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">{(maxBalance - balance).toLocaleString()} credits remaining</p>
      </div>
    </div>
  )
}
