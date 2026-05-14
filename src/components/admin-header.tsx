"use client"

import { Bell, Search, Settings, User, Moon, Sun, Menu, LayoutDashboard, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from "@/components/AuthProvider"
import { cn } from "@/lib/utils"
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
    "/admin/wallet": { title: "Wallet", description: "Manage wallet and transactions" },
    "/admin/topup-history": { title: "Topup History", description: "View deposit and topup records" },
    "/admin/ai-training/bots": { title: "Bot Management", description: "Manage AI training bots" },
    "/admin/email": { title: "Email Templates", description: "Manage email templates" },
    "/admin/database": { title: "Database", description: "Database management and monitoring" },
    "/admin/permissions": { title: "Permissions", description: "Manage user permissions" },
    "/admin/2fa": { title: "2FA Management", description: "Two-factor authentication settings" },
    "/admin/settings": { title: "Settings", description: "General system settings and configuration" },
}

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user, status } = useAuth()
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()
    const [isDark, setIsDark] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [notifications, setNotifications] = useState(3)

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
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold ring-2 ring-background group-hover:ring-primary/20 transition-all duration-300">
                                        AD
                                    </div>
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
                <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search users, analytics, packages..."
                                className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                autoFocus
                            />
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <kbd className="px-2 py-1 bg-muted rounded border border-border">↑↓</kbd>
                            <span>to navigate</span>
                            <kbd className="px-2 py-1 bg-muted rounded border border-border">↵</kbd>
                            <span>to select</span>
                            <kbd className="px-2 py-1 bg-muted rounded border border-border">esc</kbd>
                            <span>to close</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
