import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/modules/rootReducer'
import {
    fetchOrdersRequest,
    approveOrderRequest,
    rejectOrderRequest,
} from '@/modules/admin/orders/actions'
import { OrdersContent } from './content'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Search,
    Filter,
    RefreshCw,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    DollarSign,
} from 'lucide-react'

export default function OrdersPage() {
    const dispatch = useDispatch()
    const { orders, stats, pagination, loading } = useSelector(
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

    useEffect(() => {
        doFetch()
    }, [doFetch])

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1)
        }
    }, [searchTerm, filterStatus])

    const handleApprove = (id: string) => {
        dispatch(approveOrderRequest(id))
    }

    const handleReject = (id: string) => {
        dispatch(rejectOrderRequest(id))
    }

    const statCards = [
        { label: 'Total Orders', value: stats?.total ?? 0, icon: CreditCard, color: 'text-blue-600' },
        { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: 'text-yellow-600' },
        { label: 'Confirming', value: stats?.confirming ?? 0, icon: AlertTriangle, color: 'text-blue-600' },
        { label: 'Failed', value: stats?.failed ?? 0, icon: XCircle, color: 'text-red-600' },
        { label: 'Revenue (USD)', value: `$${(stats?.revenue ?? 0).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600' },
    ]

    return (
        <div>
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={doFetch}
                    disabled={loading}
                    className="gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-border/50 bg-secondary/50">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                                <stat.icon className={`w-6 h-6 ${stat.color}/60`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by user email, name, or transaction hash..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="confirming">Confirming</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <OrdersContent
                orders={orders}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {/* Pagination */}
            {!loading && orders.length > 0 && pagination && (
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} orders
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="h-8 px-3"
                        >
                            Previous
                        </Button>

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
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="h-8 w-8 p-0"
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                            disabled={currentPage >= pagination.pages}
                            className="h-8 px-3"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
