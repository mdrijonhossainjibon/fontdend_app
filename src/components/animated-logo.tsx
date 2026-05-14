"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated logo icon */}
      <div className="relative">
        <div
          className={`
            w-10 h-10 rounded-xl bg-primary flex items-center justify-center
            transition-all duration-500 animate-pulse-glow
            ${isHovered ? "scale-110 rotate-12" : ""}
          `}
        >
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        {/* Floating particles */}
        <div
          className={`
            absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/60
            transition-all duration-700 animate-float
            ${isHovered ? "opacity-100" : "opacity-60"}
          `}
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className={`
            absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-primary/40
            transition-all duration-700 animate-float
            ${isHovered ? "opacity-100" : "opacity-40"}
          `}
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Logo text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground tracking-tight">
          Spark<span className="text-primary">AI</span>
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Dashboard</span>
      </div>
    </div>
  )
}
