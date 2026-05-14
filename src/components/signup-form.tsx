
import { GoogleIcon } from '@/components/google-icon'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, User, Check, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { notification } from 'antd'


import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/modules/rootReducer'
import * as authActions from '@/modules/auth/actions'

type SignupStep = 'credentials' | 'otp' | 'success'

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

export function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading: isLoading, registrationSuccess, verificationSuccess, requiresVerification } = useSelector((state: RootState) => state.auth)

  const [step, setStep] = useState<SignupStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(300)
  const [resendDisabled, setResendDisabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    dispatch(authActions.resetAuthState()) // Clear state on mount
    return () => clearTimeout(timer)
  }, [dispatch])

  // Handle Redux Success states
  useEffect(() => {
    if (registrationSuccess) {
      if (requiresVerification) {
        setStep('otp')
        setTimer(300)
        setResendDisabled(true)
      } else {
        setStep('success')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    }
  }, [registrationSuccess, requiresVerification, router])

  useEffect(() => {
    if (verificationSuccess) {
      setStep('success')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }
  }, [verificationSuccess, router])

  // OTP timer countdown
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

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      notification.error({
        message: 'Passwords do not match',
        description: 'Please ensure your passwords are identical.',
      })
      return
    }

    dispatch(authActions.registerRequest({ name, email, password }))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return

    dispatch(authActions.verifyEmailRequest({ email, otp: otpCode }))
  }

  const handleResendOtp = () => {
    setResendDisabled(true)
    setOtp(['', '', '', '', '', ''])
    setTimer(300)
    dispatch(authActions.resendVerificationRequest({ email }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleGoogleSignup = async () => {
    notification.info({
      message: 'Coming Soon',
      description: 'Social signup is being updated.',
    })
  }

  const passwordStrength = passwordRequirements.filter((req) => req.test(password)).length
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  return (
    <div
      className={`
        w-full max-w-md transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Card */}
      <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center animate-pulse-glow shadow-lg border border-border/50 overflow-hidden">
              {step === 'success' ? (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              ) : (
                <img                   src="/logo.png"
                  alt="Captcha Master Logo"
                  style={{ width: 80 }}
                  
                  className="w-full h-full object-contain p-2"
                />
              )}
            </div>
            {/* Floating particles */}
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
            Create your <span className="text-primary">Account</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 'credentials' && 'Start solving captchas in seconds'}
            {step === 'otp' && 'Enter the verification code sent to your email'}
            {step === 'success' && 'Account created successfully!'}
          </p>
        </div>

        {/* Step 1: Credentials */}
        {step === 'credentials' && (
          <form onSubmit={handleSubmitCredentials} className="space-y-4 relative z-10 animate-in fade-in duration-300">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
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

              {/* Password Strength */}
              {password.length > 0 && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength >= level
                          ? passwordStrength <= 1
                            ? 'bg-red-500'
                            : passwordStrength <= 2
                              ? 'bg-orange-500'
                              : passwordStrength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          : 'bg-secondary'
                          }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className={`flex items-center gap-1 text-xs ${req.test(password) ? 'text-green-500' : 'text-muted-foreground'
                          }`}
                      >
                        <Check className={`w-3 h-3 ${req.test(password) ? 'opacity-100' : 'opacity-30'}`} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary transition-all ${confirmPassword.length > 0 && !passwordsMatch ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-tight">
                I agree to the{' '}
                <Link to="#" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !agreeTerms || !passwordsMatch || passwordStrength < 4}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10 animate-in fade-in duration-300">
            {/* OTP Input Fields */}
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
                    placeholder="â€¢"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">A code has been sent to {email}</p>
            </div>

            {/* Timer and Resend */}
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

            {/* Verify Button */}
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
                  <span>Verify & Create Account</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>

            {/* Back Button */}
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
              Back to Sign Up
            </Button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-6 relative z-10 animate-in fade-in duration-300 py-8 text-center">
            <div className="inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
              <p className="text-muted-foreground">Welcome {name}! Your account is ready to use.</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {/* Divider - Only show in credentials step */}
        {step === 'credentials' && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                disabled={isLoading || googleLogin.loading}
                className="h-12 border-border hover:bg-secondary/50 hover:border-primary/30 transition-all bg-transparent disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin mr-2" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 mr-2" />
                    Google
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
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

        {/* Login Link - Only show in credentials step */}
        {step === 'credentials' && (
          <p className="text-center text-sm text-muted-foreground mt-5 relative z-10">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
