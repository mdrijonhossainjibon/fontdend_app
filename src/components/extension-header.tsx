"use client"

import { useState, useEffect } from "react"
import { Puzzle, Settings, User, Power, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Link } from 'react-router-dom'
export function ExtensionHeader() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header
      className={`px-4 py-3 border-b border-border bg-card transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Puzzle className="w-4 h-4 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">CaptchaSolver</h1>
            <p className="text-[10px] text-muted-foreground">v2.4.1</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50">
            <Power className={`w-3 h-3 ${isEnabled ? "text-green-500" : "text-muted-foreground"}`} />
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              className="scale-75 data-[state=checked]:bg-primary"
            />
          </div>
          <Link to="/extension/captcha">
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground">
              <Shield className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/extension/settings">
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/extension/account">
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
