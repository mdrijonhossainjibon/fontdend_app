import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/modules/rootReducer'
import {
    fetchOrdersRequest,
    clearOrdersRequest,
    checkOrderPaymentRequest,
    deleteOrderRequest,
} from '@/modules/admin/orders/actions'
import { OrdersContent, TableSkeleton } from './content'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Search,
    RefreshCw,
    Trash2,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Wallet,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
} from 'lucide-react'

export default function OrdersPage() {
    const dispatch = useDispatch()
    const { orders, pagination, loading } = useSelector(
        (state: RootState) => state.adminOrders,
    )
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    const doFetch = useCallback(() => {
        dispatch(
            fetchOrdersRequest({
                search: searchTerm || undefined,
                status: filterStatus || undefined,
                page: currentPage,
                limit: itemsPerPage,
            }),
        )
    }, [dispatch, searchTerm, filterStatus, currentPage])

    useEffect(() => { doFetch() }, [doFetch])

    useEffect(() => {
        if (currentPage !== 1) setCurrentPage(1)
    }, [searchTerm, filterStatus])

    const [clearDialogOpen, setClearDialogOpen] = useState(false)

    const handleCheckPayment = (id: string) => dispatch(checkOrderPaymentRequest(id))
    const handleDeleteOrder = (id: string) => dispatch(deleteOrderRequest(id))

    const handleClearAll = () => {
        dispatch(clearOrdersRequest({ status: filterStatus || undefined }))
        setClearDialogOpen(false)
    }

    // Stats computed from current page data
    const stats = useMemo(() => {
        const total = pagination?.total || orders.length
        const completed = orders.filter(o => o.status === 'completed').length
        const pending = orders.filter(o => o.status === 'pending').length
        const failed = orders.filter(o => o.status === 'failed' || o.status === 'expired' || o.status === 'rejected').length
        const revenue = orders.reduce((sum, o) => o.status === 'completed' ? sum + (o.amountUSD || 0) : sum, 0)
        return { total, completed, pending, failed, revenue }
    }, [orders, pagination])

    const statCards = [
        {
            label: 'Total Orders',
            value: stats.total,
            icon: Wallet,
            gradient: 'from-blue-500/20 to-indigo-500/20',
            iconBg: 'bg-blue-500/20 text-blue-500',
            border: 'border-blue-500/20',
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: CheckCircle2,
            gradient: 'from-emerald-500/20 to-green-500/20',
            iconBg: 'bg-emerald-500/20 text-emerald-500',
            border: 'border-emerald-500/20',
        },
        {
            label: 'Pending',
            value: stats.pending,
            icon: Clock,
            gradient: 'from-amber-500/20 to-yellow-500/20',
            iconBg: 'bg-amber-500/20 text-amber-500',
            border: 'border-amber-500/20',
        },
        {
            label: 'Failed',
            value: stats.failed,
            icon: XCircle,
            gradient: 'from-red-500/20 to-rose-500/20',
            iconBg: 'bg-red-500/20 text-red-500',
            border: 'border-red-500/20',
        },
        {
            label: 'Revenue (USD)',
            value: `$${stats.revenue.toFixed(2)}`,
            icon: TrendingUp,
            gradient: 'from-purple-500/20 to-pink-500/20',
            iconBg: 'bg-purple-500/20 text-purple-500',
            border: 'border-purple-500/20',
        },
    ]

    return (
        <div className="space-y-6">
            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Orders</h1>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                        Manage and monitor all deposit orders
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={doFetch}
                        disabled={loading}
                        className="h-9 gap-1.5 text-xs"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setClearDialogOpen(true)}
                        disabled={loading}
                        className="h-9 gap-1.5 text-xs"
                    >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Clear All</span>
                    </Button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className={`relative rounded-xl border ${stat.border} bg-gradient-to-br ${stat.gradient} backdrop-blur-sm p-4 overflow-hidden`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <p className="text-xl font-bold text-foreground">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-lg ${stat.iconBg} backdrop-blur-sm`}>
                                    <Icon size={16} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by email, name, or tx hash..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-border/60 bg-background/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground text-xs"
                        >✕</button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-muted-foreground/50" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-9 px-3 text-sm rounded-lg border border-border/60 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer transition-all"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="confirming">Confirming</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* ── Table ── */}
            <OrdersContent
                orders={orders}
                loading={loading}
                onCheckPayment={handleCheckPayment}
                onDeleteOrder={handleDeleteOrder}
            />

            {/* ── Pagination ── */}
            {!loading && orders.length > 0 && pagination && pagination.pages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border/60 rounded-xl px-4 py-3">
                    <span className="text-xs text-muted-foreground/60">
                        Showing <span className="font-medium text-foreground/80">{((currentPage - 1) * itemsPerPage) + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium text-foreground/80">{Math.min(currentPage * itemsPerPage, pagination.total)}</span>
                        {' '}of{' '}
                        <span className="font-medium text-foreground/80">{pagination.total}</span> orders
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-border/60 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={13} /> Prev
                        </button>

                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum: number
                            if (pagination.pages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= pagination.pages - 2) {
                                pageNum = pagination.pages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`min-w-[30px] h-8 text-xs rounded-lg border transition-all ${
                                        currentPage === pageNum
                                            ? 'bg-primary text-primary-foreground border-primary font-medium shadow-sm'
                                            : 'border-border/60 hover:bg-muted text-muted-foreground/70'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={currentPage >= pagination.pages}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-border/60 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next <ChevronRight size={13} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Clear All Confirm Dialog ── */}
            <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                <AlertDialogContent className="border-border/60">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 size={16} className="text-destructive" />
                            Clear All Orders
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to clear all orders? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="rounded-lg bg-destructive hover:bg-destructive/90" onClick={handleClearAll}>Clear All</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
