"use client"

import { useState } from "react"
import { PricingCard } from "./pricing-card"
import { PricingToggle } from "./pricing-toggle"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    description: "For getting started",
    icon: "free" as const,
    cta: "Get Started Free",
    features: [
      "100 captcha solves/day",
      "reCAPTCHA v2 support",
      "Basic API access",
      "Community support",
      "99% uptime SLA",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "month",
    description: "For growing businesses",
    icon: "pro" as const,
    cta: "Start Pro Trial",
    highlighted: true,
    features: [
      "10,000 captcha solves/day",
      "All captcha types supported",
      "Priority API access",
      "24/7 email support",
      "99.9% uptime SLA",
      "Advanced analytics",
      "Webhook integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "month",
    description: "For large scale operations",
    icon: "enterprise" as const,
    cta: "Contact Sales",
    features: [
      "Unlimited captcha solves",
      "All captcha types supported",
      "Dedicated API endpoints",
      "24/7 priority support",
      "99.99% uptime SLA",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment",
    ],
  },
]

const annualPlans = plans.map((plan) => ({
  ...plan,
  price: plan.price === "$0" ? "$0" : plan.price === "$29" ? "$23" : "$79",
  period: "month",
}))

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const currentPlans = isAnnual ? annualPlans : plans

  return (
    <section className="py-16 lg:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Choose the perfect plan for your needs. Scale as you grow with our flexible pricing options.
        </p>

        {/* Toggle */}
        <div className="mt-8">
          <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {currentPlans.map((plan, index) => (
          <PricingCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Need a custom solution?{" "}
          <a href="#" className="text-primary font-semibold hover:underline">
            Contact our sales team
          </a>
        </p>
      </div>
    </section>
  )
}
