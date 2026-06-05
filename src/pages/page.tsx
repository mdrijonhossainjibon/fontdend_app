import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useGoogleOneTapLogin } from "@react-oauth/google"
import {
  Shield,
  Zap,
  Activity,
  Globe,
  Layers,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  Star,
  Users,
  MessageSquare,
  ArrowUpRight,
  User,
  LogOut,
  LayoutDashboard,
  Settings
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from "@/components/landing/footer"

/* ── Data ── */
const stats = [
  { label: "Solved Captchas", value: 284763921, suffix: "+", icon: <CheckCircle2 className="w-4 h-4" /> },
  { label: "Success Rate", value: 99.92, suffix: "%", icon: <Activity className="w-4 h-4" /> },
  { label: "Active Users", value: 18940, suffix: "+", icon: <Users className="w-4 h-4" /> },
  { label: "API Requests / Day", value: 742000000, suffix: "+", icon: <Zap className="w-4 h-4" /> },
]

const features = [
  {
    title: "AI Powered Solving",
    text: "Neural networks trained on millions of samples for near-perfect accuracy.",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    title: "Ultra Fast API",
    text: "Global edge network ensuring sub-500ms response times worldwide.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Browser Automation",
    text: "Seamless integration with Puppeteer, Playwright, and Selenium.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "Multi Support",
    text: "Support for reCAPTCHA, hCaptcha, FunCaptcha, and GeeTest.",
    icon: <Layers className="h-6 w-6" />,
  },
  {
    title: "Real-time Analytics",
    text: "Deep insights into your solving patterns and cost efficiency.",
    icon: <Activity className="h-6 w-6" />,
  },
  {
    title: "Secure Infrastructure",
    text: "Military-grade encryption and isolated processing environments.",
    icon: <Shield className="h-6 w-6" />,
  },
]

const steps = [
  {
    n: "01",
    title: "Connect API",
    text: "Grab your API key and integrate with just 3 lines of code.",
    icon: <Cpu className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-600"
  },
  {
    n: "02",
    title: "Send CAPTCHA",
    text: "Post your challenge data to our lightning-fast endpoints.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-amber-400 to-orange-500"
  },
  {
    n: "03",
    title: "Receive Solution",
    text: "Get a verified solution in real-time, ready for submission.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "from-emerald-400 to-teal-500"
  },
]

const faqs = [
  { q: "How fast is CaptchaⱮaster?", a: "Our AI engine typically solves challenges in 200ms to 600ms, depending on the complexity of the CAPTCHA type." },
  { q: "Is it safe for my account?", a: "Yes. We use advanced human-emulation patterns and clean residential IP rotations to ensure maximum security." },
  { q: "What CAPTCHA types do you support?", a: "We support reCAPTCHA (v2/v3/Enterprise), hCaptcha, FunCaptcha, GeeTest, Cloudflare Turnstile, and standard image captchas." },
  { q: "Do you offer enterprise custom pricing?", a: "Absolutely. Contact our sales team for high-volume discounts and dedicated infrastructure options." },
]

const testimonials = [
  {
    name: "Alex Rivers",
    role: "DevOps at FinTech",
    text: "Integration was seamless. We reduced our failed login cycles by 80% within the first week.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    name: "Sarah Chen",
    role: "E-com Architect",
    text: "The speed is unbeatable. 300ms average response time is insane for the price point.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Marcus Thorne",
    role: "Security Engineer",
    text: "Most reliable solution on the market. Their enterprise SLA gives us peace of mind for our massive loads.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
  },
]


/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start: number | null = null
    const duration = 2000
    const raf = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setCount(value % 1 !== 0 ? +(p * value).toFixed(2) : Math.floor(p * value))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [value])

  return <span>{count.toLocaleString()}{suffix}</span>
}

/* ── ScrollReveal ── */
function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  )
}

/* ── User Dropdown ── */
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

