import { useState, useEffect } from "react"
import { API_CALL } from '@/lib/auth-fingerprint'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Key, Tag, Copy, CheckCheck, ChevronDown, ChevronUp, Shield, RefreshCw, Trash2, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface Coupon {
  _id: string
  code: string
  discount: number
  type: string
  credits: number
  usedCount: number
  maxUses: number
  isActive: boolean
  expiresAt: string
  createdAt: string
}

interface Reseller {
  _id: string
  name: string
  email: string
  avatar: string
  balance: number
  status: string
  createdAt: string
  stats: {
    totalApiKeys: number
    activeApiKeys: number
    totalCoupons: number
    usedCoupons: number
  }
  coupons: Coupon[]
}

export default function AdminResellersContent() {
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [addDialog, setAddDialog] = useState<Reseller | null>(null)
  const [adding, setAdding] = useState(false)
  const [newCode, setNewCode] = useState("")
  const [newCredits, setNewCredits] = useState("")
  const [newMaxUses, setNewMaxUses] = useState("")
  const [newDiscount, setNewDiscount] = useState("")
  const [newType, setNewType] = useState<"percentage" | "fixed">("fixed")

  useEffect(() => {
    fetchResellers()
  }, [])

  async function fetchResellers() {
    setLoading(true)
    try {
      const { response }: any = await API_CALL({ method: "GET", url: "/admin/resellers" })
      const data = response?.data || response || { resellers: [] }
      setResellers(data.resellers || [])
    } catch (err) {
      console.error("Failed to fetch resellers", err)
    } finally {
      setLoading(false)
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id)
  }

  async function handleDeleteCoupon() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await API_CALL({ method: "DELETE", url: `/admin/resellers/coupon/${deleteTarget._id}` })
      toast.success("Coupon deleted")
      setDeleteTarget(null)
      fetchResellers()
    } catch {
      toast.error("Failed to delete coupon")
    } finally {
      setDeleting(false)
    }
  }

  async function handleAddCoupon() {
    if (!addDialog || !newCode || !newCredits) return
    setAdding(true)
    try {
      await API_CALL({
        method: "POST",
        url: "/admin/resellers/coupon",
        body: {
          resellerId: addDialog._id,
          code: newCode,
          credits: Number(newCredits),
          maxUses: Number(newMaxUses) || 1,
          discount: Number(newDiscount) || 0,
          type: newType,
        },
      })
      toast.success("Coupon created")
      setAddDialog(null)
      setNewCode("")
      setNewCredits("")
      setNewMaxUses("")
      setNewDiscount("")
      setNewType("fixed")
      fetchResellers()
    } catch {
      toast.error("Failed to create coupon")
    } finally {
      setAdding(false)
    }
  }

  // Skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Reseller Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>
          ))}
        </div>
        <Card className="animate-pulse"><CardContent className="h-64" /></Card>
      </div>
    )
  }

  const totalStats = {
    resellers: resellers.length,
    apiKeys: resellers.reduce((s, r) => s + r.stats.totalApiKeys, 0),
    coupons: resellers.reduce((s, r) => s + r.stats.totalCoupons, 0),
    usedCoupons: resellers.reduce((s, r) => s + r.stats.usedCoupons, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Reseller Management</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchResellers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Reload
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Resellers</p>
              <p className="text-2xl font-bold">{totalStats.resellers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Key className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">API Keys</p>
              <p className="text-2xl font-bold">{totalStats.apiKeys}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Tag className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coupons Created</p>
              <p className="text-2xl font-bold">{totalStats.coupons}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coupons Used</p>
              <p className="text-2xl font-bold">{totalStats.usedCoupons}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resellers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Resellers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Reseller</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>API Keys</TableHead>
                <TableHead>Coupons</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No resellers found
                  </TableCell>
                </TableRow>
              ) : (
                resellers.map((reseller) => (
                  <>
                    <TableRow
                      key={reseller._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(reseller._id)}
                    >
                      <TableCell>
                        {reseller.coupons.length > 0 ? (
                          expandedId === reseller._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={reseller.avatar || ''} alt={reseller.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {reseller.name?.charAt(0)?.toUpperCase() || 'R'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{reseller.name}</p>
                            <p className="text-xs text-muted-foreground">{reseller.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-emerald-500">${reseller.balance?.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={reseller.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {reseller.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">{reseller.stats.activeApiKeys}/{reseller.stats.totalApiKeys}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">{reseller.stats.usedCoupons}/{reseller.stats.totalCoupons}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {reseller.createdAt ? new Date(reseller.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                    {expandedId === reseller._id && (
                      <TableRow key={`${reseller._id}-coupons`}>
                        <TableCell colSpan={7} className="bg-muted/30 p-4">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Coupon Codes ({reseller.coupons.length})
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {reseller.coupons.map((coupon) => (
                                <div key={coupon._id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <code className="text-xs font-mono font-semibold text-primary truncate">
                                        {coupon.code}
                                      </code>
                                      <button onClick={() => copyCode(coupon.code)} className="shrink-0">
                                        {copiedCode === coupon.code ? (
                                          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                        )}
                                      </button>
                                      <button onClick={() => setDeleteTarget(coupon)} className="shrink-0">
                                        <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-500" />
                                      </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {coupon.credits} credits · {coupon.usedCount}/{coupon.maxUses} used
                                    </p>
                                  </div>
                                  <Badge variant={coupon.isActive ? 'default' : 'secondary'} className="text-[10px] ml-2">
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              ))}
                              <button
                                onClick={() => setAddDialog(reseller)}
                                className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="text-xs font-medium">Add Coupon</span>
                              </button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete coupon <strong>{deleteTarget?.code}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCoupon} disabled={deleting} className="bg-red-500 hover:bg-red-600">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Coupon Dialog */}
      <Dialog open={!!addDialog} onOpenChange={(open) => { if (!open) setAddDialog(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Coupon — {addDialog?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Coupon Code</Label>
              <Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="e.g. SAVE50" />
            </div>
            <div>
              <Label>Credits</Label>
              <Input value={newCredits} onChange={(e) => setNewCredits(e.target.value)} type="number" placeholder="e.g. 100" />
            </div>
            <div>
              <Label>Max Uses</Label>
              <Input value={newMaxUses} onChange={(e) => setNewMaxUses(e.target.value)} type="number" placeholder="e.g. 10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Discount Type</Label>
                <Select value={newType} onValueChange={(v: "percentage" | "fixed") => setNewType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount Value</Label>
                <Input value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} type="number" placeholder="e.g. 0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(null)} disabled={adding}>Cancel</Button>
            <Button onClick={handleAddCoupon} disabled={adding || !newCode || !newCredits}>
              {adding ? "Creating..." : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
