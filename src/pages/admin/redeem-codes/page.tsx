import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Gift, Plus, Trash2, Eye, EyeOff, Copy, CheckCircle2, Shield, X, RotateCw, Search, Pencil, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchRedeemCodesRequest, createRedeemCodeRequest, updateRedeemCodeRequest, deleteRedeemCodeRequest } from '@/modules/admin/redeem-codes/actions'
import type { RedeemCodeItem } from '@/modules/admin/redeem-codes/reducer'

export default function AdminRedeemCodesPage() {
  const dispatch = useDispatch()
  const { codes, loading, creating, saving } = useSelector((state: any) => state.adminRedeemCodes)

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<RedeemCodeItem | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [form, setForm] = useState({ code: '', credits: '1000', maxUses: '1', expiresAt: '' })
  const [visibleCodes, setVisibleCodes] = useState<Set<string>>(new Set())

  useEffect(() => { dispatch(fetchRedeemCodesRequest()) }, [dispatch])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  const filtered = codes.filter((c: RedeemCodeItem) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.code.trim() || !form.credits) return
    dispatch(createRedeemCodeRequest({
      code: form.code.trim(),
      credits: Number(form.credits),
      maxUses: Number(form.maxUses),
      expiresAt: form.expiresAt || null,
    }))
    setShowCreate(false)
    setForm({ code: '', credits: '1000', maxUses: '1', expiresAt: '' })
    showToast('success', `Code created!`)
  }

  const handleToggle = (id: string, isActive: boolean) => {
    dispatch(updateRedeemCodeRequest({ id, isActive: !isActive }))
    showToast('success', `Code ${!isActive ? 'activated' : 'deactivated'}`)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this redeem code?')) return
    dispatch(deleteRedeemCodeRequest(id))
    showToast('success', 'Code deleted')
  }

  const handleReset = (id: string) => {
    if (!confirm('Reset usage count for this code? Users can reuse it.')) return
    dispatch(updateRedeemCodeRequest({ id, resetUsedBy: true }))
    showToast('success', 'Usage count reset')
  }

  const openEdit = (code: RedeemCodeItem) => {
    setEditTarget(code)
    setForm({
      code: code.code,
      credits: String(code.credits),
      maxUses: String(code.maxUses),
      expiresAt: code.expiresAt ? code.expiresAt.split('T')[0] : '',
    })
  }

  const handleEdit = () => {
    if (!editTarget || !form.credits) return
    dispatch(updateRedeemCodeRequest({
      id: editTarget.id,
      credits: Number(form.credits),
      maxUses: Number(form.maxUses),
      expiresAt: form.expiresAt || null,
    }))
    setEditTarget(null)
    showToast('success', 'Code updated')
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    showToast('success', 'Copied to clipboard')
  }

  const toggleVisible = (id: string) => {
    setVisibleCodes(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isExpired = (code: RedeemCodeItem) => {
    if (!code.expiresAt) return false
    return new Date(code.expiresAt) < new Date()
  }

  const modalOpen = showCreate || editTarget

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium",
          toast.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
        )}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {toast.text}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Redeem Codes</h1>
          </div>
          <p className="text-sm text-muted-foreground">Create and manage promo/redeem codes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => dispatch(fetchRedeemCodesRequest())} className="gap-2">
            <RotateCw className="w-4 h-4" /> Reload
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Create Code
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search codes..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
        />
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editTarget ? 'Edit Redeem Code' : 'Create Redeem Code'}</h2>
              <button onClick={() => { setShowCreate(false); setEditTarget(null) }} className="p-1 hover:bg-secondary/50 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Code</label>
                <input
                  value={form.code}
                  onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SUMMER50"
                  disabled={!!editTarget}
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm uppercase tracking-wider font-mono font-bold disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Credits *</label>
                <input
                  type="number"
                  value={form.credits}
                  onChange={e => setForm(p => ({ ...p, credits: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                  min={1}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Uses</label>
                  <input
                    type="number"
                    value={form.maxUses}
                    onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Expires At</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={editTarget ? handleEdit : handleCreate}
                disabled={creating || saving || !form.credits}
                className="w-full h-12 rounded-xl gap-2 mt-2"
              >
                {(creating || saving) ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gift className="w-4 h-4" />
                )}
                {(creating || saving) ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Code'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-border">
          <Gift className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{search ? 'No codes match your search' : 'No redeem codes yet'}</p>
          <p className="text-sm mt-1">{search ? 'Try a different search term.' : 'Create your first promo code to get started.'}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Code</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Credits</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Uses</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Expires</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((code: RedeemCodeItem) => {
                  const expired = isExpired(code)
                  const showCode = visibleCodes.has(code.id)
                  return (
                    <tr key={code.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold tracking-wider">
                            {showCode ? code.code : '••••••••'}
                          </span>
                          <button onClick={() => toggleVisible(code.id)} className="p-1 hover:bg-secondary/50 rounded" title="Toggle visibility">
                            {showCode ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                          <button onClick={() => copyCode(code.code)} className="p-1 hover:bg-secondary/50 rounded" title="Copy code">
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{(code.credits ?? 0).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={cn(
                          "text-sm",
                          code.usedCount >= code.maxUses ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {code.usedCount}/{code.maxUses}
                        </span>
                      </td>
                      <td className="p-4">
                        {code.expiresAt ? (
                          <span className={cn(expired && "text-destructive")}>
                            {new Date(code.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            !code.isActive ? "bg-red-500" : expired ? "bg-yellow-500" : "bg-green-500"
                          )} />
                          <span className={cn(
                            "text-xs font-medium",
                            !code.isActive ? "text-red-500" : expired ? "text-yellow-500" : "text-green-500"
                          )}>
                            {!code.isActive ? 'Inactive' : expired ? 'Expired' : 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(code)} className="p-2 hover:bg-secondary/50 rounded-xl transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleReset(code.id)} className="p-2 hover:bg-secondary/50 rounded-xl transition-colors" title="Reset usage">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggle(code.id, code.isActive)}
                            className="p-2 hover:bg-secondary/50 rounded-xl transition-colors"
                            title={code.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {code.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(code.id)}
                            className="p-2 hover:bg-destructive/10 rounded-xl transition-colors text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}
    </div>
  )
}
