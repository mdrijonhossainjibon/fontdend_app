import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Link, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Key,
  FileText,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

const navItems = [
  { href: "/reseller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reseller/packages", label: "My Packages", icon: Package },
  { href: "/reseller/packages/buy", label: "Buy Package", icon: ShoppingCart },
  { href: "/reseller/api-keys", label: "API Keys", icon: Key },
  { href: "/reseller/docs", label: "Documentation", icon: FileText },
]

export function ResellerSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { user, logout } = useAuth();
  const location = useLocation()
  const pathname = location.pathname
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (isOpen) setIsOpen(false)
  }, [pathname])

  if (!['reseller', 'superadmin'].includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />
  }

  const NavItem = ({ item, index }: { item: (typeof navItems)[0]; index: number }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        to={item.href}
        data-tour={
          item.href === "/reseller" ? "stats" :
          item.href === "/reseller/packages" ? "packages" :
          item.href === "/reseller/packages/buy" ? "buy-package" :
          item.href === "/reseller/api-keys" ? "api-keys" :
          item.href === "/reseller/docs" ? "docs" : undefined
        }
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
          <Icon className={cn("w-5 h-5 transition-all duration-300", isActive && "text-primary")} />
        </div>

        <span className="font-medium whitespace-nowrap transition-all duration-300 opacity-100">
          {item.label}
        </span>
      </Link>
    )
  }

  return (
    <>
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
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/reseller" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                Reseller<span className="text-primary">Panel</span>
              </span>
              <span className="text-xs text-muted-foreground">Partner Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {navItems.map((item, idx) => (
            <NavItem key={item.href} item={item} index={idx} />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
