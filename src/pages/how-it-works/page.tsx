"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/landing/footer"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import {
  Download,
  Settings,
  Zap,
  CheckCircle,
  Shield,
  Clock,
  ChevronDown,
  ArrowRight,
  Sparkles,
  MousePointer,
  Eye,
  Bot,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react"
import { ChromeIcon } from "@/components/chrome-icon"
import YouTubeEmbed from "@/components/YouTubeEmbed"

const mainSteps = [
  {
    icon: Download,
    title: "Install Extension",
    description: "Download and install our Chrome extension from the Chrome Web Store with just one click.",
    details: [
      "Click 'Add to Chrome' button",
      "Confirm installation permission",
      "Extension icon appears in toolbar",
      "No signup required to start",
    ],
    image: "/chrome-extension-install.jpg",
  },
  {
    icon: Settings,
    title: "Configure Settings",
    description: "Customize your preferences for automatic captcha detection and solving behavior.",
    details: [
      "Choose captcha types to solve",
      "Set auto-solve or manual mode",
      "Configure site whitelist/blacklist",
      "Adjust solving speed preferences",
    ],
    image: "/settings-dashboard-interface.jpg",
  },
  {
    icon: Zap,
    title: "Auto-Solve Captchas",
    description: "Our AI automatically detects captchas on any website and solves them in seconds.",
    details: [
      "AI detects captcha presence",
      "Analyzes captcha type",
      "Solves using trained models",
      "Submits solution automatically",
    ],
    image: "/ai-solving-captcha-automation.jpg",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Seamless Browsing",
    description: "Continue your browsing without interruptions. All captchas handled automatically.",
    details: ["No more manual solving", "Works on all websites", "Track stats in dashboard", "Save hours every week"],
    image: "/happy-user-browsing-computer.jpg",
  },
]

const howItWorksDetails = [
  {
    icon: Eye,
    title: "Detection",
    description: "Our extension continuously monitors pages for captcha elements using advanced pattern recognition.",
  },
  {
    icon: Bot,
    title: "AI Processing",
    description: "Detected captchas are analyzed by our AI models trained on millions of captcha samples.",
  },
  {
    icon: MousePointer,
    title: "Solution",
    description: "The AI generates accurate solutions and automatically fills them into the captcha form.",
  },
  {
    icon: CheckCircle,
    title: "Verification",
    description: "Solution is submitted and verified. If needed, retry logic handles edge cases.",
  },
]

const faqs = [
  {
    question: "Is it safe to use?",
    answer:
      "Yes, absolutely. Our extension only interacts with captcha elements and never collects or stores your personal data. All processing is done securely.",
  },
  {
    question: "Which captcha types are supported?",
    answer:
      "We support reCAPTCHA v2 & v3, hCaptcha, Cloudflare Turnstile, FunCaptcha, GeeTest, and many more. New types are added regularly.",
  },
  {
    question: "How fast is the solving?",
    answer:
      "Most captchas are solved in under 3 seconds. Complex image-based captchas may take up to 10 seconds depending on type.",
  },
  {
    question: "Do I need an account?",
    answer:
      "The free tier allows 50 solves per day without signup. For unlimited usage and premium features, create a free account.",
  },
  {
    question: "What happens if a solve fails?",
    answer:
      "Our system automatically retries failed attempts up to 3 times. With 99.9% accuracy, failures are extremely rare.",
  },
]

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

export default function HowItWorksPage() {
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

  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="selection:bg-primary/30 min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              How It Works
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Solving Captchas Made
              <span className="text-primary"> Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Learn how our AI-powered extension automatically detects and solves captchas, saving you time and
              frustration.
            </p>

            {/* YouTube video */}
            <div
              className={`max-w-4xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <YouTubeEmbed videoId="dQw4w9WgXcQ" title="How CaptchaMaster Works" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Steps Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">4 Simple Steps</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our easy setup process
            </p>
          </div>

          <div className="space-y-24">
            {mainSteps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-lg text-muted-foreground">{step.description}</p>

                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="rounded-2xl overflow-hidden border border-border bg-card p-2">
                    <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-full h-auto rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Process */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Under The Hood
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">How Our AI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A closer look at the technology powering instant captcha solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksDetails.map((item, index) => (
              <div key={item.title} className="relative">
                {/* Connector line */}
                {index < howItWorksDetails.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border z-0">
                    <ArrowRight className="absolute right-0 -top-2 w-4 h-4 text-primary" />
                  </div>
                )}

                <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs text-primary font-medium mb-2">Step {index + 1}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-foreground mb-6">Built for Speed & Reliability</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our infrastructure is designed to handle millions of captcha requests with industry-leading accuracy and
                speed.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{"< 3s Average"}</h4>
                    <p className="text-sm text-muted-foreground">Lightning fast solving time</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">99.9% Accuracy</h4>
                    <p className="text-sm text-muted-foreground">Industry leading success rate</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ChromeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Works Everywhere</h4>
                    <p className="text-sm text-muted-foreground">All major browsers supported</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">AI Powered</h4>
                    <p className="text-sm text-muted-foreground">Constantly learning & improving</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <img src="/dashboard-analytics-stats.jpg" alt="Dashboard" className="w-full h-auto" />
              </div>
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-card border border-border shadow-lg">
                <div className="text-2xl font-bold text-primary">50M+</div>
                <div className="text-sm text-muted-foreground">Captchas Solved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQs
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about our service</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who save hours every week with automatic captcha solving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/extensions">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                <Download className="w-5 h-5" />
                Install Extension
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
