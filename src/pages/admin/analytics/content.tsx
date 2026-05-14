
import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Zap,
  Globe,
  Shield,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface ChartDataPoint {
  date: string
  requests: number
  users: number
  successRate: string
}

interface Metric {
  value: string
  change: string
}

interface Metrics {
  totalCaptchas: Metric
  avgResponseTime: Metric
  successRate: Metric
  apiCalls: Metric
  totalRevenue: Metric
  activeApiKeys: Metric
}

interface Country {
  country: string
  requests: number
}

interface CaptchaType {
  type: string
  count: number
  color: string
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#6b7280']

export default function AdminAnalyticsContent() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [metrics, setMetrics] = useState<Metrics>({
    totalCaptchas: { value: '0', change: '+0%' },
    avgResponseTime: { value: '0s', change: '0s' },
    successRate: { value: '0%', change: '+0%' },
    apiCalls: { value: '0', change: '+0%' },
    totalRevenue: { value: '$0.00', change: '+0%' },
    activeApiKeys: { value: '0', change: '+0' }
  })
  const [topCountries, setTopCountries] = useState<Country[]>([])
  const [captchaTypes, setCaptchaTypes] = useState<CaptchaType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/analytics?days=${days}`)
      const data = await response.json()

      if (data.success) {
        setChartData(data.chartData)
        setMetrics(data.metrics)
        setTopCountries(data.topCountries)
        setCaptchaTypes(data.captchaTypes)
      } else {
        toast.error(data.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to fetch analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const StatCard = ({ icon: Icon, label, value, change, trend, color }: any) => {
    const isPositive = change.startsWith('+')
    const isNegative = change.startsWith('-')
    const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Activity

    return (
      <div className="group relative bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${color.replace('from-', 'text-').replace(' to-', '').split(' ')[0]}`} />
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-500/10 text-green-600' :
                isNegative ? 'bg-red-500/10 text-red-600' :
                  'bg-muted text-muted-foreground'
              }`}>
              <TrendIcon className="w-3 h-3" />
              {change}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 font-medium">{label}</p>
            <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          </div>
        </div>
      </div>
    )
  }

  const pieChartData = captchaTypes.map(item => ({
    name: item.type,
    value: item.count
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Activity className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={Shield}
              label="Total Captchas Solved"
              value={metrics.totalCaptchas.value}
              change={metrics.totalCaptchas.change}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Clock}
              label="Average Response Time"
              value={metrics.avgResponseTime.value}
              change={metrics.avgResponseTime.change}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={CheckCircle2}
              label="Success Rate"
              value={metrics.successRate.value}
              change={metrics.successRate.change}
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={Zap}
              label="API Calls"
              value={metrics.apiCalls.value}
              change={metrics.apiCalls.change}
              color="from-orange-500 to-orange-600"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={metrics.totalRevenue.value}
              change={metrics.totalRevenue.change}
              color="from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={Users}
              label="Active API Keys"
              value={metrics.activeApiKeys.value}
              change={metrics.activeApiKeys.change}
              color="from-cyan-500 to-cyan-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart - Takes 2 columns */}
            <div className="lg:col-span-2 bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance Trends
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Requests and user growth over time
                </p>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Requests"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                      fill="url(#colorRequests)"
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="New Users"
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      activeDot={{ r: 6 }}
                      fill="url(#colorUsers)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <XCircle className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-medium">No data available</p>
                  <p className="text-sm">Try selecting a different time period</p>
                </div>
              )}
            </div>

            {/* Pie Chart */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Captcha Types
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Distribution by type
                </p>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {captchaTypes.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.type}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.count}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Top Countries
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  By number of requests
                </p>
              </div>

              <div className="space-y-4">
                {topCountries.map((item, i) => {
                  const maxRequests = topCountries[0]?.requests || 1
                  const percentage = (item.requests / maxRequests) * 100

                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {i + 1}
                          </div>
                          <span className="font-medium text-foreground">{item.country}</span>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {formatNumber(item.requests)}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500 group-hover:from-primary group-hover:to-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Request Status */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Request Status
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Success vs failure rate
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Successful</p>
                      <p className="text-2xl font-bold text-foreground">{metrics.successRate.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-foreground">
                        {(100 - parseFloat(metrics.successRate.value)).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <p className="text-sm font-medium text-foreground">Total API Calls</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{metrics.apiCalls.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.apiCalls.change} from previous period
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
