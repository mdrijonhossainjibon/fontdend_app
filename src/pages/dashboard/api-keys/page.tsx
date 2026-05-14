"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, Check, Key, Shield, RefreshCw, Plus } from "lucide-react"

interface ApiKey {
  id: number
  name: string
  key: string
  created: string
  lastUsed: string
  status: "active" | "inactive"
  isMaster?: boolean
}

const masterKey: ApiKey = {
  id: 1,
  name: "Master Key",
  key: "pk_master_51H2K3...xyz789",
  created: "2024-01-01",
  lastUsed: "Just now",
  status: "active",
  isMaster: true,
}

export default function ApiKeysPage() {
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set())
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null)
  const [apiKeys, setApiKeys] = useState<(ApiKey | null)[]>([masterKey, null, null])
  const [generatingSlot, setGeneratingSlot] = useState<number | null>(null)

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyKey = async (key: string, id: number) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy key:", err)
    }
  }

  const regenerateKey = async (id: number) => {
    if (regeneratingId) return
    setRegeneratingId(id)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newKey = `pk_master_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`
    
    setApiKeys((prev) =>
      prev.map((key) =>
        key?.id === id
          ? { ...key, key: newKey, lastUsed: "Just now" }
          : key
      )
    )
    
    setRegeneratingId(null)
    setVisibleKeys((prev) => new Set(prev).add(id))
  }

  const generateNewKey = async (slotIndex: number) => {
    if (generatingSlot !== null) return
    setGeneratingSlot(slotIndex)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newKey: ApiKey = {
      id: slotIndex + 1,
      name: `API Key ${slotIndex}`,
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      status: "active",
    }
    
    setApiKeys((prev) => {
      const updated = [...prev]
      updated[slotIndex] = newKey
      return updated
    })
    
    setGeneratingSlot(null)
  }

  const maskKey = (key: string) => {
    const prefix = key.substring(0, 10)
    return `${prefix}••••••••••••••`
  }

  const renderKeyCard = (apiKey: ApiKey | null, index: number) => {
    // Empty slot
    if (!apiKey) {
      return (
        <Card key={`empty-${index}`} className="border-border/50 border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-3 rounded-full bg-secondary/50 mb-4">
              <Key className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Empty slot</p>
            <Button
              onClick={() => generateNewKey(index)}
              disabled={generatingSlot === index}
              className="bg-primary hover:bg-primary/90"
              size="sm"
            >
              {generatingSlot === index ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Key
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Master or regular key
    return (
      <Card key={apiKey.id} className={`border-border/50 ${apiKey.isMaster ? 'border-primary/30 bg-primary/5' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{apiKey.name}</CardTitle>
              {apiKey.isMaster && (
                <span className="text-[10px] uppercase tracking-wide bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  Master
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  apiKey.status === "active"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-500/10 text-gray-500"
                }`}
              >
                {apiKey.status}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => regenerateKey(apiKey.id)}
                disabled={regeneratingId === apiKey.id}
                className="h-7 w-7 p-0"
                title="Regenerate key"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regeneratingId === apiKey.id ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="h-7 w-7 p-0"
              >
                {visibleKeys.has(apiKey.id) ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyKey(apiKey.key, apiKey.id)}
                className="h-7 w-7 p-0"
              >
                {copiedId === apiKey.id ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs mt-1">
            Created: {apiKey.created}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-2.5 rounded-lg bg-secondary/50 font-mono text-xs break-all">
            {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Last used: {apiKey.lastUsed}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your API keys. Master key is permanent, additional keys can be generated in empty slots.
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-border/50 bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Security Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your API keys secure and never share them publicly. Master key cannot be deleted, only regenerated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiKeys.map((key, index) => renderKeyCard(key, index))}
        </div>
      </div>
    </DashboardLayout>
  )
}
