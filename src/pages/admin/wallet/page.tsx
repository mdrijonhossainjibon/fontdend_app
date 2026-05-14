"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, Plus, Settings,
  RefreshCcw, Trash2, Edit, Coins, Shield, Check, X, Loader2,
  Activity, Copy, ExternalLink, Moon, Sun, AlertTriangle, Key
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { fetchAdminWalletsRequest, createAdminWalletRequest, deleteAdminWalletRequest } from "@/modules/admin/actions"
import { fetchCryptoConfigRequest } from "@/modules/crypto/actions"

// ── Types ─────────────────────────────────────────────────────────────────────
interface AdminWallet {
  _id?: string
  address: string
  network: string
  label: string
  symbol: string
  balance: string
  isActive: boolean
}

interface CryptoConfig {
  id: string
  name: string
  fullName: string
  networks: { id: string; name: string }[]
}

interface Toast { id: number; msg: string; type: "success" | "error" | "info" }

// ── Tiny Toast Hook ──────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const show = useCallback((msg: string, type: Toast["type"] = "info") => {
    const id = ++counter.current
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const toast = useRef({
    success: (msg: string) => show(msg, "success"),
    error: (msg: string) => show(msg, "error"),
    info: (msg: string) => show(msg, "info"),
  }).current

  return { toasts, toast }
}

