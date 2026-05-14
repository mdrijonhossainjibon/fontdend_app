"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Settings2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface ExtensionCaptchaCardProps {
  name: string
  description: string
  logo: React.ReactNode
  isPopular?: boolean
  isActive?: boolean
  color: string
  animationDelay?: number
  onToggle?: (name: string, isEnabled: boolean) => void
}

export function ExtensionCaptchaCard({
  name,
  description,
  logo,
  isPopular = false,
  isActive = false,
  color,
  animationDelay = 0,
  onToggle,
}: ExtensionCaptchaCardProps) {
  const [enabled, setEnabled] = useState(isActive)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay)
    return () => clearTimeout(timer)
  }, [animationDelay])

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    onToggle?.(name, checked)
  }

  return (
    <div
      className={`relative p-3 rounded-xl border transition-all duration-300 ${
        enabled ? "bg-primary/5 border-primary/30" : "bg-secondary/30 border-border hover:border-primary/20"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
          Popular
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Logo */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          {logo}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-foreground truncate">{name}</h3>
          <p className="text-[10px] text-muted-foreground truncate">{description}</p>
        </div>

        {/* Toggle */}
        <Switch checked={enabled} onCheckedChange={handleToggle} className="data-[state=checked]:bg-primary shrink-0" />
      </div>

      {/* Active indicator */}
      {enabled && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-primary/20">
          <Check className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-primary font-medium">Auto-solve enabled</span>
          <button className="ml-auto p-1 rounded hover:bg-primary/10 transition-colors">
            <Settings2 className="w-3 h-3 text-muted-foreground hover:text-primary" />
          </button>
        </div>
      )}
    </div>
  )
}
