import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Package, Plus, Edit, Trash2, RefreshCw, DollarSign, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
    fetchCreditPackagesRequest,
    createCreditPackageRequest,
    updateCreditPackageRequest,
    deleteCreditPackageRequest,
} from '@/modules/admin/credit-packages/actions'
import type { CreditPackageItem } from '@/modules/admin/credit-packages/reducer'

const initialForm = {
    name: '',
    code: '',
    credits: 0,
    price: 0,
    discountPrice: 0,
    type: 'one_time' as const,
    billingCycle: 'monthly' as const,
    features: '',
    isActive: true,
    sortOrder: 0,
}

export default function AdminCreditPackages() {
    const dispatch = useDispatch()
    const { packages, stats, loading, saving } = useSelector((state: any) => state.adminCreditPackages)
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<CreditPackageItem | null>(null)
    const [form, setForm] = useState(initialForm)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => { dispatch(fetchCreditPackagesRequest(filter)) }, [dispatch, filter])

    const openCreate = () => {
        setEditing(null)
        setForm(initialForm)
        setShowModal(true)
    }

    const openEdit = (pkg: CreditPackageItem) => {
        setEditing(pkg)
        setForm({
            name: pkg.name,
            code: pkg.code,
            credits: pkg.credits,
            price: pkg.price,
            discountPrice: pkg.discountPrice || 0,
            type: pkg.type,
            billingCycle: pkg.billingCycle || 'monthly',
            features: (pkg.features || []).join('\n'),
            isActive: pkg.isActive,
            sortOrder: pkg.sortOrder,
        })
        setShowModal(true)
    }

    const handleSave = () => {
        const payload = {
            ...form,
            credits: Number(form.credits),
            price: Number(form.price),
            discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
            features: form.features.split('\n').filter(f => f.trim()),
        }
        if (payload.type === 'one_time') delete payload.billingCycle

        if (editing) {
            dispatch(updateCreditPackageRequest({ packageId: editing._id, ...payload }))
            toast.success('Credit package updated')
        } else {
            dispatch(createCreditPackageRequest(payload))
            toast.success('Credit package created')
        }
        setShowModal(false)
    }

    const handleDelete = (id: string) => {
        dispatch(deleteCreditPackageRequest(id))
        toast.success('Credit package deleted')
        setDeleteConfirm(null)
    }

    const statCards = [
        { label: 'Total Packages', value: stats?.total ?? 0, icon: Package, color: 'from-blue-500 to-blue-600' },
        { label: 'Active', value: stats?.active ?? 0, icon: CheckCircle, color: 'from-green-500 to-green-600' },
        { label: 'One-Time', value: stats?.oneTime ?? 0, icon: DollarSign, color: 'from-purple-500 to-purple-600' },
        { label: 'Subscription', value: stats?.subscription ?? 0, icon: CreditCard, color: 'from-orange-500 to-orange-600' },
    ]

    const typeFilters = ['all', 'one_time', 'subscription']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Credit Packages</h1>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">
                    <Plus className="w-4 h-4" /> Add Package
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(card => (
                    <div key={card.label} className={`rounded-xl bg-gradient-to-br ${card.color} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">{card.label}</span>
                            <card.icon className="w-5 h-5 opacity-80" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {typeFilters.map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                            filter === t
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        {t === 'all' ? 'All' : t === 'one_time' ? 'One-Time' : 'Subscription'}
                    </button>
                ))}
                <button
                    onClick={() => dispatch(fetchCreditPackagesRequest(filter))}
                    className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Package className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No credit packages yet</p>
                    <p className="text-sm">Create your first credit package to get started</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="text-left p-3 font-medium">Name</th>
                                <th className="text-left p-3 font-medium">Code</th>
                                <th className="text-right p-3 font-medium">Credits</th>
                                <th className="text-right p-3 font-medium">Price</th>
                                <th className="text-right p-3 font-medium">Discount</th>
                                <th className="text-center p-3 font-medium">Type</th>
                                <th className="text-center p-3 font-medium">Active</th>
                                <th className="text-center p-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg: CreditPackageItem) => (
                                <tr key={pkg._id} className="border-t border-border hover:bg-muted/30 transition">
                                    <td className="p-3 font-medium">{pkg.name}</td>
                                    <td className="p-3 text-muted-foreground">{pkg.code}</td>
                                    <td className="p-3 text-right">{pkg.credits.toLocaleString()}</td>
                                    <td className="p-3 text-right">${pkg.price.toFixed(2)}</td>
                                    <td className="p-3 text-right">{pkg.discountPrice ? `$${pkg.discountPrice.toFixed(2)}` : '-'}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            pkg.type === 'one_time' ? 'bg-purple-500/10 text-purple-600' : 'bg-orange-500/10 text-orange-600'
                                        }`}>
                                            {pkg.type === 'one_time' ? 'One-Time' : 'Subscription'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        {pkg.isActive ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(pkg)} className="p-1.5 rounded-lg hover:bg-muted transition opacity-70">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteConfirm(pkg._id)} className="p-1.5 rounded-lg hover:bg-muted transition opacity-70 text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-card rounded-xl border border-border w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-lg font-semibold">{editing ? 'Edit' : 'Create'} Credit Package</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Code</label>
                                    <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                                        disabled={!!editing}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background disabled:opacity-50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Credits</label>
                                    <input type="number" min="0" value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                                    <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Discount ($)</label>
                                    <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                                        disabled={!!editing}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background disabled:opacity-50">
                                        <option value="one_time">One-Time</option>
                                        <option value="subscription">Subscription</option>
                                    </select>
                                </div>
                                {form.type === 'subscription' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                                        <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value as any })}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                                <textarea rows={4} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background" placeholder="1000 requests/day&#10;Priority support&#10;API access" />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                        className="rounded border-border" />
                                    <span className="text-sm font-medium">Active</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Sort Order</label>
                                    <input type="number" min="0" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
                                        className="w-20 px-2 py-1.5 rounded-lg border border-border bg-background text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving || !form.name || !form.code}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
                                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {editing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-card rounded-xl border border-border w-full max-w-sm mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-2">Delete Credit Package?</h3>
                        <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
