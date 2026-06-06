"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import { fetchHistoryRequest } from "@/modules/topup/actions"
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Coins,
  Gift,
} from "lucide-react"
import { CryptoIcon } from "@/components/CryptoIcon"
import { cn } from "@/lib/utils"

function getNetworkCoinId(networkName: string): string {
  const n = (networkName || '').toLowerCase()
  if (n.includes('bsc') || n.includes('bnb') || n.includes('binance')) return 'bnb'
  if (n.includes('eth') || n === 'ethereum') return 'eth'
  if (n.includes('polygon') || n.includes('matic')) return 'matic'
  if (n.includes('tron') || n.includes('trc20')) return 'trx'
  if (n.includes('solana') || n.includes('sol')) return 'sol'
  if (n.includes('bitcoin') || n === 'btc') return 'btc'
  if (n.includes('litecoin') || n === 'ltc') return 'ltc'
  if (n.includes('doge')) return 'doge'
  return 'btc'
}

const ITEMS_PER_PAGE = 10

export function DashboardHistoryContent() {
  const dispatch = useDispatch()
  const { history, historyLoading } = useSelector((state: RootState) => state.topup)

  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setIsVisible(true)
    dispatch(fetchHistoryRequest())
  }, [dispatch])

  const transactions = history?.transactions || []
  const stats = history?.stats

  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      if (statusFilter !== "All" && (item.status || 'completed') !== statusFilter.toLowerCase()) return false
      if (typeFilter !== "All" && item.type !== typeFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          item.label?.toLowerCase().includes(q) ||
          item.type?.toLowerCase().includes(q) ||
          item.invoiceId?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [transactions, statusFilter, typeFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE))
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topup': return { icon: ArrowDown, bg: 'bg-green-500/10', color: 'text-green-500' }
      case 'redeem': return { icon: Gift, bg: 'bg-purple-500/10', color: 'text-purple-500' }
      case 'purchase': return { icon: CreditCard, bg: 'bg-blue-500/10', color: 'text-blue-500' }
      case 'usage': return { icon: ArrowUpRight, bg: 'bg-amber-500/10', color: 'text-amber-500' }
      default: return { icon: Coins, bg: 'bg-primary/10', color: 'text-primary' }
    }
  }

  const typeLabels: Record<string, string> = {
    topup: 'Top Up',
    deposit: 'Deposit',
    redeem: 'Code Redeemed',
    purchase: 'Purchase',
    usage: 'Usage',
  }

  const statusBadge = (status?: string) => {
    const s = status || 'completed'
    switch (s) {
      case 'paid':
      case 'completed':
        return { label: 'Completed', class: 'bg-green-500/10 text-green-500' }
      case 'pending':
        return { label: 'Pending', class: 'bg-amber-500/10 text-amber-500' }
      case 'expired':
        return { label: 'Expired', class: 'bg-red-500/10 text-red-500' }
      case 'failed':
        return { label: 'Failed', class: 'bg-destructive/10 text-destructive' }
      default:
        return { label: s, class: 'bg-secondary text-muted-foreground' }
    }
  }

  return (
    <div className="px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
      {/* Header */}
      <div className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Transaction History</h1>
              <p className="text-sm text-muted-foreground">Your deposit and credit history</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(fetchHistoryRequest())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", historyLoading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
        style={{ transitionDelay: "100ms" }}>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
          <p className="text-xl font-bold">${(stats?.totalSpent || 0).toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Credits Added</p>
          <p className="text-xl font-bold text-green-500">+{stats?.totalCreditsAdded || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Credits Used</p>
          <p className="text-xl font-bold text-amber-500">{stats?.totalCreditsUsed || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Transactions</p>
          <p className="text-xl font-bold">{stats?.transactionCount || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={cn("flex flex-col md:flex-row gap-3 mb-6 transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
        style={{ transitionDelay: "200ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by label, type, or invoice..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 h-11 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary">
          {["All", "Completed", "Pending", "Failed"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setStatusFilter(tab); setCurrentPage(1) }}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all",
                statusFilter === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1) }}
          className="h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="All">All Types</option>
          <option value="topup">Top Up</option>
          <option value="redeem">Code Redeem</option>
          <option value="usage">Usage</option>
        </select>
      </div>

      {/* Table */}
      <div className={cn("rounded-2xl bg-card border border-border overflow-hidden transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
        style={{ transitionDelay: "300ms" }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 md:gap-4 px-0 py-3 bg-secondary/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-3">Transaction</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Credits</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Date</div>
        </div>

        {/* Body */}
        {historyLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading history...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-base font-medium mb-1">No transactions found</p>
            <p className="text-sm text-muted-foreground">{searchQuery ? 'Try adjusting your search' : 'Your deposits will appear here'}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedData.map((item, idx) => {
              const typeInfo = getTypeIcon(item.type)
              const statusInfo = statusBadge(item.status)
              const isNegative = item.type === 'usage'
              return (
                <div key={item.id || idx}
                  className="grid grid-cols-12 gap-2 md:gap-4 px-0 py-3 items-center hover:bg-secondary/30 transition-colors"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                    transition: "all 0.3s ease-out",
                    transitionDelay: `${400 + idx * 50}ms`,
                  }}
                >
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg shrink-0", typeInfo.bg)}>
                        <typeInfo.icon className={cn("w-4 h-4", typeInfo.color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.label || typeLabels[item.type] || item.type}</p>
                        {item.meta && <p className="text-[10px] text-muted-foreground truncate">{item.meta}</p>}
                        {item.invoiceId && <p className="text-[10px] text-muted-foreground font-mono">#{item.invoiceId.slice(0, 12)}...</p>}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {item.amount != null && item.amount > 0 ? (
                      <div className="flex items-center gap-2">
                        {item.cryptoName && (
                          <CryptoIcon coinId={getNetworkCoinId(item.cryptoName)} className="w-5 h-5" name={item.cryptoName} />
                        )}
                        <span className={cn("text-sm font-semibold", isNegative ? "text-amber-500" : "text-green-500")}>
                          {isNegative ? '-' : '+'}${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {item.credits != null ? (
                      <span className={cn("text-sm font-semibold", isNegative ? "text-amber-500" : "text-green-500")}>
                        {isNegative ? '-' : '+'}{item.credits}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusInfo.class)}>
                      {statusInfo.label === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> :
                       statusInfo.label === 'Pending' ? <Clock className="w-3 h-3" /> :
                       <AlertCircle className="w-3 h-3" />}
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    {item.time && <p className="text-[10px] text-muted-foreground">{item.time}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className={cn("flex items-center justify-between mt-6 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0")}
          style={{ transitionDelay: "500ms" }}>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–
            <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of{' '}
            <span className="font-medium text-foreground">{filteredData.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, currentPage - 2)
              const page = start + i
              if (page > totalPages) return null
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={cn("w-10 h-10 rounded-lg text-sm font-medium transition-all",
                    currentPage === page ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  )}>
                  {page}
                </button>
              )
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
