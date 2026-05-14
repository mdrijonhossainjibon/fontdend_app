"use client"

import { CaptchaServiceCard } from "./captcha-service-card"
import { Shield, Bot, Lock, Fingerprint, Eye, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
    isActive: false,
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
    isActive: false,
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

export function CaptchaSettings() {
  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Captcha Services
          </h2>
          <p className="text-muted-foreground mt-1">Configure and manage your captcha providers for bot protection</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="pl-9 bg-card border-border focus:border-primary" />
        </div>
      </div>

      {/* Popular Services Label */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Popular Services</span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {captchaServices.map((service, index) => (
          <CaptchaServiceCard key={service.name} {...service} animationDelay={index * 80} />
        ))}
      </div>
    </section>
  )
}
