"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"

interface StatusBoxProps {
  title: string
  value: string
  subValue?: string
  icon: LucideIcon
  variant?: "default" | "warning" | "success"
  progress?: number
  animationDelay?: number
}

export function StatusBox({
  title,
  value,
  subValue,
  icon: Icon,
  variant = "default",
  progress,
  animationDelay = 0,
}: StatusBoxProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay)
    return () => clearTimeout(timer)
  }, [animationDelay])

  useEffect(() => {
    if (progress !== undefined && isVisible) {
      const timer = setTimeout(() => setDisplayProgress(progress), 200)
      return () => clearTimeout(timer)
    }
  }, [progress, isVisible])

  const variantStyles = {
    default: "border-border bg-card hover:border-primary/40",
    warning: "border-amber-200 bg-amber-50/50 hover:border-amber-300",
    success: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300",
  }

  const iconVariantStyles = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-600",
    success: "bg-emerald-100 text-emerald-600",
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border p-4 transition-all duration-500
        ${variantStyles[variant]}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1
        group cursor-pointer
      `}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-card-foreground tracking-tight">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
            transition-transform duration-300 group-hover:scale-110
            ${iconVariantStyles[variant]}
          `}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-3 relative">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`
                h-full rounded-full transition-all duration-1000 ease-out
                ${variant === "warning" ? "bg-amber-400" : variant === "success" ? "bg-emerald-400" : "bg-primary"}
              `}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
