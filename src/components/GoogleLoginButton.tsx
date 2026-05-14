import { useState, useCallback, type ButtonHTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { notification } from 'antd'
import { API_CALL } from '@/lib/api'

function GoogleSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

interface GoogleLoginButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'type'> {
  label?: string
  compact?: boolean
  card?: boolean
}

export function GoogleLoginButton({
  label = 'Sign in with Google',
  compact = false,
  card = false,
  className = '',
  disabled,
  ...rest
}: GoogleLoginButtonProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        const { response, status } = await API_CALL({
          method: 'POST',
          url: '/api/auth/google',
          body: { access_token: tokenResponse.access_token },
        })
        if (status === 200 && response.token) {
          localStorage.setItem('authToken', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          navigate('/dashboard')
        } else {
          notification.error({
            message: 'Google Login Failed',
            description: response?.error || 'Could not sign in with Google.',
          })
        }
      } catch (error: any) {
        notification.error({
          message: 'Google Login Failed',
          description: error?.message || 'An unexpected error occurred.',
        })
      }
    },
    onError: () => {
      notification.error({
        message: 'Google Login Failed',
        description: 'The Google sign-in popup was closed or failed.',
      })
    },
  })

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      await login()
    } finally {
      setLoading(false)
    }
  }, [login])

  const renderButton = () => (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={[
        'group relative inline-flex items-center justify-center gap-3 overflow-hidden',
        'rounded-xl font-semibold text-slate-900',
        'bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500',
        'shadow-[0_8px_24px_rgba(212,175,55,0.22)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(212,175,55,0.4)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'active:translate-y-0 active:shadow-[0_4px_12px_rgba(212,175,55,0.3)]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_24px_rgba(212,175,55,0.22)]',
        compact ? 'h-11 w-11 sm:h-12 sm:w-auto sm:px-6' : 'h-12 w-full px-6',
        className,
      ].join(' ')}
      aria-label={loading ? 'Signing in with Google...' : label}
      {...rest}
    >
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
      <span className="absolute inset-0 rounded-xl opacity-0 ring-2 ring-yellow-300/50 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      {loading ? (
        <span className="relative flex items-center gap-2.5">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
          <span className={compact ? 'hidden sm:inline' : ''}>Signing in...</span>
        </span>
      ) : (
        <span className="relative flex items-center justify-center gap-2.5">
          <GoogleSVG className="h-5 w-5 shrink-0" />
          <span className={compact ? 'hidden sm:inline' : ''}>{label}</span>
        </span>
      )}
    </button>
  )

  if (card) {
    return (
      <div className="group/card relative overflow-hidden rounded-2xl border dark:border-white/10 border-border/60 dark:bg-[rgba(12,12,18,0.7)] bg-card/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500">
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[0.03] dark:opacity-[0.06]"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 100%)' }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_8px_32px_rgba(212,175,55,0.15)] ring-1 ring-primary/10 backdrop-blur-sm">
              <GoogleSVG className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Continue with Google</h2>
            <p className="mt-1 text-sm text-muted-foreground/80">Sign in to access your dashboard</p>
          </div>
          {renderButton()}
        </div>
      </div>
    )
  }

  return renderButton()
} 
