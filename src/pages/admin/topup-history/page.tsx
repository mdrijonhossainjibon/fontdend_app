
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/modules/rootReducer'
import {
  fetchTopupHistoryRequest,
} from '@/modules/admin/topup-history/actions'
import type {
  DepositRecord,
  Stats,
} from '@/modules/admin/topup-history/reducer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { message } from 'antd'
import {
  CreditCard,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react'

export default function TopupHistoryPage() {
  const dispatch = useDispatch()
  const { deposits, stats, pagination, loading: isLoading } = useSelector(
    (state: RootState) => state.adminTopupHistory,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const doFetch = useCallback(() => {
    dispatch(
      fetchTopupHistoryRequest({
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        page: currentPage,
        limit: itemsPerPage,
      }),
    )
  }, [dispatch, searchTerm, filterStatus, currentPage, itemsPerPage])

  // Fetch deposits when page, perPage, or status changes
  useEffect(() => {
    doFetch()
  }, [doFetch])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchTerm, filterStatus])

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Transaction ID', 'User', 'Amount', 'USD Value', 'Crypto', 'Network', 'Status', 'Date']
    const rows = deposits.map(d => [
      d.transactionId,
      d.user,
      d.amount,
      d.amountUSD,
      d.crypto,
      d.network,
      d.status,
      d.createdAt
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deposit-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    message.success('CSV exported successfully')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700'
      case 'confirming':
        return 'bg-blue-500/20 text-blue-700'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700'
      case 'failed':
        return 'bg-red-500/20 text-red-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <ArrowDownLeft className="w-3 h-3" />
      case 'confirming':
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'failed':
        return <ArrowUpRight className="w-3 h-3" />
      default:
        return <CreditCard className="w-3 h-3" />
    }
  }

  const getExplorerUrl = (network: string | undefined, txHash: string) => {
    if (!network) return '#'
    const networkLower = network.toLowerCase()

    // Ethereum and EVM chains
    if (networkLower.includes('ethereum') || networkLower.includes('eth')) {
      return `https://etherscan.io/tx/${txHash}`
    }
    if (networkLower.includes('bsc') || networkLower.includes('binance')) {
      return `https://bscscan.com/tx/${txHash}`
    }
    if (networkLower.includes('polygon') || networkLower.includes('matic')) {
      return `https://polygonscan.com/tx/${txHash}`
    }
    if (networkLower.includes('arbitrum')) {
      return `https://arbiscan.io/tx/${txHash}`
    }
    if (networkLower.includes('optimism')) {
      return `https://optimistic.etherscan.io/tx/${txHash}`
    }
    if (networkLower.includes('avalanche') || networkLower.includes('avax')) {
      return `https://snowtrace.io/tx/${txHash}`
    }

    // Bitcoin
    if (networkLower.includes('bitcoin') || networkLower.includes('btc')) {
      return `https://blockchain.com/btc/tx/${txHash}`
    }

    // Tron
    if (networkLower.includes('tron') || networkLower.includes('trx')) {
      return `https://tronscan.org/#/transaction/${txHash}`
    }

    // Solana
    if (networkLower.includes('solana') || networkLower.includes('sol')) {
      return `https://solscan.io/tx/${txHash}`
    }

    // Default to etherscan
    return `https://etherscan.io/tx/${txHash}`
  }

  const statsData = [
    { label: 'Total Deposits', value: stats?.total ?? 0, color: 'text-blue-600' },
    { label: 'Completed', value: stats?.completed ?? 0, color: 'text-green-600' },
    { label: 'Confirming', value: stats?.confirming ?? 0, color: 'text-blue-600' },
    { label: 'Pending', value: stats?.pending ?? 0, color: 'text-yellow-600' },
    { label: 'Failed', value: stats?.failed ?? 0, color: 'text-red-600' },
  ]

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={doFetch}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          className="gap-2 bg-amber-500 hover:bg-amber-600"
          onClick={handleExportCSV}
          disabled={deposits.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-secondary/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <CreditCard className={`w-8 h-8 ${stat.color}/60`} />
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
            placeholder="Search by user email or transaction hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="confirming">Confirming</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Transactions ({pagination?.total ?? 0})</CardTitle>
          <CardDescription>All deposit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No deposits found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">USD Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Confirmations</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Explorer</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit, index) => (
                    <tr
                      key={deposit.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      style={{
                        opacity: 0,
                        animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                      }}
                    >
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground font-mono">
                          {deposit.transactionId}
                        </p>
                        {deposit.txHash && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {deposit.txHash}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-foreground">{deposit.user}</p>
                        {deposit.userName !== 'N/A' && (
                          <p className="text-xs text-muted-foreground">{deposit.userName}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-foreground">
                          {deposit.amount.toFixed(4)} {deposit.crypto}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-green-600">
                          ${deposit.amountUSD.toFixed(2)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-700">
                          {deposit.method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">
                          {deposit.confirmations}/{deposit.requiredConfirmations}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                          {getStatusIcon(deposit.status)}
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">{deposit.createdAt}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          {deposit.txHash ? (
                            <a
                              href={getExplorerUrl(deposit.network, deposit.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && deposits.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination?.total ?? 0)} of {pagination?.total ?? 0} deposits
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination?.hasPrevPage}
                className="h-8 px-3"
              >
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination?.totalPages ?? 1) }, (_, i) => {
                  let pageNum
                  const totalPages = pagination?.totalPages ?? 1
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination?.totalPages ?? 1, prev + 1))}
                disabled={!pagination?.hasNextPage}
                className="h-8 px-3"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
