"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, Activity, Clock, Coins } from "lucide-react"

interface Stat {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}

const stats: Stat[] = [
  {
    label: "Total Requests",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    label: "Success Rate",
    value: "99.2%",
    change: "+0.3%",
    trend: "up",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Avg Response",
    value: "1.2s",
    change: "-0.2s",
    trend: "up",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    label: "Credits Used",
    value: "8,450",
    change: "+2,100",
    trend: "up",
    icon: <Coins className="w-5 h-5" />,
  },
]

export function ProfileStats() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`
        transition-all duration-700 ease-out delay-100
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="relative bg-card border border-border rounded-xl p-4 overflow-hidden group hover:border-primary/30 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>

            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
