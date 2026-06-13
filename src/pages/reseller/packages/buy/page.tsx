import { useEffect, useState } from 'react'
import { ShoppingCart, Check, Loader2, Mail } from 'lucide-react'
import { API_CALL } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    const [plans, setPlans] = useState<PricingPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState<string | null>(null)

    // Buy modal state
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
    const [customerEmail, setCustomerEmail] = useState('')

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await API_CALL({ method: 'GET', url: '/reseller/pricing-plans' })
                if (res.status !== 200) {
                    toast.error(res.response?.message || `Failed to load plans (${res.status})`)
                    setPlans([])
                } else {
                    setPlans(res.response.plans || [])
                }
            } catch (err: any) {
                toast.error(err?.message || 'Failed to load pricing plans')
            } finally {
                setLoading(false)
            }
        }
        fetchPlans()
    }, [])

    const openBuyModal = (plan: PricingPlan) => {
        setSelectedPlan(plan)
        setCustomerEmail('')
        setShowBuyModal(true)
    }

    const purchase = async () => {
        if (!selectedPlan) return
        if (!customerEmail.trim()) return toast.error('Customer email is required')

        setPurchasing(selectedPlan._id)
        try {
            const res = await API_CALL({
                method: 'POST',
                url: `/reseller/purchase/${selectedPlan._id}`,
                body: { customerEmail: customerEmail.trim() },
            })
            if (!res.response?.success && res.response?.error) {
                toast.error(res.response.error)
                return
            }
            if (res.status !== 200) {
                toast.error(res.response?.message || res.response?.error || 'Purchase failed')
                return
            }
            toast.success(res.response.message || 'Package purchased!')
            toast.success(`API Key created for ${customerEmail.trim()}`)
            setShowBuyModal(false)
        } catch (err: any) {
            toast.error(err?.message || 'Purchase failed')
        } finally {
            setPurchasing(null)
        }
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

            {/* Customer Email Modal */}
            <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>
                            {selectedPlan && (
                                <>Buying <strong>{selectedPlan.priceDisplay || selectedPlan.type}</strong> for ${selectedPlan.price}</>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
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
                        <Button variant="outline" onClick={() => setShowBuyModal(false)}>Cancel</Button>
                        <Button onClick={purchase} disabled={purchasing}>
                            {purchasing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Purchasing...</> : 'Confirm & Buy'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
