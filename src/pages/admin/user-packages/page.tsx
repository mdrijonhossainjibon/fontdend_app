import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Package, Search, RefreshCw, CheckCircle, XCircle, Clock, User, Ban, Play, AlertTriangle, Edit3, Save, X } from 'lucide-react'
import { fetchAllUserPackagesRequest, updateUserPackageRequest } from '@/modules/admin/user-packages/actions'

const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    expired: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const tabs = ['all', 'active', 'expired', 'cancelled'] as const

function getRemaining(endDate: string | null | undefined): { text: string; urgent: boolean } {
    if (!endDate) return { text: '—', urgent: false }
    const diff = new Date(endDate).getTime() - Date.now()
    if (diff <= 0) return { text: 'Expired', urgent: true }
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    if (days > 0) return { text: `${days}d ${hours}h`, urgent: days <= 3 }
    if (hours > 0) return { text: `${hours}h ${mins}m`, urgent: true }
    return { text: `${mins}m`, urgent: true }
}

function toDatetimeLocal(date: string | Date): string {
    const d = new Date(date)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminUserPackages() {
    const dispatch = useDispatch()
    const { allPackages, allLoading, updating } = useSelector((state: any) => state.adminUserPackages)
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<any>({})

    useEffect(() => { dispatch(fetchAllUserPackagesRequest()) }, [dispatch])

    const filtered = allPackages.filter((p: any) => {
        const user = p.userId || {}
        const userName = (user.name || '').toLowerCase()
        const userEmail = (user.email || '').toLowerCase()
        const q = search.toLowerCase()
        const matchesSearch = !search || userName.includes(q) || userEmail.includes(q) || (p.name || '').toLowerCase().includes(q)
        const matchesTab = activeTab === 'all' || p.status === activeTab
        return matchesSearch && matchesTab
    })

    const statCards = [
        { label: 'Total Assigned', value: allPackages.length, icon: Package, color: 'from-blue-500 to-blue-600' },
        { label: 'Active', value: allPackages.filter((p: any) => p.status === 'active').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
        { label: 'Expired', value: allPackages.filter((p: any) => p.status === 'expired').length, icon: XCircle, color: 'from-red-500 to-red-600' },
        { label: 'Cancelled', value: allPackages.filter((p: any) => p.status === 'cancelled').length, icon: Ban, color: 'from-gray-500 to-gray-600' },
    ]

    const startEdit = (pkg: any) => {
        setEditingId(pkg._id)
        setEditForm({
            status: pkg.status || 'active',
            endDate: pkg.endDate ? toDatetimeLocal(pkg.endDate) : '',
            credits: pkg.credits ?? 0,
            creditsUsed: pkg.creditsUsed ?? 0,
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    const saveEdit = (pkg: any) => {
        const payload: any = { packageId: pkg._id }
        if (editForm.status !== pkg.status) payload.status = editForm.status
        if (editForm.endDate && new Date(editForm.endDate).getTime() !== new Date(pkg.endDate).getTime()) {
            payload.endDate = new Date(editForm.endDate).toISOString()
        }
        if (Number(editForm.credits) !== (pkg.credits ?? 0)) payload.credits = Number(editForm.credits)
        if (Number(editForm.creditsUsed) !== (pkg.creditsUsed ?? 0)) payload.creditsUsed = Number(editForm.creditsUsed)
        if (Object.keys(payload).length > 1) dispatch(updateUserPackageRequest(payload))
        setEditingId(null)
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">{card.label}</p>
                                <p className="text-2xl font-bold mt-1">{card.value}</p>
                            </div>
                            <card.icon className="w-8 h-8 opacity-50" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition -mb-px ${
                            activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab}
                        <span className="ml-2 text-xs opacity-60">
                            ({tab === 'all' ? allPackages.length : allPackages.filter((p: any) => p.status === tab).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by user name, email or package..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button
                    onClick={() => { setEditingId(null); dispatch(fetchAllUserPackagesRequest()) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent text-foreground text-sm transition"
                >
                    <RefreshCw className={`w-4 h-4 ${allLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Package</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Credits</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Used</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Remaining</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Type</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Price</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Expires In</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLoading ? (
                                <tr>
                                    <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Loading packages...
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        No packages found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((pkg: any) => {
                                    const user = pkg.userId || {}
                                    const remaining = getRemaining(pkg.endDate)
                                    const isEditing = editingId === pkg._id

                                    return (
                                        <tr key={pkg._id} className="border-b last:border-0 hover:bg-muted/50 transition">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center shrink-0">
                                                            <span className="text-[11px] font-semibold text-primary-foreground">
                                                                {(user.name || '??').slice(0, 2).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{user.name || 'Unknown'}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium">{pkg.name || pkg.packageCode || 'N/A'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={editForm.credits}
                                                        onChange={(e) => setEditForm({ ...editForm, credits: e.target.value })}
                                                        className="w-20 text-center px-2 py-1 rounded border bg-background text-foreground text-sm"
                                                    />
                                                ) : (
                                                    pkg.credits ?? '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={editForm.creditsUsed}
                                                        onChange={(e) => setEditForm({ ...editForm, creditsUsed: e.target.value })}
                                                        className="w-20 text-center px-2 py-1 rounded border bg-background text-foreground text-sm"
                                                    />
                                                ) : (
                                                    pkg.creditsUsed ?? 0
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono">
                                                {isEditing
                                                    ? Number(editForm.credits) - Number(editForm.creditsUsed)
                                                    : (pkg.credits ?? 0) - (pkg.creditsUsed ?? 0)
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-xs capitalize">{pkg.type || 'N/A'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono">
                                                {pkg.price ? `$${pkg.price}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {isEditing ? (
                                                    <select
                                                        value={editForm.status}
                                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                        className="px-2 py-1 rounded border bg-background text-foreground text-xs"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="expired">Expired</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[pkg.status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                                                        {pkg.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                                        {pkg.status === 'expired' && <XCircle className="w-3 h-3" />}
                                                        {pkg.status === 'cancelled' && <Ban className="w-3 h-3" />}
                                                        {pkg.status || 'N/A'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="datetime-local"
                                                        value={editForm.endDate}
                                                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                                                        className="w-40 px-2 py-1 rounded border bg-background text-foreground text-xs"
                                                    />
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 text-xs font-mono ${
                                                        remaining.urgent ? 'text-red-500' : 'text-muted-foreground'
                                                    }`}>
                                                        {remaining.urgent && remaining.text !== 'Expired' && <AlertTriangle className="w-3 h-3" />}
                                                        {remaining.text}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => saveEdit(pkg)}
                                                            disabled={updating}
                                                            className="p-1.5 rounded-md hover:bg-green-500/10 text-green-500 transition disabled:opacity-40"
                                                            title="Save"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => startEdit(pkg)}
                                                            className="p-1.5 rounded-md hover:bg-blue-500/10 text-blue-500 transition"
                                                            title="Edit"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
