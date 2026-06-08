
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Search, Edit, Trash2, Loader2, Bot, Activity,
    CreditCard, TrendingUp, Power, PauseCircle, CheckCircle2,
    Ban, RefreshCw
} from "lucide-react"
import { RootState } from "@/modules/rootReducer"
import {
    fetchAdminBotsRequest,
    updateAdminBotRequest,
    deleteAdminBotRequest
} from "@/modules/admin/actions"

interface BotItem {
    id: string
    name: string
    userId: string
    userEmail: string
    api_key: string
    balance: number
    credits: number
    credits_used: number
    status: string
    total_solves: number
    success_rate: number
    last_active: string | null
    created_at: string
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    active: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
    paused: { label: "Paused", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: PauseCircle },
    banned: { label: "Banned", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: Ban },
}

export default function AdminBotsContent() {
    const dispatch = useDispatch()
    const { bots, loading, botPagination: pagination, isSaving, error } = useSelector(
        (state: RootState) => state.admin
    )

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedBot, setSelectedBot] = useState<BotItem | null>(null)
    const [editForm, setEditForm] = useState({ balance: 0, credits: 0, status: "active" })
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [deleteBotId, setDeleteBotId] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchAdminBotsRequest({ searchTerm, statusFilter, page: currentPage, limit: itemsPerPage }))
    }, [dispatch, searchTerm, statusFilter, currentPage, itemsPerPage])

    useEffect(() => { setCurrentPage(1) }, [searchTerm, statusFilter])

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    const handleEditBot = () => {
        if (!selectedBot) return
        dispatch(updateAdminBotRequest({
            botId: selectedBot.id,
            balance: editForm.balance,
            credits: editForm.credits,
            status: editForm.status,
        }))
        setIsEditModalOpen(false)
    }

    const handleDeleteBot = (botId: string) => {
        setDeleteBotId(botId)
    }

    const confirmDeleteBot = () => {
        if (deleteBotId) {
            dispatch(deleteAdminBotRequest(deleteBotId))
            setDeleteBotId(null)
        }
    }

    const totalBots = pagination?.total || 0
    const activeBots = (bots as BotItem[]).filter(b => b.status === 'active').length
    const totalSolves = (bots as BotItem[]).reduce((s, b) => s + (b.total_solves || 0), 0)
    const totalCreditsUsed = (bots as BotItem[]).reduce((s, b) => s + (b.credits_used || 0), 0)

    return (
        <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total Bots", value: totalBots, icon: Bot, color: "text-blue-600", bg: "bg-blue-500/10" },
                    { label: "Active Now", value: activeBots, icon: Activity, color: "text-green-600", bg: "bg-green-500/10" },
                    { label: "Total Solves", value: totalSolves.toLocaleString(), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-500/10" },
                    { label: "Credits Used", value: totalCreditsUsed.toLocaleString(), icon: CreditCard, color: "text-orange-600", bg: "bg-orange-500/10" },
                ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="border-border hover:border-primary/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 80}ms` }}>
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-5">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search bots by name or user..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="banned">Banned</option>
                        </select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dispatch(fetchAdminBotsRequest({ searchTerm, statusFilter, page: currentPage, limit: itemsPerPage }))}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Bots Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Bot Management</CardTitle>
                    <CardDescription>{pagination?.total || 0} total bots registered</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && (bots || []).length === 0 ? (
                        <div className="flex items-center justify-center py-14">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (bots || []).length === 0 ? (
                        <div className="text-center py-14 text-muted-foreground">
                            <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No bots found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        {["Bot", "Owner", "Balance / Credits", "Solves", "Success Rate", "Status", "Actions"].map(h => (
                                            <th key={h} className="py-3 px-4 text-sm font-semibold text-muted-foreground">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(bots as BotItem[]).map((bot, i) => {
                                        const s = statusConfig[bot.status] || statusConfig.active
                                        const StatusIcon = s.icon
                                        return (
                                            <tr
                                                key={bot.id}
                                                className="border-b border-border hover:bg-secondary/50 transition-colors"
                                                style={{ opacity: 0, animation: `slideInUp 0.4s ease-out ${i * 40}ms forwards` }}
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <Bot className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">{bot.name}</p>
                                                            <p className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">{bot.api_key?.slice(0, 16)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-muted-foreground">{bot.userEmail || 'â€”'}</td>
                                                <td className="py-4 px-4">
                                                    <p className="font-semibold text-sm">${(bot.balance || 0).toFixed(2)}</p>
                                                    <p className="text-xs text-muted-foreground">{bot.credits_used || 0} / {bot.credits || 0} credits</p>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-sm">{(bot.total_solves || 0).toLocaleString()}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full max-w-[60px] bg-secondary rounded-full h-1.5">
                                                            <div
                                                                className="h-full rounded-full bg-primary transition-all"
                                                                style={{ width: `${Math.round((bot.success_rate || 0) * 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium">{Math.round((bot.success_rate || 0) * 100)}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {s.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white text-xs gap-1 h-8 px-3"
                                                            onClick={() => {
                                                                setSelectedBot(bot)
                                                                setEditForm({ balance: bot.balance || 0, credits: bot.credits || 0, status: bot.status })
                                                                setIsEditModalOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="w-3 h-3" /> Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white text-xs gap-1 h-8 px-3"
                                                            onClick={() => handleDeleteBot(bot.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!loading && (bots || []).length > 0 && pagination && (
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1}â€“{Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total}
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            value={itemsPerPage}
                            onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={!pagination.hasPrevPage}>Previous</Button>
                        <span className="text-sm font-medium px-2">{currentPage} / {pagination.totalPages || 1}</span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))} disabled={!pagination.hasNextPage}>Next</Button>
                    </div>
                </div>
            )}

            {/* Edit Bot Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Bot</DialogTitle>
                        <p className="text-sm text-muted-foreground">Update bot balance, credits, and status</p>
                    </DialogHeader>
                    {selectedBot && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{selectedBot.name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedBot.userEmail}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-2 block">Balance (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <input
                                        type="number"
                                        value={editForm.balance}
                                        onChange={e => setEditForm({ ...editForm, balance: parseFloat(e.target.value) || 0 })}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-2 block">Credits Limit</label>
                                <input
                                    type="number"
                                    value={editForm.credits}
                                    onChange={e => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-2 block">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                >
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="banned">Banned</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="bg-transparent" disabled={isSaving}>Cancel</Button>
                        <Button className="bg-amber-500 hover:bg-amber-600" onClick={handleEditBot} disabled={isSaving}>
                            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteBotId !== null} onOpenChange={(open) => { if (!open) setDeleteBotId(null) }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Bot</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this bot? This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteBot}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </>
    )
}
