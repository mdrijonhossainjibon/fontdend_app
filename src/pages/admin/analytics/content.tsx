import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  Activity, Users, Zap, Globe, Clock, Shield,
  TrendingUp, TrendingDown, RefreshCw, ChevronDown
} from "lucide-react"
import { fetchAdminAnalyticsRequest } from '@/modules/admin/actions'

export default function AdminAnalyticsContent() {
  const dispatch = useDispatch()
  const { analytics, analyticsLoading } = useSelector((state: any) => state.admin)
  const [days, setDays] = useState(30)

  useEffect(() => {
    dispatch(fetchAdminAnalyticsRequest(days))
  }, [dispatch, days])

  const chartData = analytics?.chartData || []
  const metrics = analytics?.metrics || {
    totalCaptchas: { value: '0', change: '+0%' },
    avgResponseTime: { value: '0s', change: '0s' },
    successRate: { value: '0%', change: '+0%' },
    apiCalls: { value: '0', change: '+0%' },
    totalRevenue: { value: '$0.00', change: '+0%' },
    activeApiKeys: { value: '0', change: '+0' },
  }
  const topCountries = analytics?.topCountries || []
  const captchaTypes = analytics?.captchaTypes || []
  const isLoading = analyticsLoading

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const MetricCard = ({ label, value, change, icon: Icon }: any) => {
    const isPos = String(change).startsWith('+')
    const isNeg = String(change).startsWith('-')
    const TrendIcon = isPos ? TrendingUp : isNeg ? TrendingDown : Activity

    return (
      <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className={`text-xs font-medium flex items-center gap-0.5 ${
            isPos ? 'text-green-500' : isNeg ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            <TrendIcon className="w-3 h-3" />
            {change}
          </span>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-sm">
        <p className="text-muted-foreground mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-foreground font-medium">{p.value.toLocaleString()}</span>
            <span className="text-muted-foreground">{p.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Platform performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
          <button
            onClick={() => dispatch(fetchAdminAnalyticsRequest(days))}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard label="Captchas" value={metrics.totalCaptchas.value} change={metrics.totalCaptchas.change} icon={Shield} />
            <MetricCard label="Avg Response" value={metrics.avgResponseTime.value} change={metrics.avgResponseTime.change} icon={Clock} />
            <MetricCard label="Success Rate" value={metrics.successRate.value} change={metrics.successRate.change} icon={Activity} />
            <MetricCard label="API Calls" value={metrics.apiCalls.value} change={metrics.apiCalls.change} icon={Zap} />
            <MetricCard label="Revenue" value={metrics.totalRevenue.value} change={metrics.totalRevenue.change} icon={TrendingUp} />
            <MetricCard label="API Keys" value={metrics.activeApiKeys.value} change={metrics.activeApiKeys.change} icon={Users} />
          </div>

          {/* Chart + Types Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Main Chart */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Performance</h2>
                  <p className="text-xs text-muted-foreground">Requests & user growth</p>
                </div>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fill="url(#reqGrad)" name="Requests" />
                    <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} fill="url(#userGrad)" name="New Users" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Activity className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">No data</p>
                  <p className="text-xs">Try a different period</p>
                </div>
              )}
            </div>

            {/* Captcha Types */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-1">Captcha Types</h2>
              <p className="text-xs text-muted-foreground mb-4">Distribution</p>
              <div className="space-y-3">
                {captchaTypes.map((item: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.type}</span>
                      <span className="font-semibold text-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min((item.count / Math.max(...captchaTypes.map((c: any) => c.count))) * 100, 100)}%`, backgroundColor: item.color || '#3b82f6' }}
                      />
                    </div>
                  </div>
                ))}
                {captchaTypes.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">No data</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Countries */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Top Countries</h2>
                  <p className="text-xs text-muted-foreground">By request volume</p>
                </div>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {topCountries.map((item: any, i: number) => {
                  const maxReq = topCountries[0]?.requests || 1
                  const pct = (item.requests / maxReq) * 100
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="text-foreground font-medium">{item.country}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{formatNumber(item.requests)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div className="bg-primary/70 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
                {topCountries.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">No data</p>
                )}
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Request Status</h2>
                  <p className="text-xs text-muted-foreground">Success vs failure</p>
                </div>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">Successful</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metrics.successRate.value}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {(100 - parseFloat(metrics.successRate.value)).toFixed(1)}%
                  </p>
                </div>
                <div className="col-span-2 bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total API Calls</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metrics.apiCalls.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{metrics.apiCalls.change} vs previous</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
