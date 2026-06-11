"use client"

import { useEffect, useState } from "react"
import {
    Plus,
    Settings2,
    Save,
    AlertCircle,
    Trash2,
    RefreshCw
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
import { Switch } from "@/components/ui/switch"
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
            <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="default"
                        onClick={fetchConfigs}
                        className="h-12 rounded-xl"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reload
                    </Button>
                    <Button
                        onClick={handleAddNew}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Crypto
                    </Button>
                </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Active Cryptocurrencies</CardTitle>
                    <CardDescription>System-wide crypto assets available for user transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Coin</TableHead>
                                <TableHead>Networks</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        <Spinner className="size-6 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : configs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No cryptocurrencies configured.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                configs.map(config => (
                                    <TableRow key={config.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden">
                                                    <CryptoIcon coinId={config.id} className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{config.name}</p>
                                                    <p className="text-xs text-muted-foreground">{config.fullName}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {config.networks.map(n => (
                                                    <Badge key={n.id} variant={n.status === 'active' ? 'secondary' : 'outline'} className="text-[10px]">
                                                        {n.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {config.status === 'active' ? (
                                                <Badge variant="default" className="bg-green-500">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                                                    <Settings2 className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(config.id)}>
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete Asset</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingConfig ? `Edit ${editingConfig.name}` : "Add New Crypto"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Coin ID (e.g., usdt, btc)</label>
                                <Input
                                    placeholder="usdt"
                                    value={formData.id}
                                    onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                                    disabled={!!editingConfig}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Short Name (e.g., USDT)</label>
                                <Input
                                    placeholder="USDT"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    placeholder="Tether USD"
                                    value={formData.fullName}
                                    onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={formData.status} onValueChange={v => setFormData(prev => ({ ...prev, status: v }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Networks</h3>

                        <div className="space-y-4">
                            {networks.map((net, index) => (
                                <div key={index} className="p-4 border rounded-xl bg-secondary/20 relative group">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeNetwork(index)}
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Net ID</label>
                                            <Input
                                                list="netIds"
                                                placeholder="bsc"
                                                value={net.id}
                                                onChange={e => updateNetwork(index, 'id', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Net Name</label>
                                            <Input
                                                list="netNames"
                                                placeholder="BNB Smart Chain"
                                                value={net.name}
                                                onChange={e => updateNetwork(index, 'name', e.target.value)}
                                                required
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
                                        <label className="text-sm text-muted-foreground">Status</label>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full border-dashed"
                                onClick={addNetwork}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Network
                            </Button>
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

                        <div className="flex justify-end gap-3 mt-8">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-10 px-6"
                            >
                                {saving ? <Spinner className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Configuration
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="text-destructive w-5 h-5" />
                            Delete Cryptocurrency?
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
                            className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                            {deleting ? <Spinner className="mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
