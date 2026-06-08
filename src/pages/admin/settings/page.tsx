import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Gift, Eye, EyeOff, RotateCcw, Zap, Clock, CheckCircle2, XCircle, Key, Coins, ChevronRight } from "lucide-react"
import { Spinner } from '@/components/ui/spinner'
import { RootState } from '@/modules/rootReducer'
import * as actions from '@/modules/settings/actions'

interface SettingItem {
  label: string
  key: string
  value: any
  toggle?: boolean
  password?: boolean
  desc?: string
  icon?: React.ReactNode
  suffix?: string
}

interface SectionConfig {
  title: string
  icon: React.ReactNode
  gradient: string
  iconBg: string
  accent: string
  accentText: string
  settings: SettingItem[]
}

export default function AdminSettings() {
  const dispatch = useDispatch()
  const { data: settings, loading, saving } = useSelector((state: RootState) => state.settings)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    dispatch(actions.fetchSettingsRequest())
  }, [dispatch])

  const handleUpdateField = (key: string, value: any) => {
    const updated = { ...settings, [key]: value }
    dispatch(actions.updateSettingField(key, value))

    // Auto-save with debounce (300ms)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      dispatch(actions.saveSettingsRequest(updated))
    }, 300)
  }

  const togglePassword = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading && !settings.platformName) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Spinner className="size-8" />
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading settings...</p>
        </div>
      </div>
    )
  }

  const sections: SectionConfig[] = [
    {
      title: "Free Trial",
      icon: <Gift className="w-4 h-4" />,
      gradient: "from-rose-500/10 via-pink-500/5",
      iconBg: "bg-gradient-to-br from-rose-500/20 to-pink-500/10 text-rose-400",
      accent: "rose",
      accentText: "text-rose-400",
      settings: [
        { label: "Free Trial Enabled", key: "freeTrialEnabled", value: settings.freeTrialEnabled, toggle: true, desc: "Auto-grant trial credits on signup", icon: <Zap className="w-4 h-4" /> },
        { label: "Free Trial Credits", key: "freeTrialCredits", value: settings.freeTrialCredits, desc: "Credits awarded to new users", icon: <Coins className="w-4 h-4" />, suffix: "credits" },
        { label: "Trial Duration", key: "freeTrialDays", value: settings.freeTrialDays, desc: "Days until trial expires", icon: <Clock className="w-4 h-4" />, suffix: "days" },
      ],
    },
    {
      title: "Cryptomus Payment Gateway",
      icon: <CreditCard className="w-4 h-4" />,
      gradient: "from-indigo-500/10 via-violet-500/5",
      iconBg: "bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-400",
      accent: "indigo",
      accentText: "text-indigo-400",
      settings: [
        { label: "Merchant ID", key: "cryptomusMerchantId", value: settings.cryptomusMerchantId, password: true, desc: "Cryptomus merchant identifier", icon: <Key className="w-4 h-4" /> },
        { label: "API Key", key: "cryptomusApiKey", value: settings.cryptomusApiKey, password: true, desc: "Cryptomus API secret key", icon: <ShieldIcon className="w-4 h-4" /> },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Content */}
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, sectionIndex) => {
            return (
          <div key={sectionIndex}>
          <Card className="relative border-border/40 bg-card shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl h-full">
            {/* Top shimmer border */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${section.gradient}`} />

            {/* Section Header */}
            <div className="relative px-6 py-5 flex items-start justify-between border-b border-border/10">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${section.iconBg} shadow-sm`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    {section.title}
                    <ChevronRight className={`w-3.5 h-3.5 ${section.accentText} opacity-50`} />
                  </h3>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {section.settings.length} setting{section.settings.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[11px] px-2.5 py-0.5 h-5 font-medium border ${
                  section.settings.every(s => !s.toggle || s.value)
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  section.settings.every(s => !s.toggle || s.value)
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                }`} />
                {section.settings.every(s => !s.toggle || s.value) ? 'Active' : 'Configured'}
              </Badge>
            </div>

            {/* Settings */}
            <CardContent className="p-0">
              <div className="divide-y divide-border/5">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={settingIndex}
                    className="group/item relative transition-all duration-200 hover:bg-muted/20"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-1.5 rounded-lg ${section.iconBg} shrink-0 opacity-70 group-hover/item:opacity-100 transition-opacity`}>
                            {setting.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                              <label className="text-sm font-medium text-foreground/90 group-hover/item:text-foreground transition-colors">
                                {setting.label}
                              </label>
                              {setting.toggle && (
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium leading-none transition-all duration-200 ${
                                  setting.value
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-muted/50 text-muted-foreground/50'
                                }`}>
                                  {setting.value ? (
                                    <><CheckCircle2 className="w-2.5 h-2.5" /> ON</>
                                  ) : (
                                    <><XCircle className="w-2.5 h-2.5" /> OFF</>
                                  )}
                                </span>
                              )}
                            </div>
                            {setting.desc && (
                              <p className="text-[11px] text-muted-foreground/50 mt-0.5 group-hover/item:text-muted-foreground/70 transition-colors">
                                {setting.desc}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {setting.toggle ? (
                            <Switch
                              checked={!!setting.value}
                              onCheckedChange={(checked) => handleUpdateField(setting.key, checked)}
                              className="data-[state=checked]:bg-emerald-500 scale-110"
                            />
                          ) : (
                            <div className="relative min-w-[180px] md:min-w-[220px]">
                              <Input
                                type={setting.password && !showPasswords[setting.key] ? "password" : "text"}
                                value={setting.value as string}
                                onChange={(e) => handleUpdateField(setting.key, e.target.value)}
                                className="w-full h-9 text-xs bg-muted/20 border-border/30 focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg pr-9 transition-all duration-200 hover:border-border/50"
                                placeholder={`Enter ${setting.label.toLowerCase()}`}
                              />
                              {setting.password && (
                                <button
                                  type="button"
                                  onClick={() => togglePassword(setting.key)}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors"
                                >
                                  {showPasswords[setting.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              )}
                              {setting.suffix && !setting.password && (
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/30 font-medium uppercase tracking-wider pointer-events-none">
                                  {setting.suffix}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line on hover */}
                    <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${section.gradient} opacity-0 group-hover/item:opacity-100 transition-opacity duration-300`} />
                  </div>
                ))}
              </div>
            </CardContent>


          </Card>
          </div>
          )
        })}
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}

function ShieldIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}
