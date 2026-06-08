import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type ResetStep = 'loading' | 'form' | 'success' | 'error'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [step, setStep] = useState<ResetStep>('loading')
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!token) {
      setStep('error')
      setErrorMessage('Invalid reset link')
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password/verify?token=${token}`)
        const data = await response.json()
        if (!response.ok) { setStep('error'); setErrorMessage(data.error || 'Invalid or expired reset link'); return }
        setEmail(data.email)
        setStep('form')
      } catch {
        setStep('error')
        setErrorMessage('Failed to verify reset link')
      }
    }
    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password Too Short', { description: 'Password must be at least 6 characters.' })
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { description: 'Please ensure your passwords are identical.' })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error('Reset Failed', { description: data.error || 'Failed to reset password.' }); setIsLoading(false); return }
      toast.success('Password Reset', { description: 'Your password has been successfully reset!' })
      setStep('success')
      setTimeout(() => navigate('/auth/login'), 3000)
    } catch {
      toast.error('Error', { description: 'An error occurred. Please try again.' })
    } finally { setIsLoading(false) }
  }

  const glassReflection = (
    <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[0.03]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 100%)' }} />
  )

  return (
    <div className="group/card relative overflow-hidden rounded-2xl transition-all duration-500"
      style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)' }}
    >
      {glassReflection}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
      <div className="relative px-6 py-8 sm:px-8 sm:py-10">

        {/* Loading */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Verifying reset link...</p>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Invalid Link</h2>
            <p className="text-sm text-muted-foreground mb-6">{errorMessage || 'This password reset link is invalid or has expired.'}</p>
            <Link to="/auth/forgot-password">
              <Button className="h-12 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 text-slate-900 font-semibold shadow-[0_8px_24px_rgba(212,175,55,0.22)] hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] border-0">
                Request New Link
              </Button>
            </Link>
            <Link to="/auth/login" className="mt-4 text-sm font-medium text-primary/80 hover:text-primary transition-colors no-underline">
              Back to login
            </Link>
          </div>
        )}

        {/* Form */}
        {step === 'form' && (
          <>
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 no-underline">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_8px_32px_rgba(212,175,55,0.15)] ring-1 ring-primary/10 backdrop-blur-sm">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
              <p className="mt-1.5 text-sm text-muted-foreground/80">
                Enter your new password for <strong className="text-foreground">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/90">New Password</Label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-all duration-300 group-focus-within:text-primary" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl border-border bg-card/50 pl-10 pr-10 text-foreground placeholder:text-muted-foreground/40 transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/15" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-transform duration-500 group-focus-within:scale-x-100" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/90">Confirm Password</Label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-all duration-300 group-focus-within:text-primary" />
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12 rounded-xl border-border bg-card/50 pl-10 pr-10 text-foreground placeholder:text-muted-foreground/40 transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/15" required minLength={6} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-transform duration-500 group-focus-within:scale-x-100" />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="group relative h-12 w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 text-sm font-semibold text-slate-900 shadow-[0_8px_24px_rgba(212,175,55,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite' }} />
                {isLoading ? (
                  <div className="relative flex items-center gap-2.5">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center gap-2">
                    <span>Reset Password</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </form>
          </>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="space-y-5 py-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">Password Reset!</h2>
              <p className="text-sm text-muted-foreground/70">Your password has been successfully reset.</p>
              <p className="text-xs text-muted-foreground/50">Redirecting to login...</p>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-border/60">
              <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500" />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
