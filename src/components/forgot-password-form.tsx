"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Reset Failed', { description: data.error || 'Failed to send reset email.' })
        setIsLoading(false)
        return
      }

      toast.success('Email Sent', { description: 'Password reset email sent! Please check your inbox.' })

      console.log('✅ Password reset email sent')
      setIsSubmitted(true)
      setCountdown(60)
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Error', { description: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Resend Failed', { description: data.error || 'Failed to resend email.' })
        setIsLoading(false)
        return
      }

      toast.success('Email Resent', { description: 'Password reset email resent! Please check your inbox.' })

      console.log('✅ Password reset email resent')
      setCountdown(60)
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Error', { description: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`
        w-full max-w-md transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {/* Card */}
      <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        {/* Back to login link */}
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 relative z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {!isSubmitted ? (
          <>
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center animate-pulse-glow shadow-lg border border-border/50 overflow-hidden">
                  <img                     src="/logo.png"
                    alt="Captcha Master Logo"
                    style={{ width: 80 }}
                    
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                {/* Floating particles */}
                <div
                  className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/60 animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-primary/40 animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
              <p className="text-muted-foreground text-sm mt-1 text-center">
                No worries, we'll send you reset instructions
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Reset Password</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              {/* Success animation rings */}
              <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We sent a password reset link to
              <br />
              <span className="text-foreground font-medium">{email}</span>
            </p>

            {/* Email icon animation */}
            <div className="w-full p-4 bg-secondary/50 rounded-xl mb-6 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Email sent!</p>
                <p className="text-xs text-muted-foreground">Check your inbox and spam folder</p>
              </div>
            </div>

            {/* Resend button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              className="w-full h-12 border-border hover:bg-secondary/50 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : countdown > 0 ? (
                <span className="text-muted-foreground">Resend email in {countdown}s</span>
              ) : (
                <span>Resend email</span>
              )}
            </Button>

            {/* Open email client */}
            <a href="mailto:" className="mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              Open email app
            </a>
          </div>
        )}

        {/* Help link */}
        <p className="text-center text-sm text-muted-foreground mt-6 relative z-10">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
