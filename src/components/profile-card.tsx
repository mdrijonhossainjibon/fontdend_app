"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Shield, Zap, Crown, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProfileCardProps {
  user?: {
    name: string
    email: string
    phone: string
    location: string
    joinDate: string
    avatar?: string
    plan: "Free" | "Pro" | "Enterprise"
    verified: boolean
    apiKey: string
  }
}

const defaultUser = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "January 2024",
  plan: "Pro" as const,
  verified: true,
  apiKey: "sk-xxxx-xxxx-xxxx-xxxx-xxxx",
}

export function ProfileCard({ user = defaultUser }: ProfileCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPlanIcon = () => {
    switch (user.plan) {
      case "Enterprise":
        return <Crown className="w-4 h-4" />
      case "Pro":
        return <Zap className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPlanColor = () => {
    switch (user.plan) {
      case "Enterprise":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "Pro":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/30 to-accent/20 relative">
          <div className="absolute inset-0 animate-shimmer opacity-40" />
          <div className="absolute -bottom-2 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
        </div>

        {/* Avatar Section */}
        <div className="relative px-6">
          <div className="absolute -top-12 left-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5 animate-pulse-glow">
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
              {user.verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border hover:border-primary/50 hover:bg-primary/5 bg-transparent"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <Badge className={`${getPlanColor()} gap-1`}>
              {getPlanIcon()}
              {user.plan}
            </Badge>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{user.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{user.location}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">Joined {user.joinDate}</span>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  )
}
