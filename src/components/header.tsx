"use client"

import { Bell, User, MoreVertical, Puzzle, Code, Wallet, Loader2, Gift, LogOut, Shield, LayoutDashboard, ExternalLink, CreditCard, History, Package, Users, Settings, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuToggle?: () => void
}

const EXTENSIONS_DRIVE_URL = "https://drive.google.com/drive/folders/1fHPVBksUzNS5aXPZJtjtmg0jGcVzi-Rx"

export function Header({ onMenuToggle }: HeaderProps = {}) {
  const { userData, loading: isLoadingBalance } = useSelector((state: RootState) => state.dashboard)
  const balance = userData?.balance || 0

  const location = useLocation()
  const { theme, setTheme } = useTheme()

  function ThemeToggleButton() {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-300"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    )
  }

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/topup": "Top Up",
    "/dashboard/redeem": "Redeem Code",
    "/dashboard/history": "Transaction History",
    "/dashboard/pricing": "Pricing",
    "/dashboard/referrals": "Invite & Earn",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
    "/dashboard/api-keys": "API Keys",
  }
  const currentPageTitle = pageTitles[location.pathname] || ""
  const pageIcons: Record<string, React.ReactNode> = {
    "/dashboard": <LayoutDashboard className="w-5 h-5" />,
    "/dashboard/topup": <CreditCard className="w-5 h-5" />,
    "/dashboard/redeem": <Gift className="w-5 h-5" />,
    "/dashboard/history": <History className="w-5 h-5" />,
    "/dashboard/pricing": <Package className="w-5 h-5" />,
    "/dashboard/referrals": <Users className="w-5 h-5" />,
    "/dashboard/profile": <User className="w-5 h-5" />,
    "/dashboard/settings": <Settings className="w-5 h-5" />,
    "/dashboard/api-keys": <Shield className="w-5 h-5" />,
  }

  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Page Icon + Active page name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-600 shadow-sm">
              <div className="text-white">
                {pageIcons[location.pathname] || <LayoutDashboard className="w-5 h-5" />}
              </div>
            </div>
            {currentPageTitle && (
              <h1 className="text-lg font-semibold text-foreground">{currentPageTitle}</h1>
            )}
          </div>
          {/* Right Section Content */}
          <div className="flex-1 flex items-center justify-end gap-6 transition-all duration-300">
            {/* Center Navigation Group */}
            <div className="hidden md:flex items-center gap-3">
              {/* Extensions - Direct Google Drive Link */}
              <a
                href={EXTENSIONS_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Puzzle className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground hidden lg:inline">Extensions</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>

              {/* API Library */}
              <Link to="/api-docs" className="hidden md:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                <Code className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground hidden lg:inline">API Library</span>
              </Link>

              {/* Telegram Group */}
              <a
                href="https://t.me/CaptchaMasterBangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-[#2AABEE] hover:bg-[#2AABEE]/5 transition-colors"
                title="Join Telegram Group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.233.17.33.016.099.036.324.02.499z"/>
                </svg>
                <span className="text-xs font-medium">Join TG Group</span>
              </a>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-6 bg-border/50 mx-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Balance - Moved to visible on mobile/desktop */}
              <div className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-secondary/30 transition-colors border border-border/30">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <div className="flex items-baseline gap-1">
                  {isLoadingBalance && balance === 0 ? (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="text-sm font-bold text-foreground">${balance.toFixed(4)}</span>
                  )}
                  <span className="text-[10px] text-muted-foreground hidden sm:inline uppercase">USD</span>
                </div>
              </div>

              <Link to="/dashboard/referrals" className="hidden sm:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  title="Invite & Earn 15%"
                >
                  <Gift className="w-5 h-5" />
                </Button>
              </Link>
              <ThemeToggleButton />
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5 relative rounded-xl"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <User className="w-5 h-5" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border bg-card/95 backdrop-blur-md shadow-xl">
                  <DropdownMenuLabel className="p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-foreground leading-none">{userData?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground leading-none truncate">{userData?.email || "Loading..."}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />

                  <Link to="/dashboard">
                    <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>

                  {['admin', 'superadmin'].includes(userData?.role || '') && (
                    <Link to="/admin">
                      <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors text-destructive-foreground/90">
                        <Shield className="w-4 h-4 text-destructive" />
                        <span className="text-destructive">Admin Panel</span>
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuSeparator className="bg-border/50" />

                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem('authToken')
                      localStorage.removeItem('user')
                      window.location.href = '/auth/login'
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle - Added to Right */}
              {onMenuToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMenuToggle}
                  className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl ml-1"
                >
                  <MoreVertical className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        </div>


      </div>
    </header>
  )
}
