"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import { fetchHistoryRequest, cancelDepositRequest } from "@/modules/topup/actions"
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Coins,
  Gift,
  Wallet,
  XCircle,
} from "lucide-react"
import { CryptoIcon } from "@/components/CryptoIcon"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

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

const ITEMS_PER_PAGE = 15

const tabs = [
  { key: 'All', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]

export function DashboardHistoryContent() {
  const dispatch = useDispatch()
  const { history, historyLoading } = useSelector((state: RootState) => state.topup)

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchHistoryRequest())
  }, [dispatch])

  const transactions = history?.transactions || []

  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      if (activeTab !== "All" && (item.status || 'completed') !== activeTab) return false
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
  }, [transactions, activeTab, searchQuery])

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

  const isCredit = (type: string) => type === 'topup' || type === 'redeem'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => { dispatch(fetchHistoryRequest()); setCurrentPage(1) }}
          disabled={historyLoading}
          className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          <RefreshCw className={cn("w-4 h-4", historyLoading && "animate-spin")} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Spent', value: `$${(history?.stats?.totalSpent || 0).toFixed(2)}`, color: '' },
          { label: 'Credits Added', value: `+${history?.stats?.totalCreditsAdded || 0}`, color: 'text-green-500' },
          { label: 'Credits Used', value: `${history?.stats?.totalCreditsUsed || 0}`, color: 'text-amber-500' },
          { label: 'Transactions', value: `${history?.stats?.transactionCount || 0}`, color: '' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-3.5">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className={cn("text-lg font-semibold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="w-full pl-9 pr-3 h-9 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="flex items-center gap-0.5 bg-card border border-border rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1) }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-secondary/40 border-b border-border text-xs font-medium text-muted-foreground">
          <div className="col-span-2">Transaction</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Credits</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Date</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Body */}
        {historyLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="py-16 text-center">
            <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-0.5">No transactions</p>
            <p className="text-xs text-muted-foreground">{searchQuery ? 'Try a different search' : 'No history yet'}</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {paginatedData.map((item, idx) => {
              const IconComponent = getTypeIcon(item.type).icon
              const bg = getTypeIcon(item.type).bg
              const color = getTypeIcon(item.type).color
              return (
                <div
                  key={item.id || idx}
                  className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-secondary/20 transition-colors"
                >
                  {/* Transaction */}
                  <div className="col-span-2 flex items-center gap-2.5">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", bg)}>
                      <IconComponent className={cn("w-3.5 h-3.5", color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.label || typeLabels[item.type] || item.type}</p>
                      {item.invoiceId && (
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          #{item.invoiceId.slice(0, 10)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 text-right">
                    {item.amount != null && item.amount > 0 ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {item.cryptoName && (
                          <CryptoIcon coinId={getNetworkCoinId(item.cryptoName)} className="w-4 h-4" name={item.cryptoName} />
                        )}
                        <span className={cn("text-sm font-medium tabular-nums", isCredit(item.type) ? "text-green-500" : "text-amber-500")}>
                          {isCredit(item.type) ? '+' : '-'}${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Credits */}
                  <div className="col-span-2 text-right">
                    {item.credits != null ? (
                      <span className={cn("text-sm font-medium tabular-nums", isCredit(item.type) ? "text-green-500" : "text-amber-500")}>
                        {isCredit(item.type) ? '+' : '-'}{item.credits}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
                      (item.status === 'paid' || item.status === 'completed' || !item.status) && "text-green-500 bg-green-500/10",
                      item.status === 'pending' && "text-amber-500 bg-amber-500/10",
                      (item.status === 'failed' || item.status === 'expired') && "text-red-500 bg-red-500/10",
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        (item.status === 'paid' || item.status === 'completed' || !item.status) && "bg-green-500",
                        item.status === 'pending' && "bg-amber-500",
                        (item.status === 'failed' || item.status === 'expired') && "bg-red-500",
                      )} />
                      {item.status === 'paid' || item.status === 'completed' || !item.status ? 'Completed' :
                       item.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-right">
                    <p className="text-sm text-muted-foreground tabular-nums">{item.date}</p>
                    {item.time && <p className="text-[10px] text-muted-foreground/60">{item.time}</p>}
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex justify-end">
                    {item.type === 'deposit' && item.status === 'pending' ? (
                      <div className="flex items-center gap-1.5">
                        {item.invoiceId && (
                          <Link
                            to={`/topup?invoice=${item.invoiceId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                          >
                            <Wallet className="w-3 h-3" />
                            Pay
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            const modal = document.getElementById('cancel-modal') as HTMLDialogElement
                            if (modal) {
                              modal.dataset.depositId = item.id
                              modal.showModal()
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                        >
                          <XCircle className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, currentPage - 2)
              const page = start + i
              if (page > totalPages) return null
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>

      {/* ── Cancel Confirmation Modal ── */}
      <dialog
        id="cancel-modal"
        className="fixed inset-0 z-50 m-auto w-full max-w-sm rounded-xl border bg-card p-0 shadow-2xl backdrop:bg-black/50 open:flex flex-col"
        onClick={(e) => { if (e.target === e.currentTarget) (e.target as HTMLDialogElement).close() }}
      >
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Cancel Deposit?</h3>
          <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const modal = document.getElementById('cancel-modal') as HTMLDialogElement
                modal?.close()
              }}
              className="px-5 py-2 rounded-lg border text-sm font-medium hover:bg-secondary/60 transition-colors"
            >
              No, keep it
            </button>
            <button
              onClick={() => {
                const modal = document.getElementById('cancel-modal') as HTMLDialogElement
                const id = modal?.dataset.depositId
                if (id) dispatch(cancelDepositRequest(id))
                modal?.close()
              }}
              className="px-5 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Yes, cancel
            </button>
          </div>
        </div>
      </dialog>
  )
}
