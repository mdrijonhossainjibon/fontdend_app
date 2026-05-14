"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCheck, Trash2, X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Captcha Solved Successfully",
    message: "reCAPTCHA v3 on amazon.com was solved in 2.3s",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Feature Available",
    message: "MetaMask payment integration is now live! Pay with crypto directly from your wallet.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Low Credit Balance",
    message: "You have 150 credits remaining. Consider topping up to avoid service interruption.",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "success",
    title: "Payment Received",
    message: "Your payment of $29.99 for 5,000 credits has been processed successfully.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "5",
    type: "error",
    title: "Captcha Solve Failed",
    message: "hCaptcha on example.com failed after 3 attempts. Credit refunded.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "6",
    type: "info",
    title: "System Maintenance",
    message: "Scheduled maintenance on Jan 25, 2026 from 2:00 AM - 4:00 AM UTC.",
    timestamp: "3 days ago",
    read: true,
  },
]

export function DashboardNotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read
    if (filter === "read") return notif.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/20"
      case "warning":
        return "bg-amber-500/10 border-amber-500/20"
      case "error":
        return "bg-red-500/10 border-red-500/20"
      case "info":
        return "bg-blue-500/10 border-blue-500/20"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div
        className="space-y-2"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.4s ease-out",
        }}
      >
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your captcha solving activities and system alerts</p>
      </div>

      {/* Stats and Actions */}
      <div
        className="flex flex-wrap items-center justify-between gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.4s ease-out",
          transitionDelay: "50ms",
        }}
      >
        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Total: <span className="font-semibold text-foreground">{notifications.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Unread: <span className="font-semibold text-primary">{unreadCount}</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-2 border-b border-border"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.4s ease-out",
          transitionDelay: "100ms",
        }}
      >
        {[
          { value: "all", label: "All" },
          { value: "unread", label: "Unread" },
          { value: "read", label: "Read" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as typeof filter)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              filter === tab.value ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {filter === tab.value && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(0.95)",
              transition: "all 0.4s ease-out",
              transitionDelay: "150ms",
            }}
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {filter === "unread"
                ? "You're all caught up! No unread notifications at the moment."
                : filter === "read"
                  ? "No read notifications to display."
                  : "You don't have any notifications yet. We'll notify you when something important happens."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif, index) => (
            <div
              key={notif.id}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300 group hover:shadow-lg",
                notif.read ? "bg-card/50 border-border/50" : "bg-card border-border",
                getBackgroundColor(notif.type),
              )}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease-out",
                transitionDelay: `${150 + index * 50}ms`,
              }}
            >
              {/* Unread indicator */}
              {!notif.read && <div className="absolute top-4 left-0 w-1 h-12 bg-primary rounded-r-full" />}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={cn("font-semibold text-foreground", !notif.read && "text-primary")}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
