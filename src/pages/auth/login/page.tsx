import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Mail,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { notification } from 'antd'
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
type LoginStep = 'credentials' | 'otp' | 'success'

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [resendDisabled, setResendDisabled] = useState(true)
  const googleLogin = useGoogleAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error: reduxError, loginSuccess, requiresOTP } = useSelector((s: RootState) => s.auth)
  const [oauthError, setOauthError] = useState('')

  /* ── OAuth error from URL ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err) {
      const messages: Record<string, string> = {
        invalid_state: 'Security verification failed. Please try again.',
        no_email: 'No email address found from the social account.',
        account_deactivated: 'Your account has been deactivated. Please contact support.',
        oauth_failed: 'Social login failed. Please try again.',
        access_denied: 'Access was denied. Please try again.',
      }
      const desc = messages[err] || 'An error occurred during social login.'
      setOauthError(desc)
      notification.error({
        message: 'Login Failed',
        description: desc,
        placement: 'topRight',
      })
      window.history.replaceState({}, '', '/auth/login')
    }
  }, [])

  /* ── OTP timer ── */
  useEffect(() => {
    if (step !== 'otp') return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { setResendDisabled(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* ── Form handlers ── */
  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(authActions.loginRequest({ email, password, rememberMe }))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return
    dispatch(authActions.verifyOtpRequest({ email, otp: otpCode }))
  }

  const handleResendOtp = () => {
    setResendDisabled(true)
    dispatch(authActions.resendOtpRequest({ email }))
    setOtp(['', '', '', '', '', '']); setTimer(300)
  }

  const handleGoogleLogin = useCallback(() => { googleLogin.login() }, [googleLogin])

  /* ── React to Redux state changes ── */
  useEffect(() => {
    if (reduxError) {
      notification.error({
        message: 'Login Error',
        description: reduxError,
        placement: 'topRight',
      })
    }
  }, [reduxError])

  useEffect(() => {
    if (requiresOTP && step === 'credentials') {
      notification.info({
        message: 'Verification Required',
        description: 'Please enter the 6-digit code sent to your email.',
        placement: 'topRight',
      })
      setStep('otp'); setTimer(300); setResendDisabled(true)
    }
  }, [requiresOTP])

  useEffect(() => {

    console.log('loginSuccess', loginSuccess)
    if (loginSuccess) {
      notification.success({
        message: 'Welcome Back!',
        description: 'You have successfully signed in.',
        placement: 'topRight',
      })
      setStep('success')
      setTimeout(() => { navigate('/dashboard') }, 2000)
    }
  }, [loginSuccess])

  /* ── Glass reflection overlay ── */
  const glassReflection = (
    <div
      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[0.03] dark:opacity-[0.06]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 100%)',
      }}
    />
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
      {/* Error */}
      <AnimatePresence mode="wait">
        {(reduxError || oauthError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-sm">
              {reduxError || oauthError}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CREDENTIALS ── */}
      {step === 'credentials' && (
        <form onSubmit={handleSubmitCredentials} className="space-y-5">
          {/* Email */}
          <LoginInput
            id="email"
            type="email"
            label="Email address"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            icon={
              <Mail className="h-5 w-5" />
            }
          />

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground/90">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-medium text-[#F0B90B]/80 transition-all duration-300 hover:text-[#F0B90B] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <LoginInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              icon={
                <Lock className="h-5 w-5" />
              }
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

          {/* Remember me */}
          <div className="flex items-center">
            <label className="group flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground/70 transition-colors hover:text-foreground">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="dark:border-white/20 border-border/60 data-[state=checked]:border-[#F0B90B] data-[state=checked]:bg-[#F0B90B] data-[state=checked]:text-black"
              />
              <span>Keep me signed in</span>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="group relative h-12 w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-[#F0B90B] via-[#F0B90B] to-[#D4A907] text-sm font-bold text-slate-900 shadow-[0_8px_24px_rgba(240,185,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,185,11,0.4)] disabled:opacity-70"
          >
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite' }}
            />
            {loading ? (
              <div className="relative flex items-center gap-2.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t dark:border-white/5 border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card/50 px-4 text-xs uppercase tracking-[0.15em] text-muted-foreground/50 backdrop-blur-sm">
                Secure Social Connect
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-3">
            {renderSocialButton('Google', <GoogleIcon className="h-4 w-4" />, handleGoogleLogin)}
            {renderSocialButton('GitHub', <GithubIcon className="h-4 w-4" />, () => { window.location.href = '/api/auth/callback/github' })}
            {renderSocialButton('Microsoft', <MicrosoftIcon className="h-4 w-4" />, () => { window.location.href = '/api/auth/callback/microsoft' })}
          </div>

          {/* Sign up link */}
          <div className="pt-2 text-center text-sm">
            <span className="text-muted-foreground/60">New to the platform?</span>{' '}
            <Link to="/auth/signup" className="font-bold text-[#F0B90B] transition-all duration-300 hover:text-[#F0B90B]/80 hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      )}

      {/* ── OTP ── */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="grid grid-cols-6 gap-3">
            {otp.map((digit, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="h-14 rounded-xl dark:border-white/10 border-border bg-card/50 text-center text-xl font-bold text-foreground backdrop-blur-md transition-all duration-300 focus:border-[#F0B90B]/60 focus:ring-0 placeholder:text-muted-foreground/20"
                placeholder="0"
              />
            ))}
          </div>

          {/* Timer + Resend */}
          <div className="flex items-center justify-between rounded-2xl border dark:border-white/5 border-border/60 dark:bg-white/[0.03] bg-card/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
              <Clock className="h-4 w-4 text-[#F0B90B]" />
              <span>Expires in:</span>
              <span className={`font-mono font-bold ${timer < 60 ? 'text-destructive' : 'text-[#F0B90B]'}`}>{formatTime(timer)}</span>
            </div>
            <button
              type="button"
              disabled={resendDisabled || loading}
              onClick={handleResendOtp}
              className="rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F0B90B] transition-all duration-300 hover:bg-[#F0B90B]/10 disabled:opacity-30"
            >
              Resend Code
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="group relative h-12 w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-[#F0B90B] via-[#F0B90B] to-[#D4A907] text-sm font-bold text-slate-900 shadow-[0_8px_24px_rgba(240,185,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(240,185,11,0.4)]"
          >
            {loading ? (
              <div className="relative flex items-center gap-2.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center gap-2">
                <span>Secure Verify</span>
                <Shield className="h-4 w-4" />
              </div>
            )}
          </Button>

          <button
            type="button"
            onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setTimer(300) }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border dark:border-white/10 border-border bg-card/30 py-3 text-sm font-medium text-muted-foreground/70 backdrop-blur-sm transition-all duration-300 hover:text-foreground"
          >
            Change email address
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
            <h2 className="text-2xl font-bold text-foreground">Authentication Successful</h2>
            <p className="text-sm text-muted-foreground/70">
              Access granted. Preparing your dashboard...
            </p>
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
     LEFT PANEL — Dynamic highlights
     ─────────────────────────────────────── */
  const renderLeftPanel = () => (
    <aside className="relative hidden w-1/2 min-h-screen lg:flex flex-col justify-center px-12 xl:px-20 2xl:px-32 overflow-hidden dark:bg-[#040406] bg-slate-50 border-r dark:border-white/[0.02] border-slate-200">
      {/* Background visual effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#F0B90B]/10 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center dark:bg-white/5 bg-white shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <img src="/logo.png" alt="CaptchaⱮaster" className="w-full h-full object-contain p-2" />
          </div>
          <div className="text-3xl font-black tracking-tighter">
            <span className="dark:text-white text-slate-900">Captcha</span>
            <span className="text-[#F0B90B]">Ɱaster</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight dark:text-white text-slate-900 xl:text-6xl"
        >
          Elevate Your <br />
          <span className="bg-gradient-to-r from-[#F0B90B] to-[#D4A907] bg-clip-text text-transparent">Solving Experience</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-10 text-lg leading-relaxed dark:text-slate-400 text-slate-600 xl:text-xl"
        >
          Access the world's fastest CAPTCHA solving infrastructure with advanced AI models and enterprise-grade reliability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="space-y-6"
        >
          {[
            { icon: <Zap className="text-yellow-500" />, title: 'Lightning Fast', desc: 'Average response time < 0.8s' },
            { icon: <Globe className="text-blue-500" />, title: 'Global Edge', desc: 'Distributed infrastructure across 12 regions' },
            { icon: <Shield className="text-green-500" />, title: 'Anti-Bot Shield', desc: 'Successfully bypass all modern bot detection' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
            >
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

      {/* Floating badge */}
    </aside>
  )

  /* ───────────────────────────────────────
     RIGHT PANEL — Login card
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
          <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase ml-1">Sign In</span>
        </div>
        <div className="w-10" />
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

        {/* ── Login Card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="group/card relative overflow-hidden lg:rounded-3xl lg:border dark:lg:border-white/[0.06] lg:border-slate-200 dark:lg:bg-[#0c0c0e]/80 lg:bg-white lg:shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:lg:shadow-[0_40px_100px_rgba(0,0,0,0.4)] lg:backdrop-blur-2xl"
        >
          {/* Internal Glow */}
          <div className="absolute -left-20 -top-20 h-40 w-40 bg-[#F0B90B]/5 blur-[60px]" />

          {/* Glass reflection */}
          <div className="hidden lg:block">{glassReflection}</div>

          {/* Top edge gradient */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent hidden lg:block" />

          {/* Content */}
          <div className="relative px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            {renderFormContent()}
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-xs tracking-wide dark:text-slate-600 text-slate-400 hidden lg:block"
        >
          <div className="mb-4 flex items-center justify-center gap-6">
            <Link to="/legal/terms" className="hover:text-[#F0B90B] transition-colors">Terms of Service</Link>
            <Link to="/legal/privacy" className="hover:text-[#F0B90B] transition-colors">Privacy Policy</Link>
            <a href="https://status.captchamaster.com" className="hover:text-[#F0B90B] transition-colors flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Systems Online
            </a>
          </div>
          &copy; 2026 CAPTCHAⱮASTER. SECURE ACCESS GATEWAY.
        </motion.div>
      </div>
    </section>
  )

  /* ───────────────────────────────────────
     RENDER
     ─────────────────────────────────────── */
  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-[#060608] bg-slate-50 text-foreground selection:bg-[#F0B90B]/30">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#F0B90B]/[0.03] blur-[150px] animate-pulse" />
        <div className="absolute -right-[10%] -bottom-[10%] h-[60%] w-[60%] rounded-full bg-blue-600/[0.02] blur-[150px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #F0B90B 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ── Split layout ── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-2xl">
        {renderLeftPanel()}
        {renderRightPanel()}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: inherit;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </main>
  )
}
