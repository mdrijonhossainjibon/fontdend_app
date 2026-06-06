import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { CryptoIcon } from '@/components/CryptoIcon'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'
import { Clock, Copy, CheckCircle2, ArrowLeft, Shield, Loader2, XCircle, Zap, Wallet, ExternalLink } from 'lucide-react'
import * as topupActions from '@/modules/topup/actions'

function getNetworkCoinId(networkName: string): string {
  const n = (networkName || '').toLowerCase()
  if (n.includes('bsc') || n.includes('bnb') || n.includes('binance')) return 'bnb'
  if (n.includes('eth') || n === 'ethereum') return 'eth'
  if (n.includes('polygon') || n.includes('matic')) return 'matic'
  if (n.includes('arbitrum')) return 'eth'
  if (n.includes('optimism')) return 'eth'
  if (n.includes('avalanche') || n.includes('avax')) return 'avax'
  if (n.includes('tron') || n.includes('trc20')) return 'trx'
  if (n.includes('solana') || n.includes('sol')) return 'sol'
  if (n.includes('bitcoin') || n === 'btc') return 'btc'
  if (n.includes('litecoin') || n === 'ltc') return 'ltc'
  if (n.includes('doge')) return 'doge'
  return 'btc'
}

export default function TopupInvoicePage() {
  const [searchParams] = useSearchParams()
  const invoiceId = searchParams.get('invoice') || ''
  const dispatch = useDispatch()

  const { invoice, invoiceLoading, invoiceError } = useSelector((s: any) => s.topup)
  const { cryptomusStatus } = useSelector((s: any) => s.topup)

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
    if (!invoice || !invoiceId) return
    const s = invoice.status
    if (s !== 'pending' && s !== 'confirming') return
    dispatch(topupActions.startCryptomusPolling(invoiceId))
    return () => { dispatch(topupActions.stopCryptomusPolling()) }
  }, [invoice?.status, invoiceId, dispatch])

  useEffect(() => {
    if (!cryptomusStatus) return
    if (['paid', 'expired', 'failed', 'cancel'].includes(cryptomusStatus)) {
      dispatch(topupActions.fetchInvoiceRequest(invoiceId))
    }
  }, [cryptomusStatus, invoiceId, dispatch])

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

  const networkCoin = invoice?.networkName ? getNetworkCoinId(invoice.networkName) : 'btc'
  const isActive = invoice?.status === 'pending' || invoice?.status === 'confirming'
  const isFinal = invoice && !isActive
  const isSuccess = invoice?.status === 'completed'
  const statusColors: Record<string, string> = {
    pending:    'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    confirming: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    completed:  'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    failed:     'text-red-400 bg-red-500/10 border-red-500/20',
    expired:    'text-gray-400 bg-gray-500/10 border-gray-500/20',
    rejected:   'text-red-400 bg-red-500/10 border-red-500/20',
    approved:   'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  }
  const statusLabel: Record<string, string> = {
    pending: 'Awaiting Confirmation', confirming: 'Confirming', completed: 'Payment Received',
    failed: 'Failed', expired: 'Expired', rejected: 'Rejected', approved: 'Approved',
  }

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
        <Button variant="outline" onClick={() => window.close()} className="rounded-xl">Close</Button>
      </div>
    </div>
  )

  // ═══════════════ ACTIVE PAYMENT ═══════════════
  if (isActive) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl -ml-2" onClick={() => window.close()}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Awaiting Payment
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" /> Secured by Cryptomus
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className={cn(
          "w-full max-w-6xl grid lg:grid-cols-5 gap-8 transition-all duration-700",
          animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* ── LEFT: QR & Address ── */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-xl shadow-amber-500/[0.02]">
              {/* QR */}
              <div className="relative flex justify-center py-12 px-4 bg-gradient-to-b from-muted/10 via-muted/5 to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.06),transparent_70%)]" />
                {/* Subtle dot grid */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,rgb(0,0,0)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="relative p-5 bg-white rounded-3xl shadow-2xl ring-1 ring-black/5">
                  {/* Animated ring */}
                  <div className="absolute -inset-2 rounded-3xl border-2 border-amber-400/20 animate-ping [animation-duration:3s]" />
                  <QRCodeSVG value={invoice.address || invoiceId} size={240} level="M" />
                  {/* Centered logo overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-lg ring-1 ring-black/10 flex items-center justify-center p-1.5">
                      <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-xl" />
                    </div>
                  </div>
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-primary/20">
                    Scan to Pay
                  </div>
                </div>
              </div>

              {/* Payment steps */}
              <div className="px-8 py-5 border-t border-border bg-muted/[0.08]">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-center mb-4">How to Pay</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { step: '01', label: 'Open Wallet', desc: 'Trust Wallet, MetaMask, or any Web3 wallet' },
                    { step: '02', label: 'Scan QR', desc: `Send ${invoice.cryptoName?.toUpperCase()} to the address above` },
                    { step: '03', label: 'Confirm', desc: 'Wait for blockchain confirmation' },
                  ].map((s, i) => (
                    <div key={s.step} className="text-center space-y-2 group">
                      <div className="w-9 h-9 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {s.step}
                      </div>
                      <p className="text-[11px] font-bold">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network route */}
              <div className="px-8 py-5 flex items-center justify-center gap-4 border-t border-border bg-muted/[0.15]">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-background border border-border shadow-sm">
                  <CryptoIcon coinId={invoice.cryptoName?.toLowerCase()} className="w-6 h-6" name={invoice.cryptoName} />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Currency</p>
                    <p className="text-sm font-bold">{invoice.cryptoName?.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <div className="w-8 h-px bg-border" />
                  <span className="text-[9px] uppercase tracking-widest font-semibold">via</span>
                  <div className="w-8 h-px bg-border" />
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-background border border-border shadow-sm">
                  <CryptoIcon coinId={networkCoin} className="w-6 h-6" name={invoice.networkName} />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Network</p>
                    <p className="text-sm font-bold">{invoice.networkName?.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-6 border-t border-border space-y-3">
                <p className="text-[11px] text-muted-foreground text-center uppercase tracking-widest font-semibold">Wallet Address</p>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/20 transition-colors group">
                  <code className="flex-1 text-sm font-mono break-all text-foreground/80 select-all leading-relaxed tracking-tight">
                    {invoice.address}
                  </code>
                  <Button
                    variant={copied ? "default" : "secondary"}
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText(invoice.address); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    className={cn("rounded-xl gap-2 shrink-0 text-xs h-9 transition-all", copied && "bg-emerald-500 hover:bg-emerald-600")}
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Watching indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Watching for transaction...
            </div>
          </div>

          {/* ── RIGHT: Payment Details ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Amount card */}
            <div className="rounded-3xl bg-card border border-border p-8 shadow-xl shadow-amber-500/[0.02]">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-6">Payment Amount</p>
              <div className="text-center mb-6">
                <div className="text-5xl font-black tracking-tight tabular-nums">${invoice.amountUSD?.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-2">USD Equivalent</p>
              </div>

              {/* Countdown */}
              <div className={cn(
                "rounded-2xl p-4 text-center border transition-colors",
                countdown === 'Expired'
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-amber-500/5 border-amber-500/20"
              )}>
                {countdown === 'Expired' ? (
                  <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
                    <XCircle className="w-5 h-5" />
                    Payment window expired
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Expires in</p>
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-lg tabular-nums font-mono">
                      <Clock className="w-5 h-5" />
                      {countdown || '--:--'}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info cards */}
            <div className="rounded-3xl bg-card border border-border p-6 space-y-4">
              <h4 className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Transaction Info</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Invoice ID</span>
                  <span className="text-xs font-mono text-foreground/60">{invoiceId.slice(0, 12)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Currency</span>
                  <div className="flex items-center gap-1.5">
                    <CryptoIcon coinId={invoice.cryptoName?.toLowerCase()} className="w-4 h-4" name={invoice.cryptoName} />
                    <span className="text-xs font-semibold">{invoice.cryptoName?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Network</span>
                  <div className="flex items-center gap-1.5">
                    <CryptoIcon coinId={networkCoin} className="w-4 h-4" name={invoice.networkName} />
                    <span className="text-xs font-semibold">{invoice.networkName?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusColors[invoice.status] || '')}>
                    {statusLabel[invoice.status] || invoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="rounded-2xl bg-amber-500/[0.04] border border-amber-500/10 p-4 flex gap-3">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send only <span className="font-semibold text-foreground">{invoice.cryptoName}</span> on the <span className="font-semibold text-foreground">{invoice.networkName}</span> network. Sending other tokens or using the wrong network may result in permanent loss of funds.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  // ═══════════════ FINAL STATUS ═══════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <header className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl -ml-2" onClick={() => window.close()}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className={cn(
          "w-full max-w-lg text-center space-y-8 transition-all duration-700",
          animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Icon */}
          <div className="relative mx-auto w-fit">
            <div className={cn(
              "w-24 h-24 rounded-3xl flex items-center justify-center",
              isSuccess ? "bg-emerald-500/10" : "bg-red-500/10"
            )}>
              {isSuccess
                ? <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                : <XCircle className="w-12 h-12 text-red-400" />
              }
            </div>
            <div className={cn(
              "absolute -inset-1 rounded-3xl -z-10 blur-xl",
              isSuccess ? "bg-emerald-500/10" : "bg-red-500/10"
            )} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {isSuccess ? 'Payment Received' : `Payment ${invoice.status}`}
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {isSuccess
                ? 'Your crypto deposit has been detected and credited to your account.'
                : 'This payment could not be processed.'}
            </p>
          </div>

          {/* Detail card */}
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xl">
            <div className="space-y-5">
              {/* Amount */}
              <div className="text-center pb-5 border-b border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Amount</p>
                <div className="text-4xl font-black tracking-tight">${invoice.amountUSD?.toFixed(2)}</div>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Invoice ID</span>
                  <span className="text-xs font-mono text-foreground/60">{invoiceId.slice(0, 14)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Currency</span>
                  <div className="flex items-center gap-1.5">
                    <CryptoIcon coinId={invoice.cryptoName?.toLowerCase()} className="w-4 h-4" name={invoice.cryptoName} />
                    <span className="text-xs font-semibold">{invoice.cryptoName?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Network</span>
                  <div className="flex items-center gap-1.5">
                    <CryptoIcon coinId={networkCoin} className="w-4 h-4" name={invoice.networkName} />
                    <span className="text-xs font-semibold">{invoice.networkName?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border", statusColors[invoice.status] || '')}>
                    {statusLabel[invoice.status] || invoice.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={() => window.close()} className="rounded-xl">Close</Button>
        </div>
      </main>
    </div>
  )
}
