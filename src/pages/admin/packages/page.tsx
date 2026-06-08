import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { Package, Edit, Trash2, Plus, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RootState } from '@/modules/rootReducer'
import { fetchPackagesRequest, createPackageRequest, updatePackageRequest, deletePackageRequest } from '@/modules/admin/packages/actions'
import type { PricingPackage } from '@/modules/admin/packages/reducer'

export default function AdminPricingPage() {
  const dispatch = useDispatch()
  const { packages, stats, loading, saving } = useSelector((state: RootState) => state.adminPackages)

  const [filterType, setFilterType] = useState<"all" | "count" | "daily" | "minute">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null)
  const [deletePkg, setDeletePkg] = useState<PricingPackage | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'count' as 'count' | 'daily' | 'minute',
    price: '',
    validity: '30d',
    validityDays: 30,
    recognition: 'Image',
    count: '',
    dailyLimit: '',
    rateLimit: '',
    status: 'active'
  })

  useEffect(() => {
    dispatch(fetchPackagesRequest(filterType))
  }, [dispatch, filterType])

  const handleCreatePackage = async () => {
    if (!formData.code || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }
    const payload: any = {
      code: formData.code,
      type: formData.type,
      price: formData.price,
      validity: formData.validity,
      validityDays: formData.validityDays,
      recognition: formData.recognition,
      status: formData.status
    }
    if (formData.type === 'count') {
      if (!formData.count) { toast.error('Please enter total request count'); return }
      payload.count = parseInt(formData.count)
    } else if (formData.type === 'daily') {
      if (!formData.dailyLimit) { toast.error('Please enter daily request limit'); return }
      payload.dailyLimit = parseInt(formData.dailyLimit)
    } else if (formData.type === 'minute') {
      if (!formData.rateLimit) { toast.error('Please enter requests per minute'); return }
      payload.rateLimit = parseInt(formData.rateLimit)
    }
    dispatch(createPackageRequest(payload))
    setIsModalOpen(false)
    resetForm()
  }

  const handleUpdatePackage = async () => {
    if (!editingPackage) return
    const payload: any = {
      planId: editingPackage.id,
      price: formData.price,
      validity: formData.validity,
      validityDays: formData.validityDays,
      recognition: formData.recognition,
      status: formData.status
    }
    if (formData.type === 'count' && formData.count) payload.count = parseInt(formData.count)
    else if (formData.type === 'daily' && formData.dailyLimit) payload.dailyLimit = parseInt(formData.dailyLimit)
    else if (formData.type === 'minute' && formData.rateLimit) payload.rateLimit = parseInt(formData.rateLimit)
    dispatch(updatePackageRequest(payload))
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingPackage(null)
    resetForm()
  }

  const handleDeletePackage = (pkg: PricingPackage) => {
    setDeletePkg(pkg)
  }

  const openEditModal = (pkg: PricingPackage) => {
    setEditingPackage(pkg)
    setIsEditMode(true)
    setFormData({
      code: pkg.code,
      type: pkg.type,
      price: pkg.priceValue.toString(),
      validity: pkg.validity,
      validityDays: pkg.validityDays,
      recognition: pkg.recognition,
      count: pkg.count?.toString() || '',
      dailyLimit: pkg.dailyLimit?.toString() || '',
      rateLimit: pkg.rateLimit?.toString() || '',
      status: pkg.status
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'count',
      price: '',
      validity: '30d',
      validityDays: 30,
      recognition: 'Image',
      count: '',
      dailyLimit: '',
      rateLimit: '',
      status: 'active'
    })
  }

  const handleValidityChange = (validity: string) => {
    const daysMap: { [key: string]: number } = {
      '1d': 1, '7d': 7, '30d': 30, '90d': 90, '365d': 365
    }
    setFormData({ ...formData, validity, validityDays: daysMap[validity] || 30 })
  }

  const filteredPackages = packages

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchPackagesRequest(filterType))}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button className="bg-amber-500 hover:bg-amber-600 gap-2" onClick={() => {
          setIsEditMode(false)
          setEditingPackage(null)
          resetForm()
          setIsModalOpen(true)
        }}>
          <Plus className="w-4 h-4" />
          New Package
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Packages</p>
          <p className="text-2xl font-bold text-foreground">{stats?.total || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">COUNT Packages</p>
          <p className="text-2xl font-bold text-foreground">{stats?.count || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">DAILY Packages</p>
          <p className="text-2xl font-bold text-foreground">{stats?.daily || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">MINUTE Packages</p>
          <p className="text-2xl font-bold text-foreground">{stats?.minute || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {(["all", "count", "daily", "minute"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${filterType === t
                ? "bg-amber-500 text-white"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t === "all" ? "ALL" : t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Showing</span>
          <span className="text-sm font-bold text-foreground">{filteredPackages.length}</span>
          <span className="text-sm text-muted-foreground">packages</span>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No packages found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredPackages.map((pkg, index) => (
            <div
              key={pkg.id}
              className="relative bg-card/50 backdrop-blur-sm border border-border rounded-lg p-5 hover:border-amber-500/50 transition-all duration-300 group"
              style={{
                opacity: 0,
                animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
              }}
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              {/* Price */}
              <div className="absolute top-5 right-5">
                <span className="text-2xl font-bold text-foreground">{pkg.price}</span>
              </div>

              {/* Count/Limit Display */}
              <div className="mb-4">
                {pkg.type === "count" && (
                  <>
                    <h3 className="text-sm font-bold text-foreground mb-1">COUNT</h3>
                    <p className="text-2xl font-bold text-foreground">{pkg.count?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">TOTAL REQUESTS</p>
                  </>
                )}
                {pkg.type === "daily" && (
                  <>
                    <h3 className="text-sm font-bold text-foreground mb-1">DAILY</h3>
                    <p className="text-2xl font-bold text-foreground">{pkg.dailyLimit?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">REQUESTS PER DAY</p>
                  </>
                )}
                {pkg.type === "minute" && (
                  <>
                    <h3 className="text-sm font-bold text-foreground mb-1">MINUTE</h3>
                    <p className="text-2xl font-bold text-foreground">{pkg.rateLimit}</p>
                    <p className="text-xs text-muted-foreground">REQUESTS PER MINUTE</p>
                  </>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/30 rounded-md p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase">Validity</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{pkg.validity}</p>
                </div>
                <div className="bg-muted/30 rounded-md p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase">Recognition</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{pkg.recognition}</p>
                </div>
              </div>

              {/* Package Code */}
              <div className="bg-muted/30 rounded-md p-2 mb-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase">ID</span>
                </div>
                <p className="text-sm font-bold text-foreground font-mono">{pkg.code}</p>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                {pkg.status === 'active' ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-600">Active</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-600">Inactive</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 py-2 rounded-md bg-transparent border border-amber-500/50 text-amber-500 font-bold text-sm hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg)}
                  className="flex-1 py-2 rounded-md bg-transparent border border-red-500/50 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Package Dialog */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsModalOpen(false)
          setIsEditMode(false)
          setEditingPackage(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Package' : 'Create New Package'}</DialogTitle>
            <DialogDescription>{isEditMode ? 'Update package details' : 'Add a new pricing package to your catalog'}</DialogDescription>
          </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Package Type Selection */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Package Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormData({ ...formData, type: 'count' })}
                disabled={isEditMode}
                className={`p-4 rounded-xl border-2 transition-all ${formData.type === "count" ? "border-amber-500 bg-amber-500/10" : "border-border bg-muted/30 hover:border-amber-500/50"} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <p className="font-bold text-foreground mb-1">COUNT</p>
                <p className="text-xs text-muted-foreground">Total requests</p>
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'daily' })}
                disabled={isEditMode}
                className={`p-4 rounded-xl border-2 transition-all ${formData.type === "daily" ? "border-amber-500 bg-amber-500/10" : "border-border bg-muted/30 hover:border-amber-500/50"} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <p className="font-bold text-foreground mb-1">DAILY</p>
                <p className="text-xs text-muted-foreground">Requests per day</p>
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'minute' })}
                disabled={isEditMode}
                className={`p-4 rounded-xl border-2 transition-all ${formData.type === "minute" ? "border-amber-500 bg-amber-500/10" : "border-border bg-muted/30 hover:border-amber-500/50"} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <p className="font-bold text-foreground mb-1">MINUTE</p>
                <p className="text-xs text-muted-foreground">Requests per minute</p>
              </button>
            </div>
          </div>

          {/* Package Code */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Package Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., C01, D01, M01"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              disabled={isEditMode}
              className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all font-mono ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <p className="text-xs text-muted-foreground mt-1">Unique identifier for this package</p>
          </div>

          {/* Dynamic Limit Field */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              {formData.type === "count" && "Total Request Count"}
              {formData.type === "daily" && "Daily Request Limit"}
              {formData.type === "minute" && "Requests Per Minute"}
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="number"
              placeholder={formData.type === "count" ? "e.g., 50000" : formData.type === "daily" ? "e.g., 1000" : "e.g., 10"}
              value={formData.type === "count" ? formData.count : formData.type === "daily" ? formData.dailyLimit : formData.rateLimit}
              onChange={(e) => {
                if (formData.type === "count") setFormData({ ...formData, count: e.target.value })
                else if (formData.type === "daily") setFormData({ ...formData, dailyLimit: e.target.value })
                else setFormData({ ...formData, rateLimit: e.target.value })
              }}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
            />
          </div>

          {/* Price and Validity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Price (USD) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number" step="0.01" placeholder="0.00" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Validity <span className="text-red-500">*</span></label>
              <select
                value={formData.validity}
                onChange={(e) => handleValidityChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
              >
                <option value="1d">1 Day</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="365d">1 Year</option>
              </select>
            </div>
          </div>

          {/* Recognition Type */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Recognition Type <span className="text-red-500">*</span></label>
            <select
              value={formData.recognition}
              onChange={(e) => setFormData({ ...formData, recognition: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
            >
              <option value="Image">Image Recognition</option>
              <option value="Text">Text Recognition</option>
              <option value="Audio">Audio Recognition</option>
              <option value="Video">Video Recognition</option>
              <option value="All">All Types</option>
            </select>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-semibold text-foreground">Active Status</p>
              <p className="text-sm text-muted-foreground">Make this package available immediately</p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
              className={`relative w-14 h-7 rounded-full transition-colors ${formData.status === 'active' ? 'bg-amber-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${formData.status === 'active' ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setIsModalOpen(false)
            setIsEditMode(false)
            setEditingPackage(null)
            resetForm()
          }} className="bg-transparent" disabled={saving}>Cancel</Button>
          <Button className="bg-amber-500 hover:bg-amber-600"
            onClick={isEditMode ? handleUpdatePackage : handleCreatePackage} disabled={saving}>
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />{isEditMode ? 'Updating...' : 'Creating...'}</>
            ) : (isEditMode ? 'Update Package' : 'Create Package')}
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>

      {/* Delete Package Confirmation */}
      <AlertDialog open={!!deletePkg} onOpenChange={() => setDeletePkg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete package {deletePkg?.code}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deletePkg) dispatch(deletePackageRequest(deletePkg.id, deletePkg.code))
              setDeletePkg(null)
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
