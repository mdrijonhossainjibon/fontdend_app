"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from "@/components/landing/footer"
import { Sparkles, Target, Users, Zap, Shield, Globe, Cpu, ChevronDown, User, LogOut, LayoutDashboard, Settings } from "lucide-react"

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

export default function AboutPage() {
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

    return (
        <div className="selection:bg-primary/30 min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
            {/* ── Inline styles ── */}
            <style>{`
              html { scroll-behavior: smooth; }
              ::-webkit-scrollbar { width: 6px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.3); border-radius: 999px; }
            `}</style>

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

            <main className="pt-24 pb-16 sm:pt-32">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-24">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-20 bg-primary/30 rounded-full" />

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
                        Our Mission
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
                        Reclaiming Your <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Digital Time</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        At CaptchaMaster, we believe the internet should be seamless. We're dedicated to eliminating one of the web's most frustrating hurdles through cutting-edge AI technology, so you can focus on what truly matters.
                    </p>
                </section>

                {/* Vision & Values */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700" />
                            <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-3xl">
                                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Target className="text-primary w-8 h-8" />
                                    Our Vision
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Founded in 2024, CaptchaMaster emerged from a simple observation: humans spend an average of 10 seconds on every captcha, totaling millions of hours globally every day.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We envisioned a world where "human verification" happens silently and securely in the background, making the web accessible and efficient for everyone, from individual researchers to enterprise data scientists.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Users, title: "Community Driven", desc: "Built by developers for developers." },
                                { icon: Shield, title: "Privacy First", desc: "Your data never leaves your browser." },
                                { icon: Zap, title: "Infinite Speed", desc: "Solving captchas in under 1s." },
                                { icon: Globe, title: "Global Scale", desc: "Supporting 100+ captcha types." }
                            ].map((value, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-card/30 border border-border/50 hover:border-primary/50 transition-colors group">
                                    <value.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Tech Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-24 bg-primary/5 border-y border-primary/10 overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-full -z-10 pointer-events-none opacity-10">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8">
                            <Cpu className="text-primary w-10 h-10" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Built on Advanced Neural Networks</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-10">
                            Our proprietary V3 Engine utilizes specialized computer vision models trained on millions of samples. Unlike traditional OCR, our AI understands context, identifies patterns, and mimics human interaction patterns to ensure 99.9% pass rates across all major platforms.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {["Neural Nets", "Edge Computing", "Real-time AI", "Zero-trust Auth"].map((tech) => (
                                <span key={tech} className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="px-4 sm:px-6 lg:px-8 py-32 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-8">Join the Master Race of Browsing</h2>
                    <p className="text-lg text-muted-foreground mb-12">
                        Thousands of users are already saving hours every week. It's time to stop checking boxes and start doing more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/extensions">
                            <button className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] hover:scale-105 transition-all">
                                Install Master Extension
                            </button>
                        </Link>
                        <Link to="/api-docs">
                            <button className="px-10 py-4 bg-card border border-border text-foreground font-bold rounded-2xl hover:bg-accent transition-all">
                                Read API Documentation
                            </button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
