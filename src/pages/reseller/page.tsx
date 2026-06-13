import { useEffect, useState } from 'react'
import { Key, Package, Activity, Eye, EyeOff, Copy, Check, RefreshCw, Trash2, Plus } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { API_CALL } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

interface Stats {
    totalPackages: number
    activePackages: number
    totalApiKeys: number
    activeApiKeys: number
    totalCredits: number
    totalUsed: number
    usagePercentage: number
}

interface PackageRecord {
    _id: string
    name: string
    packageCode: string
    status: string
    credits: number
    creditsUsed: number
    creditsRemaining: number
    startDate: string
    endDate: string
}

interface ApiKeyRecord {
    _id: string
    name: string
    key: string
    prefix: string
    status: string
    usageCount: number
    lastUsed?: string
    createdAt: string
}

export default function ResellerDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState<Stats | null>(null)
    const [recentKeys, setRecentKeys] = useState<ApiKeyRecord[]>([])
    const [packages, setPackages] = useState<PackageRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newKeyName, setNewKeyName] = useState('')

    const fetchData = async () => {
        try {
            const [statsRes, packagesRes, keysRes] = await Promise.all([
                API_CALL({ method: 'GET', url: '/reseller/stats' }),
                API_CALL({ method: 'GET', url: '/reseller/packages' }),
                API_CALL({ method: 'GET', url: '/reseller/api-keys' }),
            ])
            setStats(statsRes.response.stats)
            setPackages(packagesRes.response.packages || [])
            setRecentKeys((keysRes.response.apiKeys || []).slice(0, 5))
        } catch (err: any) {
            toast.error(err?.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

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

    const createApiKey = async () => {
        if (!newKeyName.trim()) return toast.error('Name is required')
        try {
            await API_CALL({ method: 'POST', url: '/reseller/api-keys', body: { name: newKeyName } })
            toast.success('API key created')
            setShowCreateModal(false)
            setNewKeyName('')
            fetchData()
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create API key')
        }
    }

    const deleteKey = async (id: string) => {
        try {
            await API_CALL({ method: 'DELETE', url: `/reseller/api-keys/${id}` })
            toast.success('API key deleted')
            fetchData()
        } catch (err: any) {
            toast.error(err?.message || 'Failed to delete API key')
        }
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
            cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-500/10 text-gray-500'}`}>
                {status}
            </span>
        )
    }

    const maskKey = (key: string) => {
        if (key.length <= 12) return key
        return key.slice(0, 10) + '••••••••' + key.slice(-6)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Reseller Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">Active Packages</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.activePackages || 0}</p>
                    <p className="text-xs text-muted-foreground">{stats?.totalPackages || 0} total</p>
                </div>
                <div className="rounded-xl border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Key className="w-4 h-4" />
                        <span className="text-sm">API Keys</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalApiKeys || 0}</p>
                    <p className="text-xs text-muted-foreground">{stats?.activeApiKeys || 0} active</p>
                </div>
                <div className="rounded-xl border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm">Credits Used</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalUsed || 0}</p>
                    <p className="text-xs text-muted-foreground">of {stats?.totalCredits || 0}</p>
                </div>
                <div className="rounded-xl border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm">Usage</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.usagePercentage || 0}%</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${Math.min(stats?.usagePercentage || 0, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent API Keys */}
            <div className="rounded-xl border bg-card">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold">Recent API Keys</h2>
                    <Button size="sm" onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Create Key
                    </Button>
                </div>
                {recentKeys.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No API keys yet. Create your first key.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="text-left p-3 font-medium">Name</th>
                                    <th className="text-left p-3 font-medium">Key</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Usage</th>
                                    <th className="text-right p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentKeys.map(k => (
                                    <tr key={k._id} className="border-b last:border-0 hover:bg-muted/50">
                                        <td className="p-3 font-medium">{k.name}</td>
                                        <td className="p-3">
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {visibleKeys.has(k._id) ? k.key : maskKey(k.key)}
                                            </code>
                                        </td>
                                        <td className="p-3">{statusBadge(k.status)}</td>
                                        <td className="p-3 text-muted-foreground">{k.usageCount}</td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => toggleVisibility(k._id)}>
                                                    {visibleKeys.has(k._id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => copyKey(k._id, k.key)}>
                                                    {copiedId === k._id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => deleteKey(k._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create API Key Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create API Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Key Name</label>
                            <Input
                                placeholder="e.g. Production Key"
                                value={newKeyName}
                                onChange={e => setNewKeyName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && createApiKey()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                        <Button onClick={createApiKey}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
