import { useState } from 'react'
import { ExternalLink, CheckCircle, XCircle, Copy } from 'lucide-react'
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

const statusStyles: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-600 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    confirming: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    failed: 'bg-red-500/10 text-red-600 border-red-500/20',
    expired: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
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

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    completed: CheckCircle,
    pending: ClockIcon,
    confirming: LoaderIcon,
    failed: XCircle,
}

function ClockIcon({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
}

function LoaderIcon({ className }: { className?: string }) {
    return <svg className={className + ' animate-spin'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
}

function truncate(s: string, len: number) {
    if (!s) return '-'
    return s.length > len ? s.slice(0, len) + '...' : s
}

function timeAgo(dateString: string) {
    if (!dateString) return '-'
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return interval + 'y'
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return interval + 'mo'
    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return interval + 'd'
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return interval + 'h'
    interval = Math.floor(seconds / 60)
    if (interval >= 1) return interval + 'm'
    return Math.floor(seconds) + 's'
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
    return 'btc'
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

// ── Loading Skeleton ────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <div className="p-4 space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-4 w-16 rounded bg-muted" />
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-4 w-16 rounded bg-muted" />
                        <div className="h-4 w-20 rounded bg-muted" />
                        <div className="h-5 w-16 rounded-full bg-muted ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Empty State ─────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <svg viewBox="0 0 120 90" className="w-28 h-20 mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="100" height="56" rx="8" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground/20" />
                <path d="M10 35h100" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/15" />
                <circle cx="24" cy="28" r="3" fill="currentColor" className="text-muted-foreground/15" />
                <circle cx="34" cy="28" r="3" fill="currentColor" className="text-muted-foreground/15" />
                <circle cx="44" cy="28" r="3" fill="currentColor" className="text-muted-foreground/15" />
                <path d="M30 50l8 8 16-16M30 62l8 8 16-16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/25" />
                <circle cx="80" cy="50" r="10" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" className="text-muted-foreground/20" />
                <path d="M88 56l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/20" />
                <circle cx="14" cy="72" r="2" fill="currentColor" className="text-muted-foreground/10" />
                <circle cx="100" cy="68" r="1.5" fill="currentColor" className="text-muted-foreground/10" />
            </svg>
            <p className="text-sm font-medium">No orders found</p>
            <p className="text-xs mt-1 text-muted-foreground/50">Try adjusting your search or filters</p>
        </div>
    )
}

// ── Main Content ────────────────────────────────────────────────────────────
interface OrdersContentProps {
    orders: OrderRecord[]
    loading: boolean
    onApprove: (id: string) => void
    onReject: (id: string) => void
}

export function OrdersContent({ orders, loading, onApprove, onReject }: OrdersContentProps) {
    const [confirmDialog, setConfirmDialog] = useState<{ type: 'approve' | 'reject'; id: string } | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copyId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 1500)
        } catch {
            // fallback for non-HTTPS contexts
            const ta = document.createElement('textarea')
            ta.value = id
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 1500)
        }
    }

    if (loading) return <TableSkeleton rows={6} />
    if (orders.length === 0) return <EmptyState />

    return (
        <>
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Order ID</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">User</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Currency</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider hidden sm:table-cell">Network</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider hidden md:table-cell">Tx Hash</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Status</th>
                                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider hidden lg:table-cell">Created</th>
                                <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => {
                                const explorerUrl = getExplorerUrl(order.networkName, order.txHash)
                                const StatusIcon = statusIcons[order.status]

                                return (
                                    <tr
                                        key={order._id}
                                        className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-150 group"
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        {/* Order ID */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <code className="text-xs font-mono text-muted-foreground/60 bg-muted/40 px-1.5 py-0.5 rounded">
                                                    {truncate(order._id, 8)}
                                                </code>
                                                <button
                                                    onClick={() => copyId(order._id)}
                                                    className="text-muted-foreground/30 hover:text-primary/60 transition-colors"
                                                    title="Copy ID"
                                                >
                                                    {copiedId === order._id
                                                        ? <CheckCircle size={11} className="text-green-500" />
                                                        : <Copy size={11} />
                                                    }
                                                </button>
                                            </div>
                                        </td>

                                        {/* User */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground/90">
                                                    {order.userId?.name || 'Unknown'}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground/50">
                                                    {order.userId?.email || '-'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Currency */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 rounded-lg bg-muted/50">
                                                    <CryptoIcon coinId={order.cryptoName} className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium">{order.cryptoName}</span>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{order.amount}</span>
                                                <span className="text-[11px] text-muted-foreground/50">
                                                    ${order.amountUSD?.toFixed(2) || '0.00'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Network */}
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <CryptoIcon coinId={getNetworkIcon(order.networkName)} className="w-4 h-4" />
                                                <span className="text-xs text-muted-foreground/70">{order.networkName || '-'}</span>
                                            </div>
                                        </td>

                                        {/* Tx Hash */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {order.txHash ? (
                                                <div className="flex items-center gap-1.5">
                                                    <code className="text-[11px] font-mono text-muted-foreground/50 bg-muted/30 px-1.5 py-0.5 rounded">
                                                        {truncate(order.txHash, 8)}
                                                    </code>
                                                    {explorerUrl && (
                                                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                                                            className="text-muted-foreground/30 hover:text-primary/60 transition-colors">
                                                            <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/30">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border ${statusStyles[order.status] || 'bg-gray-500/10 text-gray-600 border-gray-500/20'}`}>
                                                {StatusIcon && <StatusIcon className="w-3 h-3" />}
                                                {statusLabels[order.status] || order.status}
                                            </div>
                                        </td>

                                        {/* Created */}
                                        <td className="px-4 py-3 text-xs text-muted-foreground/50 hidden lg:table-cell">
                                            {timeAgo(order.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setConfirmDialog({ type: 'approve', id: order._id })}
                                                    className="p-1.5 rounded-lg text-green-500/60 hover:text-green-500 hover:bg-green-500/10 transition-all"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDialog({ type: 'reject', id: order._id })}
                                                    className="p-1.5 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                    title="Reject"
                                                >
                                                    <XCircle size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Confirm Dialog ── */}
            <AlertDialog open={!!confirmDialog} onOpenChange={(open) => { if (!open) setConfirmDialog(null) }}>
                <AlertDialogContent className="border-border/60">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            {confirmDialog?.type === 'approve' ? (
                                <CheckCircle size={18} className="text-green-500" />
                            ) : (
                                <XCircle size={18} className="text-red-500" />
                            )}
                            {confirmDialog?.type === 'approve' ? 'Approve Order' : 'Reject Order'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            {confirmDialog?.type === 'approve'
                                ? 'This will mark the order as completed and credit the user balance. Are you sure?'
                                : 'This will mark the order as failed. The user will not receive credits. Are you sure?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className={`rounded-lg ${confirmDialog?.type === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'} text-white`}
                            onClick={() => {
                                if (!confirmDialog) return
                                if (confirmDialog.type === 'approve') onApprove(confirmDialog.id)
                                else onReject(confirmDialog.id)
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
