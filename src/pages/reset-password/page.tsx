import { Suspense, useEffect, useRef, useState } from 'react'
import { ResetPasswordForm } from '@/components/reset-password-form'

function ResetPasswordContent() {
  const particleContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const container = particleContainerRef.current
    if (!container) return
    const frag = document.createDocumentFragment()
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div')
      const size = 2 + Math.random() * 3
      p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;animation:float-up ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 8}s infinite;opacity:0.35;pointer-events:none;border-radius:50%;background:rgba(240,185,11,0.5);`
      frag.appendChild(p)
    }
    container.appendChild(frag)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-yellow-500/[0.04] blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/[0.03] blur-[100px] animate-pulse [animation-delay:1s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-yellow-500/[0.02] blur-[90px] animate-pulse [animation-delay:2s]" />

      {/* Particles */}
      <div ref={particleContainerRef} className="pointer-events-none absolute inset-0 z-0" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <div
          className="w-full max-w-md transition-all duration-700"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)' }}
        >
          {/* Logo above card */}
          <div className="mb-8 text-center">
            <div className="mb-1 inline-flex items-center gap-2.5 justify-center">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="CaptchaⱮaster" className="w-full h-full object-contain p-1.5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">Captcha</span>
              <span className="text-2xl font-bold tracking-tight text-yellow-400">Ɱ</span>
              <span className="text-2xl font-bold tracking-tight text-yellow-400">aster</span>
            </div>
            <p className="text-xs text-gray-400 tracking-widest uppercase">Enterprise CAPTCHA Platform</p>
          </div>

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-[0_20px_60px_rgba(0,0,0,0.08),_0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-sm bg-card/80">
            <ResetPasswordForm />
          </div>

          {/* Shadow behind */}
          <div className="mx-auto -mt-6 h-12 w-3/4 rounded-full blur-[60px]" style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.08), transparent)' }} />

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground/40">
            &copy; 2026 CaptchaⱮaster. All rights reserved.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