/* ── Page ── */
export default function LandingPage() {
  const dispatch = useDispatch()
  const { user, loginSuccess } = useSelector((state: RootState) => state.auth)
  const isLoggedIn = !!localStorage.getItem("authToken") || loginSuccess
  const currentUser = user || JSON.parse(localStorage.getItem("user") || "null")

  const [isDark, setIsDark] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutRequest())
  }

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark) }, [isDark])

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      }).then((r) => r.json()).then((d) => {
        if (d.success) {
          localStorage.setItem("authToken", d.token)
          localStorage.setItem("user", JSON.stringify(d.user))
          window.location.href = "/dashboard"
        }
      })
    },
    onError: () => console.error("Google One Tap failed"),
    disabled: isLoggedIn,
    cancel_on_tap_outside: false,
  })

  const navItems = ["Features", "How it works", "Extensions", "FAQ"]

  return (
    <div className="selection:bg-primary/30 min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      {/* ── Inline styles ── */}
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.3); border-radius: 999px; }
      `}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 dark:bg-yellow-600/5 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-primary/5 dark:bg-primary/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tighter flex items-center gap-2.5">
            <img src="/logo.png" alt="CaptchaⱮaster" className="w-7 h-7 rounded-lg shadow-lg shadow-amber-500/20" />
            <span className="hidden sm:inline">Captcha<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Ɱaster</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-primary transition-colors">
                {item}
              </a>
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
              <>
                <Link to="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/auth/signup" className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold text-sm shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Sign Up
                </Link>
              </>
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
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{item}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* ════════════════════════════════════
           HERO
           ════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-5">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" /></span>
              Next-Gen Automation
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
              Automate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">CAPTCHA</span> <br />
              Solving.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed mx-auto">
              The world's most powerful AI-driven CAPTCHA bypass engine. Built for developers who demand speed, reliability, and extreme accuracy at scale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth/signup" className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(240,185,11,0.4)] hover:scale-[1.05] active:scale-[0.98]">
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                Start Solving Now
              </Link>
              <a href="#features" className="px-10 py-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all font-bold text-sm">
                View Features
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* ════════════════════════════════════
           STATS
           ════════════════════════════════════ */}
        <section className="border-y border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-xl md:text-3xl font-black mb-1">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
           FEATURES
           ════════════════════════════════════ */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-3">Cutting-Edge Features</h2>
              <p className="text-sm text-muted-foreground">Everything you need to bypass verification at any scale. Built by engineers, for engineers.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title}>
                <div className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:bg-card transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">{f.icon}</div>
                  <div className="w-10 h-10 bg-gradient-to-tr from-primary to-yellow-500 rounded-xl flex items-center justify-center text-primary-foreground mb-3 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
                  <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-primary to-yellow-500 group-hover:w-full transition-all duration-700" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
           HOW IT WORKS
           ════════════════════════════════════ */}
        <section id="how-it-works" className="bg-foreground text-background py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(240,185,11,0.08),transparent_70%)]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />

              {steps.map((step, idx) => (
                <ScrollReveal key={step.n} className="z-10">
                  <div className="relative group flex flex-col items-center text-center">
                    {/* Background Number */}
                    <div className="text-[10rem] font-black absolute -top-20 text-foreground/5 select-none group-hover:text-primary/10 transition-colors duration-700">
                      {step.n}
                    </div>

                    <div className="relative">
                      {/* Icon Circle */}
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${step.color} flex items-center justify-center mb-8 shadow-2xl shadow-black/20 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative`}>
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative text-white">
                          {step.icon}
                        </div>
                        {/* Step Badge */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] font-black text-foreground">
                          {idx + 1}
                        </div>
                      </div>

                      <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-foreground/50 text-xs leading-relaxed max-w-[200px] font-medium uppercase tracking-tighter">
                        {step.text}
                      </p>

                      {/* Action Button */}
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                          Explore Docs <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
           EXTENSIONS
           ════════════════════════════════════ */}
        <section id="extensions" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-3">Powerful Extensions</h2>
              <p className="text-sm text-muted-foreground">Seamlessly integrate CaptchaⱮaster into your favorite tools and workflows.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Chrome Extension", desc: "Auto-solve CAPTCHAs in your browser with one click.", color: "from-blue-500 to-cyan-400", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg> },
              { name: "API Integration", desc: "Simple REST API for custom applications and scripts.", color: "from-primary to-yellow-400", icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg> },
              { name: "Browser Automation", desc: "Built-in support for Puppeteer, Playwright, and Selenium.", color: "from-purple-500 to-pink-400", icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg> },
            ].map((ext) => (
              <ScrollReveal key={ext.name}>
                <div className="group relative rounded-3xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:bg-card transition-all duration-500 overflow-hidden">
                  <div className={`w-12 h-12 bg-gradient-to-tr ${ext.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>{ext.icon}</div>
                  <h3 className="text-sm font-bold mb-1.5">{ext.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{ext.desc}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    Learn More
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border/50 bg-card/50 px-8 py-4 max-w-lg mx-auto">
              {[{ val: "50K+", label: "Downloads" }, { val: "4.9★", label: "Rating" }, { val: "Weekly", label: "Updates" }].map((x, i) => (
                <div key={x.label} className={`flex items-center gap-6 ${i > 0 ? "pl-6 border-l border-border/50" : ""}`}>
                  <div className="text-center"><div className="text-2xl font-black text-primary">{x.val}</div><div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{x.label}</div></div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ════════════════════════════════════
           TESTIMONIALS
           ════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                <div className="max-w-xl">
                  <h2 className="text-2xl md:text-4xl font-black mb-3">Loved by Product Teams</h2>
                  <p className="text-xs text-muted-foreground">Join thousands of companies automating their workflows with CaptchaⱮaster.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-xl border border-border/50 bg-card/50 px-4 py-3">
                    <div className="text-primary text-lg font-bold tracking-tight">4.9/5</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground">User Rating</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <ScrollReveal key={t.name}>
                  <div className="relative rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:bg-card transition-all duration-500 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex gap-0.5 text-primary mb-4 text-xs">{Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}</div>
                    <p className="text-xs italic mb-4 text-muted-foreground leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full border border-primary/20 object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
                      />
                      <div>
                        <div className="font-bold text-xs">{t.name}</div>
                        <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
           FAQ
           ════════════════════════════════════ */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <ScrollReveal>
            <h2 className="text-2xl md:text-4xl font-black text-center mb-14">Got Questions?</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <ScrollReveal key={i}>
                <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-300 hover:border-primary/20">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors">
                    <span className="text-base font-bold">{f.q}</span>
                    <div className={`w-8 h-8 rounded-full border border-border/50 flex items-center justify-center shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">{f.a}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
           FINAL CTA
           ════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
          <ScrollReveal>
            <div className="relative rounded-[4rem] border border-primary/20 bg-card/50 backdrop-blur-sm p-10 md:p-20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(240,185,11,0.08),transparent_70%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                  Ready to break <br />
                  <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent italic">the limits?</span>
                </h2>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join 18,000+ developers automating their way to the top. No credit card required to start.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/auth/signup" className="px-8 py-3.5 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-sm hover:scale-105 transition-transform hover:shadow-[0_0_50px_rgba(240,185,11,0.4)]">
                    Create Account
                  </Link>
                  <span className="px-8 py-3.5 rounded-3xl border border-border bg-card/50 font-bold text-sm cursor-default">
                    Talk to Sales
                  </span>
                </div>
                <div className="mt-8 text-xs text-muted-foreground font-bold uppercase tracking-widest flex flex-wrap items-center justify-center gap-6">
                  <span className="flex items-center gap-2">✓ 50 Free credits</span>
                  <span className="flex items-center gap-2">✓ No KYC</span>
                  <span className="flex items-center gap-2">✓ Instant API</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  )
}
