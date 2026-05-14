
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2, Settings2, Shield, Wallet, Globe } from "lucide-react"
import { Spin } from 'antd'
import { RootState } from '@/modules/rootReducer'
import * as actions from '@/modules/settings/actions'

export default function AdminSettings() {
  const dispatch = useDispatch()
  const { data: settings, loading, saving } = useSelector((state: RootState) => state.settings)

  useEffect(() => {
    dispatch(actions.fetchSettingsRequest())
  }, [dispatch])

  const handleSave = () => {
    dispatch(actions.saveSettingsRequest(settings))
  }

  const handleUpdateField = (key: string, value: any) => {
    dispatch(actions.updateSettingField(key, value))
  }

  if (loading && !settings.platformName) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" tip="Loading settings..." />
      </div>
    )
  }

  const sections = [
    {
      title: "General",
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      settings: [
        { label: "Platform Name", key: "platformName", value: settings.platformName },
        { label: "Support Email", key: "supportEmail", value: settings.supportEmail },
        { label: "Max API Rate Limit", key: "maxApiRateLimit", value: settings.maxApiRateLimit },
      ],
    },
    {
      title: "Wallet Configuration",
      icon: <Wallet className="w-5 h-5 text-amber-500" />,
      settings: [
        { label: "Main Wallet Address", key: "mainWalletAddress", value: settings.mainWalletAddress }
      ],
    },
    {
      title: "Security",
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      settings: [
        { label: "2FA Required", key: "twoFARequired", value: settings.twoFARequired, toggle: true },
        { label: "IP Whitelist", key: "ipWhitelist", value: settings.ipWhitelist, toggle: true },
        { label: "Session Timeout", key: "sessionTimeout", value: settings.sessionTimeout },
      ],
    },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Settings2 className="w-8 h-8" />
            </div>
            Admin Settings
          </h1>
          <p className="text-muted-foreground">Manage system-wide configurations and security policies</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <Card
            key={sectionIndex}
            className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5"
            style={{
              opacity: 0,
              animation: `slideInUp 0.5s ease-out ${sectionIndex * 100}ms forwards`,
            }}
          >
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-foreground">{setting.label}</label>
                      <p className="text-xs text-muted-foreground">
                        Configure the {setting.label.toLowerCase()} for the platform
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {setting.toggle ? (
                        <Switch
                          checked={!!setting.value}
                          onCheckedChange={(checked) => handleUpdateField(setting.key, checked)}
                        />
                      ) : (
                        <Input
                          value={setting.value as string}
                          onChange={(e) => handleUpdateField(setting.key, e.target.value)}
                          className="w-64 bg-secondary/50 border-border/50 focus:ring-primary/20"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={() => dispatch(actions.fetchSettingsRequest())} disabled={saving || loading}>
            Cancel
          </Button>
          <Button
            className="gap-2 px-8 py-6 rounded-2xl shadow-lg shadow-primary/20"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
