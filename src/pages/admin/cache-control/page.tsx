
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/modules/rootReducer'
import { fetchCacheSettingsRequest, updateCacheSettingRequest } from '@/modules/admin/cache-control/actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Cloud, Database, Shield, Key, Loader2, RefreshCw } from "lucide-react"

const cacheItems = [
  { key: 'cacheControlAws', label: 'AWS', icon: Cloud, color: 'text-orange-500', description: 'Cache AWS model responses' },
  { key: 'cacheControlKbs', label: 'KBS', icon: Database, color: 'text-emerald-500', description: 'Cache KBS model responses' },
  { key: 'cacheControlHcaptcha', label: 'hCaptcha', icon: Shield, color: 'text-blue-500', description: 'Cache hCaptcha verification results' },
  { key: 'cacheControlKblogin', label: 'KbLogin', icon: Key, color: 'text-purple-500', description: 'Cache KbLogin authentication tokens' },
]

export default function CacheControl() {
  const dispatch = useDispatch()
  const { settings: toggles, loading, savingKey } = useSelector((state: RootState) => state.adminCacheControl)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    dispatch(fetchCacheSettingsRequest())
  }, [dispatch])

  const handleToggle = (key: string, value: boolean) => {
    dispatch(updateCacheSettingRequest(key, value))
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s ease-out',
      }}
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <RefreshCw className="w-7 h-7 text-primary" />
          Cache Control
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enable or disable caching per service
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cacheItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card
              key={item.key}
              className="border-border/60 overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-black/10"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${idx * 80}ms`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.label}</CardTitle>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {savingKey === item.key ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Switch
                      checked={toggles[item.key] ?? true}
                      onCheckedChange={(checked) => handleToggle(item.key, checked)}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-xs px-3 py-1.5 rounded-lg font-medium w-fit ${
                  toggles[item.key]
                    ? 'bg-primary/10 text-primary'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {toggles[item.key] ? 'Enabled' : 'Disabled'}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
