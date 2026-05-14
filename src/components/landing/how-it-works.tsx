"use client"

import { useState, useEffect } from "react"
import { Download, Settings, Zap, CheckCircle, ArrowRight } from "lucide-react"
import { Steps, ConfigProvider, theme } from "antd"



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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7c3aed",
          borderRadius: 12,
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
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

          {/* Ant Design Steps - Interactive */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="bg-card/30 backdrop-blur-xl border border-border/40 p-6 sm:p-10 rounded-2xl shadow-lg overflow-hidden relative group mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <Steps
                direction="horizontal"
                size="small"
                current={currentStep}
                onChange={(c) => setCurrentStep(c)}
                responsive={true}
                items={steps.map((step, idx) => ({
                  title: (
                    <div className={`text-base font-semibold mb-1.5 transition-colors duration-300 ${currentStep === idx ? 'text-primary' : 'text-foreground/80'}`}>
                      {step.title}
                    </div>
                  ),
                  description: (
                    <div className="text-muted-foreground/70 leading-relaxed text-sm max-w-[180px]">
                      {step.description}
                    </div>
                  ),
                  icon: (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} ${step.borderColor} border flex items-center justify-center transition-all duration-300 ${currentStep === idx
                        ? `scale-105 ${step.glowColor} shadow-md`
                        : 'scale-100 hover:scale-105 hover:bg-primary/10'
                      }`}>
                      {step.icon}
                    </div>
                  ),
                }))}
                className="custom-steps cursor-pointer"
              />
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

        <style jsx global>{`
          .custom-steps .ant-steps-item-title {
            padding-right: 24px !important;
          }
          .custom-steps .ant-steps-item-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .custom-steps .ant-steps-item-icon {
            margin-bottom: 16px !important;
            margin-inline-start: 0 !important;
            float: none !important;
          }
          .custom-steps .ant-steps-item-content {
            display: block !important;
            min-height: auto !important;
          }
          .custom-steps .ant-steps-item-tail {
            top: 20px !important;
            padding: 0 20px !important;
          }
          .custom-steps .ant-steps-item-tail::after {
            background-color: rgba(124, 58, 237, 0.2) !important;
            height: 2px !important;
          }
          .custom-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
            background-color: #7c3aed !important;
          }
          
          @media (max-width: 768px) {
            .custom-steps .ant-steps-item-container {
              align-items: center;
              text-align: center;
            }
            .custom-steps .ant-steps-item-icon {
              margin-inline-end: 0 !important;
            }
            .custom-steps .ant-steps-item-tail {
              display: none !important;
            }
            .custom-steps .ant-steps-item {
              margin-bottom: 32px;
            }
          }
        `}</style>
      </section>
    </ConfigProvider>
  )
}
