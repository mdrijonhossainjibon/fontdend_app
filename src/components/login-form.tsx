// app/auth/login/page.tsx


import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Trophy,
  Code2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

type LoginStep = 'credentials' | 'otp' | 'success'

// ─── Floating particle component ───
function FloatingParticle({
  size,
  top,
  left,
  delay,
  duration,
}: {
  size: number
  top: string
  left: string
  delay: string
  duration: string
}) {
  return (
    <div
      className="absolute rounded-full bg-primary/20 animate-float"
      style={{
        width: size,
        height: size,
        top,
        left,
        animationDelay: delay,
        animationDuration: duration,
      }}
    />
  )
}

// ─── Feature card component ───
function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: React.ElementType
  title: string
  desc: string
  delay: string
}) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 
                 transition-all duration-500 hover:border-primary/40 hover:bg-card/80 hover:translate-x-1
                 animate-in fade-in slide-in-from-left duration-700"
      style={{ animationDelay: delay }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ─── Main page component ───
export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // OTP timer
  useEffect(() => {
    if (step !== 'otp') return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await response.json()

      if (result?.requiresOTP) {
        setTwoFaEnabled(true)
        setStep('otp')
        setTimer(300)
        setResendDisabled(true)
      } else if (result?.error) {
        setErrorMessage(result.error)
      } else if (result?.success) {
        if (result.token) localStorage.setItem('authToken', result.token)
        if (result.user) localStorage.setItem('user', JSON.stringify(result.user))
        setStep('success')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      })
      const result = await response.json()

      if (result?.error) {
        setErrorMessage(result.error || 'Invalid verification code')
      } else if (result?.success) {
        if (result.token) localStorage.setItem('authToken', result.token)
        if (result.user) localStorage.setItem('user', JSON.stringify(result.user))
        setStep('success')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setErrorMessage('An error occurred during verification.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setResendDisabled(true)

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error('Resend Failed', { description: data.error || 'Failed to resend OTP code.' })
        setResendDisabled(false)
        setIsLoading(false)
        return
      }

      toast.success('OTP Resent', { description: 'A new verification code has been sent to your email.' })
      setOtp(['', '', '', '', '', ''])
      setTimer(300)
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Error', { description: 'An error occurred while resending OTP. Please try again.' })
      setResendDisabled(false)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ════════════════════════════════════════════════════════════
          LEFT SIDE – Decorative / Branding
         ════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        <FloatingParticle size={6} top="15%" left="20%" delay="0s" duration="6s" />
        <FloatingParticle size={4} top="40%" left="70%" delay="1s" duration="8s" />
        <FloatingParticle size={8} top="70%" left="30%" delay="2s" duration="7s" />
        <FloatingParticle size={5} top="25%" left="80%" delay="0.5s" duration="9s" />
        <FloatingParticle size={3} top="60%" left="55%" delay="1.5s" duration="5s" />
        <FloatingParticle size={7} top="85%" left="15%" delay="3s" duration="7s" />
        <FloatingParticle size={4} top="50%" left="40%" delay="2.5s" duration="6s" />

        {/* Large glow orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
              <img                 src="/logo.png"
                alt="Logo"
                style={{ width: 40 }}
                
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              Captcha<span className="text-primary">Ɱaster</span>
            </span>
          </div>

          {/* Center hero content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div
              className="transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                  Master Every Captcha
                </span>
              </div>

              <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
                Solve captchas
                <br />
                <span className="text-primary">faster & smarter</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-10">
                Join thousands of users who trust CaptchaⱮaster for lightning-fast,
                reliable captcha solving powered by cutting-edge AI technology.
              </p>

              {/* Feature cards */}
              <div className="space-y-3">
                <FeatureCard
                  icon={Shield}
                  title="Secure & Private"
                  desc="End-to-end encryption keeps your data safe at all times."
                  delay="0.1s"
                />
                <FeatureCard
                  icon={Zap}
                  title="Lightning Fast"
                  desc="Average solve time under 2 seconds with 99.9% accuracy."
                  delay="0.2s"
                />
                <FeatureCard
                  icon={Trophy}
                  title="Proven Results"
                  desc="Trusted by 50,000+ users solving 10M+ captchas daily."
                  delay="0.3s"
                />
              </div>
            </div>
          </div>

          {/* Bottom testimonial / stats */}
          <div
            className="flex items-center gap-6 transition-all duration-700 delay-500 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-background flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">50,000+ users</p>
              <p className="text-xs text-muted-foreground">trust CaptchaⱮaster daily</p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          RIGHT SIDE – Login Form
         ════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative">
        {/* Subtle background glow for right side */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div
          className={`
            w-full max-w-md transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
              <img                 src="/logo.png"
                alt="Logo"
                style={{ width: 40 }}
                
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              Captcha<span className="text-primary">Ɱaster</span>
            </span>
          </div>

          {/* Card */}
          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

            {/* Logo / Header Section */}
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center animate-pulse-glow shadow-lg border border-border/50 overflow-hidden">
                  {step === 'success' ? (
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  ) : (
                    <img                       src="/logo.png"
                      alt="Captcha Master Logo"
                      style={{ width: 80 }}
                      
                      className="w-full h-full object-contain p-2"
                    />
                  )}
                </div>
                <div
                  className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/60 animate-float"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-primary/40 animate-float"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome to Captcha<span className="text-primary">Ɱaster</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {step === 'credentials' && 'Sign in to continue to your dashboard'}
                {step === 'otp' && 'Enter the verification code sent to your email'}
                {step === 'success' && 'Welcome back! Redirecting...'}
              </p>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* ─── Step 1: Credentials ─── */}
            {step === 'credentials' && (
              <form
                onSubmit={handleSubmitCredentials}
                className="space-y-5 relative z-10 animate-in fade-in duration-300"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>{twoFaEnabled ? 'Sending OTP...' : 'Signing in...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            )}

            {/* ─── Step 2: OTP ─── */}
            {step === 'otp' && (
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-6 relative z-10 animate-in fade-in duration-300"
              >
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">Verification Code</Label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all font-semibold text-lg"
                        placeholder="•"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">A code has been sent to {email}</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Expires in</span>
                    <span className={`font-semibold ${timer < 60 ? 'text-destructive' : 'text-primary'}`}>
                      {formatTime(timer)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={resendDisabled || isLoading}
                    onClick={handleResendOtp}
                    className="text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    Resend
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Verify & Sign In</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('credentials')
                    setOtp(['', '', '', '', '', ''])
                    setTimer(300)
                  }}
                  className="w-full h-12 border-border hover:bg-secondary/50 transition-all bg-transparent"
                >
                  Back to Sign In
                </Button>
              </form>
            )}

            {/* ─── Step 3: Success ─── */}
            {step === 'success' && (
              <div className="space-y-6 relative z-10 animate-in fade-in duration-300 py-8 text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Welcome Back!</h2>
                  <p className="text-muted-foreground">
                    {twoFaEnabled ? 'Your login was verified successfully.' : 'You are now signed in.'}
                  </p>
                  <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full animate-pulse"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* Divider */}
            {step === 'credentials' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-4 text-sm text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast.info('Coming Soon', { description: 'Social login is being updated.' })
                    }}
                    className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast.info('Coming Soon', { description: 'Social login is being updated.' })
                    }}
                    className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </>
            )}

            {/* Sign up link */}
            {step === 'credentials' && (
              <p className="text-center text-sm text-muted-foreground mt-6 relative z-10">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Create account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
