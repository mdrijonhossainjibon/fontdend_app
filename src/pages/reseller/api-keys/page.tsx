import { useEffect, useState } from 'react'
import { Key, Eye, EyeOff, Copy, Check, RefreshCw, Trash2, Calendar, RotateCw, AlertCircle, Gift } from 'lucide-react'
import { API_CALL } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'

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

export default function ResellerApiKeys() {
    const [keys, setKeys] = useState<ApiKeyRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newKeyName, setNewKeyName] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [balance, setBalance] = useState(0)
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [lastCoupon, setLastCoupon] = useState<{ code: string; amount: number } | null>(null)
    const navigate = useNavigate()

    const fetchKeys = async (showLoader = true) => {
        if (showLoader) setLoading(true)
        const res = await API_CALL({ method: 'GET', url: '/reseller/api-keys' })
        if (res.status >= 200 && res.status < 300) {
            setKeys(res.response.apiKeys || [])
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to load API keys')
        }
        setLoading(false)
        setRefreshing(false)
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchKeys(false)
    }

    useEffect(() => { fetchKeys() }, [])

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
            setKeys(prev => prev.map(k => k._id === id ? { ...k, key: res.response.apiKey?.key || k.key } : k))
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to regenerate')
        }
    }

    const deleteKey = async (id: string) => {
        const res = await API_CALL({ method: 'DELETE', url: `/reseller/api-keys/${id}` })
        if (res.status >= 200 && res.status < 300) {
            toast.success('API key deleted')
            setKeys(prev => prev.filter(k => k._id !== id))
        } else {
            toast.error(res.response?.error || res.response?.message || 'Failed to delete API key')
        }
    }

    const createApiKey = async () => {
        if (!newKeyName.trim()) return toast.error('Name is required')
        const res = await API_CALL({ method: 'POST', url: '/reseller/api-keys', body: { name: newKeyName } })
        if (res.status >= 200 && res.status < 300) {
            toast.success('API key created')
            setShowCreateModal(false)
            setNewKeyName('')
            fetchKeys()
            if (res.response?.coupon) {
                setLastCoupon({ code: res.response.coupon.code, amount: res.response.coupon.amount })
                setShowCouponModal(true)
            }
        } else {
            const msg = res.response?.error || res.response?.message || ''
            if (typeof msg === 'string' && msg.includes('Minimum')) {
                toast.error(msg)
                navigate('/dashboard/topup')
            } else {
                toast.error(msg || 'Failed to create API key')
            }
        }
    }

    const maskKey = (key: string) => {
        if (key.length <= 12) return key
        return key.slice(0, 10) + '••••••••' + key.slice(-6)
    }

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-500/10 text-green-500 border-green-500/20',
            inactive: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            expired: 'bg-red-500/10 text-red-500 border-red-500/20',
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                {status}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">API Keys</h1>
                    <p className="text-muted-foreground">Manage your reseller API keys and view customer assignments</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing} title="Refresh">
                        <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Key className="w-4 h-4 mr-1" /> Create Key
                    </Button>
                </div>
            </div>

            {keys.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                    <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium mb-1">No API keys yet</p>
                    <p className="text-sm mb-4">Create a key to start reselling. Keys can be linked to packages when customers purchase through you.</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Key className="w-4 h-4 mr-1" /> Create Your First Key
                    </Button>
                </div>
            ) : (
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30 text-muted-foreground">
                                    <th className="text-left p-3 font-medium">Name</th>
                                    <th className="text-left p-3 font-medium">API Key</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Usage</th>
                                    <th className="text-left p-3 font-medium">Created</th>
                                    <th className="text-right p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.map(k => (
                                    <tr key={k._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="p-3">
                                            <span className="font-medium">{k.name}</span>
                                        </td>
                                        <td className="p-3">
                                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                                {visibleKeys.has(k._id) ? k.key : maskKey(k.key)}
                                            </code>
                                        </td>
                                        <td className="p-3">{statusBadge(k.status)}</td>
                                        <td className="p-3">
                                            <span className="text-muted-foreground">{k.usageCount}</span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-xs">{new Date(k.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-0.5">
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => toggleVisibility(k._id)} title={visibleKeys.has(k._id) ? 'Hide' : 'Show'}>
                                                    {visibleKeys.has(k._id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => copyKey(k._id, k.key)} title="Copy">
                                                    {copiedId === k._id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => regenerateKey(k._id)} title="Regenerate">
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => deleteKey(k._id)} title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create API Key Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create API Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Key Name</label>
                            <input
                                className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. Customer ABC Key"
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

            {/* Coupon Reward Modal */}
            <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-500">
                            <Gift className="w-5 h-5" />
                            🎉 Advance Coupon Generated!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Your $100 Advance Due Coupon</p>
                            <p className="text-2xl font-mono font-bold tracking-wider text-emerald-500 select-all">
                                {lastCoupon?.code}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">Coupon Code — Copy & use at checkout</p>
                        </div>
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (lastCoupon?.code) {
                                        navigator.clipboard.writeText(lastCoupon.code)
                                        toast.success('Coupon code copied')
                                    }
                                }}
                            >
                                <Copy className="w-4 h-4 mr-1" /> Copy Code
                            </Button>
                            <Button onClick={() => setShowCouponModal(false)}>Done</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
