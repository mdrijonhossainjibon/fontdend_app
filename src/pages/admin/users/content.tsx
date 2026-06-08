
import { useState, useEffect, useRef } from "react"
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
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import store from "@/modules/store"
type AppDispatch = typeof store.dispatch

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, Ban, Unlock, Edit, Trash2, Loader2, Eye, Package, RefreshCw } from "lucide-react"
import { Suspense } from "react"
import { useNavigate } from 'react-router-dom'
import Loading from "./loading"
import { RootState } from "@/modules/rootReducer"
import {
  fetchAdminUsersRequest,
  updateAdminUserRequest,
  deleteAdminUserRequest
} from "@/modules/admin/actions"
import {
  fetchUserPackagesRequest,
  updateUserPackageRequest,
  deleteUserPackageRequest,
  assignPackageRequest,
  resetAssignSuccess,
} from "@/modules/admin/user-packages/actions"
import {
  fetchPricingPlansRequest,
} from "@/modules/admin/pricing-plans/actions"

interface User {
  id: string
  name: string
  email: string
  plan: string
  status: string
  balance: string
  joined: string
  image?: string | null
  twoFactorEnabled?: boolean
  isAdmin?: boolean
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function AdminUsersContent() {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch()

  // Redux state
  const { users, loading: isLoading, pagination, isSaving, error } = useSelector((state: RootState) => state.admin)
  const { plans: pricingPlanList } = useSelector((state: RootState) => state.adminPricingPlans)
  const { packages: userPkgList, assigning: isAssigningPkg, updating: isUpdatingPkg, assignSuccess: assignPkgSuccess, error: assignPkgError } = useSelector((state: RootState) => state.adminUserPackages)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ name: "", balance: "", status: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Set package modal state
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false)
  const [pkgUser, setPkgUser] = useState<User | null>(null)
  const [pricingPlans, setPricingPlans] = useState<any[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState("")
  const [isFreeTrial, setIsFreeTrial] = useState(false)

  // Manage packages modal state
  const [isPkgManageOpen, setIsPkgManageOpen] = useState(false)
  const [pkgManageUser, setPkgManageUser] = useState<User | null>(null)
  const [userPackages, setUserPackages] = useState<any[]>([])
  const [loadingPackages, setLoadingPackages] = useState(false)
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null)
  const [editPkgCredits, setEditPkgCredits] = useState<number>(0)
  const [removingPkgId, setRemovingPkgId] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [removePkgConfirmId, setRemovePkgConfirmId] = useState<string | null>(null)
  const [trialDays, setTrialDays] = useState(7)
  const [trialCredits, setTrialCredits] = useState(50)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch users from API via Redux
  useEffect(() => {
    dispatch(fetchAdminUsersRequest({
      searchTerm,
      statusFilter,
      page: currentPage,
      limit: itemsPerPage
    }))
  }, [dispatch, currentPage, itemsPerPage, searchTerm, statusFilter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Sync pricing plans from Redux to local state
  const [prevPricingPlanLen, setPrevPricingPlanLen] = useState(0)
  useEffect(() => {
    setPricingPlans(pricingPlanList)
    setLoadingPlans(false)
    if (pricingPlanList.length > 0 && pricingPlanList.length !== prevPricingPlanLen) {
      setSelectedPlanId(pricingPlanList[0]._id)
      setPrevPricingPlanLen(pricingPlanList.length)
    }
  }, [pricingPlanList])

  // Sync user packages from Redux to local state
  useEffect(() => {
    setUserPackages(userPkgList)
    setLoadingPackages(false)
  }, [userPkgList])

  // Handle package assign success
  useEffect(() => {
    if (assignPkgSuccess) {
      toast.success('Package assigned successfully')
      setIsPkgModalOpen(false)
      dispatch(resetAssignSuccess())
    }
  }, [assignPkgSuccess])

  // Handle package assign error
  const prevAssigningRef = useRef(false)
  useEffect(() => {
    if (prevAssigningRef.current && assignPkgError) {
      toast.error(assignPkgError)
    }
    prevAssigningRef.current = isAssigningPkg
  }, [assignPkgError, isAssigningPkg])

  const handleEditUser = () => {
    if (!selectedUser) return

    dispatch(updateAdminUserRequest({
      userId: selectedUser.id,
      name: editForm.name,
      balance: editForm.balance,
      status: editForm.status
    }))

    // Optimistically close modal
    setIsEditModalOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId)
  }

  const openManagePackages = async (user: User) => {
    setPkgManageUser(user)
    setIsPkgManageOpen(true)
    setLoadingPackages(true)
    dispatch(fetchUserPackagesRequest(user.id))
  }

  const handleEditPackageCredits = async (pkgId: string) => {
    dispatch(updateUserPackageRequest({ packageId: pkgId, credits: editPkgCredits }))
  }

  const handleRemovePackage = async (pkgId: string) => {
    setRemovePkgConfirmId(pkgId)
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div>
          {/* Search and filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users table */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>{pagination?.total || 0} total users</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (users || []).length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (users || []).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Balance</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Joined</th>
                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: User, index: number) => (
                        <tr
                          key={user.id}
                          className="border-b border-border hover:bg-secondary/50 transition-colors"
                          style={{
                            opacity: 0,
                            animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                          }}
                        >
                          <td className="py-4 px-4">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mr-3 inline-flex overflow-hidden">
                              {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                user.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            {user.name}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-foreground">{user.balance}</span>
                            <span className="text-xs text-muted-foreground ml-1">USD</span>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                                user.status?.toLowerCase() === "active"
                                  ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20"
                                  : user.status?.toLowerCase() === "inactive"
                                    ? "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20"
                                    : user.status?.toLowerCase() === "banned"
                                      ? "bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/20"
                                      : "bg-gray-500/10 text-gray-500 ring-1 ring-inset ring-gray-500/20"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                user.status?.toLowerCase() === "active"
                                  ? "bg-emerald-500"
                                  : user.status?.toLowerCase() === "inactive"
                                    ? "bg-amber-500"
                                    : user.status?.toLowerCase() === "banned"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                              }`} />
                              {user.status || "Unknown"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{user.joined}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => navigate(`/admin/users/${user.id}`)}
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-purple-500/50 text-purple-500 hover:bg-purple-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => {
                                  setPkgUser(user)
                                  setSelectedPlanId("")
                                  setPricingPlans([])
                                  setIsPkgModalOpen(true)
                                  setLoadingPlans(true)
                                  dispatch(fetchPricingPlansRequest())
                                }}
                              >
                                <Package className="w-3 h-3" />
                                Set Pkg
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-purple-500/50 text-purple-500 hover:bg-purple-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => openManagePackages(user)}
                              >
                                <Package className="w-3 h-3" />
                                Pkgs
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setEditForm({ name: user.name, balance: `$${user.balance}`, status: user.status })
                                  setIsEditModalOpen(true)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white text-xs gap-1 h-8 px-3"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
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
          {!isLoading && users && users.length > 0 && pagination && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} users
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
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="h-8 px-3"
                  >
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
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
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage}
                    className="h-8 px-3"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                />
              </div>

              {/* Balance */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Balance (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="text"
                    value={editForm.balance.replace('$', '')}
                    onChange={(e) => setEditForm({ ...editForm, balance: `$${e.target.value.replace('$', '')}` })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "Active", color: "bg-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", hover: "hover:bg-emerald-500/20", glow: "shadow-emerald-500/20" },
                    { value: "Inactive", color: "bg-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", hover: "hover:bg-amber-500/20", glow: "shadow-amber-500/20" },
                    { value: "Banned", color: "bg-red-500", bg: "bg-red-500/10", border: "border-red-500/30", hover: "hover:bg-red-500/20", glow: "shadow-red-500/20" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, status: status.value })}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200
                        ${editForm.status === status.value
                          ? `${status.bg} ${status.border} shadow-lg ${status.glow} ring-2 ${status.color.replace('bg-', 'ring-')}/40`
                          : 'bg-secondary/50 border-border hover:bg-secondary/80 text-muted-foreground'}
                      `}
                    >
                      <span className={`w-2 h-2 rounded-full ${status.color} ${editForm.status === status.value ? 'animate-pulse' : ''}`} />
                      <span className={`text-sm font-semibold ${editForm.status === status.value ? 'text-foreground' : ''}`}>
                        {status.value}
                      </span>
                      {editForm.status === status.value && (
                        <span className="ml-auto">
                          <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Info Display */}
              <div className="mt-6 p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-foreground">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground mt-3 mb-1">Plan</p>
                <p className="font-semibold text-foreground">{selectedUser.plan}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="bg-transparent" disabled={isSaving}>Cancel</Button>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={handleEditUser} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Set Package Dialog */}
        <Dialog open={isPkgModalOpen} onOpenChange={setIsPkgModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Set Package</DialogTitle>
              <DialogDescription>Assign to {pkgUser?.name || pkgUser?.email}</DialogDescription>
            </DialogHeader>
          {/* Free Trial Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <p className="font-semibold text-foreground">Free Trial</p>
              <p className="text-sm text-muted-foreground">Assign a free trial package instead</p>
            </div>
            <button
              onClick={() => setIsFreeTrial(!isFreeTrial)}
              className={`relative w-14 h-7 rounded-full transition-colors ${isFreeTrial ? 'bg-purple-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${isFreeTrial ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {isFreeTrial ? (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Trial Duration (Days)</label>
                <select
                  value={trialDays}
                  onChange={(e) => setTrialDays(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-foreground outline-none transition-all"
                >
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Trial Credits</label>
                <input
                  type="number"
                  value={trialCredits}
                  onChange={(e) => setTrialCredits(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-foreground outline-none transition-all"
                />
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm text-purple-700 font-semibold">Free Trial Summary</p>
                <p className="text-sm text-purple-600 mt-1">{trialCredits} credits for {trialDays} days â€” $0.00</p>
              </div>
            </div>
          ) : loadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pricingPlans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pricing plans found. Create one in Packages first.</div>
          ) : (
            <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
              {pricingPlans.map((plan: any) => (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlanId === plan._id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border bg-muted/30 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        selectedPlanId === plan._id ? 'bg-purple-500 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {plan.type.toUpperCase()} - {plan.code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {plan.type === 'count' ? `${plan.count?.toLocaleString()} Total Requests` :
                           plan.type === 'daily' ? `${plan.dailyLimit?.toLocaleString()} / Day` :
                           `${plan.rateLimit} / Min`} &middot; {plan.validity} Validity
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{plan.price}</p>
                      <p className="text-xs text-muted-foreground">{plan.recognition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPkgModalOpen(false)} className="bg-transparent" disabled={isAssigningPkg}>
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => {
                if (!pkgUser) return
                if (!isFreeTrial && !selectedPlanId) return
                const body: any = { userId: pkgUser.id }
                if (isFreeTrial) {
                  body.freeTrial = true
                  body.trialDays = trialDays
                  body.trialCredits = trialCredits
                } else {
                  body.planId = selectedPlanId
                }

                dispatch(assignPackageRequest(body))
              }}
              disabled={isAssigningPkg || (!isFreeTrial && !selectedPlanId)}
            >
              {isAssigningPkg ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Assigning...</>
              ) : isFreeTrial ? (
                'Assign Free Trial'
              ) : (
                'Assign Package'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Manage Packages Dialog */}
        <Dialog open={isPkgManageOpen} onOpenChange={setIsPkgManageOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Manage Packages</DialogTitle>
              <DialogDescription>Packages for {pkgManageUser?.name || pkgManageUser?.email}</DialogDescription>
            </DialogHeader>
          {loadingPackages ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : userPackages.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold">No packages assigned</p>
              <p className="text-sm">Use "Set Pkg" to assign a package to this user</p>
            </div>
          ) : (
            <div className="space-y-3 py-4 max-h-[500px] overflow-y-auto">
              {userPackages.map((pkg: any) => (
                <div
                  key={pkg._id}
                  className="p-4 rounded-xl border border-border bg-muted/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{pkg.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {pkg.packageCode} &middot; {pkg.type}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="p-3 rounded-lg bg-background">
                          <p className="text-xs text-muted-foreground">Credits</p>
                          <p className="font-bold text-foreground">{pkg.credits?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="text-xs text-muted-foreground">Used</p>
                          <p className="font-bold text-amber-500">{pkg.creditsUsed?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className="font-bold text-green-500">{pkg.creditsRemaining?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Status: <span className={`font-semibold ${pkg.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{pkg.status}</span></span>
                        {pkg.startDate && <span>Start: {new Date(pkg.startDate).toLocaleDateString()}</span>}
                        {pkg.endDate && <span>End: {new Date(pkg.endDate).toLocaleDateString()}</span>}
                        {pkg.price > 0 && <span>Price: ${pkg.price}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {editingPkgId === pkg._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editPkgCredits}
                            onChange={(e) => setEditPkgCredits(Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-sm text-center"
                            min={1}
                          />
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white h-8 px-2"
                            onClick={() => handleEditPackageCredits(pkg._id)}
                            disabled={isUpdatingPkg}
                          >
                            {isUpdatingPkg ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => setEditingPkgId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white h-8 px-3 text-xs"
                          onClick={() => {
                            setEditingPkgId(pkg._id)
                            setEditPkgCredits(pkg.credits)
                          }}
                        >
                          Edit Credits
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white h-8 px-3 text-xs"
                        onClick={() => handleRemovePackage(pkg._id)}
                        disabled={removingPkgId === pkg._id}
                      >
                        {removingPkgId === pkg._id ?<Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPkgManageOpen(false)} className="bg-transparent">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this user? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteUserId) dispatch(deleteAdminUserRequest(deleteUserId))
              setDeleteUserId(null)
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Package Confirmation */}
      <AlertDialog open={!!removePkgConfirmId} onOpenChange={() => setRemovePkgConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Package</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to remove this package from the user?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (removePkgConfirmId) {
                setRemovingPkgId(removePkgConfirmId)
                dispatch(deleteUserPackageRequest(removePkgConfirmId))
              }
              setRemovePkgConfirmId(null)
            }}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </Suspense>

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
    </>
  )
}
