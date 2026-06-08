"use client"

import { useState, useEffect } from "react"
import { Download, Settings, Zap, CheckCircle, ArrowRight } from "lucide-react"



const steps = [
  {
    title: "Install Extension",
    description: "Download our extension with one click for your preferred browser.",
    icon: <Download className="w-5 h-5" />,
    color: "from-blue-500/20 to-violet-500/20",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/30",
  },
  {
    title: "Configure",
    description: "Personalize your settings and choose which captchas to solve.",
    icon: <Settings className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    glowColor: "shadow-violet-500/30",
  },
  {
    title: "Auto-Solve",
    description: "AI automatically detects and solves captchas instantly.",
    icon: <Zap className="w-5 h-5" />,
    color: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/30",
  },
  {
    title: "Done",
    description: "Browse uninterrupted and save hours of manual work.",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    glowColor: "shadow-green-500/30",
  },
]

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("how-it-works")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
      <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden bg-background">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 text-balance px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              User Guide
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              How It <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
              Follow these simple steps to get started in minutes.
            </p>
          </div>

          {/* Interactive Steps */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="bg-card/30 backdrop-blur-xl border border-border/40 p-6 sm:p-10 rounded-2xl shadow-lg overflow-hidden relative group mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`
                      relative group/step cursor-pointer
                      flex flex-col items-center text-center
                      p-5 rounded-xl border transition-all duration-300
                      ${currentStep >= idx
                        ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-md'
                        : 'bg-card/50 border-border/50 hover:bg-card/80 hover:border-border'
                      }
                    `}
                  >
                    {/* Connector line */}
                    {idx < steps.length - 1 && (
                      <div className={`
                        hidden lg:block absolute top-9 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 transition-colors duration-300
                        ${idx < currentStep ? 'bg-primary/60' : 'bg-border'}
                      `} />
                    )}
                    {/* Step number */}
                    <div className="absolute top-2 right-3 text-xs font-bold text-muted-foreground/30">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    {/* Icon */}
                    <div className={`
                      w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} ${step.borderColor} border
                      flex items-center justify-center transition-all duration-300 mb-4
                      ${currentStep >= idx
                        ? `scale-110 ${step.glowColor} shadow-md`
                        : 'group-hover/step:scale-105'
                      }
                    `}>
                      {step.icon}
                    </div>
                    {/* Title */}
                    <h3 className={`text-base font-semibold mb-1.5 transition-colors duration-300 ${currentStep >= idx ? 'text-primary' : 'text-foreground/80'}`}>
                      {step.title}
                    </h3>
                    {/* Description */}
                    <p className="text-muted-foreground/70 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <button className="px-8 py-3.5 bg-primary/90 hover:bg-primary text-primary-foreground text-base font-semibold rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_30px_-8px_rgba(124,58,237,0.4)] group">
                Get Started Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
              <p className="text-xs text-muted-foreground/80">
                {currentStep === 3
                  ? "You're all set! Experience the power of AI."
                  : `Next up: ${steps[(currentStep + 1) % 4].title}`}
              </p>
            </div>
          </div>
        </div>

      </section>
  )
}
