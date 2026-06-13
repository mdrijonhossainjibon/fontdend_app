"use client"

import { useEffect, useState, useMemo } from "react"
import {
    Plus,
    Settings2,
    Save,
    AlertCircle,
    Trash2,
    RefreshCw,
    Search,
    Coins,
    Network,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { API_CALL } from "@/lib/auth-fingerprint"
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CryptoIcon } from "@/components/CryptoIcon"
import { SkeletonTable } from "@/components/skeletons"

interface Network {
    id: string
    name: string
    fee: string
    time: string
    confirmations: number
    minDeposit: string
    address: string
    badge?: string
    badgeColor?: string
    status: string
}

interface CryptoConfig {
    id: string
    name: string
    fullName: string
    icon: string
    color: string
    bg: string
    borderGlow: string
    networks: Network[]
    status: string
}

export default function AdminCrypto() {
    const [configs, setConfigs] = useState<CryptoConfig[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState<CryptoConfig | null>(null)

    // Search & filter
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        fullName: '',
        status: 'active',
    })
    const [networks, setNetworks] = useState<{ id: string; name: string; status: string }[]>([])

    // Delete dialog state
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)

    // Computed values
    const filteredConfigs = useMemo(() => {
        return configs.filter(c => {
            const matchesSearch = !searchTerm ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.networks.some(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()) || n.id.toLowerCase().includes(searchTerm.toLowerCase()))
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [configs, searchTerm, statusFilter])

    const totalActive = configs.filter(c => c.status === 'active').length
    const totalInactive = configs.filter(c => c.status === 'inactive').length
    const totalNetworks = configs.reduce((sum, c) => sum + c.networks.length, 0)
    const activeNetworks = configs.reduce((sum, c) => sum + c.networks.filter(n => n.status === 'active').length, 0)

    const fetchConfigs = async () => {
        setLoading(true)
        try {
            const { response, status } = await API_CALL({ method: 'GET', url: '/crypto/config' })
            if (status === 200 && response.success) {
                setConfigs(response.data)
            } else {
                toast.error(response?.error || "Failed to fetch configurations")
            }
        } catch (error) {
            toast.error("Failed to fetch configurations")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfigs()
    }, [])

    const handleEdit = (config: CryptoConfig) => {
        setEditingConfig(config)
        setFormData({
            id: config.id,
            name: config.name,
            fullName: config.fullName,
            status: config.status,
        })
        setNetworks(config.networks.map(n => ({ id: n.id, name: n.name, status: n.status ?? 'active' })))
        setIsModalOpen(true)
    }

    const handleAddNew = () => {
        setEditingConfig(null)
        setFormData({ id: '', name: '', fullName: '', status: 'active' })
        setNetworks([])
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const formattedValues = {
                ...formData,
                icon: formData.name?.toLowerCase() || '',
                networks: networks.map(net => ({
                    ...net,
                    confirmations: Number((net as any).confirmations)
                }))
            }

            const { response, status } = await API_CALL({ method: 'POST', url: '/crypto/config', body: formattedValues })
            if (status === 200 || status === 201) {
                const msg = response?.message || response?.data?.message || 'Saved successfully'
                toast.success(msg)
                setIsModalOpen(false)
                fetchConfigs()
            } else {
                toast.error(response?.error || response?.message || "Save failed")
            }
        } catch (error) {
            toast.error("Failed to save configuration")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeleting(true)
        try {
            const { response, status } = await API_CALL({ method: 'DELETE', url: `/crypto/config?id=${id}` })
            if (status === 200) {
                toast.success(response?.message || "Crypto configuration deleted")
                fetchConfigs()
            } else {
                toast.error(response?.error || response?.message || "Delete failed")
            }
        } catch (error) {
            toast.error("Failed to delete configuration")
        } finally {
            setDeleting(false)
            setDeleteTarget(null)
        }
    }

    const addNetwork = () => {
        setNetworks(prev => [...prev, { id: '', name: '', status: 'active' }])
    }

    const removeNetwork = (index: number) => {
        setNetworks(prev => prev.filter((_, i) => i !== index))
    }

    const updateNetwork = (index: number, field: 'id' | 'name' | 'status', value: string) => {
        setNetworks(prev => prev.map((net, i) => (i === index ? { ...net, [field]: value } : net)))
    }

    // Collect existing network suggestions from all configs
    const allNetIds = [...new Set(configs.flatMap(c => c.networks.map(n => n.id)))]
    const allNetNames = [...new Set(configs.flatMap(c => c.networks.map(n => n.name)))]

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Crypto Configuration</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage supported cryptocurrencies and their network configurations
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        onClick={fetchConfigs}
                        className="h-11 rounded-xl px-4"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reload
                    </Button>
                    <Button
                        onClick={handleAddNew}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2 h-11 rounded-xl px-5 shadow-lg shadow-amber-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Crypto
                    </Button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Assets', value: configs.length, icon: Coins, gradient: 'from-amber-500/10 via-yellow-500/5', iconBg: 'bg-amber-500/20 text-amber-500' },
                        { label: 'Active', value: totalActive, icon: Coins, gradient: 'from-emerald-500/10 via-emerald-500/5', iconBg: 'bg-emerald-500/20 text-emerald-500' },
                        { label: 'Inactive', value: totalInactive, icon: Coins, gradient: 'from-red-500/10 via-red-500/5', iconBg: 'bg-red-500/20 text-red-500' },
                        { label: 'Networks', value: `${activeNetworks}/${totalNetworks}`, icon: Network, gradient: 'from-blue-500/10 via-sky-500/5', iconBg: 'bg-blue-500/20 text-blue-500' },
                    ].map((stat, i) => (
                        <Card key={i} className="relative overflow-hidden border-border/50">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`} />
                            <CardContent className="relative pt-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ── Search & Filter ── */}
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name, ticker, or network..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-sm transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 text-sm transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* ── Crypto Table ── */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/40 via-yellow-500/60 to-amber-500/40" />
                <CardHeader>
                    <CardTitle>Supported Assets</CardTitle>
                    <CardDescription>
                        {filteredConfigs.length} of {configs.length} assets
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('all') }}
                                className="ml-2 text-amber-500 hover:text-amber-600 underline text-xs"
                            >
                                Clear filters
                            </button>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <SkeletonTable />
                    ) : filteredConfigs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <svg viewBox="0 0 120 90" className="w-28 h-20 mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="10" y="20" width="100" height="56" rx="8" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground/20" />
                                <path d="M10 35h100" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/15" />
                                <circle cx="24" cy="28" r="3" fill="currentColor" className="text-muted-foreground/15" />
                                <circle cx="34" cy="28" r="3" fill="currentColor" className="text-muted-foreground/15" />
                                <circle cx="44" cy="28" r="3" fill="currentColor" className="text-muted-foreground/15" />
                                <circle cx="60" cy="52" r="10" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" className="text-muted-foreground/20" />
                                <path d="M68 58l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/20" />
                            </svg>
                            <p className="text-sm font-medium">
                                {searchTerm || statusFilter !== 'all'
                                    ? "No assets match your search"
                                    : "No cryptocurrencies configured"}
                            </p>
                            <p className="text-xs mt-1 text-muted-foreground/50">
                                {searchTerm || statusFilter !== 'all'
                                    ? "Try adjusting your search or filter"
                                    : 'Click "Add Crypto" to get started'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Coin</TableHead>
                                    <TableHead className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Networks</TableHead>
                                    <TableHead className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-right text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredConfigs.map((config, idx) => (
                                    <TableRow key={config.id} className="group animate-fadeIn" style={{ animationDelay: `${idx * 40}ms` }}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden ring-1 ring-border/50">
                                                    <CryptoIcon coinId={config.id} className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{config.name}</p>
                                                    <p className="text-xs text-muted-foreground">{config.fullName}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                {config.networks.length === 0 ? (
                                                    <span className="text-xs text-muted-foreground/50">No networks</span>
                                                ) : (
                                                    config.networks.map(n => (
                                                        <Badge
                                                            key={n.id}
                                                            variant={n.status === 'active' ? 'secondary' : 'outline'}
                                                            className="text-[10px] font-medium"
                                                        >
                                                            {n.name}
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {config.status === 'active' ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <Badge variant="default" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-0">
                                                        Active
                                                    </Badge>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    <Badge variant="destructive" className="bg-red-500/15 text-red-600 dark:text-red-400 border-0">
                                                        Inactive
                                                    </Badge>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(config)} className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity">
                                                                <Settings2 className="w-4 h-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Edit Asset</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(config.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive opacity-70 hover:opacity-100 transition-opacity">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete Asset</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ── Add/Edit Dialog ── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                {editingConfig ? (
                                    <Settings2 className="w-5 h-5 text-amber-500" />
                                ) : (
                                    <Plus className="w-5 h-5 text-amber-500" />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-lg">
                                    {editingConfig ? `Edit ${editingConfig.name}` : "Add New Cryptocurrency"}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                                    {editingConfig
                                        ? "Modify the asset details and network configurations."
                                        : "Configure a new cryptocurrency asset for user transactions."}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ── Basic Information Section ── */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Coins className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Coin ID <span className="text-destructive">*</span></label>
                                    <p className="text-[11px] text-muted-foreground">e.g., usdt, btc, eth</p>
                                    <Input
                                        placeholder="usdt"
                                        value={formData.id}
                                        onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                                        disabled={!!editingConfig}
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Short Name <span className="text-destructive">*</span></label>
                                    <p className="text-[11px] text-muted-foreground">e.g., USDT, BTC, ETH</p>
                                    <Input
                                        placeholder="USDT"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-foreground/80">Full Name <span className="text-destructive">*</span></label>
                                    <p className="text-[11px] text-muted-foreground">e.g., Tether USD, Bitcoin, Ethereum</p>
                                    <Input
                                        placeholder="Tether USD"
                                        value={formData.fullName}
                                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Status</label>
                                    <Select value={formData.status} onValueChange={v => setFormData(prev => ({ ...prev, status: v }))}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* ── Network Configuration Section ── */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Network className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-semibold text-foreground">Network Configuration</h3>
                                <span className="text-xs text-muted-foreground">({networks.length} configured)</span>
                            </div>

                            <div className="space-y-3">
                                {networks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl bg-secondary/20">
                                        No networks configured yet. Click below to add one.
                                    </div>
                                ) : (
                                    networks.map((net, index) => (
                                        <div key={index} className="p-4 border border-border/60 rounded-xl bg-secondary/20 relative group hover:border-amber-500/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                                                    Network #{index + 1}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeNetwork(index)}
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-foreground/70">Network ID</label>
                                                    <Input
                                                        list="netIds"
                                                        placeholder="bsc"
                                                        value={net.id}
                                                        onChange={e => updateNetwork(index, 'id', e.target.value)}
                                                        required
                                                        className="h-9 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-foreground/70">Network Name</label>
                                                    <Input
                                                        list="netNames"
                                                        placeholder="BNB Smart Chain"
                                                        value={net.name}
                                                        onChange={e => updateNetwork(index, 'name', e.target.value)}
                                                        required
                                                        className="h-9 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Select value={net.status ?? 'active'} onValueChange={v => updateNetwork(index, 'status', v)}>
                                                    <SelectTrigger className="h-8 w-[130px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <span className="text-xs text-muted-foreground">Status</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-border/60 hover:border-amber-500/50 hover:text-amber-500 transition-colors gap-2"
                                    onClick={addNetwork}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Network
                                </Button>
                            </div>
                        </div>

                        <datalist id="netIds">
                            {allNetIds.map(id => (
                                <option key={id} value={id} />
                            ))}
                        </datalist>
                        <datalist id="netNames">
                            {allNetNames.map(n => (
                                <option key={n} value={n} />
                            ))}
                        </datalist>

                        <Separator className="bg-border/50" />

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2 min-w-[140px]"
                            >
                                {saving ? (
                                    <Spinner className="w-4 h-4" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? "Saving..." : "Save Configuration"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirmation ── */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
                                <AlertCircle className="text-destructive w-5 h-5" />
                            </div>
                            <span>Delete Cryptocurrency?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this cryptocurrency and all its network configurations. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteTarget && handleDelete(deleteTarget)}
                            disabled={deleting}
                            className="bg-destructive hover:bg-destructive/90 text-white gap-2"
                        >
                            {deleting ? <Spinner className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
