"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Link } from 'react-router-dom'
const activities = [
  { site: "google.com", type: "reCAPTCHA v2", time: "2s ago", status: "success", duration: "1.2s" },
  { site: "twitter.com", type: "hCaptcha", time: "1m ago", status: "success", duration: "2.8s" },
  { site: "discord.com", type: "Turnstile", time: "3m ago", status: "success", duration: "0.9s" },
  { site: "amazon.com", type: "FunCaptcha", time: "5m ago", status: "pending", duration: "..." },
]

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  pending: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  failed: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
}

export function ExtensionRecentActivity() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 550)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">Recent Activity</p>
        <Link to="/extension/topup?tab=history" className="text-[10px] text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-2">
        {activities.map((activity, index) => {
          const config = statusConfig[activity.status as keyof typeof statusConfig]
          return (
            <Link
              to="/extension/topup?tab=history"
              key={index}
              className={`flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border hover:border-primary/20 hover:bg-primary/5 cursor-pointer transition-all duration-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <config.icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{activity.site}</p>
                <p className="text-[10px] text-muted-foreground">{activity.type}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-medium text-foreground">{activity.duration}</p>
                <p className="text-[10px] text-muted-foreground">{activity.time}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
