"use client"

import { useState, useEffect } from "react"
import { Check, Zap, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PricingCardProps {
  plan: {
    name: string
    price: string
    period: string
    description: string
    features: string[]
    highlighted?: boolean
    icon: "free" | "pro" | "enterprise"
    cta: string
  }
  index: number
}

export function PricingCard({ plan, index }: PricingCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 + index * 150)
    return () => clearTimeout(timer)
  }, [index])

  const getIcon = () => {
    switch (plan.icon) {
      case "enterprise":
        return <Crown className="w-6 h-6" />
      case "pro":
        return <Zap className="w-6 h-6" />
      default:
        return <Sparkles className="w-6 h-6" />
    }
  }

  return (
    <div
      className={`
        relative transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}

      <div
        className={`
          relative h-full bg-card border rounded-2xl overflow-hidden transition-all duration-300
          ${
            plan.highlighted
              ? "border-primary shadow-xl shadow-primary/10 scale-105"
              : "border-border hover:border-primary/50 hover:shadow-lg"
          }
          ${isHovered && !plan.highlighted ? "scale-[1.02]" : ""}
        `}
      >
        {/* Glow Effect for highlighted */}
        {plan.highlighted && (
          <>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          </>
        )}

        {/* Card Content */}
        <div className="relative p-6 lg:p-8">
          {/* Icon & Plan Name */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${plan.highlighted ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}
              `}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6 mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl lg:text-5xl font-bold text-foreground">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className={`
              w-full h-12 text-base font-semibold transition-all duration-300
              ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                  : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
              }
            `}
          >
            {plan.cta}
          </Button>

          {/* Divider */}
          <div className="my-6 h-px bg-border" />

          {/* Features */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">What&apos;s included:</p>
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${plan.highlighted ? "bg-primary/20 text-primary" : "bg-secondary text-primary"}
                    `}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shimmer Effect */}
        {plan.highlighted && <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none" />}
      </div>
    </div>
  )
}
