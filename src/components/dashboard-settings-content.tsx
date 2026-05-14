"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Settings,
  Palette,
  Globe,
  Code,
  Monitor,
  Moon,
  Sun,
  RefreshCw,
  Save,
  Puzzle,
  Timer,
  Shield,
  Eye,
  Database,
  Trash2,
  Download,
  Upload,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const themeOptions = [
  { label: "Light", icon: Sun, value: "light" },
  { label: "Dark", icon: Moon, value: "dark" },
  { label: "System", icon: Monitor, value: "system" },
]

const languageOptions = [
  { label: "English", value: "en", flag: "🇺🇸" },
  { label: "Spanish", value: "es", flag: "🇪🇸" },
  { label: "French", value: "fr", flag: "🇫🇷" },
  { label: "German", value: "de", flag: "🇩🇪" },
  { label: "Japanese", value: "ja", flag: "🇯🇵" },
  { label: "Chinese", value: "zh", flag: "🇨🇳" },
]

const timeoutOptions = [
  { label: "30 seconds", value: 30 },
  { label: "60 seconds", value: 60 },
  { label: "90 seconds", value: 90 },
  { label: "120 seconds", value: 120 },
]

const tabs = ["General", "Captcha", "API", "Data"]

export function DashboardSettingsContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("General")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [timeout, setTimeout] = useState(60)

  const [settings, setSettings] = useState({
    // General
    autoStart: true,
    soundEffects: false,
    desktopNotifications: true,
    minimizeToTray: true,
    // Captcha
    autoSolve: true,
    turboMode: false,
    priorityQueue: true,
    retryOnFail: true,
    maxRetries: 3,
    // API
    rateLimiting: true,
    webhookEnabled: false,
    loggingEnabled: true,
    debugMode: false,
    // Privacy
    anonymousUsage: true,
    shareAnalytics: false,
    clearOnExit: false,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div
          className="mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Configure your preferences and options</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary hover:bg-primary/90">
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 mb-8 p-1 bg-secondary/50 rounded-xl w-fit"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
            transitionDelay: "100ms",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease-out",
              transitionDelay: "200ms",
            }}
          >
            {activeTab === "General" && (
              <>
                {/* Appearance */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Appearance</h3>
                      <p className="text-sm text-muted-foreground">Customize how SparkAI looks</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-3 block">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                              theme === option.value
                                ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10"
                                : "bg-secondary/30 border-border hover:border-primary/20"
                            }`}
                          >
                            <option.icon
                              className={`w-6 h-6 ${theme === option.value ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                theme === option.value ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-3 block">Language</label>
                      <div className="grid grid-cols-3 gap-2">
                        {languageOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setLanguage(option.value)}
                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                              language === option.value
                                ? "bg-primary/10 border-primary/30"
                                : "bg-secondary/30 border-border hover:border-primary/20"
                            }`}
                          >
                            <span className="text-lg">{option.flag}</span>
                            <span
                              className={`text-sm font-medium ${
                                language === option.value ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Puzzle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Application</h3>
                      <p className="text-sm text-muted-foreground">General application settings</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "autoStart",
                        label: "Auto-start on login",
                        desc: "Launch SparkAI when you start your computer",
                      },
                      {
                        key: "soundEffects",
                        label: "Sound effects",
                        desc: "Play sounds for notifications and events",
                      },
                      {
                        key: "desktopNotifications",
                        label: "Desktop notifications",
                        desc: "Show notifications when captchas are solved",
                      },
                      {
                        key: "minimizeToTray",
                        label: "Minimize to tray",
                        desc: "Keep running in system tray when closed",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={() => toggleSetting(item.key)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Captcha" && (
              <>
                {/* Solver Settings */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Solver Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure captcha solving behavior</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "autoSolve",
                        label: "Auto-solve captchas",
                        desc: "Automatically solve captchas when detected",
                        badge: "Recommended",
                      },
                      {
                        key: "turboMode",
                        label: "Turbo mode",
                        desc: "Faster solving with more credits consumed",
                        badge: "Pro",
                      },
                      {
                        key: "priorityQueue",
                        label: "Priority queue",
                        desc: "Get priority in solving queue",
                        badge: "Pro",
                      },
                      {
                        key: "retryOnFail",
                        label: "Retry on failure",
                        desc: "Automatically retry failed captchas",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-2">
                              {item.label}
                              {item.badge && (
                                <Badge
                                  className={`text-xs ${
                                    item.badge === "Pro"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-green-500/10 text-green-500"
                                  }`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={() => toggleSetting(item.key)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeout Settings */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Timer className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Timeout Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure solving timeouts</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-3 block">Default timeout</label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeoutOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTimeout(option.value)}
                            className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                              timeout === option.value
                                ? "bg-primary/10 border-primary/30"
                                : "bg-secondary/30 border-border hover:border-primary/20"
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                timeout === option.value ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-3 block">Max retries</label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => setSettings((prev) => ({ ...prev, maxRetries: num }))}
                            className={`w-12 h-12 rounded-xl border text-center transition-all duration-300 ${
                              settings.maxRetries === num
                                ? "bg-primary/10 border-primary/30"
                                : "bg-secondary/30 border-border hover:border-primary/20"
                            }`}
                          >
                            <span
                              className={`text-lg font-bold ${
                                settings.maxRetries === num ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {num}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "API" && (
              <>
                {/* API Configuration */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">API Configuration</h3>
                      <p className="text-sm text-muted-foreground">Configure API behavior and limits</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "rateLimiting",
                        label: "Rate limiting",
                        desc: "Enable rate limiting to prevent API abuse",
                      },
                      {
                        key: "webhookEnabled",
                        label: "Webhook notifications",
                        desc: "Send webhook notifications for solved captchas",
                      },
                      {
                        key: "loggingEnabled",
                        label: "Request logging",
                        desc: "Log all API requests for debugging",
                      },
                      {
                        key: "debugMode",
                        label: "Debug mode",
                        desc: "Enable verbose logging for troubleshooting",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={() => toggleSetting(item.key)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Webhook URL */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Webhook URL</h3>
                      <p className="text-sm text-muted-foreground">Endpoint to receive notifications</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="url"
                      placeholder="https://your-server.com/webhook"
                      disabled={!settings.webhookEnabled}
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground outline-none transition-all disabled:opacity-50"
                    />
                    <Button variant="outline" disabled={!settings.webhookEnabled} className="gap-2 bg-transparent">
                      Test
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Data" && (
              <>
                {/* Privacy */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Privacy</h3>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "anonymousUsage",
                        label: "Anonymous usage",
                        desc: "Don't associate solving requests with your account",
                      },
                      {
                        key: "shareAnalytics",
                        label: "Share analytics",
                        desc: "Help improve SparkAI by sharing usage data",
                      },
                      {
                        key: "clearOnExit",
                        label: "Clear data on exit",
                        desc: "Clear all local data when closing the app",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={() => toggleSetting(item.key)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Management */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Data Management</h3>
                      <p className="text-sm text-muted-foreground">Export, import, or delete your data</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border hover:border-primary/20 transition-all group">
                      <Download className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium text-foreground">Export Data</p>
                      <p className="text-xs text-muted-foreground">Download all your data</p>
                    </button>
                    <button className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border hover:border-primary/20 transition-all group">
                      <Upload className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium text-foreground">Import Data</p>
                      <p className="text-xs text-muted-foreground">Restore from backup</p>
                    </button>
                    <button className="p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all group">
                      <Trash2 className="w-6 h-6 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium text-red-500">Clear All Data</p>
                      <p className="text-xs text-red-500/60">Permanently delete</p>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div
            className="space-y-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease-out",
              transitionDelay: "300ms",
            }}
          >
            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <RefreshCw className="w-4 h-4" />
                  Reset to Defaults
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Settings
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Import Settings
                </Button>
              </div>
            </div>

            {/* Help */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Need Help?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Check our documentation for detailed guides on configuring SparkAI.
              </p>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                View Documentation
              </Button>
            </div>

            {/* Version Info */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <Badge className="bg-primary/10 text-primary">v2.5.0</Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm text-foreground">Jan 15, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
