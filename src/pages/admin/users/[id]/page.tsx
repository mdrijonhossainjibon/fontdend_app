import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Box,
    Clock,
    Key,
    Copy,
    Trash2,
    RefreshCw,
    Plus,
    Eye,
    EyeOff
} from "lucide-react"
import {
    fetchAdminUserDetailsRequest,
    fetchAdminUserApiKeysRequest,
    generateAdminUserApiKeyRequest,
    deleteAdminUserApiKeyRequest,
    regenerateAdminUserApiKeyRequest,
} from "@/modules/admin/user-details/actions"

export default function UserDetailPage() {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, packages, apiKeys, loading, apiKeysLoading, generatingKey } = useSelector((state: any) => state.adminUserDetails)

    const [keyName, setKeyName] = useState("")
    const [showGenerate, setShowGenerate] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
    const [confirmRegenerate, setConfirmRegenerate] = useState<string | null>(null)
    const [showFullKey, setShowFullKey] = useState<Record<string, boolean>>({})

    const maskKey = (k: string) => {
        if (k.length <= 16) return '\u2022'.repeat(8)
        return k.substring(0, 8) + '\u2022'.repeat(8) + k.slice(-4)
    }

    useEffect(() => {
        if (params.id) {
            dispatch(fetchAdminUserDetailsRequest(params.id))
            dispatch(fetchAdminUserApiKeysRequest(params.id))
        }
    }, [params.id, dispatch])

    const handleGenerate = () => {
        if (!keyName.trim() || !params.id) return
        dispatch(generateAdminUserApiKeyRequest(params.id, keyName.trim()))
        setKeyName("")
        setShowGenerate(false)
    }

    const handleCopy = async (key: string, id: string) => {
        try {
            await navigator.clipboard.writeText(key)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch {
            // fallback
        }
    }

    const handleDelete = (keyId: string) => {
        if (!params.id) return
        dispatch(deleteAdminUserApiKeyRequest(params.id, keyId))
        setConfirmDelete(null)
    }

    const handleRegenerate = (keyId: string) => {
        if (!params.id) return
        dispatch(regenerateAdminUserApiKeyRequest(params.id, keyId))
        setConfirmRegenerate(null)
    }

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
                        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                        <p className="text-xs text-muted-foreground font-medium">Users / {user.name}</p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Profile Card - Left Sidebar */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-primary/15 to-primary/5" />
                        <div className="px-5 pb-5 -mt-10">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-background border-4 border-card shadow-xl flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <h2 className="mt-3 text-base font-bold text-foreground">{user.name}</h2>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                <div className="mt-3 flex gap-1.5">
                                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase">
                                    {user.role}
                                </span>
                                <span className={user.status === "Active" ? "px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-500/10 text-green-600 border border-green-500/20" : "px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/10 text-red-600 border border-red-500/20"}>
                                    {user.status}
                                </span>
                                </div>
                            </div>
                            <div className="mt-5 space-y-3 border-t border-border/50 pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Email</span>
                                    <span className="text-xs text-foreground font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Joined</span>
                                    <span className="text-xs text-foreground font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">2FA</span>
                                    {user.twoFactorEnabled ? (
                                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Not Set</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Last IP</span>
                                    <span className="text-xs text-foreground font-mono">{user.lastLoginIp || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-border/50">
                                <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/0 p-3">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Balance</p>
                                    <p className="text-xl font-extrabold text-foreground mt-0.5">
                                        ${user.balance?.toFixed(4) || '0.0000'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Right Area */}
                <div className="lg:col-span-4 space-y-5">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border/50 bg-card p-4">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Balance</p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5">{user.balance ?? 0}</p>
                        </div>
                        <div className="rounded-xl border border-border/50 bg-card p-4">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Packages</p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5">{packages.length}</p>
                        </div>
                    </div>

                    {/* Packages Section */}
                    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                        <div className="border-b border-border/50 px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-sm">Active Packages</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">{packages.length} Active</span>
                        </div>
                        {packages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Box className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-sm font-medium">No active packages</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {packages.map((pkg: any) => (
                                    <div key={pkg._id} className="px-5 py-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Credits: {pkg.creditsUsed ?? 0} / {pkg.credits ?? 0}
                                        {pkg.endDate ? (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Expires {new Date(pkg.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        ) : null}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-primary">${pkg.price ?? 0}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                        {/* API Keys Section */}
                        <div className="rounded-xl border border-border/50 shadow-sm overflow-hidden bg-card">
                            <div className="border-b border-border/50 bg-secondary/30 px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold text-sm">API Keys</h3>
                                    <span className="text-xs text-muted-foreground">{apiKeys.length} keys</span>
                                </div>
                                <Button size="sm" onClick={() => setShowGenerate(!showGenerate)} className="h-8 text-xs gap-1.5">
                                    <Plus className="w-3.5 h-3.5" />
                                    Generate
                                </Button>
                            </div>

                            {showGenerate && (
                                    <div className="mb-6 p-4 rounded-2xl border border-border bg-secondary/20">
                                        <label className="text-sm font-medium text-foreground mb-2 block">Key Name</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={keyName}
                                                onChange={(e) => setKeyName(e.target.value)}
                                                placeholder="e.g. Production API Key"
                                                className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                            />
                                            <Button onClick={handleGenerate} disabled={!keyName.trim() || generatingKey}>
                                                {generatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                Create
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {apiKeysLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    </div>
                                ) : apiKeys.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Key className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm font-medium">No API keys</p>
                                        <p className="text-xs mt-1">Click Generate to create one</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border/50 text-xs text-muted-foreground">
                                                    <th className="text-left font-medium py-3 px-4">Name</th>
                                                    <th className="text-left font-medium py-3 px-4">API Key</th>
                                                    <th className="text-left font-medium py-3 px-4">Created</th>
                                                    <th className="text-left font-medium py-3 px-4">Last Used</th>
                                                    <th className="text-right font-medium py-3 px-4">Usage</th>
                                                    <th className="text-right font-medium py-3 px-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {apiKeys.map((key: any) => {
                                                    const keyId = key._id || key.id
                                                    const fullKeyStr = key.fullKey || key.key || ''
                                                    const masked = maskKey(fullKeyStr)
                                                    return (
                                                        <tr key={keyId} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Key className="w-3.5 h-3.5 text-primary/60" />
                                                                    <span className="font-medium text-foreground">{key.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-xs text-muted-foreground">
                                                                        {showFullKey[keyId] ? fullKeyStr : masked}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setShowFullKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))}
                                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                                        title={showFullKey[keyId] ? 'Hide' : 'Show'}
                                                                    >
                                                                        {showFullKey[keyId] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleCopy(fullKeyStr, keyId)}
                                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                                        title="Copy"
                                                                    >
                                                                        {copiedId === keyId ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4 text-xs text-muted-foreground">
                                                                {key.createdAt ? new Date(key.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                                            </td>
                                                            <td className="py-3 px-4 text-xs text-muted-foreground">
                                                                {key.lastUsed ? (
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(key.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                    </span>
                                                                ) : '-'}
                                                            </td>
                                                            <td className="py-3 px-4 text-right text-xs text-muted-foreground">
                                                                {key.usageCount ?? 0}
                                                            </td>
                                                            <td className="py-3 px-4 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        onClick={() => setConfirmRegenerate(keyId)}
                                                                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-amber-500 transition-all"
                                                                        title="Regenerate"
                                                                    >
                                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setConfirmDelete(keyId)}
                                                                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-red-500 transition-all"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>

                                        {/* Confirmation dialogs */}
                                        {confirmRegenerate && (
                                            <div className="border-t border-border/50 px-4 py-3 bg-amber-500/5 flex items-center justify-between">
                                                <p className="text-xs text-amber-600 font-medium">Regenerate this key? The old key will stop working immediately.</p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => setConfirmRegenerate(null)} className="text-xs h-7">Cancel</Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleRegenerate(confirmRegenerate)} className="text-xs h-7 bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20">Confirm</Button>
                                                </div>
                                            </div>
                                        )}
                                        {confirmDelete && (
                                            <div className="border-t border-border/50 px-4 py-3 bg-red-500/5 flex items-center justify-between">
                                                <p className="text-xs text-red-600 font-medium">Delete this key? This action cannot be undone.</p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)} className="text-xs h-7">Cancel</Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleDelete(confirmDelete)} className="text-xs h-7 bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500/20">Delete</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
    )
}