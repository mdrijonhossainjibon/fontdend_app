"use client"

import { useState, useEffect } from "react"
import { CaptchaServiceCard } from "@/components/captcha-service-card"
import {
  Shield,
  Bot,
  Lock,
  Fingerprint,
  Eye,
  ShieldCheck,
  Search,
  Zap,
  TrendingUp,
  CheckCircle2,
  Settings2,
  LayoutGrid,
  List,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const captchaServices = [
  {
    name: "Google reCAPTCHA",
    description: "Most widely used captcha service",
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#4285F4">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    isPopular: true,
    isActive: true,
    features: ["Invisible mode", "v2 & v3 support", "Free tier available"],
    color: "#4285F4",
  },
  {
    name: "hCaptcha",
    description: "Privacy-focused alternative",
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#00838F">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
    isPopular: true,
    isActive: true,
    features: ["GDPR compliant", "Earn rewards", "Accessibility support"],
    color: "#00838F",
  },
  {
    name: "Cloudflare Turnstile",
    description: "Smart, non-intrusive verification",
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#F38020">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    isPopular: true,
    isActive: false,
    features: ["No puzzles needed", "Privacy-first", "Managed challenge"],
    color: "#F38020",
  },
  {
    name: "FunCaptcha",
    description: "Gamified captcha experience",
    logo: <Bot className="w-6 h-6 text-purple-500" />,
    isPopular: false,
    isActive: false,
    features: ["Interactive games", "High security", "Bot detection"],
    color: "#9333EA",
  },
  {
    name: "GeeTest",
    description: "Behavioral analysis captcha",
    logo: <Fingerprint className="w-6 h-6 text-cyan-500" />,
    isPopular: false,
    isActive: true,
    features: ["AI-powered", "Slide verification", "Risk analysis"],
    color: "#06B6D4",
  },
  {
    name: "KeyCAPTCHA",
    description: "Puzzle-based verification",
    logo: <Lock className="w-6 h-6 text-rose-500" />,
    isPopular: false,
    isActive: false,
    features: ["Custom puzzles", "Brand integration", "Multi-language"],
    color: "#F43F5E",
  },
  {
    name: "MTCaptcha",
    description: "Enterprise-grade solution",
    logo: <Shield className="w-6 h-6 text-indigo-500" />,
    isPopular: false,
    isActive: false,
    features: ["SOC2 compliant", "Custom branding", "Invisible mode"],
    color: "#6366F1",
  },
  {
    name: "Arkose Labs",
    description: "Advanced fraud prevention",
    logo: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    isPopular: false,
    isActive: false,
    features: ["Fraud detection", "Account protection", "Enterprise API"],
    color: "#10B981",
  },
  {
    name: "PerimeterX",
    description: "Bot mitigation platform",
    logo: <Eye className="w-6 h-6 text-amber-500" />,
    isPopular: false,
    isActive: false,
    features: ["Real-time detection", "ML-powered", "API protection"],
    color: "#F59E0B",
  },
]

const stats = [
  {
    label: "Total Solved",
    value: "24,847",
    change: "+12%",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Success Rate",
    value: "98.5%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Avg Speed",
    value: "1.2s",
    change: "-0.3s",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Active Services",
    value: "4",
    change: "of 9",
    icon: Shield,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
]

export function DashboardCaptchaContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<"all" | "active" | "popular">("all")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredServices = captchaServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" ? true : filter === "active" ? service.isActive : filter === "popular" ? service.isPopular : true
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.5s ease-out",
        }}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            Captcha Services
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure and manage your captcha providers for automated solving
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Settings2 className="w-4 h-4" />
          Global Settings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="relative p-4 rounded-2xl bg-card border border-border overflow-hidden group hover:border-primary/30 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${index * 100}ms`,
                transitionDuration: "500ms",
              }}
            >
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <span className={cn("text-xs font-medium px-2 py-1 rounded-full", stat.bgColor, stat.color)}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          )
        })}
      </div>

      {/* Toolbar */}
      <div
        className="flex flex-col sm:flex-row gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "400ms",
          transitionDuration: "500ms",
        }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search captcha services..."
            className="pl-10 bg-card border-border focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border border-border rounded-xl p-1">
            {(["all", "active", "popular"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div
        className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}
      >
        {filteredServices.map((service, index) => (
          <CaptchaServiceCard key={service.name} {...service} animationDelay={500 + index * 80} />
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No services found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Quick Tips */}
      <div
        className="p-4 rounded-2xl bg-primary/5 border border-primary/20"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: "800ms",
          transitionDuration: "500ms",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Pro Tip</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Enable multiple captcha services to maximize success rates. Our AI automatically selects the best solver
              for each captcha type.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
