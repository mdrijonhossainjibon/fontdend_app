import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Lock,
  Mail,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import type { RootState } from '@/modules/rootReducer'
import { Button } from '@/components/ui/button'
import { LoginInput } from '@/components/LoginInput'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setIsLoading(false)
        return
      }
      setIsSubmitted(true)
      setCountdown(60)
    } catch {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setIsLoading(false)
        return
      }
      setCountdown(60)
    } catch {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Glass reflection ── */
  const glassReflection = (
    <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[0.03] dark:opacity-[0.06]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 100%)' }} />
  )

  /* ───────────────────────────────────────
     FORM CONTENT
     ─────────────────────────────────────── */
  const renderFormContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {!isSubmitted ? (
        <>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <LoginInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              icon={<Mail className="h-5 w-5" />}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="group relative h-12 w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-[#F0B90B] via-[#F0B90B] to-[#D4A907] text-sm font-bold text-slate-900 shadow-[0_8px_24px_rgba(240,185,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,185,11,0.4)] disabled:opacity-50"
            >
              <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite' }} />
              {isLoading ? (
                <div className="relative flex items-center gap-2.5">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="relative flex items-center justify-center gap-2">
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>
        </>
      ) : (
        /* ── SUCCESS ── */
        <div className="space-y-8 py-4 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.2)] ring-1 ring-green-500/20"
          >
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Check Your Inbox</h2>
            <p className="text-sm text-muted-foreground/70">
              We've sent a reset link to <strong className="text-foreground/90">{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground/50">Didn't receive the email? Check spam or resend below.</p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border dark:border-white/5 border-border/60 dark:bg-white/[0.03] bg-card/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
              <Clock className="h-4 w-4 text-[#F0B90B]" />
              <span>Resend in:</span>
              <span className={`font-mono font-bold ${countdown < 10 ? 'text-destructive' : 'text-[#F0B90B]'}`}>{countdown}s</span>
            </div>
            <button
              type="button"
              disabled={countdown > 0 || isLoading}
              onClick={handleResend}
              className="text-sm font-bold text-[#F0B90B] transition-all duration-300 hover:text-[#F0B90B]/80 disabled:opacity-30"
            >
              Resend
            </button>
          </div>

          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full rounded-xl border dark:border-white/10 border-border bg-card/30 py-6 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-card/50"
          >
            Return to Login
          </Button>
        </div>
      )}
    </motion.div>
  )

  /* ───────────────────────────────────────
     LEFT PANEL
     ─────────────────────────────────────── */
  const renderLeftPanel = () => (
    <aside className="relative hidden w-1/2 min-h-screen lg:flex flex-col justify-center px-12 xl:px-20 2xl:px-32 overflow-hidden dark:bg-[#040406] bg-slate-50 border-r dark:border-white/[0.02] border-slate-200">
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#F0B90B]/10 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="max-w-lg relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center dark:bg-white/5 bg-white shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <img src="/logo.png" alt="CaptchaⱮaster" className="w-full h-full object-contain p-2" />
          </div>
          <div className="text-3xl font-black tracking-tighter">
            <span className="dark:text-white text-slate-900">Captcha</span>
            <span className="text-[#F0B90B]">Ɱaster</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight dark:text-white text-slate-900 xl:text-6xl">
          Secure <br />
          <span className="bg-gradient-to-r from-[#F0B90B] to-[#D4A907] bg-clip-text text-transparent">Recovery Gateway</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-10 text-lg leading-relaxed dark:text-slate-400 text-slate-600 xl:text-xl">
          Lost your access? No worries. Our automated system will help you regain entry to your dashboard safely and quickly.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="space-y-6">
          {[
            { icon: <Shield className="text-[#F0B90B]" />, title: 'Identity Protection', desc: 'Encrypted reset links for your security' },
            { icon: <Zap className="text-[#F0B90B]" />, title: 'Instant Delivery', desc: 'Recovery emails delivered in seconds' },
          ].map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }} className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.03] ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 group-hover:scale-110">
                {feat.icon}
              </div>
              <div>
                <p className="text-base font-bold dark:text-slate-200 text-slate-900">{feat.title}</p>
                <p className="text-sm dark:text-slate-500 text-slate-500">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </aside>
  )

  /* ───────────────────────────────────────
     RIGHT PANEL
     ─────────────────────────────────────── */
  const renderRightPanel = () => (
    <section className="relative flex w-full flex-col items-center justify-center p-0 lg:p-6 lg:w-1/2 min-h-screen">
      {/* Mobile Header (Back Button & Logo) - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:hidden bg-slate-50/80 dark:bg-[#060608]/80 backdrop-blur-lg border-b dark:border-white/[0.05] border-slate-200">
        <Link
          to="/auth/login"
          className="flex h-10 w-10 items-center justify-center rounded-xl border dark:border-white/10 border-slate-200 bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase ml-1">Forgot Password</span>
        </div>
        <div className="w-10" /> {/* Spacer to center logo */}
      </div>

      <div className="w-full max-w-md flex flex-col justify-center flex-1 lg:flex-initial">
        {/* Desktop Mobile logo */}
        <div className="mb-10 hidden lg:flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden dark:bg-white/5 bg-white flex items-center justify-center shadow-lg ring-1 ring-black/5">
            <img src="/logo.png" alt="CaptchaⱮaster" className="w-full h-full object-contain p-2" />
          </div>
          <div className="text-2xl font-bold tracking-tight">
            <span className="dark:text-white text-slate-900">Captcha</span>
            <span className="text-[#F0B90B]">Ɱaster</span>
          </div>
        </div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="group/card relative overflow-hidden lg:rounded-3xl lg:border dark:lg:border-white/[0.06] lg:border-slate-200 dark:lg:bg-[#0c0c0e]/80 lg:bg-white lg:shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:lg:shadow-[0_40px_100px_rgba(0,0,0,0.4)] lg:backdrop-blur-2xl"
        >
          <div className="absolute -left-20 -top-20 h-40 w-40 bg-[#F0B90B]/5 blur-[60px]" />
          <div className="hidden lg:block">{glassReflection}</div>
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent hidden lg:block" />
          <div className="relative px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            {renderFormContent()}
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 text-center text-xs tracking-wide dark:text-slate-600 text-slate-400 hidden lg:block">
          <div className="mb-4 flex items-center justify-center gap-6">
            <Link to="/terms" className="hover:text-[#F0B90B] transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-[#F0B90B] transition-colors">Privacy</Link>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Encrypted Access</span>
          </div>
          &copy; 2026 CAPTCHAⱮASTER. SECURE ACCESS GATEWAY.
        </motion.div>
      </div>
    </section>
  )

  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-[#060608] bg-slate-50 text-foreground selection:bg-[#F0B90B]/30">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#F0B90B]/[0.03] blur-[150px] animate-pulse" />
        <div className="absolute -right-[10%] -bottom-[10%] h-[60%] w-[60%] rounded-full bg-blue-600/[0.02] blur-[150px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #F0B90B 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-2xl">
        {renderLeftPanel()}
        {renderRightPanel()}
      </div>

      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus {
          -webkit-text-fill-color: inherit;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </main>
  )
}
