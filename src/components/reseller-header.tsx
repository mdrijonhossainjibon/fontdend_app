"use client"

import { Wallet, LogOut, Shield, LayoutDashboard, Package, ShoppingCart, Key, Gift, Copy, Check, Menu } from "lucide-react"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { useMemo, useState } from "react"
import { API_CALL } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'

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

interface ResellerHeaderProps {
    onMenuToggle?: () => void
}

export function ResellerHeader({ onMenuToggle }: ResellerHeaderProps = {}) {
    const { user, status, refresh } = useAuth()
    const location = useLocation()

    const balance = user?.balance ?? 0
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [claimedCoupon, setClaimedCoupon] = useState<{ code: string; amount: number } | null>(null)
    const [copied, setCopied] = useState(false)

    const initials = useMemo(() => {
        if (!user?.name) return 'RS'
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }, [user?.name])

    const currentPage = pageTitles[location.pathname] || "Reseller Panel"

    const handleClaimCoupon = async () => {
        setClaiming(true)
        const res = await API_CALL({ method: 'GET', url: '/reseller/coupon/claim' })
        if (res.status >= 200 && res.status < 300) {
            setClaimedCoupon({ code: res.response.coupon.code, amount: res.response.coupon.amount })
            await refresh()
            toast.success('$100 advance coupon claimed!')
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to claim coupon')
        }
        setClaiming(false)
    }

    const copyCoupon = async () => {
        if (!claimedCoupon?.code) return
        try {
            await navigator.clipboard.writeText(claimedCoupon.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast.success('Coupon code copied')
        } catch { toast.error('Failed to copy') }
    }

    return (
        <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="w-full mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Page title */}
                    <div className="flex items-center gap-3">
                        {/* Mobile menu toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuToggle}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                            title="Toggle sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 shadow-sm text-white">
                            {pageIcons[location.pathname] || <LayoutDashboard className="w-5 h-5" />}
                        </div>
                        <h1 className="text-lg font-semibold text-foreground">{currentPage}</h1>
                    </div>

                    {/* Right: Balance + Avatar */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCouponModal(true)}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                            title="Claim $100 Advance Coupon"
                        >
                            <Gift className="w-4 h-4 text-amber-500" />
                        </button>
                        <div data-tour="balance" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
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

                                {['admin', 'superadmin'].includes(user?.role || '') && (
                                    <Link to="/admin">
                                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors">
                                            <Shield className="w-4 h-4" />
                                            <span>Admin Panel</span>
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                {!['admin', 'superadmin'].includes(user?.role || '') && (
                                    <Link to="/dashboard">
                                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Dashboard</span>
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
                    </div>
                </div>
            </div>

            {/* Coupon Claim Modal */}
            <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-500">
                            <Gift className="w-5 h-5" />
                            $100 Advance Coupon
                        </DialogTitle>
                    </DialogHeader>
                    {claimedCoupon ? (
                        <div className="space-y-4 py-2">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-center">
                                <p className="text-sm text-muted-foreground mb-2">Your $100 Advance Coupon Code</p>
                                <p className="text-2xl font-mono font-bold tracking-wider text-amber-500 select-all">
                                    {claimedCoupon.code}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">Valid for 30 days — use at checkout</p>
                            </div>
                            <div className="flex justify-center gap-2">
                                <Button variant="outline" onClick={copyCoupon}>
                                    {copied ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                    {copied ? 'Copied' : 'Copy Code'}
                                </Button>
                                <Button onClick={() => { setShowCouponModal(false); setClaimedCoupon(null) }}>Done</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-2">
                            <div className="p-4 rounded-xl bg-muted/50 border text-center space-y-2">
                                <Gift className="w-10 h-10 mx-auto text-amber-500" />
                                <p className="text-sm text-muted-foreground">
                                    Get a <strong className="text-foreground">$100 advance coupon</strong> to use at checkout.
                                    {balance >= 5
                                        ? ' Your balance qualifies — claim it now!'
                                        : ` You need a minimum $5 balance. Your balance: $${balance.toFixed(2)}`}
                                </p>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setShowCouponModal(false)}>Cancel</Button>
                                <Button
                                    onClick={handleClaimCoupon}
                                    disabled={claiming || balance < 5}
                                >
                                    {claiming ? 'Claiming...' : 'Claim $100 Coupon'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </header>
    )
}
