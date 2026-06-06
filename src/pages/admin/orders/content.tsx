import { useState } from 'react'
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CryptoIcon } from '@/components/CryptoIcon'
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
import type { OrderRecord } from '@/modules/admin/orders/reducer'

const statusColors: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-600 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    confirming: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    failed: 'bg-red-500/10 text-red-600 border-red-500/20',
    expired: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
}

const statusLabels: Record<string, string> = {
    completed: 'Completed',
    pending: 'Pending',
    confirming: 'Confirming',
    failed: 'Failed',
    expired: 'Expired',
    rejected: 'Rejected',
    approved: 'Approved',
}

function truncate(s: string, len: number) {
    if (!s) return '-'
    return s.length > len ? s.slice(0, len) + '...' : s
}

function formatDate(d: string) {
    if (!d) return '-'
    return new Date(d).toLocaleString()
}

function timeAgo(dateString: string) {
    if (!dateString) return '-'
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return interval + 'y ago'
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return interval + 'mo ago'
    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return interval + 'd ago'
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return interval + 'h ago'
    interval = Math.floor(seconds / 60)
    if (interval >= 1) return interval + 'm ago'
    return Math.floor(seconds) + 's ago'
}

function getNetworkIcon(networkName: string): string {
    const net = (networkName || '').toLowerCase()
    if (net.includes('bsc') || net.includes('bnb') || net.includes('binance')) return 'bnb'
    if (net.includes('eth') || net === 'ethereum') return 'eth'
    if (net.includes('polygon') || net.includes('matic')) return 'matic'
    if (net.includes('arbitrum')) return 'eth'
    if (net.includes('optimism')) return 'eth'
    if (net.includes('avalanche') || net.includes('avax')) return 'avax'
    if (net.includes('tron') || net.includes('trc20')) return 'trx'
    if (net.includes('solana') || net.includes('sol')) return 'sol'
    return 'btc' // fallback
}

function getExplorerUrl(networkName: string, txHash: string) {
    if (!txHash) return null
    const net = (networkName || '').toLowerCase()
    if (net.includes('eth') || net === 'ethereum') return `https://etherscan.io/tx/${txHash}`
    if (net.includes('bsc') || net.includes('bnb')) return `https://bscscan.com/tx/${txHash}`
    if (net.includes('polygon') || net.includes('matic')) return `https://polygonscan.com/tx/${txHash}`
    if (net.includes('arbitrum')) return `https://arbiscan.io/tx/${txHash}`
    if (net.includes('optimism')) return `https://optimistic.etherscan.io/tx/${txHash}`
    if (net.includes('avalanche')) return `https://snowtrace.io/tx/${txHash}`
    if (net.includes('tron')) return `https://tronscan.org/#/transaction/${txHash}`
    if (net.includes('solana')) return `https://solscan.io/tx/${txHash}`
    return null
}

interface OrdersContentProps {
    orders: OrderRecord[]
    loading: boolean
    onApprove: (id: string) => void
    onReject: (id: string) => void
}

export function OrdersContent({ orders, loading, onApprove, onReject }: OrdersContentProps) {
    const [confirmDialog, setConfirmDialog] = useState<{ type: 'approve' | 'reject'; id: string } | null>(null)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
        )
    }

    return (
        <>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Currency</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Network Name</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tx Hash</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Expires</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => {
                                const explorerUrl = getExplorerUrl(order.networkName, order.txHash)
                                return (
                                    <tr
                                        key={order._id}
                                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                            {truncate(order._id, 10)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">
                                                    {order.userId?.name || 'Unknown'}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {order.userId?.email || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <CryptoIcon coinId={order.cryptoName} className="w-5 h-5" />
                                                <span className="font-medium">{order.cryptoName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {order.amount}
                                            <span className="text-xs text-muted-foreground ml-1">
                                                (${order.amountUSD?.toFixed(2) || '0.00'})
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <CryptoIcon coinId={getNetworkIcon(order.networkName)} className="w-5 h-5" />
                                                <span className="text-sm">{order.networkName || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.txHash ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {truncate(order.txHash, 8)}
                                                    </span>
                                                    {explorerUrl && (
                                                        <a
                                                            href={explorerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary/80"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${statusColors[order.status] || ''}`}
                                            >
                                                {statusLabels[order.status] || order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {timeAgo(order.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {order.expiresAt ? timeAgo(order.expiresAt) : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                                                    onClick={() => setConfirmDialog({ type: 'approve', id: order._id })}
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                                                    onClick={() => setConfirmDialog({ type: 'reject', id: order._id })}
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AlertDialog open={!!confirmDialog} onOpenChange={(open) => { if (!open) setConfirmDialog(null) }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog?.type === 'approve' ? 'Approve Order' : 'Reject Order'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog?.type === 'approve'
                                ? 'This will mark the order as completed and credit the user balance. Are you sure?'
                                : 'This will mark the order as failed. The user will not receive credits. Are you sure?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className={confirmDialog?.type === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'}
                            onClick={() => {
                                if (!confirmDialog) return
                                if (confirmDialog.type === 'approve') {
                                    onApprove(confirmDialog.id)
                                } else {
                                    onReject(confirmDialog.id)
                                }
                                setConfirmDialog(null)
                            }}
                        >
                            {confirmDialog?.type === 'approve' ? 'Approve' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
