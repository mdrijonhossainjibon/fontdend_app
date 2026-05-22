import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    User,
    Mail,
    Calendar,
    Shield,
    CreditCard,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    Activity,
    Box,
    Clock,
    History,
    ShieldAlert,
    PieChart,
    Zap
} from "lucide-react"
import { fetchAdminUserDetailsRequest } from "@/modules/admin/user-details/actions"

export default function UserDetailPage() {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, packages, activities, loading } = useSelector((state: any) => state.adminUserDetails)

    useEffect(() => {
        if (params.id) {
            dispatch(fetchAdminUserDetailsRequest(params.id))
        }
    }, [params.id, dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-muted-foreground">User not found</p>
                <Button onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">User Details</h1>
                        <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">Management / Users / {user.id.substring(0, 8)}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Close
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1 border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                    <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/30 relative">
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.status === "Active"
                                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                : "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                }`}>
                                {user.status}
                            </span>
                        </div>
                    </div>
                    <CardContent className="-mt-16 space-y-6 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-3xl bg-background border-8 border-background shadow-xl flex items-center justify-center text-5xl font-bold text-primary mb-4 transform hover:scale-105 transition-transform duration-300">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                            <p className="text-sm text-muted-foreground font-medium">{user.email}</p>

                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <span className="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase tracking-tight">
                                    {user.role}
                                </span>
                                <span className="px-4 py-1.5 text-xs font-bold rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 uppercase tracking-tight">
                                    v1.0.0
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 space-y-4 border-t border-border">
                            <div className="flex items-center justify-between group">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email
                                </span>
                                <span className="text-sm text-foreground font-semibold group-hover:text-primary transition-colors">{user.email}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Joined
                                </span>
                                <span className="text-sm text-foreground font-semibold group-hover:text-primary transition-colors">
                                    {new Date(user.joined).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Security
                                </span>
                                <span className="text-sm text-foreground font-semibold flex items-center gap-1.5">
                                    {user.twoFactorEnabled ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-green-600">2FA Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">No 2FA</span>
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Details Container */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="border-none shadow-lg shadow-primary/5 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden relative">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <CreditCard className="w-32 h-32" />
                            </div>
                            <CardContent className="pt-8">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-primary uppercase tracking-wider">Wallet Balance</p>
                                    <p className="text-4xl font-extrabold text-foreground tracking-tighter">
                                        ${user.balance.toFixed(4)}
                                    </p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Available for withdrawal
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-sm bg-card/50">
                            <CardContent className="pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-orange-500/10">
                                        <Activity className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase">Activity</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-muted-foreground">Last IP Address</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {user.lastLogin || 'N/A'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Information Sections */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Active Packages Section */}
                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <CardHeader className="bg-secondary/30 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Box className="w-5 h-5 text-primary" />
                                        Active Packages
                                    </CardTitle>
                                    <CardDescription>Currently active service subscriptions</CardDescription>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                                    {packages.length} Active
                                </span>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {packages.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border">
                                        No active packages found
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {packages.map((pkg: any) => (
                                            <div key={pkg._id} className="p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{pkg.name}</h4>
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-green-500/10 text-green-600">Active</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Usage</span>
                                                        <span className="font-bold">{pkg.creditsUsed} / {pkg.credits}</span>
                                                    </div>
                                                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-primary h-full transition-all duration-1000"
                                                            style={{ width: `${(pkg.creditsUsed / pkg.credits) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2">
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            Expires {new Date(pkg.endDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-xs font-bold text-primary">${pkg.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Activity History Section */}
                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <CardHeader className="bg-secondary/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <History className="w-5 h-5 text-primary" />
                                    Activity History
                                </CardTitle>
                                <CardDescription>Recent system interactions and events</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {activities.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No recent activities recorded
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/40">
                                        {activities.map((activity: any, i: number) => (
                                            <div key={activity._id} className="py-4 flex items-start gap-4 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                <div className={`p-2 rounded-xl mt-0.5 ${activity.status === 'success' ? 'bg-green-500/10 text-green-600' :
                                                    activity.status === 'failed' ? 'bg-red-500/10 text-red-600' :
                                                        'bg-amber-500/10 text-amber-600'
                                                    }`}>
                                                    {activity.type === 'auth' ? <ShieldAlert className="w-4 h-4" /> :
                                                        activity.type === 'billing' ? <CreditCard className="w-4 h-4" /> :
                                                            activity.type === 'system' ? <Zap className="w-4 h-4" /> :
                                                                <Activity className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-foreground">{activity.action}</p>
                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                            {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                                                    <div className="flex items-center gap-3 pt-1">
                                                        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded opacity-70">IP: {activity.ip}</span>
                                                        <span className="text-[10px] text-muted-foreground italic">{activity.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* System Info Section */}
                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-foreground">Internal Management ID</h4>
                                    <p className="text-sm font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded inline-block">{user.id}</p>
                                    <p className="text-xs text-muted-foreground mt-2">This is the unique system identifier for this user across all database collections.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
