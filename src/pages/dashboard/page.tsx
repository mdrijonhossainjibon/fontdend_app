"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/modules/rootReducer"
import {
  fetchDashboardDataRequest,
  generateKeyRequest,
  deleteKeyRequest,
  regenerateKeyRequest,
  toggleAutoRenewRequest,
  cancelPackageRequest,
  fetchOffersRequest,
} from "@/modules/dashboard/actions"

import { useDashboardSocket } from "@/hooks/useDashboardSocket"
import { Zap, Clock, TrendingUp, CheckCircle2, ArrowUpRight, Sparkles, Package, Key, Copy, RefreshCw, ToggleLeft, ToggleRight, Trash2, Star, Activity } from "lucide-react"
import { Link } from 'react-router-dom'
import { SkeletonStats, SkeletonGrid, SkeletonCard } from "@/components/skeletons"


export default function DashboardPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<string>("00:00:00")

  const dispatch = useDispatch()
  const {
    userData,
    dailyUsage,
    activePackage,
    apiKeys: dashboardApiKeys,
    loading,
    generatingKey,
    regeneratingKey,
    offers,
    offersLoading,
  } = useSelector((state: RootState) => state.dashboard)

  const autoRenew = activePackage?.autoRenew ?? true

  // Real-time dashboard updates via WebSocket
  useDashboardSocket()

  // Initial data fetch on mount
  useEffect(() => {
    dispatch(fetchDashboardDataRequest())
    dispatch(fetchOffersRequest())
  }, [dispatch])

  useEffect(() => {
    if (!activePackage?.endDate) return

    const calculateTimeLeft = () => {
      const now = Date.now() // always ms
      const end = Date.parse(activePackage.endDate) // UTC safe
      const diff = end - now

      if (diff <= 0) {
        setCountdown("00:00:00")
        return
      }

      const totalSeconds = Math.floor(diff / 1000)

      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      let res = ""
      if (days > 0) res += `${days}d `
      res += `${hours.toString().padStart(2, "0")}:` +
        `${minutes.toString().padStart(2, "0")}:` +
        `${seconds.toString().padStart(2, "0")}`

      setCountdown(res)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [activePackage?.endDate])


  // Get current date and greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getCurrentDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const handleCopyKey = async (key: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(keyName)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy key:', err)
    }
  }

  const handleGenerateKey = (slotName: string) => {
    const finalName = slotName.startsWith('Slot') ? (slotName === 'Slot 2' ? 'API Key 2' : (slotName === 'Slot 3' ? 'API Key 3' : 'Master Key')) : slotName
    const nameToCreate = slotName === 'Slot 1' ? 'Master Key' : finalName

    if (generatingKey) return
    dispatch(generateKeyRequest(nameToCreate, slotName))
  }

  const handleDeleteKey = (id: string, keyName: string) => {
    if (!confirm(`Are you sure you want to delete ${keyName}? This action cannot be undone.`)) return
    dispatch(deleteKeyRequest(id))
  }

  const handleRegenerateKey = (key: any) => {
    if (regeneratingKey) return
    if (!confirm(`Regenerating ${key.name} will revoke the current key immediately. Continue?`)) return
    dispatch(regenerateKeyRequest(key))
  }

  const handleToggleAutoRenew = () => {
    dispatch(toggleAutoRenewRequest(!autoRenew))
  }

  const handleCancelPackage = () => {
    if (!confirm('Are you sure you want to cancel your package? This will stop all services associated with this package.')) return
    dispatch(cancelPackageRequest())
  }


  return (
    <>



      <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 ">
        {/* Top Navigation Header - Hidden on mobile, shown on desktop */}


        <div className="animate-in fade-in duration-500">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
            {getGreeting()},
            {loading ? (
              <div className="h-8 bg-secondary rounded-lg w-32 animate-pulse" />
            ) : (
              <span className="text-primary">{userData?.name}</span>
            )}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">{getCurrentDate()}</p>
        </div>

        {/* Promotional Offers */}
        {!offersLoading && offers.length > 0 && offers.map((offer: any, idx: number) => (
          <div key={offer.id || idx} className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-primary/10 border border-purple-500/30 p-4 md:p-6 animate-in slide-in-from-top duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-full"></div>

            {offer.offerBadge && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                {offer.offerBadge}
              </div>
            )}

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">{offer.offerTitle}</h3>
                      {offer.offerDescription && (
                        <p className="text-xs text-muted-foreground">{offer.offerDescription}</p>
                      )}
                    </div>
                  </div>

                  {offer.offerFeatures && offer.offerFeatures.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-4">
                      {offer.offerFeatures.map((feature: string, fi: number) => (
                        <div key={fi} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                      {offer.offerHighlight && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-500">{offer.offerHighlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{offer.price}</p>
                    <p className="text-xs text-muted-foreground">{offer.validity} validity</p>
                  </div>
                  <Link to={`/dashboard/pricing?offer=${offer.code}`} className="w-full md:w-auto">
                    <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                      Upgrade Now
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}



        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Daily Usage */}
              <div
                className="p-6 md:p-8 rounded-2xl bg-card border border-border animate-in fade-in duration-500 hover:border-primary/30 transition-all group relative overflow-hidden"
                style={{ animationDelay: '100ms' }}
              >
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 items-center gap-8">
                  {/* Stats Left - Col 3 */}
                  <div className="md:col-span-3 space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-foreground mb-1">
                        {dailyUsage?.type === 'count' ? 'Package Usage' : 'Daily Usage'}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {dailyUsage?.type === 'count'
                          ? 'Your current package consumption and remaining balance'
                          : 'Your daily request quota and current status'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {dailyUsage?.type === 'count' ? 'Total Used' : 'Total Requests'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-2xl font-bold text-foreground">{dailyUsage?.totalRequests}</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <p className="text-xs text-primary uppercase tracking-wider mb-1 font-semibold">
                          {dailyUsage?.type === 'count' ? 'Remaining' : 'Requests Left'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-2xl font-bold text-primary">{dailyUsage?.requestsLeft}</span>
                        </div>
                      </div>
                    </div>

                    {dailyUsage?.resetsIn && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/20 p-2 rounded-lg w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Quota resets in: <span className="text-foreground font-medium">{dailyUsage?.resetsIn}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Circular Progress Right - Col 2 */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="relative w-44 h-44">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="88"
                          cy="88"
                          r="76"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          className="text-secondary/50"
                        />
                        <circle
                          cx="88"
                          cy="88"
                          r="76"
                          stroke="url(#usage-gradient)"
                          strokeWidth="11"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 76}`}
                          strokeDashoffset={`${2 * Math.PI * 76 * (1 - dailyUsage?.percentage / 100)}`}
                          className="transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="usage-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-foreground">{Math.round(dailyUsage?.percentage)}%</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Usage</span>
                      </div>
                      {/* Pulsing Dot on progress head */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div
                          className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `rotate(${dailyUsage?.percentage * 3.6 - 90}deg) translate(76px) rotate(-${dailyUsage?.percentage * 3.6 - 90}deg) translate(-50%, -50%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
              </div>

              {/* Package / Subscription */}
              {activePackage ? (
                <div
                  className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-card border border-border animate-in fade-in duration-500 hover:border-primary/30 transition-colors"
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">Package</h3>
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleToggleAutoRenew}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                          title={autoRenew ? 'Auto Renew: On' : 'Auto Renew: Off'}
                        >
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Auto Renew</span>
                          {autoRenew ? (
                            <ToggleRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={handleCancelPackage}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Package Code and Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{activePackage.code}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activePackage.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">${activePackage.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">per month</p>
                      </div>
                    </div>

                    {/* Usage Stats Cards */}
                    <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                      <div className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">Credits</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{activePackage.creditsRemaining}</p>
                        <p className="text-xs text-muted-foreground">remaining</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-xs text-muted-foreground">Used</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{activePackage.creditsUsed}</p>
                        <p className="text-xs text-muted-foreground">this month</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Activity className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs text-muted-foreground">Uptime</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">99.9%</p>
                        <p className="text-xs text-muted-foreground">guaranteed</p>
                      </div>
                    </div>

                    {/* Package Features */}
                    <div className="grid grid-cols-2 gap-2">
                      {activePackage.features.slice(0, 4).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{feature}</span>
                        </div>
                      ))}
                    </div>



                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        disabled={countdown !== "00:00:00"}
                        className={`
                        flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border
                        ${countdown === "00:00:00"
                            ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-lg hover:scale-[1.02]"
                            : "bg-secondary/40 text-muted-foreground border-border/50 cursor-not-allowed"}
                      `}
                      >
                        <Clock className={`w-3.5 h-3.5 ${countdown === "00:00:00" ? "text-white" : "text-primary animate-pulse"}`} />
                        <span className="font-mono text-[12px] tracking-tight">
                          {countdown === "00:00:00" ? "RENEW NOW" : countdown}
                        </span>
                      </button>
                      <Link to={`/dashboard/pricing?current=${activePackage?.code}`} className="flex-1">
                        <button className="w-full px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02]">
                          UPGRADE
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border animate-in fade-in duration-500 hover:border-primary/30 transition-colors flex items-center justify-center"
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-secondary/50">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Package Found</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                      You don't have an active subscription package yet.
                    </p>
                    <Link to="/dashboard/pricing">
                      <button
                        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-105"
                      >
                        Get Package
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* API Keys */}
              <div
                className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border animate-in fade-in duration-500 md:col-span-2 lg:col-span-1"
                style={{ animationDelay: '400ms' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <Key className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
                  </div>
                  <Link to="/dashboard/api-keys" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Manage <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {dashboardApiKeys.map((key: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl transition-colors ${key.status === 'empty' ? 'bg-secondary/30 border border-dashed border-border' : 'bg-secondary/50 hover:bg-secondary'}`}
                    >
                      {key.status === 'empty' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Empty slot</p>
                          </div>
                          <button
                            onClick={() => handleGenerateKey(key.name)}
                            disabled={generatingKey === key.name}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {generatingKey === key.name ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Key className="w-3 h-3" />
                                Generate Key
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">{key.name}</p>
                              {key.name === "Master Key" && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Master</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${key.status === 'active'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-gray-500/10 text-gray-500'
                                }`}>
                                {key.status}
                              </span>
                              <button
                                onClick={() => handleRegenerateKey(key)}
                                disabled={regeneratingKey === key.name}
                                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group disabled:opacity-50"
                                title="Regenerate API key"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-primary ${regeneratingKey === key.name ? 'animate-spin' : ''}`} />
                              </button>
                              {!key.isMaster && key.name !== "Master Key" && (
                                <button
                                  onClick={() => handleDeleteKey(key.id, key.name)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors group"
                                  title="Delete API key"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-500" />
                                </button>
                              )}
                              <button
                                onClick={() => handleCopyKey(key.key, key.name)}
                                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
                                title="Copy API key"
                              >
                                {copiedKey === key.name ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono mb-1">{key.key}</p>


                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>


      </div>

      <style>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

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
    </>
  )
}
