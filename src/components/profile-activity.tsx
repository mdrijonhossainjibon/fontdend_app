"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

interface Activity {
  id: number
  type: "success" | "error" | "warning" | "pending"
  action: string
  timestamp: string
  details: string
}

const activities: Activity[] = [
  {
    id: 1,
    type: "success",
    action: "reCAPTCHA v3 Solved",
    timestamp: "2 minutes ago",
    details: "Token generated successfully",
  },
  {
    id: 2,
    type: "success",
    action: "hCaptcha Solved",
    timestamp: "5 minutes ago",
    details: "Challenge completed",
  },
  {
    id: 3,
    type: "error",
    action: "FunCaptcha Failed",
    timestamp: "12 minutes ago",
    details: "Timeout exceeded",
  },
  {
    id: 4,
    type: "warning",
    action: "Rate Limit Warning",
    timestamp: "25 minutes ago",
    details: "80% of daily limit reached",
  },
  {
    id: 5,
    type: "pending",
    action: "GeeTest Processing",
    timestamp: "30 minutes ago",
    details: "Awaiting challenge response",
  },
  {
    id: 6,
    type: "success",
    action: "Turnstile Solved",
    timestamp: "45 minutes ago",
    details: "Cloudflare verification complete",
  },
]

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />
    case "warning":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    case "pending":
      return <Clock className="w-5 h-5 text-blue-500" />
  }
}

const getBgColor = (type: Activity["type"]) => {
  switch (type) {
    case "success":
      return "bg-green-500/10"
    case "error":
      return "bg-red-500/10"
    case "warning":
      return "bg-yellow-500/10"
    case "pending":
      return "bg-blue-500/10"
  }
}

export function ProfileActivity() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`
        transition-all duration-700 ease-out delay-200
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mt-1">Your latest captcha solving history</p>
        </div>

        <div className="divide-y divide-border">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-secondary/30 transition-colors duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${getBgColor(activity.type)} flex items-center justify-center flex-shrink-0`}
                >
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground truncate">{activity.action}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  )
}
