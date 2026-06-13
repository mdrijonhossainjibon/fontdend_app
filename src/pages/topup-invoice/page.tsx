import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, Shield, Loader2, XCircle } from 'lucide-react'
import * as topupActions from '@/modules/topup/actions'
import DepositInvoiceCard from '@/components/DepositInvoiceCard'

export default function TopupInvoicePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const invoiceId = searchParams.get('invoice') || ''
  const dispatch = useDispatch()

  const { invoice, invoiceLoading, invoiceError } = useSelector((s: any) => s.topup)

  const [countdown, setCountdown] = useState('')
  const [copied, setCopied] = useState(false)
  const [animated, setAnimated] = useState(false)

  useEffect(() => { requestAnimationFrame(() => setAnimated(true)) }, [])

  useEffect(() => {
    if (!invoiceId) return
    dispatch(topupActions.fetchInvoiceRequest(invoiceId))
    return () => { dispatch(topupActions.resetInvoice()) }
  }, [invoiceId, dispatch])

  useEffect(() => {
    if (!invoice?.expiresAt) return
    const tick = () => {
      const end = new Date(invoice.expiresAt).getTime()
      const diff = end - Date.now()
      if (diff <= 0) { setCountdown('Expired'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${m}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [invoice?.expiresAt])

  const isActive = invoice?.status === 'pending' || invoice?.status === 'confirming'

  // ── Loading / Error ──
  if (!invoiceId) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-4 p-10 rounded-3xl bg-card/50 backdrop-blur border border-border/50">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center"><XCircle className="w-8 h-8 text-muted-foreground" /></div>
        <p className="text-muted-foreground font-medium">No invoice ID provided</p>
      </div>
    </div>
  )
  if (invoiceLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          <div className="absolute -inset-1 rounded-2xl bg-primary/5 animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading invoice...</p>
      </div>
    </div>
  )
  if (invoiceError || !invoice) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-4 p-10 rounded-3xl bg-card/50 backdrop-blur border border-border/50 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center"><XCircle className="w-8 h-8 text-red-400" /></div>
        <h2 className="text-xl font-bold">Invoice Not Found</h2>
        <p className="text-sm text-muted-foreground">{invoiceError || 'This invoice may have been removed or expired.'}</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/history')} className="rounded-xl">Go Back</Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <header className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl -ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          {isActive && (
            <>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Awaiting Payment
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" /> Secured by CP (CaptchaMaster)
              </div>
            </>
          )}
        </div>
      </header>

      <main className={cn("flex-1 p-6", isActive && "flex items-center justify-center")}>
        <div className={cn("transition-all duration-700", animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <DepositInvoiceCard
            data={{
              amountUSD: invoice.amountUSD || 0,
              cryptoName: invoice.cryptoName || '',
              networkName: invoice.networkName || '',
              address: invoice.address || invoiceId || '',
              status: invoice.status || 'pending',
              invoiceId: invoiceId,
            }}
            countdown={countdown}
            copied={copied}
            onCopy={() => { navigator.clipboard.writeText(invoice.address || invoiceId); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            hideActions={!isActive}
          />
        </div>
      </main>

      {!isActive && (
        <div className="flex justify-center pb-10">
          <Button variant="outline" onClick={() => navigate('/dashboard/history')} className="rounded-xl">Go Back</Button>
        </div>
      )}
    </div>
  )
}
