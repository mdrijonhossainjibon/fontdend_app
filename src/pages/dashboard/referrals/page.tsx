"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/modules/rootReducer"
import { fetchReferralStatsRequest, fetchReferralListRequest } from "@/modules/referrals/actions"
import {
    Users,
    Share2,
    Copy,
    CheckCircle2,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Clock,
    ChevronRight,
    Zap,
    Star,
    Trophy
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReferralsPage() {
    const dispatch = useDispatch()
    const { stats, loading, list, listLoading } = useSelector((state: RootState) => state.referrals)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        dispatch(fetchReferralStatsRequest())
        dispatch(fetchReferralListRequest())
    }, [dispatch])

    const referralCode = stats?.referralCode || ""
    const referralLink = referralCode
        ? `${window.location.origin}/auth/signup?ref=${referralCode}`
        : ""

    const handleCopy = () => {
        if (!referralLink) return
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const statCards = [
        { label: "Total Referrals", value: loading ? "..." : String(stats?.totalReferrals ?? 0), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Users", value: loading ? "..." : String(stats?.activeUsers ?? 0), icon: Zap, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Total Earned", value: loading ? "..." : `$${(stats?.totalEarned ?? 0).toFixed(2)}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Pending Earn", value: loading ? "..." : `$${(stats?.pendingEarnings ?? 0).toFixed(2)}`, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    ]

    return (
        <div className="relative p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-700 min-h-[calc(100vh-100px)]">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Referral Link Card */}
                <Card className="lg:col-span-2 border-border/50 bg-card/30 backdrop-blur-md overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                            Your Referral Link
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Copy and share this link to start earning commissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-secondary text-muted-foreground">
                                    <Share2 className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    value={loading && !referralLink ? "Generating your referral link..." : referralLink}
                                    className="w-full pl-14 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm font-mono text-muted-foreground focus:outline-none"
                                    placeholder="Generating your referral link..."
                                />
                            </div>
                            <Button
                                onClick={handleCopy}
                                disabled={!referralLink}
                                className="rounded-xl px-6 h-auto py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold flex items-center gap-2"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Link"}
                            </Button>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20">
                            <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> How it works
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                                    <p className="font-bold text-sm text-foreground">Spread the link</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Share your unique link on social media, blogs, or with your friends.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                                    <p className="font-bold text-sm text-foreground">They join & top-up</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">New users sign up through your link and purchase credits or packages.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</div>
                                    <p className="font-bold text-sm text-foreground">Earn {stats?.commissionRate ?? 15}% Rewards</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Instantly receive a {stats?.commissionRate ?? 15}% commission from every purchase they make!</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Highlights Card */}
                <Card className="border-border/50 bg-primary/5 border-primary/20 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                    <CardHeader>
                        <CardTitle className="text-primary tracking-wide uppercase text-xs font-black">Program Highlights</CardTitle>
                        <CardDescription className="text-foreground font-bold text-lg">Maximum Commission</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="text-4xl font-black text-primary tracking-tighter">{stats?.commissionRate ?? 15}.0%</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We offer one of the most competitive affiliate programs in the captcha market. Your earnings are uncapped.
                        </p>

                        <div className="space-y-3 pt-4 border-t border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <CheckCircle2 className="w-3 h-3 h-3" />
                                </div>
                                <span className="text-xs font-medium text-foreground">Lifetime Commission</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <span className="text-xs font-medium text-foreground">Detailed Analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <span className="text-xs font-medium text-foreground">Promotional Materials</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full mt-auto border-primary/50 text-primary hover:bg-primary/10 group font-bold transition-all h-10">
                            View Terms <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Referrals */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-foreground">Recent Referrals</CardTitle>
                        <CardDescription className="text-muted-foreground">Track your latest invites and their activity.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="px-4 py-3 font-medium uppercase text-[10px] tracking-widest">User</th>
                                    <th className="px-4 py-3 font-medium uppercase text-[10px] tracking-widest">Joined</th>
                                    <th className="px-4 py-3 font-medium uppercase text-[10px] tracking-widest">Status</th>
                                    <th className="px-4 py-3 font-medium uppercase text-[10px] tracking-widest">Commission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-16 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center animate-pulse">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <p className="font-medium">Loading referrals...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : list.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-16 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <p className="font-medium">No referrals yet. Share your link to get started!</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((item) => (
                                        <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                        {item.user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground text-sm">{item.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{item.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-sm">
                                                {new Date(item.joined).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.status === 'active'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}>
                                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-foreground font-medium text-sm">
                                                ${item.commission.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
