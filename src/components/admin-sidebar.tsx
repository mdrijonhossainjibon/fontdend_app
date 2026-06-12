"use client"

import { cn } from "@/lib/utils"

import { Link } from 'react-router-dom'
import { useEffect } from "react"

import { useState } from "react"

import { useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lock,
  Bell,
  Package,
  Zap,
  RefreshCw,
  DollarSign,
  FileText,
  Mail,
  Database,
  GitBranch,
  ArrowRightLeft,
  AlertCircle,
  CreditCard,
  Smartphone,
  Key,
  Activity,
  ShoppingCart,
  Puzzle,
  Upload,
  Gift,
  Bot,
} from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

const mainNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

const managementItems = [
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/user-packages", label: "User Packages", icon: CreditCard },
  { href: "/admin/extensions", label: "Extensions", icon: Puzzle },
  { href: "/admin/solutions", label: "Solution Cache", icon: Database },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/crypto", label: "Crypto Config", icon: Zap },
  { href: "/admin/history", label: "All History", icon: FileText },
  { href: "/admin/ai-training/bot-endpoints", label: "Bot Endpoints", icon: Bot },
  { href: "/admin/upload-model", label: "Upload Model", icon: Upload },
  { href: "/admin/cache-control", label: "Cache Control", icon: RefreshCw },
  { href: "/admin/redeem-codes", label: "Redeem Codes", icon: Gift },
  { href: "/admin/promo-offers", label: "Promo Offers", icon: Gift },
]

const systemItems = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/permissions", label: "Permissions", icon: Lock },
  { href: "/admin/system/smtp", label: "SMTP Config", icon: Mail },
  { href: "/admin/email", label: "Email Templates", icon: Mail },
  { href: "/admin/database", label: "Database", icon: Database },
  { href: "/admin/database/transfer", label: "Database Transfer", icon: ArrowRightLeft }
]





export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { user, status } = useAuth();
  const location = useLocation()
  const pathname = location.pathname
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isOpen) setIsOpen(false)
  }, [pathname])

  if (status === 'loading') {
    return <div className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border flex items-center justify-center lg:flex hidden">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const NavItem = ({ item, index }: { item: (typeof mainNavItems)[0]; index: number }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        to={item.href}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
          "hover:bg-primary/10",
          isActive && "bg-primary/15 text-primary",
          !isActive && "text-muted-foreground hover:text-foreground",
        )}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(-20px)",
          transitionDelay: `${index * 50}ms`,
        }}
      >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}

        <div
          className={cn(
            "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
            isActive && "bg-primary/20",
            !isActive && "group-hover:bg-secondary",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isActive && "text-primary drop-shadow-[0_0_8px_oklch(0.82_0.18_90/0.6)]",
            )}
          />
        </div>

        <span
          className={cn(
            "font-medium whitespace-nowrap transition-all duration-300",
            "opacity-100",
          )}
        >
          {item.label}
        </span>

        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "bg-gradient-to-r from-primary/5 to-transparent pointer-events-none",
          )}
        />
      </Link>
    )
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out",
          "bg-card/80 backdrop-blur-xl border-r border-border",
          "w-64",
          // Mobile visibility
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-card animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                Admin<span className="text-destructive">Panel</span>
              </span>
              <span className="text-xs text-muted-foreground">Management</span>
            </div>
          </Link>
        </div>




        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Main Section */}
          <div className="space-y-2">
            {mainNavItems.map((item, idx) => (
              <NavItem key={item.href} item={item} index={idx} />
            ))}
          </div>

          {/* Management Section */}
          <div>
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Management
            </p>
            <div className="space-y-2">
              {managementItems.map((item, idx) => (
                <NavItem key={item.href} item={item} index={mainNavItems.length + idx} />
              ))}
            </div>
          </div>

          {/* System Section */}
          <div>
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              System
            </p>
            <div className="space-y-2">
              {systemItems.map((item, idx) => (
                <NavItem
                  key={item.href}
                  item={item}
                  index={mainNavItems.length + managementItems.length + idx}
                />
              ))}
            </div>
          </div>




        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 left-4 w-32 h-32 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />
      </aside>
    </>
  )
}
