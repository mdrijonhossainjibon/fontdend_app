import { useEffect, useState, useMemo } from 'react'
import { Package, AlertCircle, Check, Eye, EyeOff, Copy, RefreshCw, Trash2, Search, Clock, RotateCw } from 'lucide-react'
import { API_CALL } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'

interface CustomerRecord {
    _id: string
    customerEmail?: string
    name: string
    key: string
    prefix: string
    status: string
    usageCount: number
    lastUsed?: string
    packageCode: string
    packageName: string
    packageType: string
    price: number
    credits: number
    creditsUsed: number
    startDate: string
    endDate: string
    createdAt: string
}

function ExpiryCountdown({ endDate }: { endDate: string }) {
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [])

    const end = new Date(endDate).getTime()
    const diff = end - now

    if (diff <= 0) return <span className="text-red-500 font-medium">Expired</span>

    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    return (
        <span className="flex items-center gap-1 text-xs font-mono tabular-nums">
            <Clock className="w-3 h-3 text-muted-foreground" />
            {d > 0 && <span>{d}d </span>}
            <span>{h}h </span>
            <span>{m}m </span>
            <span>{s}s</span>
        </span>
    )
}

function RefillCountdown({ packageType, startDate }: { packageType: string; startDate: string }) {
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        if (packageType !== 'daily') return
        const timer = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [packageType])

    if (packageType !== 'daily') return null

    const start = new Date(startDate).getTime()
    const elapsed = now - start
    const cycleMs = 24 * 60 * 60 * 1000
    const nextRefill = start + (Math.floor(elapsed / cycleMs) + 1) * cycleMs
    const diff = nextRefill - now

    if (diff <= 0) return null

    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    return (
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Next refill in">
            <Clock className="w-3 h-3 text-amber-500" />
            <span className="text-amber-500 font-mono tabular-nums">Refill {h}h {m}m {s}s</span>
        </span>
    )
}

export default function ResellerPackages() {
    const [packages, setPackages] = useState<CustomerRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    const fetchPackages = async (showLoader = true) => {
        if (showLoader) setLoading(true)
        const res = await API_CALL({ method: 'GET', url: '/reseller/packages' })
        if (res.status >= 200 && res.status < 300) {
            setPackages(res.response.packages || [])
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to load packages')
        }
        setLoading(false)
        setRefreshing(false)
    }

    useEffect(() => { fetchPackages() }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchPackages(false)
    }

    const filtered = useMemo(() => {
        if (!search.trim()) return packages
        const q = search.toLowerCase()
        return packages.filter(p =>
            p.packageName.toLowerCase().includes(q) ||
            p.packageCode.toLowerCase().includes(q) ||
            p.customerEmail?.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            p.key.toLowerCase().includes(q)
        )
    }, [packages, search])

    const toggleVisibility = (id: string) => {
        setVisibleKeys(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const copyKey = async (id: string, key: string) => {
        try {
            await navigator.clipboard.writeText(key)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
            toast.success('Copied to clipboard')
        } catch { toast.error('Failed to copy') }
    }

    const regenerateKey = async (id: string) => {
        const res = await API_CALL({ method: 'PUT', url: `/reseller/api-keys/${id}/regenerate` })
        if (res.status >= 200 && res.status < 300) {
            toast.success('API key regenerated')
            setPackages(prev => prev.map(p => p._id === id ? { ...p, key: res.response.apiKey.key } : p))
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to regenerate')
        }
    }

    const deleteKey = async (id: string) => {
        const res = await API_CALL({ method: 'DELETE', url: `/reseller/api-keys/${id}` })
        if (res.status >= 200 && res.status < 300) {
            toast.success('API key deleted')
            setPackages(prev => prev.filter(p => p._id !== id))
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to delete')
        }
    }

    const deleteCustomerPackage = async (pkgId: string) => {
        const res = await API_CALL({ method: 'DELETE', url: `/reseller/packages/${pkgId}` })
        if (res.status >= 200 && res.status < 300) {
            toast.success(res.response?.message || 'Customer package deleted')
            setPackages(prev => prev.filter(p => p._id !== pkgId))
            setDeleteTarget(null)
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to delete customer package')
        }
    }

    const maskKey = (key: string) => {
        if (key.length <= 12) return key
        return key.slice(0, 10) + '••••••••' + key.slice(-6)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        )
    }

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-500/10 text-green-500 border-green-500/20',
            expired: 'bg-red-500/10 text-red-500 border-red-500/20',
            inactive: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-500/10 text-gray-500'}`}>
                {status}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Packages</h1>
                    <p className="text-muted-foreground">Customer packages and their API keys</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing} title="Refresh">
                        <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search packages, keys, emails..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {packages.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No packages yet</p>
                    <p className="text-sm">Buy a package to get started.</p>
                </div>
            ) : (
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30 text-muted-foreground">
                                    <th className="text-left p-3 font-medium">Package</th>
                                    <th className="text-left p-3 font-medium">Price</th>
                                    <th className="text-left p-3 font-medium">Customer</th>
                                    <th className="text-left p-3 font-medium">API Key</th>
                                    <th className="text-left p-3 font-medium">Credits</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Expiry</th>
                                    <th className="text-left p-3 font-medium">Refill</th>
                                    <th className="text-right p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(pkg => {
                                    const usedPercent = pkg.credits > 0 ? Math.round((pkg.creditsUsed / pkg.credits) * 100) : 0
                                    const isExpired = new Date(pkg.endDate) < new Date()

                                    return (
                                        <tr key={pkg._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{pkg.packageName}</span>
                                                    <span className="text-xs text-muted-foreground">{pkg.packageCode}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-medium">${pkg.price.toFixed(2)}</span>
                                            </td>
                                            <td className="p-3">
                                                {pkg.customerEmail ? (
                                                    <span className="text-xs text-muted-foreground">{pkg.customerEmail}</span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/60">—</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1.5">
                                                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono whitespace-nowrap">
                                                        {visibleKeys.has(pkg._id) ? pkg.key : maskKey(pkg.key)}
                                                    </code>
                                                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => toggleVisibility(pkg._id)} title="Show/Hide">
                                                        {visibleKeys.has(pkg._id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => copyKey(pkg._id, pkg.key)} title="Copy">
                                                        {copiedId === pkg._id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col gap-1 min-w-[100px]">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">{pkg.creditsUsed}/{pkg.credits}</span>
                                                        <span className={usedPercent >= 90 ? 'text-red-500' : usedPercent >= 70 ? 'text-amber-500' : ''}>{usedPercent}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${usedPercent >= 90 ? 'bg-red-500' : usedPercent >= 70 ? 'bg-amber-500' : 'bg-primary'}`}
                                                            style={{ width: `${Math.min(usedPercent, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">{statusBadge(pkg.status)}</td>
                                            <td className="p-3">
                                                {isExpired ? (
                                                    <div className="text-[10px] text-red-500 font-medium">Expired</div>
                                                ) : (
                                                    <ExpiryCountdown endDate={pkg.endDate} />
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <RefillCountdown packageType={pkg.packageType} startDate={pkg.startDate} />
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end gap-0.5">
                                                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => regenerateKey(pkg._id)} title="Regenerate">
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => deleteKey(pkg._id)} title="Delete Key">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    {pkg.customerEmail && (
                                                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => setDeleteTarget(pkg._id)} title="Delete Package">
                                                            <Package className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-3 py-2 border-t text-xs text-muted-foreground text-right">
                        {filtered.length} / {packages.length} packages
                    </div>
                </div>
            )}

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Customer Package</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this customer's package and their linked API key. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteTarget && deleteCustomerPackage(deleteTarget)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
