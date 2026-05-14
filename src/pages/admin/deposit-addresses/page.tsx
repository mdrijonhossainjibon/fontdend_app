"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createPortal } from "react-dom"
import {
    Search, Shield, Lock, Key, RefreshCw, ExternalLink, Copy, Loader2,
    Trash2, AlertTriangle, ArrowDownToLine, Zap, Plus, Activity, QrCode,
    User as UserIcon, Wallet as WalletIcon, Check, X, ChevronLeft, ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCode } from "antd"
import type { RootState } from "@/modules/rootReducer"
import type { DepositAddress } from "@/modules/admin/deposit-addresses/reducer"
import * as depositActions from "@/modules/admin/deposit-addresses/actions"

interface Toast { id: number; msg: string; type: "success" | "error" | "info" }

// ── Tiny Toast Hook ──────────────────────────────────────────────────────────
function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])
    const counter = useRef(0)
    const show = (msg: string, type: Toast["type"] = "info") => {
        const id = ++counter.current
        setToasts(p => [...p, { id, msg, type }])
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
    }
    const toast = {
        success: (msg: string) => show(msg, "success"),
        error: (msg: string) => show(msg, "error"),
        info: (msg: string) => show(msg, "info"),
    }
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
        // prevent body scroll while modal is open
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", fn)
            document.body.style.overflow = ""
        }
    }, [open, onClose])

    if (!mounted || !open) return null

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                style={{ zIndex: -1 }}
            />
            {/* panel */}
            <div className={`relative w-full ${maxWidth} bg-card border border-border/60 rounded-2xl shadow-2xl`}
                style={{ animation: "modalIn 0.18s ease-out both" }}>
                <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.96) translateY(8px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0); }
                    }
                `}</style>
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                    <div className="font-bold text-base flex items-center gap-2">{title}</div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {/* body */}
                <div className="px-6 py-5">{children}</div>
                {/* footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/40">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

// ── Inline badge / tag ────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "gold" | "network" | "success" | "warning" | "error" | "info" }) {
    const styles: Record<string, string> = {
        default: "bg-secondary text-secondary-foreground",
        gold: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
        network: "bg-primary/10 text-primary border border-primary/20",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        error: "bg-red-500/20 text-red-400 border border-red-500/30",
        info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
            {children}
        </span>
    )
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${checked ? "bg-primary" : "bg-secondary"}`}
        >
            <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
        </button>
    )
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }: {
    open: boolean; title: string; description: string
    onConfirm: () => void; onCancel: () => void; confirmLabel?: string; danger?: boolean
}) {
    return (
        <Modal open={open} onClose={onCancel} title={<><AlertTriangle className={`w-4 h-4 ${danger ? "text-red-400" : "text-yellow-400"}`} /> {title}</>} maxWidth="max-w-sm"
            footer={[
                <Button key="cancel" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>,
                <Button key="confirm" size="sm" onClick={onConfirm} className={danger ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary text-primary-foreground"}>{confirmLabel}</Button>,
            ]}
        >
            <p className="text-sm text-muted-foreground">{description}</p>
        </Modal>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDepositAddresses() {
    const dispatch = useDispatch()
    const { toasts, toast } = useToast()
    const { addresses, loading, total, checkingBalance, balanceResult, sweeping, sweepResults, sweepError, masterWallets, fetchingMasterWallets, syncingAll, addingMasterWallet, addMasterWalletSuccess } = useSelector((state: RootState) => state.adminDepositAddresses)

    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const limit = 20

    // Private key modal
    const [showKeyModal, setShowKeyModal] = useState(false)
    const [selectedKey, setSelectedKey] = useState("")

    // Row selection
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [showResultsModal, setShowResultsModal] = useState(false)

    // Add master wallet modal
    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false)
    const [missingNetwork, setMissingNetwork] = useState("")
    const [masterForm, setMasterForm] = useState({ label: "", symbol: "", address: "" })

    // Select master wallet for sweep
    const [isSelectWalletModalOpen, setIsSelectWalletModalOpen] = useState(false)
    const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null)

    // Per-row balance fetching
    const [rowBalanceLoading, setRowBalanceLoading] = useState<Record<string, boolean>>({})

    // Confirm delete
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

    // QR Code Modal
    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const [qrAddress, setQrAddress] = useState("")
    const [qrLabel, setQrLabel] = useState("")

    // ── Fetch list ─────────────────────────────────────────────────────────
    const fetchAddresses = useCallback((shouldSync = false) => {
        dispatch(depositActions.fetchDepositAddressesRequest({ page, limit, search, sync: shouldSync }))
    }, [dispatch, page, limit, search])

    const fetchMasterWallets = useCallback(() => {
        dispatch(depositActions.fetchMasterWalletsRequest())
    }, [dispatch])

    useEffect(() => {
        const t = setTimeout(() => { setPage(1); fetchAddresses() }, 500)
        return () => clearTimeout(t)
    }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { fetchAddresses(); fetchMasterWallets() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Toggle active status ───────────────────────────────────────────────
    const toggleStatus = async (id: string, current: boolean) => {
        dispatch(depositActions.updateDepositAddressRequest({ id, isActive: !current }))
    }

    // ── Sweep ──────────────────────────────────────────────────────────────
    const handleSweep = () => {
        if (!selectedRowKeys.length) return
        setIsSelectWalletModalOpen(false)
        dispatch(depositActions.sweepRequest({ addressIds: selectedRowKeys, masterWalletId: selectedMasterId! }))
    }

    // ── Delete ─────────────────────────────────────────────────────────────
    const executeDelete = (id: string) => {
        dispatch(depositActions.deleteDepositAddressRequest(id))
        setConfirmDelete(null)
    }

    // ── Copy ───────────────────────────────────────────────────────────────
    const copy = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied`)
    }

    // ── On-chain balance ───────────────────────────────────────────────────
    const handleCheckBalance = (record: DepositAddress) => {
        const id = record._id
        setRowBalanceLoading(p => ({ ...p, [id]: true }))
        dispatch(depositActions.checkBalanceRequest(id))
    }

    // ── Add master wallet form submit ──────────────────────────────────────
    const handleAddMasterWallet = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(depositActions.addMasterWalletRequest({ ...masterForm, network: missingNetwork, isActive: true }))
    }

    // ── Row selection helpers ──────────────────────────────────────────────
    const allSelected = addresses.length > 0 && selectedRowKeys.length === addresses.length
    const toggleAll = () => setSelectedRowKeys(allSelected ? [] : addresses.map(a => a._id))
    const toggleRow = (id: string) =>
        setSelectedRowKeys(p => p.includes(id) ? p.filter(k => k !== id) : [...p, id])

    // ── Watchers ────────────────────────────────────────────────────────────
    // Balance check result
    useEffect(() => {
        if (!balanceResult) return
        const id = balanceResult.id
        toast.success(`Live: ${balanceResult.balance.toFixed(6)} ${balanceResult.cryptoId.toUpperCase()}`)
        setRowBalanceLoading(p => ({ ...p, [id]: false }))
        fetchAddresses()
        dispatch(depositActions.clearBalanceResult())
    }, [balanceResult]) // eslint-disable-line react-hooks/exhaustive-deps

    // Balance check failure — clear the per-row spinner
    useEffect(() => {
        if (checkingBalance || !Object.keys(rowBalanceLoading).length) return
        setRowBalanceLoading({})
    }, [checkingBalance]) // eslint-disable-line react-hooks/exhaustive-deps

    // Sweep results
    useEffect(() => {
        if (!sweepResults) return
        setShowResultsModal(true)
        fetchAddresses()
    }, [sweepResults]) // eslint-disable-line react-hooks/exhaustive-deps

    // Sweep error
    useEffect(() => {
        if (!sweepError) return
        toast.error(sweepError)
        dispatch(depositActions.clearSweepResults())
    }, [sweepError]) // eslint-disable-line react-hooks/exhaustive-deps

    // Add master wallet success
    useEffect(() => {
        if (!addMasterWalletSuccess) return
        toast.success("Master wallet added")
        setIsMasterModalOpen(false)
        fetchMasterWallets()
        dispatch(depositActions.clearAddMasterWalletStatus())
    }, [addMasterWalletSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

    const getExplorerUrl = (network: string, address: string) => {
        const n = network.toLowerCase()
        if (n.includes('bsc') || n.includes('binance')) return `https://bscscan.com/address/${address}`
        if (n.includes('eth') || n.includes('mainnet')) return `https://etherscan.io/address/${address}`
        if (n.includes('polygon') || n.includes('matic')) return `https://polygonscan.com/address/${address}`
        if (n.includes('tron') || n.includes('trx')) return `https://tronscan.org/#/address/${address}`
        if (n.includes('solana')) return `https://solscan.io/account/${address}`
        return `https://blockchair.com/search?q=${address}`
    }

    // ── Pagination ─────────────────────────────────────────────────────────
    const totalPages = Math.ceil(total / limit)

    // ── Balance totals by crypto (from current page) ──────────────────────
    const cryptoTotals = addresses.reduce<Record<string, { total: number; count: number }>>((acc, a) => {
        const key = a.cryptoId.toUpperCase()
        if (!acc[key]) acc[key] = { total: 0, count: 0 }
        acc[key].total += a.lastBalance || 0
        acc[key].count += 1
        return acc
    }, {})

    // ══════════════════════════════════════════════════════════════════════════
    return (
        <div className="space-y-6 animate-in fade-in duration-500">

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

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Deposit Address Management
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Monitor and manage user-specific cryptocurrency deposit wallets.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            id="deposit-search"
                            type="text"
                            placeholder="Search user, email, address, asset…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 w-[260px] md:w-[360px] h-10 rounded-xl bg-card/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl" onClick={() => fetchAddresses(false)}>
                        <RefreshCw className={`w-4 h-4 ${loading && !syncingAll ? "animate-spin" : ""}`} />
                    </Button>
                    <button
                        title="Batch sync all on-chain balances for current page"
                        onClick={() => fetchAddresses(true)}
                        disabled={syncingAll || loading}
                        className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-all"
                    >
                        <Activity className={`w-4 h-4 ${syncingAll ? "animate-spin" : ""}`} />
                        {syncingAll ? "Syncing…" : "Sync All"}
                    </button>
                </div>
            </div>

            {/* ── Crypto Balance Status Bar ────────────────────────────────── */}
            {Object.keys(cryptoTotals).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.entries(cryptoTotals)
                        .sort(([, a], [, b]) => b.total - a.total)
                        .map(([coin, { total, count }]) => {
                            const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
                                USDT: { bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
                                USDC: { bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/10" },
                                BNB: { bg: "from-amber-400/10 to-amber-400/5", border: "border-amber-400/20", text: "text-amber-400", glow: "shadow-amber-400/10" },
                                ETH: { bg: "from-violet-500/10 to-violet-500/5", border: "border-violet-500/20", text: "text-violet-400", glow: "shadow-violet-500/10" },
                                BTC: { bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20", text: "text-orange-400", glow: "shadow-orange-500/10" },
                                MATIC: { bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/10" },
                                TRX: { bg: "from-red-500/10 to-red-500/5", border: "border-red-500/20", text: "text-red-400", glow: "shadow-red-500/10" },
                            }
                            const c = colorMap[coin] ?? { bg: "from-primary/10 to-primary/5", border: "border-primary/20", text: "text-primary", glow: "shadow-primary/10" }
                            return (
                                <div
                                    key={coin}
                                    className={`relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-4 shadow-lg ${c.glow} backdrop-blur-sm transition-transform hover:-translate-y-0.5`}
                                >
                                    {/* decorative blurred circle */}
                                    <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${c.text} opacity-10 blur-xl`}
                                        style={{ background: "currentColor" }} />

                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${c.text} mb-1`}>{coin}</p>
                                    <p className={`text-xl font-extrabold ${c.text} leading-none`}>
                                        {total >= 1000
                                            ? `${(total / 1000).toFixed(2)}K`
                                            : total.toFixed(total < 0.001 ? 8 : 4)}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1.5">
                                        {count} wallet{count !== 1 ? "s" : ""} · this page
                                    </p>
                                </div>
                            )
                        })}
                </div>
            )}

            {/* ── Sweep banner ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-2xl border border-primary/10">
                <div className="flex-1">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Wallet Automation Bot
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Sweep deposits from multiple wallets simultaneously into your Master Admin Wallet.
                    </p>
                </div>
                <Button
                    disabled={!selectedRowKeys.length || sweeping}
                    onClick={() => setIsSelectWalletModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 gap-2 rounded-xl h-10 px-5"
                >
                    {sweeping ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                    Withdraw ({selectedRowKeys.length})
                </Button>
            </div>

            {/* ── Table ────────────────────────────────────────────────────── */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Generated Wallets</CardTitle>
                    <CardDescription>
                        {total} unique user addresses · Search: name, email, address or asset
                        <span className="ml-2 text-primary text-[11px] font-medium">· On-chain balance uses RPC from Crypto Settings</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/40 bg-secondary/20">
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            className="rounded border-border/60 accent-primary"
                                        />
                                    </th>
                                    {["User", "Asset", "Address", "Balance", "Security", "Status", "Last Activity", "Actions"].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-muted-foreground">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                            <p className="text-xs">Fetching wallets…</p>
                                        </td>
                                    </tr>
                                ) : addresses.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-muted-foreground text-sm">
                                            No deposit addresses found.
                                        </td>
                                    </tr>
                                ) : addresses.map((rec, idx) => (
                                    <tr
                                        key={rec._id}
                                        className={`border-b border-border/20 transition-colors hover:bg-secondary/10 ${idx % 2 === 0 ? "" : "bg-secondary/5"} ${selectedRowKeys.includes(rec._id) ? "bg-primary/5" : ""}`}
                                    >
                                        {/* checkbox */}
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRowKeys.includes(rec._id)}
                                                onChange={() => toggleRow(rec._id)}
                                                className="rounded border-border/60 accent-primary"
                                            />
                                        </td>

                                        {/* User */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <UserIcon className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-foreground text-xs">{rec.userId?.name || "Unknown"}</p>
                                                    <p className="text-[10px] text-muted-foreground">{rec.userId?.email || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Asset */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                <Badge variant="gold">{rec.cryptoId}</Badge>
                                                <Badge variant="network">{rec.networkId}</Badge>
                                            </div>
                                        </td>

                                        {/* Address */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <code className="text-[10px] font-mono bg-secondary/50 px-2 py-1 rounded max-w-[160px] truncate block">
                                                    {rec.address}
                                                </code>
                                                <button
                                                    title="Copy address"
                                                    onClick={() => copy(rec.address, "Address")}
                                                    className="p-1 rounded hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                                <a
                                                    href={getExplorerUrl(rec.networkId, rec.address)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="View on Blockchain Explorer"
                                                    className="p-1 rounded hover:bg-secondary/60 text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </td>

                                        {/* Balance */}
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-primary text-sm">
                                                {rec.lastBalance > 0 ? rec.lastBalance.toFixed(6) : "0.000000"}
                                                <span className="ml-1 text-[9px] uppercase opacity-60">{rec.cryptoId}</span>
                                            </p>
                                            <p className="text-[9px] uppercase text-muted-foreground mb-1">{rec.networkId}</p>
                                            <button
                                                onClick={() => handleCheckBalance(rec)}
                                                disabled={rowBalanceLoading[rec._id]}
                                                className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                                            >
                                                {rowBalanceLoading[rec._id]
                                                    ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                                    : <Activity className="w-2.5 h-2.5" />}
                                                {rowBalanceLoading[rec._id] ? "Checking…" : "Check on-chain"}
                                            </button>
                                        </td>

                                        {/* Security */}
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => { setSelectedKey(rec.privateKey); setShowKeyModal(true) }}
                                                className="flex items-center gap-1.5 text-[11px] font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Key className="w-3 h-3" />
                                                Private Key
                                            </button>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Toggle checked={rec.isActive} onChange={() => toggleStatus(rec._id, rec.isActive)} />
                                                <span className={`text-[11px] font-medium ${rec.isActive ? "text-green-400" : "text-muted-foreground"}`}>
                                                    {rec.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Last Activity */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="text-xs text-foreground">{rec.lastUsedAt ? new Date(rec.lastUsedAt).toLocaleTimeString() : "Never"}</p>
                                            <p className="text-[10px] text-muted-foreground">{rec.lastUsedAt ? new Date(rec.lastUsedAt).toLocaleDateString() : "Pending check"}</p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    title="Gas Deposit QR"
                                                    onClick={() => {
                                                        setQrAddress(rec.address)
                                                        setQrLabel(`Deposit Gas (${rec.networkId.toUpperCase()})`)
                                                        setIsQRModalOpen(true)
                                                    }}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => setConfirmDelete(rec._id)}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-1 px-6 py-4 border-t border-border/30">
                            <span className="text-xs text-muted-foreground mr-3">
                                Page {page} / {totalPages} · {total} total
                            </span>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg hover:bg-secondary/60 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                                .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                                    if (idx > 0 && (n as number) - (arr[idx - 1] as number) > 1) acc.push("…")
                                    acc.push(n)
                                    return acc
                                }, [])
                                .map((n, idx) => n === "…" ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">…</span>
                                ) : (
                                    <button
                                        key={n}
                                        onClick={() => setPage(n as number)}
                                        className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${page === n ? "bg-primary text-primary-foreground" : "hover:bg-secondary/60 text-muted-foreground"}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded-lg hover:bg-secondary/60 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Confirm Delete ─────────────────────────────────────────‐── */}
            <ConfirmDialog
                open={!!confirmDelete}
                danger
                title="Delete Deposit Address?"
                description="This will permanently delete this deposit address record. This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={() => confirmDelete && executeDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
            />

            {/* ── Private Key Modal ──────────────────────────────────────── */}
            <Modal
                open={showKeyModal}
                onClose={() => setShowKeyModal(false)}
                title={<React.Fragment><AlertCircle className="w-4 h-4 text-red-400" /> <span className="text-red-400 uppercase tracking-wide">Security Warning</span></React.Fragment>}
                footer={[
                    <Button key="close" variant="outline" size="sm" onClick={() => setShowKeyModal(false)}>Close</Button>,
                    <Button key="copy" size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => copy(selectedKey, "Private Key")}>
                        <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Key
                    </Button>,
                ]}
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This is a highly sensitive <span className="text-red-400 font-bold uppercase underline">Private Key</span>.
                        Exposure allows full control over all funds in this wallet.
                    </p>
                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 select-all font-mono text-xs break-all leading-relaxed text-red-200">
                        {selectedKey}
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                        Only authorized administrators should ever access these keys.
                    </div>
                </div>
            </Modal>

            {/* ── Sweep Results Modal ────────────────────────────────────── */}
            <Modal
                open={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                title={<><ArrowDownToLine className="w-4 h-4 text-primary" /> Withdrawal Results</>}
                maxWidth="max-w-2xl"
                footer={<Button variant="outline" size="sm" onClick={() => setShowResultsModal(false)}>Done</Button>}
            >
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {sweepResults?.map((res, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${res.status === "success" ? "bg-green-950/30 border-green-500/20" :
                            res.status === "need_gas" ? "bg-yellow-950/30 border-yellow-500/20" :
                                res.status === "skipped" ? "bg-blue-950/30 border-blue-500/20" :
                                    "bg-red-950/20 border-red-500/20"}`}>
                            <div className="flex items-center justify-between mb-2">
                                <code className="text-[10px] opacity-60 truncate max-w-[240px]">{res.address}</code>
                                <Badge variant={
                                    res.status === "success" ? "success" :
                                        res.status === "need_gas" ? "warning" :
                                            res.status === "skipped" ? "info" : "error"
                                }>
                                    {res.status.replace("_", " ")}
                                </Badge>
                            </div>
                            <p className="text-xs font-medium">{res.message}</p>
                            {res.status === "error" && res.networkId && (
                                <button
                                    onClick={() => {
                                        setMissingNetwork(res.networkId)
                                        setMasterForm({ label: `Main ${res.networkId.toUpperCase()} Wallet`, symbol: "", address: "" })
                                        setIsMasterModalOpen(true)
                                    }}
                                    className="flex items-center gap-1 text-[10px] text-primary font-bold mt-2 hover:underline"
                                >
                                    <Plus className="w-3 h-3" />
                                    Setup {res.networkId.toUpperCase()} Master Wallet
                                </button>
                            )}
                            {res.status === "need_gas" && (
                                <div className="mt-2 p-2 bg-yellow-950/30 rounded-lg flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] text-yellow-400 font-bold uppercase">Activation Required</p>
                                        <p className="text-[10px] mt-1 text-yellow-100/70 truncate">
                                            Fund <span className="font-bold underline text-yellow-400">{res.requiredGas}</span> native coins to cover gas.
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="h-7 px-3 text-[10px] bg-yellow-500 hover:bg-yellow-600 text-black border-none font-bold shrink-0"
                                        onClick={() => {
                                            setQrAddress(res.address);
                                            setQrLabel(`Gas Deposit: ${res.requiredGas} ${res.networkId?.toUpperCase() || 'BNB'}`);
                                            setIsQRModalOpen(true);
                                        }}
                                    >
                                        Show QR
                                    </Button>
                                </div>
                            )}
                            {res.txHash && (
                                <p className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                                    <ExternalLink className="w-3 h-3" /> TX: <span className="font-mono">{res.txHash}</span>
                                </p>
                            )}
                        </div>
                    ))}
                    {(!sweepResults || !sweepResults.length) && (
                        <p className="text-center text-muted-foreground py-8 text-sm">No results to show.</p>
                    )}
                </div>
            </Modal>

            {/* ── Add Master Wallet Modal ────────────────────────────────── */}
            <Modal
                open={isMasterModalOpen}
                onClose={() => setIsMasterModalOpen(false)}
                title={<><WalletIcon className="w-4 h-4 text-primary" /> Add Master Wallet — {missingNetwork.toUpperCase()}</>}
            >
                <form onSubmit={handleAddMasterWallet} className="space-y-4">
                    {[
                        { label: "Wallet Label", key: "label", placeholder: `Main ${missingNetwork.toUpperCase()} Wallet` },
                        { label: "Native Token Symbol", key: "symbol", placeholder: "BNB / ETH / MATIC" },
                        { label: "Master Receiving Address", key: "address", placeholder: "0x…" },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{f.label}</label>
                            <input
                                required
                                value={(masterForm as any)[f.key]}
                                onChange={e => setMasterForm(p => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full h-10 px-3 rounded-xl bg-secondary/40 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsMasterModalOpen(false)}>Cancel</Button>
                        <Button type="submit" size="sm" className="bg-primary text-primary-foreground">Save Master Wallet</Button>
                    </div>
                </form>
            </Modal>

            {/* ── Select Master Wallet Modal ─────────────────────────────── */}
            <Modal
                open={isSelectWalletModalOpen}
                onClose={() => setIsSelectWalletModalOpen(false)}
                title={<><WalletIcon className="w-4 h-4 text-primary" /> Select Master Admin Wallet</>}
                footer={[
                    <Button key="cancel" variant="outline" size="sm" onClick={() => setIsSelectWalletModalOpen(false)}>Cancel</Button>,
                    <Button key="sweep" size="sm" disabled={!selectedMasterId} onClick={handleSweep} className="bg-primary text-primary-foreground">
                        Proceed with Withdrawal
                    </Button>,
                ]}
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Choose the Master Admin Wallet to receive funds from {selectedRowKeys.length} selected wallet{selectedRowKeys.length > 1 ? "s" : ""}.
                    </p>

                    <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                        {masterWallets.length === 0 ? (
                            <div className="text-center py-8 bg-secondary/20 rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                                No master wallets found. Add one from Crypto Settings.
                            </div>
                        ) : masterWallets.map(w => (
                            <div
                                key={w._id}
                                onClick={() => setSelectedMasterId(w._id)}
                                className={`relative cursor-pointer p-3.5 rounded-xl border-2 transition-all ${selectedMasterId === w._id
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border/40 hover:border-primary/30 hover:bg-secondary/20"}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3 items-start">
                                        <div className={`p-1.5 rounded-lg transition-colors ${selectedMasterId === w._id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                                            <WalletIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm flex items-center gap-1.5">
                                                {w.label}
                                                <Badge variant="gold">{w.symbol}</Badge>
                                            </p>
                                            <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">{w.address}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="network">{w.network}</Badge>
                                                <span className="text-[10px] text-foreground/70">
                                                    Bal: <span className="text-primary font-semibold">{w.balance} {w.symbol}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedMasterId === w._id && (
                                        <div className="bg-primary rounded-full p-1 text-primary-foreground">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-2">
                        <ArrowDownToLine className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground">
                            All selected wallets will transfer their full balance (minus gas) into the chosen master wallet.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* ── QR Code Modal (using antd) ───────────────────────────── */}
            <Modal
                open={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                title={<><WalletIcon className="w-4 h-4 text-primary" /> Deposit Gas (BNB/Native)</>}
                maxWidth="max-w-xs"
                footer={<Button variant="outline" size="sm" onClick={() => setIsQRModalOpen(false)} className="w-full">Done</Button>}
            >
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="p-3 bg-white rounded-2xl shadow-xl">
                        <QRCode
                            value={qrAddress}
                            size={200}
                            bordered={false}
                            color="#000"
                        />
                    </div>
                    <div className="text-center space-y-2 w-full">
                        <p className="text-xs font-bold text-foreground">
                            {qrLabel}
                        </p>
                        <div className="flex items-center gap-1.5 justify-center bg-secondary/40 p-2 rounded-lg border border-border/50">
                            <code className="text-[10px] font-mono break-all">{qrAddress}</code>
                            <button onClick={() => copy(qrAddress, "Address")} className="shrink-0 p-1 hover:bg-secondary rounded">
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic px-4">
                            Send gas to this address to activate sweeping.
                        </p>
                    </div>
                </div>
            </Modal>

        </div>
    )
}

// ── AlertCircle SVG ───────────────────────────────────────────────────────────
const AlertCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)
