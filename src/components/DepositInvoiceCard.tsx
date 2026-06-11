import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { CryptoIcon } from '@/components/CryptoIcon'
import { cn } from '@/lib/utils'
import { Clock, Copy, CheckCircle2, Shield, Loader2, XCircle, AlertTriangle } from 'lucide-react'

// ── Types ──
export interface DepositData {
  amountUSD: number
  cryptoName: string
  networkName: string
  address: string
  status: string
  invoiceId?: string
}

interface DepositInvoiceCardProps {
  data: DepositData
  countdown?: string
  copied: boolean
  onCopy: () => void
  hideActions?: boolean
}

// ── Helpers ──
function getNetworkCoinId(networkName: string): string {
  const n = (networkName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (n.includes('bsc') || n.includes('bnb') || n.includes('binance')) return 'bnb'
  if (n.includes('erc20') || n.includes('eth') || n === 'ethereum') return 'eth'
  if (n.includes('polygon') || n.includes('matic')) return 'matic'
  if (n.includes('arbitrum')) return 'eth'
  if (n.includes('optimism')) return 'eth'
  if (n.includes('avalanche') || n.includes('avax')) return 'avax'
  if (n.includes('trc20') || n.includes('tron')) return 'trx'
  if (n.includes('solana') || n.includes('sol')) return 'sol'
  if (n.includes('bitcoin') || n === 'btc') return 'btc'
  if (n.includes('litecoin') || n === 'ltc') return 'ltc'
  if (n.includes('doge')) return 'doge'
  return 'btc'
}

// Using standard Tailwind colors for Light Mode, and Binance Hex for Dark Mode
export const statusColors: Record<string, string> = {
  pending:       'text-amber-600 dark:text-[#F0B90B] bg-amber-500/10 dark:bg-[#F0B90B]/10 border-amber-500/20 dark:border-[#F0B90B]/20',
  confirming:    'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  completed:     'text-emerald-600 dark:text-[#0ECB81] bg-emerald-500/10 dark:bg-[#0ECB81]/10 border-emerald-500/20 dark:border-[#0ECB81]/20',
  paid:          'text-emerald-600 dark:text-[#0ECB81] bg-emerald-500/10 dark:bg-[#0ECB81]/10 border-emerald-500/20 dark:border-[#0ECB81]/20',
  failed:        'text-red-600 dark:text-[#F6465D] bg-red-500/10 dark:bg-[#F6465D]/10 border-red-500/20 dark:border-[#F6465D]/20',
  expired:       'text-gray-500 dark:text-[#848E9C] bg-gray-500/10 dark:bg-[#848E9C]/10 border-gray-500/20 dark:border-[#848E9C]/20',
  rejected:      'text-red-600 dark:text-[#F6465D] bg-red-500/10 dark:bg-[#F6465D]/10 border-red-500/20 dark:border-[#F6465D]/20',
  approved:      'text-emerald-600 dark:text-[#0ECB81] bg-emerald-500/10 dark:bg-[#0ECB81]/10 border-emerald-500/20 dark:border-[#0ECB81]/20',
  pending_funds: 'text-amber-600 dark:text-[#F0B90B] bg-amber-500/10 dark:bg-[#F0B90B]/10 border-amber-500/20 dark:border-[#F0B90B]/20',
}

export const statusLabel: Record<string, string> = {
  pending:        'Awaiting Deposit',
  confirming:     'Confirming',
  completed:      'Completed',
  paid:           'Completed',
  failed:         'Failed',
  expired:        'Expired',
  rejected:       'Rejected',
  approved:       'Approved',
  pending_funds:  'Awaiting Deposit',
}

// Binance-style step connector
function StepConnector() {
  return (
    <div className="flex-1 flex items-center px-1">
      <div className="w-full h-px bg-gray-200 dark:bg-[#2B3139]" />
    </div>
  )
}

// Binance-style step indicator
function StepItem({ num, label, active }: { num: number; label: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
          active
            ? 'bg-[#F0B90B] text-black'
            : 'bg-gray-100 dark:bg-[#1E2329] text-gray-400 dark:text-[#848E9C] border border-gray-200 dark:border-[#2B3139]'
        )}
      >
        {num}
      </div>
      <span
        className={cn(
          'text-[11px] font-medium whitespace-nowrap',
          active ? 'text-gray-900 dark:text-[#EAECEF]' : 'text-gray-400 dark:text-[#848E9C]'
        )}
      >
        {label}
      </span>
    </div>
  )
}

