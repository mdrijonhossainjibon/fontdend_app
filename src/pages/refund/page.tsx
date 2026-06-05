"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from "@/components/landing/footer"
import { RotateCcw, Clock, CreditCard, AlertCircle, CheckCircle2, Mail, ChevronDown, User, LogOut, LayoutDashboard, Settings } from "lucide-react"

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

export default function RefundPage() {
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

    const lastUpdated = "February 09, 2026"

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
                {/* Header Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-16">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-10 bg-primary/20 rounded-full" />
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <RotateCcw className="w-4 h-4" />
                        Fair & Transparent
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Refund Policy</h1>
                    <p className="text-muted-foreground italic">Last updated: {lastUpdated}</p>
                </section>

                {/* Content */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 sm:p-12 shadow-2xl space-y-10">

                        {/* Eligibility */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <CheckCircle2 className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">1. Refund Eligibility</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                We offer refunds under the following conditions:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>You purchased a package within the last 7 days.</li>
                                <li>You have used less than 10% of the purchased credits.</li>
                                <li>The service was unavailable for more than 24 consecutive hours (excluding scheduled maintenance).</li>
                                <li>Duplicate or erroneous charges resulting from a technical error on our platform.</li>
                            </ul>
                        </div>

                        {/* Non-Refundable */}
                        <div className="space-y-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 text-amber-500 mb-2">
                                <AlertCircle className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">2. Non-Refundable Circumstances</h2>
                            </div>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Credits that have already been consumed for captcha solving.</li>
                                <li>Refund requests submitted more than 7 days after the purchase date.</li>
                                <li>Accounts terminated due to violation of our Terms of Service.</li>
                                <li>Change of mind after extensive usage of the service (more than 10% of credits consumed).</li>
                                <li>Subscription renewals unless cancellation was requested before the renewal date.</li>
                            </ul>
                        </div>

                        {/* Processing */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Clock className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">3. Processing Time & Method</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Approved refunds are processed within 5-10 business days. Refunds are issued to the original payment method used during the purchase. Cryptocurrency payments are refunded at the original fiat equivalent at the time of purchase, not at the current exchange rate.
                            </p>
                        </div>

                        {/* How to Request */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Mail className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">4. How to Request a Refund</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                To initiate a refund request, email us at <a href="mailto:support@captchamaster.com" className="text-primary hover:underline font-medium">support@captchamaster.com</a> with the following information:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Your registered email address.</li>
                                <li>The transaction ID or order reference number.</li>
                                <li>The date and amount of the purchase.</li>
                                <li>A brief explanation of why you are requesting a refund.</li>
                            </ul>
                        </div>

                        {/* Chargebacks */}
                        <div className="space-y-4 bg-destructive/5 border border-destructive/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-6 h-6 text-destructive" />
                                <h2 className="text-2xl font-bold">5. Chargebacks</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Filing a chargeback with your payment provider without first contacting us may result in immediate account suspension. We encourage you to reach out to our support team first — we are committed to resolving any issues fairly and promptly.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="text-center pt-8 border-t border-border/50">
                            <p className="text-muted-foreground mb-4">Questions about our refund policy?</p>
                            <a
                                href="mailto:support@captchamaster.com"
                                className="inline-block px-8 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
