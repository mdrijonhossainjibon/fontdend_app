"use client"

import { useState, useEffect } from "react"
import { Tabs } from "antd"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Shield,
  Zap,
  Crown,
  Copy,
  Check,
  Key,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DashboardProfileContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "SparkTech Inc.",
    timezone: "America/Los_Angeles",
    joinDate: "January 2024",
    plan: "Pro" as const,
    verified: true,
    apiKey: "sk-spark-xxxx-xxxx-xxxx-7d4f",
    balance: 0,
    twoFactorEnabled: false,
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    usageWarnings: true,
    weeklyReports: false,
    marketingEmails: false,
    securityAlerts: true,
    apiUpdates: true,
  })

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()

        if (data.success && data.user) {
          // Format join date from createdAt if available
          const joinDate = new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })

          setProfile(prev => ({
            ...prev,
            name: data.user.name || "User",
            email: data.user.email || "",
            balance: data.user.balance || 0,
            joinDate: joinDate,
            // You can add more fields from the API response as needed
          }))
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
    setIsVisible(true)
  }, [])




  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1500)
  }

  const getPlanIcon = () => {
    switch (profile.plan) {

      case "Pro":
        return <Zap className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPlanColor = () => {
    switch (profile.plan) {

      case "Pro":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (

    <div className="p-8 ">
      {/* Header */}
      <div
        className="mb-8"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease-out",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Tabs - Using Ant Design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div
          className="lg:col-span-1"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
            transitionDelay: "200ms",
          }}
        >
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/30 to-accent/20 relative">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
            </div>

            {/* Avatar */}
            <div className="relative px-6">
              <div className="absolute -top-10 left-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5">
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Camera className="w-3 h-3" />
                  </button>
                  {profile.verified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
                      <Shield className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="px-6 pt-14 pb-6">
              <div className="flex items-center gap-2 mb-1">
                {isLoading ? (
                  <div className="h-7 w-32 bg-secondary/50 rounded-lg animate-pulse" />
                ) : (
                  <h2 className="text-xl font-bold text-foreground">{profile.name || "User"}</h2>
                )}
                <Badge className={`${getPlanColor()} gap-1 text-xs`}>
                  {getPlanIcon()}
                  {profile.plan}
                </Badge>
              </div>
              {isLoading ? (
                <div className="h-5 w-48 bg-secondary/50 rounded mb-4 animate-pulse" />
              ) : (
                <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 rounded-xl bg-secondary/50 text-center">
                  {isLoading ? (
                    <div className="h-7 w-16 bg-secondary rounded mx-auto mb-1 animate-pulse" />
                  ) : (
                    <p className="text-lg font-bold text-foreground">${profile.balance.toFixed(2)}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 text-center">
                  <p className="text-lg font-bold text-foreground">99.2%</p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Ant Design Tabs */}
        <div
          className="lg:col-span-2"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
            transitionDelay: "300ms",
          }}
        >
          <Tabs
            defaultActiveKey="profile"
            items={[
              {
                key: "profile",
                label: "Profile",
                children: (
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div className="p-6 rounded-2xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                          disabled={isSaving}
                          className="gap-2"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : isEditing ? (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: "Full Name", value: profile.name, icon: User },
                          { label: "Email Address", value: profile.email, icon: Mail },
                          { label: "Phone Number", value: profile.phone, icon: Phone },
                          { label: "Location", value: profile.location, icon: MapPin },
                          { label: "Company", value: profile.company, icon: Globe },
                          { label: "Timezone", value: profile.timezone, icon: Calendar },
                        ].map((field) => {
                          const Icon = field.icon
                          return (
                            <div key={field.label} className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                  <Icon className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <input
                                  type="text"
                                  value={field.value}
                                  disabled={!isEditing}
                                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 ${isEditing
                                    ? "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    : "bg-secondary/50 border-transparent"
                                    } text-foreground outline-none`}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>


                  </div>
                ),
              },
              {
                key: "security",
                label: "Security",
                children: (
                  <div className="space-y-6">
                    {/* Password */}
                    <div className="p-6 rounded-2xl bg-card border border-border">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Change Password</h3>
                          <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                          <div key={label} className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">{label}</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground outline-none transition-all"
                            />
                          </div>
                        ))}
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                          <Save className="w-4 h-4" />
                          Update Password
                        </Button>
                      </div>
                    </div>

                    {/* 2FA */}
                    <div className="p-6 rounded-2xl bg-card border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-green-500/10">
                            <Shield className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500">Enabled</Badge>
                      </div>
                    </div>


                  </div>
                ),
              },

            ]}
          />
        </div>
      </div>
    </div>

  )
}
