import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from "@/components/landing/footer"
import { Shield, Lock, Eye, Database, UserCheck, FileText, AlertCircle, Mail, ChevronDown, User, LogOut, LayoutDashboard, Settings } from "lucide-react"

const sections = [
    {
        icon: FileText,
        title: "Information We Collect",
        content: [
            {
                subtitle: "Account Information",
                text: "When you create an account, we collect your email address, name, and password. This information is necessary to provide you with access to our services and to communicate with you about your account."
            },
            {
                subtitle: "Usage Data",
                text: "We automatically collect information about how you interact with our service, including API requests, captcha solving statistics, and feature usage. This helps us improve our service and provide you with better support."
            },
            {
                subtitle: "Payment Information",
                text: "When you make a purchase, our payment processors collect your payment card information. We do not store complete payment card details on our servers."
            },
            {
                subtitle: "Technical Information",
                text: "We collect device information, IP addresses, browser types, and operating system details to ensure security and optimize our service performance."
            }
        ]
    },
    {
        icon: Database,
        title: "How We Use Your Information",
        content: [
            {
                subtitle: "Service Delivery",
                text: "We use your information to provide, maintain, and improve our captcha solving services, process your requests, and manage your account."
            },
            {
                subtitle: "Communication",
                text: "We may send you service-related emails, including account notifications, security alerts, and updates about our services. You can opt out of marketing communications at any time."
            },
            {
                subtitle: "Analytics & Improvement",
                text: "We analyze usage patterns to improve our AI models, enhance user experience, and develop new features that better serve our users."
            },
            {
                subtitle: "Security & Fraud Prevention",
                text: "We use your information to detect and prevent fraud, abuse, and security incidents, and to protect the rights and safety of our users and services."
            }
        ]
    },
    {
        icon: Lock,
        title: "Data Security",
        content: [
            {
                subtitle: "Encryption",
                text: "All data transmitted between your device and our servers is encrypted using industry-standard TLS/SSL protocols. Sensitive data at rest is encrypted using AES-256 encryption."
            },
            {
                subtitle: "Access Controls",
                text: "We implement strict access controls and authentication mechanisms to ensure that only authorized personnel can access user data, and only when necessary for service operations."
            },
            {
                subtitle: "Regular Audits",
                text: "We conduct regular security audits and vulnerability assessments to identify and address potential security risks proactively."
            },
            {
                subtitle: "Incident Response",
                text: "We maintain an incident response plan to quickly address any security breaches and will notify affected users in accordance with applicable laws."
            }
        ]
    },
    {
        icon: Eye,
        title: "Data Sharing & Disclosure",
        content: [
            {
                subtitle: "Third-Party Service Providers",
                text: "We may share your information with trusted third-party service providers who assist us in operating our service, such as payment processors, cloud hosting providers, and analytics services. These providers are contractually obligated to protect your data."
            },
            {
                subtitle: "Legal Requirements",
                text: "We may disclose your information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights or the safety of our users."
            },
            {
                subtitle: "Business Transfers",
                text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership."
            },
            {
                subtitle: "No Selling of Data",
                text: "We do not sell, rent, or trade your personal information to third parties for their marketing purposes."
            }
        ]
    },
    {
        icon: UserCheck,
        title: "Your Rights & Choices",
        content: [
            {
                subtitle: "Access & Portability",
                text: "You have the right to access your personal information and request a copy of your data in a portable format."
            },
            {
                subtitle: "Correction & Update",
                text: "You can update or correct your account information at any time through your account settings or by contacting our support team."
            },
            {
                subtitle: "Deletion",
                text: "You may request deletion of your account and associated data. Please note that some information may be retained for legal or legitimate business purposes."
            },
            {
                subtitle: "Opt-Out",
                text: "You can opt out of marketing communications by clicking the unsubscribe link in our emails or adjusting your notification preferences in your account settings."
            },
            {
                subtitle: "Do Not Track",
                text: "We respect Do Not Track (DNT) browser settings and do not track users across third-party websites."
            }
        ]
    },
    {
        icon: AlertCircle,
        title: "Cookies & Tracking",
        content: [
            {
                subtitle: "Essential Cookies",
                text: "We use essential cookies to enable core functionality such as authentication, security, and session management. These cookies are necessary for the service to function."
            },
            {
                subtitle: "Analytics Cookies",
                text: "We use analytics cookies to understand how users interact with our service. This helps us improve user experience and service performance."
            },
            {
                subtitle: "Cookie Management",
                text: "You can control cookie preferences through your browser settings. Note that disabling essential cookies may affect service functionality."
            }
        ]
    }
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

export default function PrivacyPage() {
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

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-4">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last updated: <span className="text-foreground font-medium">February 8, 2026</span>
                        </p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {sections.map((section, idx) => {
                        const Icon = section.icon
                        return (
                            <section
                                key={idx}
                                className="group relative"
                            >
                                {/* Section Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                            {section.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Section Content */}
                                <div className="ml-16 space-y-6">
                                    {section.content.map((item, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            className="relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                                {item.subtitle}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )
                    })}

                    {/* Data Retention */}
                    <section className="group relative">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                <Database className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                    Data Retention
                                </h2>
                            </div>
                        </div>
                        <div className="ml-16">
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal, regulatory, or legitimate business purposes.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Usage logs and analytics data may be retained in aggregated, anonymized form for statistical analysis and service improvement purposes.
                            </p>
                        </div>
                    </section>

                    {/* International Transfers */}
                    <section className="group relative">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                    International Data Transfers
                                </h2>
                            </div>
                        </div>
                        <div className="ml-16">
                            <p className="text-muted-foreground leading-relaxed">
                                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We ensure that such transfers comply with applicable data protection laws and that your information receives an adequate level of protection through appropriate safeguards.
                            </p>
                        </div>
                    </section>

                    {/* Children's Privacy */}
                    <section className="group relative">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                    Children's Privacy
                                </h2>
                            </div>
                        </div>
                        <div className="ml-16">
                            <p className="text-muted-foreground leading-relaxed">
                                Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will delete such information from our systems.
                            </p>
                        </div>
                    </section>

                    {/* Changes to Policy */}
                    <section className="group relative">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                    Changes to This Policy
                                </h2>
                            </div>
                        </div>
                        <div className="ml-16">
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                            </p>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="relative mt-16">
                        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 sm:p-10 border border-primary/20">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                        Contact Us
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        If you have any questions about this privacy policy or our data practices, please contact us:
                                    </p>
                                </div>
                            </div>

                            <div className="ml-16 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground">Email:</span>
                                    <a
                                        href="mailto:privacy@captchamaster.com"
                                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        privacy@captchamaster.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground">Support:</span>
                                    <a
                                        href="mailto:support@captchamaster.com"
                                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        support@captchamaster.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Compliance Notice */}
                    <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                        <p className="text-sm text-muted-foreground text-center">
                            This privacy policy is designed to comply with GDPR, CCPA, and other applicable data protection regulations.
                            We are committed to protecting your privacy and ensuring transparency in our data practices.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
