"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  ChevronDown,
  
  Zap,
  HelpCircle,
  Info,
  FileCode,
  Puzzle,
  Bell,
  Wallet,
  LogOut,
  LayoutDashboard,
  User,
  
  Loader2,
  ChevronRight,
  CreditCard,
  Package,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RootState } from "@/modules/rootReducer"
import * as dashboardActions from "@/modules/dashboard/actions"
import { useAuth } from "@/components/AuthProvider"

interface Extension {
  _id: string
  name: string
  version: string
  platform: string
  downloadUrl: string
  iconUrl?: string
}

const navLinks = [
  { to: "/features", label: "Features", icon: Zap },
  { to: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { to: "/about", label: "About", icon: Info },
  { to: "/api-docs", label: "API Docs", icon: FileCode },
]

const dashboardLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/activities", label: "Activities", icon: Zap },
  { to: "/dashboard/pricing", label: "Pricing", icon: Package },
  { to: "/dashboard/topup", label: "Top Up", icon: CreditCard },
  { to: "/dashboard/referrals", label: "Invite & Earn", icon: Users },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [extensionDropdownOpen, setExtensionDropdownOpen] = useState(false)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const { user: session, status } = useAuth();
  const dispatch = useDispatch()

  // Redux state
  const extensions = useSelector((state: RootState) => state.dashboard.extensions as Extension[])
  const extensionsLoading = useSelector((state: RootState) => state.dashboard.extensionsLoading)
  const userData = useSelector((state: RootState) => state.dashboard.userData)
  const dashboardLoading = useSelector((state: RootState) => state.dashboard.loading)

  const balance = userData?.balance || 0
  const isLoadingBalance = dashboardLoading && !userData

  useEffect(() => {
    dispatch(dashboardActions.fetchExtensionsRequest())
    if (status === "authenticated") {
      dispatch(dashboardActions.fetchDashboardDataRequest())
    }
    const interval = setInterval(() => {
      dispatch(dashboardActions.fetchExtensionsRequest())
      if (status === "authenticated") {
        dispatch(dashboardActions.fetchDashboardDataRequest())
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [status, dispatch])

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExtensionDropdownOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 overflow-hidden">
              <img                 src="/logo.png"
                alt="CaptchaMaster Logo"
                style={{ width: 40 }}
                
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              Captcha<span className="text-primary">Ɱaster</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                  {link.label}
                </Link>
              )
            })}

            {/* Extension Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors outline-none group"
                onClick={() => setExtensionDropdownOpen(!extensionDropdownOpen)}
              >
                <Puzzle className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                Extension
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${extensionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {extensionDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-lg overflow-hidden py-1">
                  {extensions.length === 0 && !extensionsLoading && (
                    <div className="px-4 py-3 text-xs text-muted-foreground">No extensions available</div>
                  )}
                  {extensionsLoading && (
                    <div className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading...
                    </div>
                  )}
                  {extensions.map((ext) => (
                    <Link
                      key={ext._id}
                      to={ext.downloadUrl}
                      className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {ext.iconUrl ? (
                          <img src={ext.iconUrl} alt={ext.name} className="w-full h-full object-cover" />
                        ) : (
                          <Puzzle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{ext.name}</p>
                        <p className="text-[10px] opacity-70">v{ext.version} • {ext.platform}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                {/* Balance Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Wallet className="w-4 h-4 text-primary" />
                  <div className="flex items-baseline gap-1">
                    {isLoadingBalance ? (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    ) : (
                      <span className="text-sm font-bold text-foreground">${balance.toFixed(4)}</span>
                    )}
                  </div>
                </div>

                {/* Notifications Icon */}
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
                </Button>

                {/* Account Dropdown */}
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-background/95 backdrop-blur-lg border border-border rounded-xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-border mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{session?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{session?.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        Dashboard
                      </Link>

                      <div className="h-px bg-border my-1" />

                      <button
                        onClick={async () => {
                          localStorage.removeItem('authToken')
                          localStorage.removeItem('user')
                          await fetch('/api/auth/logout', { method: 'POST' });
                          window.location.href = '/';
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="md:hidden flex items-center gap-3">
            {status === "authenticated" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-bold text-foreground">${balance.toFixed(2)}</span>
              </div>
            )}
            <button className="p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer - Moved outside constrained container */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-[100] transition-all duration-300",
          isOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 w-[300px] bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col z-[101]",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/10 border border-primary/20">
                <img src="/logo.png" alt="Logo" style={{ width: 36 }}  className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-foreground">
                Captcha<span className="text-primary">Ɱaster</span>
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-accent">
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
            {status === "authenticated" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{session?.name || "User"}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Wallet className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-foreground">${balance.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3">Quick Actions</p>
                  <div className="space-y-1">
                    {dashboardLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.label}
                          to={link.to}
                          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all py-3.5 px-4 rounded-xl hover:bg-accent group font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                          <span>{link.label}</span>
                        </Link>
                      )
                    })}

                    <button
                      onClick={async () => {
                        localStorage.removeItem('authToken')
                        localStorage.removeItem('user')
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-3 w-full text-destructive hover:bg-destructive/10 transition-all py-3.5 px-4 rounded-xl group font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-1">
                <Link to="/auth/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full text-xs h-11 font-bold rounded-xl active:scale-95 transition-all">Sign In</Button>
                </Link>
                <Link to="/auth/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-xs h-11 font-bold rounded-xl bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20">Sign Up</Button>
                </Link>
              </div>
            )}

            <div className="space-y-2">
              <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3">Navigation</p>
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all py-3.5 px-4 rounded-xl hover:bg-accent group font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="h-px bg-border/50 mx-3 my-2" />

            <div className="space-y-2">
              <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3">Browser</p>
              <div className="px-1">
                <button
                  className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-all py-3.5 px-3 rounded-xl hover:bg-accent group font-medium"
                  onClick={() => setExtensionDropdownOpen(!extensionDropdownOpen)}
                >
                  <div className="flex items-center gap-3">
                    <Puzzle className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                    Extensions
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${extensionDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {extensionDropdownOpen && (
                  <div className="pl-11 mt-1 flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    {extensions.map((ext) => (
                      <Link
                        key={ext._id}
                        to={ext.downloadUrl}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors py-2.5 px-3 rounded-lg hover:bg-accent/50"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {ext.iconUrl ? (
                            <img src={ext.iconUrl} alt={ext.name} className="w-full h-full object-cover" />
                          ) : (
                            <Puzzle className="w-4 h-4 text-primary/60" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{ext.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 rounded-[24px] p-5 border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-16 h-16 text-primary" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                  Invite & Earn <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded">15%</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Earn commission on every credit purchase from your referrals.</p>
                <Link
                  to="/dashboard/referrals"
                  className="text-xs font-bold text-primary flex items-center gap-1 group/link"
                  onClick={() => setIsOpen(false)}
                >
                  Get your link <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
