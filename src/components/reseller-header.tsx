"use client"

import { Wallet, LogOut, Shield, LayoutDashboard, Package, ShoppingCart, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from "@/components/AuthProvider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo } from "react"

const pageTitles: Record<string, string> = {
    "/reseller": "Dashboard",
    "/reseller/packages": "My Packages",
    "/reseller/packages/buy": "Buy Package",
    "/reseller/api-keys": "API Keys",
}

const pageIcons: Record<string, React.ReactNode> = {
    "/reseller": <LayoutDashboard className="w-5 h-5" />,
    "/reseller/packages": <Package className="w-5 h-5" />,
    "/reseller/packages/buy": <ShoppingCart className="w-5 h-5" />,
    "/reseller/api-keys": <Key className="w-5 h-5" />,
}

export function ResellerHeader() {
    const { user, status } = useAuth()
    const location = useLocation()

    const balance = user?.balance ?? 0

    const initials = useMemo(() => {
        if (!user?.name) return 'RS'
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }, [user?.name])

    const currentPage = pageTitles[location.pathname] || "Reseller Panel"

    return (
        <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="w-full mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Page title */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 shadow-sm text-white">
                            {pageIcons[location.pathname] || <LayoutDashboard className="w-5 h-5" />}
                        </div>
                        <h1 className="text-lg font-semibold text-foreground">{currentPage}</h1>
                    </div>

                    {/* Right: Balance + Avatar */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Wallet className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-emerald-500">${balance.toFixed(2)}</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full w-9 h-9 p-0 hover:ring-2 hover:ring-emerald-500/30 transition-all"
                                >
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Reseller')}&backgroundColor=10b981`} alt={user?.name || 'Reseller'} />
                                        <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border bg-card/95 backdrop-blur-md shadow-xl">
                                <DropdownMenuLabel className="p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium text-foreground leading-none">{user?.name || "Reseller"}</p>
                                        <p className="text-xs text-muted-foreground leading-none truncate">{user?.email || "Loading..."}</p>
                                        <span className="text-[10px] font-medium text-emerald-500 mt-1 uppercase tracking-wider">Reseller</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50" />

                                {user?.role === 'admin' && (
                                    <>
                                        <Link to="/admin">
                                            <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors">
                                                <Shield className="w-4 h-4" />
                                                <span>Admin Panel</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator className="bg-border/50" />
                                    </>
                                )}

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
                    </div>
                </div>
            </div>
        </header>
    )
}
