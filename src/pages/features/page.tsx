"use client"

import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import {
  Zap,
  Shield,
  Globe,
  Cpu,
  Clock,
  HeadphonesIcon,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Lock,
  Layers,
  RefreshCw,
  Code2,
  Server,
  Eye,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const mainFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Average solving time under 2 seconds. Our AI processes captchas faster than ever.",
    color: "text-primary",
    bg: "bg-primary/10",
    details: [
      "Real-time captcha detection",
      "Parallel processing architecture",
      "Optimized neural networks",
      "Zero queue waiting time",
    ],
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "End-to-end encryption. Your data never leaves our secure servers.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    details: ["AES-256 encryption", "No data logging policy", "GDPR compliant", "SOC 2 certified infrastructure"],
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Distributed servers worldwide for minimal latency wherever you are.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    details: ["50+ server locations", "Auto region selection", "CDN optimized delivery", "< 50ms average latency"],
  },
  {
    icon: Cpu,
    title: "AI Powered",
    description: "Advanced machine learning models trained on millions of captchas.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    details: ["Deep learning algorithms", "Continuous model updates", "99.5% accuracy rate", "Self-improving system"],
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "99.9% uptime guarantee. We're always online when you need us.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    details: ["Redundant infrastructure", "Auto-failover systems", "Real-time monitoring", "Instant incident response"],
  },
  {
    icon: HeadphonesIcon,
    title: "Priority Support",
    description: "Dedicated support team ready to help you anytime, anywhere.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    details: ["24/7 live chat support", "Dedicated account manager", "Technical documentation", "API integration help"],
  },
]

const advancedFeatures = [
  {
    icon: Target,
    title: "Smart Detection",
    description: "Automatically identifies captcha types on any webpage.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your usage, success rates, and performance metrics.",
  },
  {
    icon: Lock,
    title: "Anti-Detection",
    description: "Human-like solving patterns to avoid detection.",
  },
  {
    icon: Layers,
    title: "Multi-Captcha",
    description: "Supports 10+ captcha types including reCAPTCHA, hCaptcha, and more.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Retry",
    description: "Automatic retry on failed attempts with smart backoff.",
  },
  {
    icon: Code2,
    title: "Easy API",
    description: "Simple REST API with SDKs for all major languages.",
  },
  {
    icon: Server,
    title: "Webhook Support",
    description: "Real-time notifications for completed solves.",
  },
  {
    icon: Eye,
    title: "Invisible Mode",
    description: "Solve invisible captchas without user interaction.",
  },
  {
    icon: Fingerprint,
    title: "Browser Fingerprint",
    description: "Advanced fingerprinting to bypass bot detection.",
  },
]

const comparisonData = [
  { feature: "Average Solve Time", sparkai: "< 2 seconds", others: "5-15 seconds" },
  { feature: "Success Rate", sparkai: "99.5%", others: "85-95%" },
  { feature: "Captcha Types Supported", sparkai: "10+", others: "3-5" },
  { feature: "API Response Time", sparkai: "< 100ms", others: "500ms+" },
  { feature: "24/7 Support", sparkai: "Yes", others: "Limited" },
  { feature: "Free Tier", sparkai: "1,000 solves/month", others: "100-500" },
]

export default function FeaturesPage() {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll("[data-animate]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Everything You Need to
              <br />
              <span className="text-primary">Solve Captchas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Industry-leading AI technology, unmatched speed, and enterprise-grade security. Discover why thousands of
              developers choose SparkAI.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/extension">
                <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="main-features" data-animate className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Core Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for performance, designed for developers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`group p-8 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 ${
                  visibleSections["main-features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section id="advanced-features" data-animate className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Advanced
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">More Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-ready tools for serious automation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-500 ${
                  visibleSections["advanced-features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" data-animate className="py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Comparison
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">Why SparkAI Wins</h2>
            <p className="text-xl text-muted-foreground">See how we stack up against the competition.</p>
          </div>

          <div
            className={`bg-card rounded-2xl border border-border overflow-hidden transition-all duration-700 ${
              visibleSections["comparison"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-3 bg-secondary/50 p-4 font-semibold text-foreground">
              <div>Feature</div>
              <div className="text-center text-primary">SparkAI</div>
              <div className="text-center text-muted-foreground">Others</div>
            </div>
            {comparisonData.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 p-4 border-t border-border ${
                  index % 2 === 0 ? "bg-transparent" : "bg-secondary/20"
                }`}
              >
                <div className="text-foreground">{row.feature}</div>
                <div className="text-center font-semibold text-primary">{row.sparkai}</div>
                <div className="text-center text-muted-foreground">{row.others}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20">
            <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust SparkAI for their captcha solving needs.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/extension">
                <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
