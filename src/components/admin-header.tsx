"use client"

import { Bell, Search, Settings, User, Moon, Sun, Menu, LayoutDashboard, LogOut, ArrowRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import React from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from "@/components/AuthProvider"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Page titles mapping
const pageTitles: Record<string, { title: string; description: string }> = {
    "/admin": { title: "Dashboard", description: "Overview of your admin panel" },
    "/admin/users": { title: "Users", description: "Manage user accounts and permissions" },
    "/admin/analytics": { title: "Analytics", description: "View detailed analytics and insights" },
    "/admin/packages": { title: "Packages", description: "Manage subscription packages" },
    "/admin/orders": { title: "Orders", description: "View and manage deposit orders" },
    "/admin/ai-training/bots": { title: "Bot Management", description: "Manage AI training bots" },
    "/admin/email": { title: "Email Templates", description: "Manage email templates" },
    "/admin/database": { title: "Database", description: "Database management and monitoring" },
    "/admin/permissions": { title: "Permissions", description: "Manage user permissions" },
    "/admin/2fa": { title: "2FA Management", description: "Two-factor authentication settings" },
    "/admin/settings": { title: "Settings", description: "General system settings and configuration" },
    "/admin/system/smtp": { title: "SMTP Configuration", description: "Manage outgoing email server settings" },
    "/admin/crypto": { title: "Crypto Config", description: "Manage supported cryptocurrencies" },
    "/admin/history": { title: "All History", description: "View all system transactions and records" },
    "/admin/extensions": { title: "Extensions", description: "Manage browser extensions" },
    "/admin/solutions": { title: "Solution Cache", description: "Manage captcha solution cache" },
    "/admin/upload-model": { title: "Upload Model", description: "Upload AI model files" },
    "/admin/cache-control": { title: "Cache Control", description: "Manage system cache settings" },
    "/admin/redeem-codes": { title: "Redeem Codes", description: "Manage redeem code generation" },
    "/admin/promo-offers": { title: "Promo Offers", description: "Manage promotional offers" },
    "/admin/user-packages": { title: "User Packages", description: "View all user-assigned packages" },
    "/admin/notifications": { title: "Notifications", description: "Send notifications and announcements to users" },
    "/admin/database/transfer": { title: "Database Transfer", description: "Transfer data between databases" },
    "/admin/ai-training/bot-endpoints": { title: "Bot Endpoints", description: "Manage AI bot endpoints" },
    "/admin/ai-training/training-data": { title: "Training Data", description: "Manage object classes for AI training" },
    "/admin/ai-training/health-check": { title: "Health Check", description: "Monitor bot health and status" },
}

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user, status } = useAuth()
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()
    const [isDark, setIsDark] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchIndex, setSearchIndex] = useState(0)
    const [notifications, setNotifications] = useState(3)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    const initials = useMemo(() => {
        if (!user?.name) return 'AD'
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }, [user?.name])

    const searchItems = useMemo(() => [
        { label: 'Dashboard', path: '/admin', keywords: 'dashboard overview home' },
        { label: 'Users', path: '/admin/users', keywords: 'users accounts members' },
        { label: 'Packages', path: '/admin/packages', keywords: 'packages pricing plans subscription' },
        { label: 'Orders', path: '/admin/orders', keywords: 'orders deposits crypto payments approve reject' },
        { label: 'Topup History', path: '/admin/topup-history', keywords: 'topup history deposits payments' },
        { label: 'All History', path: '/admin/history', keywords: 'history transactions records all' },
        { label: 'Analytics', path: '/admin/analytics', keywords: 'analytics stats statistics insights' },
        { label: 'Email Templates', path: '/admin/email', keywords: 'email templates mail' },
        { label: 'System SMTP', path: '/admin/system/smtp', keywords: 'smtp mail server email settings' },
        { label: 'Cache Control', path: '/admin/cache-control', keywords: 'cache control settings' },
        { label: 'Solution Cache', path: '/admin/solutions', keywords: 'solutions cache captcha' },
        { label: 'Bot Management', path: '/admin/ai-training/bots', keywords: 'bots ai training' },
        { label: 'Upload Model', path: '/admin/upload-model', keywords: 'upload model ai' },
        { label: 'Extensions', path: '/admin/extensions', keywords: 'extensions browser plugins' },
        { label: 'Database', path: '/admin/database', keywords: 'database db storage' },
        { label: 'Database Transfer', path: '/admin/database/transfer', keywords: 'database transfer data migration' },
        { label: 'Permissions', path: '/admin/permissions', keywords: 'permissions roles access' },
        { label: '2FA', path: '/admin/2fa', keywords: '2fa two factor authentication security' },
        { label: 'Notifications', path: '/admin/notifications', keywords: 'notifications announcements send' },
        { label: 'Settings', path: '/admin/settings', keywords: 'settings configuration general' },
        { label: 'Crypto Config', path: '/admin/crypto', keywords: 'crypto cryptocurrency config networks coins' },
        { label: 'Bot Endpoints', path: '/admin/ai-training/bot-endpoints', keywords: 'bot endpoints ai training' },
        { label: 'Training Data', path: '/admin/ai-training/training-data', keywords: 'training data ai object classes' },
        { label: 'Health Check', path: '/admin/ai-training/health-check', keywords: 'health check bot uptime monitoring' },
        { label: 'Redeem Codes', path: '/admin/redeem-codes', keywords: 'redeem codes gift codes coupons' },
        { label: 'Promo Offers', path: '/admin/promo-offers', keywords: 'promo offers promotions discounts' },
    ], [])

    const filteredResults = useMemo(() => {
        if (!searchQuery.trim()) return []
        const q = searchQuery.toLowerCase()
        return searchItems.filter(item =>
            item.label.toLowerCase().includes(q) || item.keywords.includes(q)
        )
    }, [searchQuery, searchItems])

    const safeIndex = Math.min(searchIndex, Math.max(0, filteredResults.length - 1))

    const navigateToResult = (path: string) => {
        navigate(path)
        setIsSearchOpen(false)
        setSearchQuery('')
        setSearchIndex(0)
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSearchIndex(i => Math.min(i + 1, filteredResults.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSearchIndex(i => Math.max(i - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (filteredResults[safeIndex]) {
                navigateToResult(filteredResults[safeIndex].path)
            }
        } else if (e.key === 'Escape') {
            setIsSearchOpen(false)
            setSearchQuery('')
            setSearchIndex(0)
        }
    }

    const pageInfo = pageTitles[pathname] || { title: "Admin Panel", description: "Management Dashboard" }

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark")
        setIsDark(isDarkMode)
    }, [])

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("theme", newTheme ? "dark" : "light")
    }

    return (
        <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground lg:hidden transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                                {pageInfo.title}
                            </h1>
                            <div className="absolute -bottom-1 left-0 h-0.5 w-8 sm:w-12 bg-gradient-to-r from-primary to-transparent rounded-full" />
                        </div>
                    </div>
                    <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5 truncate hidden xs:block">{pageInfo.description}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                            "hover:bg-secondary/80 text-muted-foreground hover:text-foreground",
                            "border border-transparent hover:border-border",
                            isSearchOpen && "bg-secondary border-border"
                        )}
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm hidden md:inline">Search...</span>
                        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>

                    <button className="relative p-2.5 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-300 group">
                        <Bell className="w-5 h-5" />
                        {notifications > 0 && (
                            <>
                                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                                    {notifications}
                                </span>
                                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-destructive animate-ping opacity-75" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            {isDark ? (
                                <Sun className="w-5 h-5 rotate-0 scale-100 transition-all duration-500" />
                            ) : (
                                <Moon className="w-5 h-5 rotate-0 scale-100 transition-all duration-500" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <div className="h-8 w-px bg-border mx-2" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/80 transition-all duration-300 group outline-none">
                                <div className="relative">
                                    <Avatar className="w-8 h-8 ring-2 ring-background group-hover:ring-primary/20 transition-all duration-300">
                                        <AvatarImage src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Admin')}&backgroundColor=4f46e5`} alt={user?.name || 'Admin'} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-bold">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-medium text-foreground">{user?.name || "Admin User"}</p>
                                    <p className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Super Admin' : 'Admin'}</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@example.com"}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="cursor-pointer gap-2">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                  localStorage.removeItem('authToken')
                                  localStorage.removeItem('user')
                                  fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                                    window.location.href = '/auth/login'
                                  })
                                }}
                                className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="max-w-2xl mx-auto p-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search pages... (Dashboard, Users, Packages, Settings...)"
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setSearchIndex(0) }}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                autoFocus
                            />
                        </div>

                        {filteredResults.length > 0 && (
                            <div className="mt-2 border border-border rounded-xl bg-card overflow-hidden">
                                {filteredResults.map((item, i) => (
                                    <button
                                        key={item.path}
                                        onClick={() => navigateToResult(item.path)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
                                            i === safeIndex
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'hover:bg-secondary/50 text-foreground'
                                        )}
                                    >
                                        <span className="flex-1">{item.label}</span>
                                        {i === safeIndex && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchQuery.trim() && filteredResults.length === 0 && (
                            <div className="mt-2 p-4 text-center text-sm text-muted-foreground">
                                No pages found for "<span className="text-foreground">{searchQuery}</span>"
                            </div>
                        )}

                        {!searchQuery.trim() && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                <kbd className="px-2 py-1 bg-muted rounded border border-border">↑↓</kbd>
                                <span>to navigate</span>
                                <kbd className="px-2 py-1 bg-muted rounded border border-border">↵</kbd>
                                <span>to select</span>
                                <kbd className="px-2 py-1 bg-muted rounded border border-border">esc</kbd>
                                <span>to close</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
