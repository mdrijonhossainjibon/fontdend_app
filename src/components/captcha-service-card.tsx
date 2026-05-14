"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, ExternalLink, Settings2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface CaptchaServiceCardProps {
  name: string
  description: string
  logo: React.ReactNode
  isPopular?: boolean
  isActive?: boolean
  features: string[]
  color: string
  animationDelay?: number
}

export function CaptchaServiceCard({
  name,
  description,
  logo,
  isPopular,
  isActive: initialActive = false,
  features,
  color,
  animationDelay = 0,
}: CaptchaServiceCardProps) {
  const [isActive, setIsActive] = useState(initialActive)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay)
    return () => clearTimeout(timer)
  }, [animationDelay])

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-500
        ${isActive ? "border-primary shadow-lg shadow-primary/10" : "border-border hover:border-primary/30"}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        hover:shadow-lg hover:-translate-y-1 group
      `}
    >
      {/* Active indicator glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Popular badge */}
      {isPopular && (
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-0.5">
          <Zap className="w-3 h-3 mr-1" />
          Popular
        </Badge>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
              style={{ backgroundColor: `${color}15` }}
            >
              {logo}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-primary" />
            <span className="text-sm text-muted-foreground">{isActive ? "Enabled" : "Disabled"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
              <Settings2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