// ── Portal-based Modal ────────────────────────────────────────────────────────
function Modal({
  open, onClose, title, children, footer, maxWidth = "max-w-lg"
}: {
  open: boolean; onClose: () => void; title: React.ReactNode
  children: React.ReactNode; footer?: React.ReactNode; maxWidth?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", fn)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", fn)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} style={{ zIndex: -1 }} />
      <div className={`relative w-full ${maxWidth} bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden`}
        style={{ animation: "modalIn 0.18s ease-out both" }}>
        <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.96) translateY(8px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0); }
                    }
                `}</style>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-secondary/10">
          <div className="font-bold text-base flex items-center gap-2">{title}</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/40 bg-secondary/5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${checked ? "bg-primary" : "bg-secondary"}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminWalletPage() {
  const dispatch = useDispatch()
  const { toasts, toast } = useToast()

  // Redux Selectors
  const wallets = useSelector((state: any) => state.admin.wallets)
  const walletLoading = useSelector((state: any) => state.admin.walletLoading)
  const cryptoConfigs = useSelector((state: any) => state.crypto.configs)
  const configLoading = useSelector((state: any) => state.crypto.loading)

  const [showWalletModal, setShowWalletModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null)

  // Form states
  const [formAddress, setFormAddress] = useState("")
  const [formLabel, setFormLabel] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState<AdminWallet | null>(null)

  const refreshData = useCallback(() => {
    dispatch(fetchAdminWalletsRequest())
    dispatch(fetchCryptoConfigRequest())
  }, [dispatch])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleSaveWallet = async () => {
    if (!formAddress || !formLabel) {
      toast.info("Please fill in address and label")
      return
    }

    if (cryptoConfigs.length === 0) {
      toast.error("No crypto configurations available")
      return
    }

    const walletEntries = cryptoConfigs.map((config: CryptoConfig) => ({
      address: formAddress,
      network: config.networks[0]?.id || "ERC20",
      label: `${formLabel} - ${config.name}`,
      symbol: config.id.toUpperCase(),
      balance: "0",
      isActive: formIsActive
    }))

    dispatch(createAdminWalletRequest(walletEntries))
    // Reset form after dispatching
    setShowWalletModal(false)
    setFormAddress("")
    setFormLabel("")
    setFormIsActive(true)
  }

  const handleDeleteWallet = async (id: string) => {
    dispatch(deleteAdminWalletRequest(id))
    setConfirmDelete(null)
  }

  const openEditModal = (wallet: AdminWallet) => {
    setEditingWallet(wallet)
    setFormAddress(wallet.address)
    setFormLabel(wallet.label)
    setFormIsActive(wallet.isActive)
    setShowWalletModal(true)
  }

  const getCoinIcon = (symbol: string) => {
    try {
      const sym = symbol.toLowerCase()
      // Try to match symbol to generic icon or just the symbol text
      return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${sym}.png`
    } catch { return null }
  }

  const getExplorerUrl = (symbol: string, address: string) => {
    return `https://bscscan.com/address/${address}`
  }

  const totalBalance = (wallets || []).reduce((acc: number, curr: AdminWallet) => acc + parseFloat(curr.balance || "0"), 0)

  const stats = [
    {
      title: "Total Balance (USD)",
      value: `$${totalBalance.toLocaleString()}`,
      icon: Wallet,
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-500",
      border: "border-blue-500/20",
      sub: "Unified value"
    },
    {
      title: "Configured Coins",
      value: (cryptoConfigs || []).length.toString(),
      icon: Coins,
      color: "from-amber-500/20 to-amber-600/5",
      iconColor: "text-amber-500",
      border: "border-amber-500/20",
      sub: "Active networks"
    },
    {
      title: "System Health",
      value: "100%",
      icon: Activity,
      color: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-500",
      border: "border-purple-500/20",
      sub: "RPC Status OK"
    }
  ]

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* ── Toast stack ─────────────────────────────────────────── */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-right-4 duration-300 border backdrop-blur-sm
                        ${t.type === "success" ? "bg-green-950/90 border-green-500/30 text-green-300" :
              t.type === "error" ? "bg-red-950/90 border-red-500/30 text-red-300" :
                "bg-card/90 border-border/60 text-foreground"}`}>
            {t.type === "success" ? <Check className="w-4 h-4 shrink-0" /> :
              t.type === "error" ? <X className="w-4 h-4 shrink-0" /> :
                <Activity className="w-4 h-4 shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Master Admin Wallets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage central liquidity and payout addresses for all supporting assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingWallet(null)
              setFormAddress("")
              setFormLabel("")
              setFormIsActive(true)
              setShowWalletModal(true)
            }}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6 shadow-lg shadow-primary/20 transition-all font-bold"
          >
            <Plus className="w-5 h-5" />
            Add Universal Wallet
          </Button>
          <Button
            variant="outline"
            onClick={refreshData}
            className="w-11 h-11 rounded-xl p-0"
          >
            <RefreshCcw className={`w-5 h-5 ${walletLoading || configLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`relative overflow-hidden p-6 rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} backdrop-blur-sm shadow-xl transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-6 h-6 ${stat.iconColor} opacity-80`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.sub}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-0.5">{stat.title}</p>
            <p className="text-2xl font-black">{stat.value}</p>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.iconColor} opacity-5 blur-3xl`} style={{ background: "currentColor" }} />
          </div>
        ))}
      </div>

      {/* Wallets Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Admin Asset Wallets</h2>
          <div className="h-px flex-1 bg-border/40 ml-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(walletLoading || configLoading) && (!wallets || wallets.length === 0) ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-secondary/20 animate-pulse border border-border/40" />
            ))
          ) : (!wallets || wallets.length === 0) ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-border/40">
              <Wallet className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground text-sm font-medium">No admin wallets configured yet.</p>
              <Button variant="link" onClick={() => setShowWalletModal(true)} className="text-primary font-bold mt-2">
                Add your first universal wallet
              </Button>
            </div>
          ) : (
            wallets.map((wallet: AdminWallet) => (
              <div
                key={wallet._id}
                className="group relative p-5 rounded-2xl border border-border/40 bg-card hover:bg-secondary/10 hover:border-primary/30 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center p-2.5 overflow-hidden border border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      <img
                        src={getCoinIcon(wallet.symbol) || ""}
                        alt={wallet.symbol}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      <Coins className="w-full h-full text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg leading-none">{wallet.symbol}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-1">{wallet.network}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={getExplorerUrl(wallet.symbol, wallet.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(wallet)}
                      className="p-1.5 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(wallet)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Balance</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-black text-primary truncate">
                        {parseFloat(wallet.balance).toFixed(wallet.symbol === "BTC" ? 6 : 4)}
                      </p>
                      <span className="text-xs font-bold text-muted-foreground">{wallet.symbol}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Address</span>
                      <code className="text-[10px] font-mono text-foreground/80 truncate max-w-[140px]">{wallet.address}</code>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${wallet.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {wallet.isActive ? "Active" : "Disabled"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Wallet Form Modal */}
      <Modal
        title={editingWallet ? "Edit Admin Wallet" : "Add Universal Wallet"}
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {!editingWallet && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase">Creates {cryptoConfigs?.length || 0} entries</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowWalletModal(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveWallet} disabled={walletLoading} className="font-bold">
                {walletLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingWallet ? "Update Wallet" : "Initialize All Wallets"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6 py-2">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <Coins className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-primary uppercase mb-1">Universal Address Mode</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Entering an address here will automatically configure it for every cryptocurrency supported by the system.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Label / Name</label>
              <input
                placeholder="e.g. Platform Main Treasury"
                value={formLabel}
                onChange={e => setFormLabel(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-secondary/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Universal Public Address</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  placeholder="0x... or crypto address"
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-secondary/30 border border-border/50 text-sm font-mono placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-border/30">
              <div>
                <p className="text-sm font-bold">Enabled Status</p>
                <p className="text-[10px] text-muted-foreground">Allow system to receive and send from this address</p>
              </div>
              <Toggle checked={formIsActive} onChange={() => setFormIsActive(!formIsActive)} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={<><AlertTriangle className="w-4 h-4 text-red-500" /> Delete Confirmation</>}
        maxWidth="max-w-sm"
        footer={<>
          <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => confirmDelete && handleDeleteWallet(confirmDelete._id!)}>Delete Permanent</Button>
        </>}
      >
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground mb-1">Are you sure you want to delete the</p>
          <p className="text-base font-black text-foreground">{confirmDelete?.symbol} ({confirmDelete?.label})</p>
          <p className="text-sm text-muted-foreground mt-1">master wallet? This may disrupt payouts.</p>
        </div>
      </Modal>
    </div>
  )
}
