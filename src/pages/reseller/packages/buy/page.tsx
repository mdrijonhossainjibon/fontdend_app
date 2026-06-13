import { useEffect, useState } from 'react'
import { ShoppingCart, Check, Loader2, Mail, Gift, Copy, Check as CheckIcon, Wallet } from 'lucide-react'
import { API_CALL } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/AuthProvider'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'

interface PricingPlan {
    _id: string
    code: string
    type: string
    price: number
    priceDisplay: string
    validity: string
    count?: number
    dailyLimit?: number
    rateLimit?: number
    recognition: string
}

export default function ResellerBuyPackage() {
    const { user } = useAuth()
    const [plans, setPlans] = useState<PricingPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState<string | null>(null)
    const userBalance = user?.balance ?? 0

    // Coupon modal state (for $100+ plans)
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null)
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
    const [validating, setValidating] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Buy modal state
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
    const [customerEmail, setCustomerEmail] = useState('')
    const [buyingFromCoupon, setBuyingFromCoupon] = useState(false)
    const [insufficientFund, setInsufficientFund] = useState(false)

    useEffect(() => {
        const fetchPlans = async () => {
            const res = await API_CALL({ method: 'GET', url: '/reseller/pricing-plans' })
            if (res.status >= 200 && res.status < 300) {
                setPlans(res.response.plans || [])
            } else {
                toast.error(res.response?.error || res.response?.message || 'Failed to load plans')
            }
            setLoading(false)
        }
        fetchPlans()
    }, [])

    const openBuyModal = (plan: PricingPlan) => {
        setSelectedPlan(plan)
        setCustomerEmail('')
        setAppliedCoupon(null)
        setBuyingFromCoupon(false)
        setInsufficientFund(false)

        if (plan.price >= 100) {
            setPendingPlan(plan)
            setCouponCode('')
            setShowCouponModal(true)
        } else {
            setPendingPlan(null)
            setShowBuyModal(true)
        }
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return toast.error('Enter a coupon code')
        setValidating(true)
        const res = await API_CALL({ method: 'POST', url: '/reseller/validate-coupon', body: { code: couponCode.trim() } })
        if (res.status >= 200 && res.status < 300) {
            setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount: res.response.coupon?.discount || 0 })
            toast.success('Coupon applied!')
        } else {
            toast.error(res.response?.error || res.response?.message || 'Invalid coupon code')
        }
        setValidating(false)
    }

    const proceedToBuy = () => {
        if (!pendingPlan) return
        setSelectedPlan(pendingPlan)
        setCustomerEmail('')
        setBuyingFromCoupon(!!appliedCoupon)
        setShowCouponModal(false)
        setShowBuyModal(true)
    }

    const purchase = async () => {
        if (!selectedPlan) return
        if (!customerEmail.trim()) return toast.error('Customer email is required')

        const finalPrice = (buyingFromCoupon && appliedCoupon)
            ? Math.max(0, selectedPlan.price - appliedCoupon.discount)
            : selectedPlan.price

        if (userBalance < finalPrice) {
            setInsufficientFund(true)
            return
        }

        setPurchasing(selectedPlan._id)
        const res = await API_CALL({
            method: 'POST',
            url: `/reseller/purchase/${selectedPlan._id}`,
            body: { customerEmail: customerEmail.trim(), couponCode: buyingFromCoupon ? appliedCoupon?.code : undefined },
        })
        if (res.status >= 200 && res.status < 300) {
            toast.success(res.response?.message || 'Package purchased!')
            setShowBuyModal(false)
            setAppliedCoupon(null)
        } else {
            toast.error(res.response?.error || res.response?.message || 'Purchase failed')
        }
        setPurchasing(null)
    }

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast.success('Coupon code copied')
    }

    const getFinalPrice = (plan: PricingPlan) => {
        if (appliedCoupon && buyingFromCoupon) return Math.max(0, plan.price - appliedCoupon.discount)
        return plan.price
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Buy Package</h1>
                <p className="text-muted-foreground">Choose a pricing plan for your customer</p>
            </div>

            {plans.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No pricing plans available</p>
                    <p className="text-sm">Contact admin to add pricing plans.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map(plan => (
                        <div key={plan._id} className="rounded-xl border bg-card p-6 space-y-4 hover:border-primary/50 transition-colors">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{plan.priceDisplay || plan.type}</h3>
                                <p className="text-3xl font-bold">${plan.price}</p>
                                <p className="text-sm text-muted-foreground">{plan.validity}</p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>{plan.count || plan.dailyLimit || 0} recognitions</span>
                                </div>
                                {plan.rateLimit && (
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>Rate limit: {plan.rateLimit}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>Validity: {plan.validity}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                onClick={() => openBuyModal(plan)}
                                disabled={purchasing === plan._id}
                            >
                                {purchasing === plan._id ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Purchasing...</>
                                ) : (
                                    <><ShoppingCart className="w-4 h-4 mr-2" /> Buy Now</>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Coupon Modal — $100+ plans unlock */}
            <Dialog open={showCouponModal} onOpenChange={(open) => { if (!open) { setPendingPlan(null); setAppliedCoupon(null); setShowCouponModal(false); } }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-amber-500" />
                            Unlock with Coupon
                        </DialogTitle>
                        <DialogDescription>
                            {pendingPlan && (
                                <span>
                                    This plan costs <strong>${pendingPlan.price}</strong>. Enter a coupon code or skip.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 space-y-4">
                        {/* Coupon input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Coupon Code</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. ADVXXXX..."
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                    onKeyDown={e => e.key === 'Enter' && !validating && handleApplyCoupon()}
                                    className="uppercase"
                                />
                                <Button onClick={handleApplyCoupon} disabled={validating} variant="secondary" className="shrink-0">
                                    {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                </Button>
                            </div>
                        </div>

                        {/* Applied coupon */}
                        {appliedCoupon && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-emerald-500">-${appliedCoupon.discount} Discount</span>
                                    <button
                                        onClick={() => copyCode(appliedCoupon.code, 'coupon')}
                                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    >
                                        {copiedId === 'coupon' ? <CheckIcon className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {appliedCoupon.code}
                                    </button>
                                </div>
                                {pendingPlan && (
                                    <p className="text-xs text-muted-foreground">
                                        Final price: <strong className="text-foreground">${Math.max(0, pendingPlan.price - appliedCoupon.discount)}</strong>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Hint */}
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs text-muted-foreground">
                            No coupon? You can claim a <strong className="text-amber-500">$100 ADV coupon</strong> from the header Gift icon if you have $5+ balance.
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => { setShowCouponModal(false); setPendingPlan(null); }}>
                            Cancel
                        </Button>
                        <Button variant="outline" onClick={() => { setAppliedCoupon(null); proceedToBuy(); }}>
                            Buy without coupon
                        </Button>
                        <Button onClick={proceedToBuy} disabled={!appliedCoupon}>
                            Apply & Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Customer Email Modal */}
            <Dialog open={showBuyModal} onOpenChange={(open) => { if (!open) { setShowBuyModal(false); setInsufficientFund(false); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>
                            {selectedPlan && (
                                <span>
                                    Buying <strong>{selectedPlan.priceDisplay || selectedPlan.type}</strong>
                                    {buyingFromCoupon && appliedCoupon ? (
                                        <>
                                            {' '}— <span className="text-emerald-500 font-semibold">${getFinalPrice(selectedPlan)}</span>
                                            <span className="text-xs text-muted-foreground line-through ml-1.5">${selectedPlan.price}</span>
                                        </>
                                    ) : (
                                        <> for <strong>${selectedPlan.price}</strong></>
                                    )}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {/* Balance display */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border text-sm">
                            <div className="flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Your Balance</span>
                            </div>
                            <span className={`font-semibold ${userBalance >= (selectedPlan ? getFinalPrice(selectedPlan) : 0) ? 'text-emerald-500' : 'text-red-500'}`}>
                                ${userBalance.toFixed(2)}
                            </span>
                        </div>

                        {/* Insufficient fund warning */}
                        {insufficientFund && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 flex items-start gap-2">
                                <span>⚠️</span>
                                <span>
                                    Insufficient balance. Required: <strong>${selectedPlan ? getFinalPrice(selectedPlan) : 0}</strong>, Available: <strong>${userBalance.toFixed(2)}</strong>
                                </span>
                            </div>
                        )}

                        {/* Applied coupon badge inside buy modal */}
                        {buyingFromCoupon && appliedCoupon && (
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
                                <div className="flex items-center gap-2">
                                    <Gift className="w-4 h-4 text-emerald-500" />
                                    <span className="text-emerald-500 font-medium">${appliedCoupon.discount} off</span>
                                </div>
                                <button
                                    onClick={() => copyCode(appliedCoupon.code, 'buy-coupon')}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                    {copiedId === 'buy-coupon' ? <CheckIcon className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {appliedCoupon.code}
                                </button>
                            </div>
                        )}

                        {/* Email input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Customer Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    placeholder="customer@example.com"
                                    value={customerEmail}
                                    onChange={e => setCustomerEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !purchasing && purchase()}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">API key will be created for this customer</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowBuyModal(false); setInsufficientFund(false); }}>Cancel</Button>
                        <Button onClick={purchase} disabled={purchasing}>
                            {purchasing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Purchasing...</> : 'Confirm & Buy'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
