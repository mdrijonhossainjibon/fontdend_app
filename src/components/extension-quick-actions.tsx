"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Shield, Zap, Settings2 } from "lucide-react"
import { useNavigate } from 'react-router-dom'
const actions = [
  { label: "Auto Solve", icon: Zap, active: true, color: "bg-green-500", href: null },
  { label: "Services", icon: Shield, active: false, color: "bg-blue-500", href: "/extension/captcha" },
  { label: "Refresh", icon: RefreshCw, active: false, color: "bg-purple-500", href: null },
  { label: "Config", icon: Settings2, active: false, color: "bg-orange-500", href: "/extension/settings" },
]

export function ExtensionQuickActions() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStates, setActiveStates] = useState(actions.map((a) => a.active))
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 450)
    return () => clearTimeout(timer)
  }, [])

  const handleAction = (index: number) => {
    const action = actions[index]
    if (action.href) {
      navigate(action.href)
    } else if (action.label === "Refresh") {
      window.location.reload()
    } else {
      setActiveStates((prev) => prev.map((state, i) => (i === index ? !state : state)))
    }
  }

  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</p>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => handleAction(index)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-300 ${
              activeStates[index] ? "bg-primary/10 border-primary/30" : "bg-card border-border hover:border-primary/20"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeStates[index] ? `${action.color}/20` : "bg-secondary"
              }`}
            >
              <action.icon
                className={`w-4 h-4 transition-colors ${
                  activeStates[index] ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
            <span className="text-[10px] font-medium text-foreground">{action.label}</span>
            {activeStates[index] && <div className="w-1 h-1 rounded-full bg-green-500" />}
          </button>
        ))}
      </div>
    </div>
  )
}

  )
}
