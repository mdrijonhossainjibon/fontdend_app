import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Lock,
  Mail,
  User,
  Trophy,
} from 'lucide-react'
import { toast } from "sonner"
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import type { RootState } from '@/modules/rootReducer'
import * as authActions from '@/modules/auth/actions'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { LoginInput } from '@/components/LoginInput'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { GoogleIcon } from '@/components/google-icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/* ── SVG icon components ── */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#f25022" />
    <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#7fba00" />
    <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#00a4ef" />
    <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#ffb900" />
  </svg>
)

/* ── Types ── */
type SignupStep = 'credentials' | 'otp' | 'success'

export default function SignupPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading: isLoading, registrationSuccess, verificationSuccess, requiresVerification } = useSelector((state: RootState) => state.auth)
  const googleLogin = useGoogleAuth()

  const [step, setStep] = useState<SignupStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    dispatch(authActions.resetAuthState())
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) setReferralCode(ref)
  }, [dispatch])

  useEffect(() => {
    if (registrationSuccess) {
      if (requiresVerification) { setStep('otp'); setTimer(300); setResendDisabled(true) }
      else { setStep('success'); setTimeout(() => navigate('/dashboard'), 2000) }
    }
  }, [registrationSuccess, requiresVerification, navigate])

  useEffect(() => {
    if (verificationSuccess) { setStep('success'); setTimeout(() => navigate('/dashboard'), 2000) }
  }, [verificationSuccess, navigate])

  useEffect(() => {
    if (step !== 'otp') return
    const interval = setInterval(() => {
      setTimer((prev) => { if (prev <= 1) { setResendDisabled(false); return 0 }; return prev - 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = { name, email, password }
    if (referralCode) payload.referralCode = referralCode
    dispatch(authActions.registerRequest(payload))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return
    dispatch(authActions.verifyEmailRequest({ email, otp: otpCode }))
  }

  const handleResendOtp = () => {
    setResendDisabled(true); setOtp(['', '', '', '', '', '']); setTimer(300)
    dispatch(authActions.resendVerificationRequest({ email }))
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* ── Glass reflection ── */
  const glassReflection = (
    <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[0.03] dark:opacity-[0.06]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 100%)' }} />
  )

  /* ── Social button ── */
  const renderSocialButton = (label: string, icon: React.ReactNode, onClick?: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center justify-center gap-2.5 rounded-xl border dark:border-white/10 border-border px-4 py-3 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F0B90B]/40 dark:hover:bg-white/[0.06] hover:bg-secondary/80 hover:text-foreground hover:shadow-[0_0_24px_rgba(240,185,11,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0B90B]/40"
    >
      {icon}
      <span>{label}</span>
    </button>
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
      {/* Header */}
      <div className="mb-10 text-center hidden lg:block">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {step === 'credentials' && 'Create Your Account'}
          {step === 'otp' && 'Verify Identity'}
          {step === 'success' && 'All Set!'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground/70">
          {step === 'credentials' && 'Sign up to manage your CAPTCHAs instantly'}
          {step === 'otp' && `Enter the code sent to ${email}`}
          {step === 'success' && 'Redirecting to dashboard...'}
        </p>
      </div>

      {/* ── CREDENTIALS ── */}
      {step === 'credentials' && (
        <form onSubmit={handleSubmitCredentials} className="space-y-4">
          {/* Name */}
          <LoginInput
            id="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            icon={<User className="h-5 w-5" />}
          />

          {/* Referral */}
          {referralCode && (
            <div className="flex items-center gap-2 rounded-xl bg-[#F0B90B]/5 border border-[#F0B90B]/20 px-4 py-3 text-xs text-[#F0B90B]">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              Referral code <strong>{referralCode}</strong> applied — bonus credits incoming!
            </div>
          )}

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-foreground/90">Password</Label>
            <LoginInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              icon={<Lock className="h-5 w-5" />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex h-full items-center justify-center p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="dark:border-white/20 border-border/60 data-[state=checked]:border-[#F0B90B] data-[state=checked]:bg-[#F0B90B] data-[state=checked]:text-black mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-tight">
              I agree to the <Link to="/terms" className="font-medium text-[#F0B90B] hover:underline transition-colors">Terms of Service</Link> and <Link to="/privacy" className="font-medium text-[#F0B90B] hover:underline transition-colors">Privacy Policy</Link>
            </Label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="group relative h-12 w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-[#F0B90B] via-[#F0B90B] to-[#D4A907] text-sm font-bold text-slate-900 shadow-[0_8px_24px_rgba(240,185,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,185,11,0.4)] disabled:opacity-50"
          >
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite' }} />
            {isLoading ? (
              <div className="relative flex items-center gap-2.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center gap-2">
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t dark:border-white/5 border-border/60" /></div>
            <div className="relative flex justify-center"><span className="bg-card/50 px-4 text-xs uppercase tracking-[0.15em] text-muted-foreground/50 backdrop-blur-sm">Secure Social Connect</span></div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-3">
            {renderSocialButton('Google', <GoogleIcon className="h-4 w-4" />, () => googleLogin.login())}
            {renderSocialButton('GitHub', <GithubIcon className="h-4 w-4" />, () => { window.location.href = '/api/auth/callback/github' })}
            {renderSocialButton('Microsoft', <MicrosoftIcon className="h-4 w-4" />, () => { window.location.href = '/api/auth/callback/microsoft' })}
          </div>

          {/* Login link */}
          <p className="pt-1 text-center text-sm text-muted-foreground/60">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-[#F0B90B] transition-all duration-300 hover:text-[#F0B90B]/80 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* ── OTP ── */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="grid grid-cols-6 gap-3">
            {otp.map((digit, i) => (
              <Input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} className="h-14 rounded-xl dark:border-white/10 border-border bg-card/50 text-center text-xl font-bold text-foreground backdrop-blur-md transition-all duration-300 focus:border-border dark:focus:border-white/20 focus:ring-0 placeholder:text-muted-foreground/20" placeholder="0" />
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border dark:border-white/5 border-border/60 dark:bg-white/[0.03] bg-card/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
              <Clock className="h-4 w-4 text-[#F0B90B]" />
              <span>Expires in:</span>
              <span className={`font-mono font-bold ${timer < 60 ? 'text-destructive' : 'text-[#F0B90B]'}`}>{formatTime(timer)}</span>
            </div>
            <button type="button" disabled={resendDisabled || isLoading} onClick={handleResendOtp} className="rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F0B90B] transition-all duration-300 hover:bg-[#F0B90B]/10 disabled:opacity-30">Resend Code</button>
          </div>

          <Button type="submit" disabled={isLoading || otp.join('').length !== 6} className="group relative h-12 w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-[#F0B90B] via-[#F0B90B] to-[#D4A907] text-sm font-bold text-slate-900 shadow-[0_8px_24px_rgba(240,185,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,185,11,0.4)]">
            {isLoading ? (
              <div className="relative flex items-center gap-2.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center gap-2">
                <span>Verify &amp; Create Account</span>
                <Shield className="h-4 w-4" />
              </div>
            )}
          </Button>

          <button type="button" onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setTimer(300) }} className="flex w-full items-center justify-center gap-2 rounded-xl border dark:border-white/10 border-border bg-card/30 py-3 text-sm font-medium text-muted-foreground/70 backdrop-blur-sm transition-all duration-300 hover:text-foreground">
            Back to Sign Up
          </button>
        </form>
      )}

      {/* ── SUCCESS ── */}
      {step === 'success' && (
        <div className="space-y-6 py-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.2)] ring-1 ring-green-500/20"
          >
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Registration Successful</h2>
            <p className="text-sm text-muted-foreground/70">Welcome aboard! Redirecting you now...</p>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full dark:bg-white/5 bg-border/60">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-r from-[#F0B90B] to-[#D4A907]"
            />
          </div>
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
          Join the <br />
          <span className="bg-gradient-to-r from-[#F0B90B] to-[#D4A907] bg-clip-text text-transparent">Elite Solver Network</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-10 text-lg leading-relaxed dark:text-slate-400 text-slate-600 xl:text-xl">
          Create your account to access enterprise-grade CAPTCHA solving infrastructure and advanced automation tools.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="space-y-6">
          {[
            { icon: <Zap className="text-yellow-500" />, title: 'High Priority', desc: 'Get the fastest solving times in the industry' },
            { icon: <Shield className="text-green-500" />, title: 'Secure Access', desc: 'Enterprise-level security for your data' },
            { icon: <Trophy className="text-blue-500" />, title: 'Reward System', desc: 'Earn bonuses for every referral' },
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
          <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase ml-1">Sign Up</span>
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

        {/* ── Signup Card ── */}
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
