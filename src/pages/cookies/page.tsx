"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from "@/components/landing/footer"
import { Cookie, ShieldCheck, Settings2, BarChart3, Info, ChevronDown, User, LogOut, LayoutDashboard, Settings } from "lucide-react"

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

export default function CookiesPage() {
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

    const cookieTypes = [
        {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
            title: "Essential Cookies",
            description: "These are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or logging in.",
            status: "Always Active"
        },
        {
            icon: <Settings2 className="w-6 h-6 text-blue-500" />,
            title: "Functional Cookies",
            description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.",
            status: "Optional"
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
            title: "Performance Cookies",
            description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.",
            status: "Optional"
        }
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
                {/* Header Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-16">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-10 bg-primary/20 rounded-full" />
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Cookie className="w-4 h-4" />
                        Privacy Matters
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Cookie Policy</h1>
                    <p className="text-muted-foreground italic">Transparency about how we use your data. Last updated: {lastUpdated}</p>
                </section>

                {/* Introduction */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
                    <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 flex items-start gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Info className="text-primary w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">How we use cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                CaptchaMaster uses cookies to improve your browsing experience. Some cookies are necessary for the service to function, while others help us understand how you interact with our extension and website. Below is a detailed breakdown of the cookies we use.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Cookie Types Grid */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
                    {cookieTypes.map((type, idx) => (
                        <div key={idx} className="group relative bg-card/20 hover:bg-card/40 border border-border/50 hover:border-primary/30 rounded-3xl p-8 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0 shadow-inner">
                                        {type.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{type.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${type.status === 'Always Active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'bg-primary/10 text-primary border border-primary/20'
                                        }`}>
                                        {type.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Manage Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-20 text-center">
                    <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-background border border-border/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                        <h2 className="text-3xl font-bold mb-6">Take Control of Your Privacy</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            You can manage your cookie preferences at any time through your browser settings. Disabling certain cookies may impact the performance of our automated solving engine.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => { document.cookie = 'cookie_consent=all; max-age=31536000; path=/'; alert('All cookies accepted. You can manage preferences in your browser settings.'); }}
                                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:scale-105 transition-all"
                            >
                                Accept All Cookies
                            </button>
                            <button
                                onClick={() => { document.cookie = 'cookie_consent=necessary; max-age=31536000; path=/'; alert('Only strictly necessary cookies enabled.'); }}
                                className="px-8 py-4 bg-background border border-border text-foreground font-bold rounded-2xl hover:bg-accent transition-all"
                            >
                                Strictly Necessary Only
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
