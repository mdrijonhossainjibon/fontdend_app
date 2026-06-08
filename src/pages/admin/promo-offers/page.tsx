import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Gift, Plus, Trash2, Eye, EyeOff, CheckCircle2, Shield, X, Search, Pencil, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchPromoOffersRequest, createPromoOfferRequest, updatePromoOfferRequest, deletePromoOfferRequest } from '@/modules/admin/promo-offers/actions'
import type { PromoOfferItem } from '@/modules/admin/promo-offers/reducer'

const EMPTY_FORM = { title: '', badge: '', description: '', features: '', highlight: '', pricingPlanCode: '', isActive: true, sortOrder: '0', image: null as File | null, imagePreview: '' }

export default function AdminPromoOffersPage() {
  const dispatch = useDispatch()
  const { offers, loading, creating, saving } = useSelector((state: any) => state.adminPromoOffers)

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<PromoOfferItem | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => { dispatch(fetchPromoOffersRequest()) }, [dispatch])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  const filtered = offers.filter((o: PromoOfferItem) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.pricingPlanCode.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.title.trim() || !form.pricingPlanCode.trim()) return
    dispatch(createPromoOfferRequest({
      title: form.title.trim(),
      badge: form.badge.trim(),
      description: form.description.trim(),
      features: form.features.split(',').map((s: string) => s.trim()).filter(Boolean),
      highlight: form.highlight.trim(),
      pricingPlanCode: form.pricingPlanCode.trim(),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      image: form.image || undefined,
    }))
    setShowCreate(false)
    setForm(EMPTY_FORM)
    showToast('success', 'Promo offer created!')
  }

  const handleToggle = (id: string, isActive: boolean) => {
    dispatch(updatePromoOfferRequest({ id, isActive: !isActive }))
    showToast('success', `Offer ${!isActive ? 'activated' : 'deactivated'}`)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this promo offer?')) return
    dispatch(deletePromoOfferRequest(id))
    showToast('success', 'Offer deleted')
  }

  const openEdit = (offer: PromoOfferItem) => {
    setEditTarget(offer)
    setForm({
      title: offer.title,
      badge: offer.badge || '',
      description: offer.description || '',
      features: (offer.features || []).join(', '),
      highlight: offer.highlight || '',
      pricingPlanCode: offer.pricingPlanCode,
      isActive: offer.isActive,
      sortOrder: String(offer.sortOrder ?? 0),
      image: null,
      imagePreview: offer.image || '',
    })
  }

  const handleEdit = () => {
    if (!editTarget || !form.title.trim() || !form.pricingPlanCode.trim()) return
    dispatch(updatePromoOfferRequest({
      id: editTarget.id,
      title: form.title.trim(),
      badge: form.badge.trim(),
      description: form.description.trim(),
      features: form.features.split(',').map((s: string) => s.trim()).filter(Boolean),
      highlight: form.highlight.trim(),
      pricingPlanCode: form.pricingPlanCode.trim(),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      image: form.image || undefined,
    }))
    setForm(EMPTY_FORM)
    setEditTarget(null)
    showToast('success', 'Offer updated')
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create Offer
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or plan code..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
        />
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editTarget ? 'Edit Promo Offer' : 'Create Promo Offer'}</h2>
              <button onClick={() => { setShowCreate(false); setEditTarget(null) }} className="p-1 hover:bg-secondary/50 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Summer Sale"
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Badge</label>
                <input
                  value={form.badge}
                  onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                  placeholder="e.g. Limited Time"
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Offer description..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Features (comma-separated)</label>
                <input
                  value={form.features}
                  onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
                  placeholder="e.g. 50% off, Priority Support, Free Setup"
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Highlight</label>
                <input
                  value={form.highlight}
                  onChange={e => setForm(p => ({ ...p, highlight: e.target.value }))}
                  placeholder="e.g. Most Popular"
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Pricing Plan Code *</label>
                <input
                  value={form.pricingPlanCode}
                  onChange={e => setForm(p => ({ ...p, pricingPlanCode: e.target.value }))}
                  placeholder="e.g. pro_monthly"
                  className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Banner Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 cursor-pointer text-sm transition-colors">
                    <Upload className="w-4 h-4" />
                    Choose
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) {
                          setForm(p => ({ ...p, image: f, imagePreview: URL.createObjectURL(f) }))
                        }
                      }}
                    />
                  </label>
                  {form.imagePreview && (
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-border">
                      <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setForm(p => ({ ...p, image: null, imagePreview: '' }))}
                        className="absolute top-0 right-0 p-0.5 bg-black/50 rounded-bl-lg"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                  {!form.imagePreview && (
                    <span className="text-xs text-muted-foreground"><ImageIcon className="w-3 h-3 inline mr-1" />No image</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none text-sm"
                    min={0}
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
              <Button
                onClick={editTarget ? handleEdit : handleCreate}
                disabled={creating || saving || !form.title.trim() || !form.pricingPlanCode.trim()}
                className="w-full h-12 rounded-xl gap-2 mt-2"
              >
                {(creating || saving) ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gift className="w-4 h-4" />
                )}
                {(creating || saving) ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Offer'}
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
          <p className="font-medium">{search ? 'No offers match your search' : 'No promo offers yet'}</p>
          <p className="text-sm mt-1">{search ? 'Try a different search term.' : 'Create your first promo offer to get started.'}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Badge</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Plan Code</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Features</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Order</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((offer: PromoOfferItem) => (
                  <tr key={offer.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-semibold">{offer.title}</span>
                        {offer.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{offer.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {offer.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
                          {offer.badge}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-secondary/50 px-2 py-0.5 rounded">{offer.pricingPlanCode}</code>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(offer.features || []).slice(0, 3).map((f: string, i: number) => (
                          <span key={i} className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded">{f}</span>
                        ))}
                        {(offer.features || []).length > 3 && (
                          <span className="text-xs text-muted-foreground">+{offer.features.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{offer.sortOrder ?? 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", offer.isActive ? "bg-green-500" : "bg-red-500")} />
                        <span className={cn("text-xs font-medium", offer.isActive ? "text-green-500" : "text-red-500")}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(offer)} className="p-2 hover:bg-secondary/50 rounded-xl transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggle(offer.id, offer.isActive)}
                          className="p-2 hover:bg-secondary/50 rounded-xl transition-colors"
                          title={offer.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {offer.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="p-2 hover:bg-destructive/10 rounded-xl transition-colors text-destructive"
                          title="Delete"
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
        </div>
      )}
    </div>
  )
}
