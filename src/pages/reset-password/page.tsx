import { Suspense, useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from '@/components/landing/footer'
import { ResetPasswordForm } from '@/components/reset-password-form'
import { ChevronDown, User, LogOut, LayoutDashboard, Settings } from "lucide-react"

function UserDropdown({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary/50 transition-all border border-transparent hover:border-border/50"
      >
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`}
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-primary/20 bg-background"
        />
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[110]"
          >
            <div className="p-4 border-b border-border/50 bg-secondary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="p-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                <Settings className="w-4 h-4 text-primary" />
                Settings
              </Link>
            </div>
            <div className="p-2 border-t border-border/50">
              <button
                onClick={() => { setIsOpen(false); onLogout() }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResetPasswordContent() {
  const dispatch = useDispatch()
  const { user, loginSuccess } = useSelector((state: RootState) => state.auth)
  const isLoggedIn = !!localStorage.getItem("authToken") || loginSuccess
  const currentUser = user || JSON.parse(localStorage.getItem("user") || "null")

  const [isDark, setIsDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutRequest())
  }

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark) }, [isDark])

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'API Docs', path: '/api-docs' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' },
    { label: 'Login', path: '/auth/login' },
  ]

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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground pt-16">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tighter flex items-center gap-2.5">
            <img src="/logo.png" alt="CaptchaⱮaster" className="w-7 h-7 rounded-lg shadow-lg shadow-amber-500/20" />
            <span className="hidden sm:inline">Captcha<span className="bg-gradient-to-r from-primary via-yellow-400 to-yellow-500 bg-clip-text text-transparent">Ɱaster</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              item.label === 'Login' ? (
                <Link key={item.label} to={item.path} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <Link key={item.label} to={item.path} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground" aria-label="Toggle dark mode">
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            {isLoggedIn ? (
              <UserDropdown user={currentUser} onLogout={handleLogout} />
            ) : (
              <Link to="/auth/signup" className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold text-sm shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get API Key
              </Link>
            )}
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground" aria-label="Menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => (
                <Link key={item.label} to={item.path} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{item.label}</Link>
              ))}
            </div>
          </div>
        )}
      </nav>
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

      <Footer />
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