// Binance-style info row
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#2B3139] last:border-0">
      <span className="text-xs text-gray-500 dark:text-[#848E9C]">{label}</span>
      <span className="text-xs text-gray-900 dark:text-[#EAECEF] font-medium flex items-center gap-1">{value}</span>
    </div>
  )
}

// ── Active Payment (Binance two-panel) ──
function ActivePaymentView({ data, countdown, copied, onCopy }: DepositInvoiceCardProps) {
  const isActive = data.status === 'pending' || data.status === 'confirming' || data.status === 'pending_funds'

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CryptoIcon coinId={data.cryptoName?.toLowerCase()} className="w-6 h-6" name={data.cryptoName} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#EAECEF]">
              Deposit {data.cryptoName?.toUpperCase()}
            </h2>
          </div>
          <span className="text-gray-300 dark:text-[#848E9C]">·</span>
          <span className="text-sm text-gray-500 dark:text-[#848E9C]">{data.networkName}</span>
        </div>

        <div className="flex items-center gap-3">
          {isActive && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#848E9C]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-[#F0B90B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-[#F0B90B]" />
              </span>
              Awaiting deposit
            </div>
          )}
          <span className={cn('text-xs font-medium px-2.5 py-1 rounded border', statusColors[data.status] || '')}>
            {statusLabel[data.status] || data.status}
          </span>
        </div>
      </div>

      {/* ── Main Card ── */}
      <div className="rounded-lg bg-white dark:bg-[#1E2329] border border-gray-200 dark:border-[#2B3139] shadow-sm dark:shadow-none overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* ── LEFT: QR & Address ── */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-[#2B3139]">
            <div className="flex flex-col items-center">
              {/* QR Code */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 dark:border-[#2B3139] shadow-sm">
                <QRCodeSVG value={data.address} size={200} level="M" />
              </div>

              {/* Steps */}
              <div className="w-full flex items-start mb-8 px-2">
                <StepItem num={1} label="Send" active={true} />
                <StepConnector />
                <StepItem num={2} label="Confirm" active={false} />
                <StepConnector />
                <StepItem num={3} label="Complete" active={false} />
              </div>

              {/* Address */}
              <div className="w-full">
                <label className="block text-xs text-gray-500 dark:text-[#848E9C] mb-2 font-medium">
                  {data.cryptoName?.toUpperCase()} Deposit Address
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-[#0B0E11] border border-gray-200 dark:border-[#2B3139] rounded px-3 py-2.5">
                    <code className="text-xs font-mono text-gray-800 dark:text-[#EAECEF] break-all leading-relaxed select-all">
                      {data.address}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className={cn(
                      'h-10 px-3 rounded text-xs font-medium shrink-0 gap-1.5 transition-all',
                      copied
                        ? 'bg-emerald-50 dark:bg-[#0ECB81]/10 text-emerald-600 dark:text-[#0ECB81] hover:bg-emerald-100 dark:hover:bg-[#0ECB81]/20'
                        : 'bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90'
                    )}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Watching */}
              {isActive && (
                <div className="w-full mt-4 flex items-center gap-2 text-[11px] text-gray-500 dark:text-[#848E9C]">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-500 dark:text-[#F0B90B]" />
                  Monitoring blockchain for your deposit...
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="p-8">
            {/* Amount */}
            <div className="mb-8">
              <label className="block text-xs text-gray-500 dark:text-[#848E9C] mb-2 font-medium">Amount</label>
              <div className="bg-gray-50 dark:bg-[#0B0E11] border border-gray-200 dark:border-[#2B3139] rounded p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-[#EAECEF] tabular-nums">
                    ${(data.amountUSD || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-[#848E9C]">USD</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="mb-8">
              <label className="block text-xs text-gray-500 dark:text-[#848E9C] mb-2 font-medium">Time Remaining</label>
              <div
                className={cn(
                  'rounded p-4 flex items-center gap-3',
                  countdown === 'Expired'
                    ? 'bg-red-50 dark:bg-[#F6465D]/5 border border-red-200 dark:border-[#F6465D]/20'
                    : 'bg-amber-50 dark:bg-[#F0B90B]/5 border border-amber-200 dark:border-[#F0B90B]/20'
                )}
              >
                {countdown === 'Expired' ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 dark:text-[#F6465D] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-[#F6465D]">Expired</p>
                      <p className="text-[11px] text-gray-500 dark:text-[#848E9C]">Payment window has closed</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-amber-500 dark:text-[#F0B90B] shrink-0" />
                    <div>
                      <p className="text-lg font-bold text-amber-600 dark:text-[#F0B90B] font-mono tabular-nums">
                        {countdown || '--:--'}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-[#848E9C]">Complete deposit before time runs out</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-0">
              <InfoRow label="Network" value={
                <div className="flex items-center gap-1.5">
                  <CryptoIcon coinId={getNetworkCoinId(data.networkName || '')} className="w-4 h-4" name={data.networkName} />
                  <span>{data.networkName}</span>
                </div>
              } />
              <InfoRow label="Currency" value={
                <div className="flex items-center gap-1.5">
                  <CryptoIcon coinId={data.cryptoName?.toLowerCase()} className="w-4 h-4" name={data.cryptoName} />
                  <span>{data.cryptoName?.toUpperCase()}</span>
                </div>
              } />
              {data.invoiceId && (
                <InfoRow label="Invoice ID" value={
                  <span className="font-mono text-gray-500 dark:text-[#848E9C]">{data.invoiceId.slice(0, 16)}...</span>
                } />
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Warning Bar ── */}
        <div className="border-t border-gray-100 dark:border-[#2B3139] bg-amber-50/50 dark:bg-[#F0B90B]/[0.03] px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-[#F0B90B] shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-[11px] text-gray-600 dark:text-[#848E9C] leading-relaxed">
              <p>
                Send only <span className="text-gray-900 dark:text-[#EAECEF] font-medium">{data.cryptoName}</span> via the{' '}
                <span className="text-gray-900 dark:text-[#EAECEF] font-medium">{data.networkName}</span> network to this address.
              </p>
              <p>
                Depositing any other coin or using a different network may result in <span className="text-red-500 dark:text-[#F6465D] font-medium">permanent loss of funds</span>.
              </p>
              <p>
                Minimum deposit amount applies. Deposits below the minimum will not be credited and <span className="text-red-500 dark:text-[#F6465D] font-medium">cannot be recovered</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Final Status (Binance-style) ──
function FinalStatusView({ data }: { data: DepositData }) {
  const isSuccess = data.status === 'completed' || data.status === 'paid'

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="rounded-lg bg-white dark:bg-[#1E2329] border border-gray-200 dark:border-[#2B3139] shadow-sm dark:shadow-none overflow-hidden">
        <div className="p-10 text-center">
          {/* Icon */}
          <div
            className={cn(
              'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6',
              isSuccess ? 'bg-emerald-50 dark:bg-[#0ECB81]/10' : 'bg-red-50 dark:bg-[#F6465D]/10'
            )}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-[#0ECB81]" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500 dark:text-[#F6465D]" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#EAECEF] mb-1">
            {isSuccess ? 'Deposit Successful' : `Deposit ${statusLabel[data.status] || data.status}`}
          </h2>
          <p className="text-sm text-gray-500 dark:text-[#848E9C] mb-8">
            {isSuccess
              ? 'Your deposit has been confirmed and credited to your account.'
              : 'This deposit could not be processed.'}
          </p>

          {/* Amount */}
          <div className="bg-gray-50 dark:bg-[#0B0E11] border border-gray-200 dark:border-[#2B3139] rounded p-5 mb-6">
            <p className="text-xs text-gray-500 dark:text-[#848E9C] mb-1">Amount</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-[#EAECEF] tabular-nums">
              ${(data.amountUSD || 0).toFixed(2)}
            </p>
          </div>

          {/* Info rows */}
          <div className="text-left space-y-0">
            <InfoRow label="Status" value={
              <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', statusColors[data.status] || '')}>
                {statusLabel[data.status] || data.status}
              </span>
            } />
            <InfoRow label="Currency" value={
              <div className="flex items-center gap-1.5">
                <CryptoIcon coinId={data.cryptoName?.toLowerCase()} className="w-4 h-4" name={data.cryptoName} />
                <span>{data.cryptoName?.toUpperCase()}</span>
              </div>
            } />
            <InfoRow label="Network" value={
              <div className="flex items-center gap-1.5">
                <CryptoIcon coinId={getNetworkCoinId(data.networkName || '')} className="w-4 h-4" name={data.networkName} />
                <span>{data.networkName}</span>
              </div>
            } />
            {data.invoiceId && (
              <InfoRow label="Invoice ID" value={
                <span className="font-mono text-gray-500 dark:text-[#848E9C]">{data.invoiceId.slice(0, 16)}...</span>
              } />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ──
export default function DepositInvoiceCard(props: DepositInvoiceCardProps) {
  const { data, hideActions } = props
  const isActive = data.status === 'pending' || data.status === 'confirming' || data.status === 'pending_funds' || data.status === 'check'

  if (hideActions || !isActive) {
    return <FinalStatusView data={data} />
  }

  return <ActivePaymentView {...props} />
}