"use client"

import { useState, useEffect } from "react"
import { Zap, Shield, Globe, Cpu, Clock, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Average solving time under 2 seconds. Our AI processes captchas faster than ever.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "End-to-end encryption. Your data never leaves our secure servers.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Distributed servers worldwide for minimal latency wherever you are.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Cpu,
    title: "AI Powered",
    description: "Advanced machine learning models trained on millions of captchas.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "99.9% uptime guarantee. We're always online when you need us.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: HeadphonesIcon,
    title: "Priority Support",
    description: "Dedicated support team ready to help you anytime, anywhere.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
]

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("features-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features-section" className="py-16 sm:py-20 lg:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">Why Choose CaptchaⱮaster?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-leading captcha solving with cutting-edge technology and unmatched reliability.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-5 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl ${feature.bg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-6 sm:w-7 h-6 sm:h-7 ${feature.color}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
