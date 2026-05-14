"use client"

import { useEffect, useState } from "react"
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  RefreshCw,
} from "lucide-react"

const historyData = [
  {
    id: 1,
    type: "reCAPTCHA v2",
    website: "example.com",
    status: "success",
    duration: "1.1s",
    credits: 2,
    timestamp: "2024-01-15 14:32:45",
  },
  {
    id: 2,
    type: "hCaptcha",
    website: "shop.io",
    status: "success",
    duration: "0.9s",
    credits: 2,
    timestamp: "2024-01-15 14:30:12",
  },
  {
    id: 3,
    type: "Turnstile",
    website: "app.vercel.com",
    status: "success",
    duration: "0.8s",
    credits: 1,
    timestamp: "2024-01-15 14:28:33",
  },
  {
    id: 4,
    type: "FunCaptcha",
    website: "gaming.net",
    status: "failed",
    duration: "-",
    credits: 0,
    timestamp: "2024-01-15 14:25:18",
  },
  {
    id: 5,
    type: "reCAPTCHA v3",
    website: "dashboard.io",
    status: "success",
    duration: "1.3s",
    credits: 3,
    timestamp: "2024-01-15 14:22:45",
  },
  {
    id: 6,
    type: "GeeTest v4",
    website: "crypto.exchange",
    status: "success",
    duration: "2.1s",
    credits: 4,
    timestamp: "2024-01-15 14:18:22",
  },
  {
    id: 7,
    type: "reCAPTCHA v2",
    website: "social.app",
    status: "success",
    duration: "1.0s",
    credits: 2,
    timestamp: "2024-01-15 14:15:10",
  },
  {
    id: 8,
    type: "hCaptcha",
    website: "news.site",
    status: "failed",
    duration: "-",
    credits: 0,
    timestamp: "2024-01-15 14:12:05",
  },
  {
    id: 9,
    type: "Turnstile",
    website: "blog.dev",
    status: "success",
    duration: "0.7s",
    credits: 1,
    timestamp: "2024-01-15 14:08:33",
  },
  {
    id: 10,
    type: "reCAPTCHA v2",
    website: "mail.service",
    status: "success",
    duration: "1.2s",
    credits: 2,
    timestamp: "2024-01-15 14:05:18",
  },
]

const filterTabs = ["All", "Success", "Failed"]
const captchaTypes = ["All Types", "reCAPTCHA v2", "reCAPTCHA v3", "hCaptcha", "Turnstile", "FunCaptcha", "GeeTest v4"]

export function DashboardHistoryContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedType, setSelectedType] = useState("All Types")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredData = historyData.filter((item) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Success" && item.status === "success") ||
      (activeFilter === "Failed" && item.status === "failed")
    const matchesType = selectedType === "All Types" || item.type === selectedType
    const matchesSearch =
      item.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesType && matchesSearch
  })

  const stats = {
    total: historyData.length,
    success: historyData.filter((i) => i.status === "success").length,
    failed: historyData.filter((i) => i.status === "failed").length,
    avgTime: "1.1s",
  }

  return (
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
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Solving History</h1>
              <p className="text-muted-foreground">View and export your captcha solving activity</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease-out",
          transitionDelay: "100ms",
        }}
      >
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-500">{stats.success}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Failed</p>
          <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Avg. Time</p>
          <p className="text-2xl font-bold text-primary">{stats.avgTime}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className="flex flex-col md:flex-row gap-4 mb-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease-out",
          transitionDelay: "200ms",
        }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by website or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeFilter === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none pl-10 pr-10 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
          >
            {captchaTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button className="p-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* History Table */}
      <div
        className="rounded-2xl bg-card border border-border overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease-out",
          transitionDelay: "300ms",
        }}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            Captcha Type <ArrowUpDown className="w-3 h-3" />
          </div>
          <div className="col-span-2">Website</div>
          <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            Status <ArrowUpDown className="w-3 h-3" />
          </div>
          <div className="col-span-1">Duration</div>
          <div className="col-span-1">Credits</div>
          <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            Timestamp <ArrowUpDown className="w-3 h-3" />
          </div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {filteredData.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors cursor-pointer ${
                selectedItem === item.id ? "bg-primary/5" : ""
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                transition: "all 0.3s ease-out",
                transitionDelay: `${400 + index * 50}ms`,
              }}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      item.type.includes("reCAPTCHA")
                        ? "bg-blue-500/10"
                        : item.type.includes("hCaptcha")
                          ? "bg-amber-500/10"
                          : item.type.includes("Turnstile")
                            ? "bg-orange-500/10"
                            : "bg-purple-500/10"
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 ${
                        item.type.includes("reCAPTCHA")
                          ? "text-blue-500"
                          : item.type.includes("hCaptcha")
                            ? "text-amber-500"
                            : item.type.includes("Turnstile")
                              ? "text-orange-500"
                              : "text-purple-500"
                      }`}
                    />
                  </div>
                  <span className="font-medium text-foreground">{item.type}</span>
                </div>
              </div>
              <div className="col-span-2 text-muted-foreground truncate">{item.website}</div>
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.status === "success" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {item.status === "success" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {item.status === "success" ? "Solved" : "Failed"}
                </span>
              </div>
              <div className="col-span-1 text-muted-foreground">{item.duration}</div>
              <div className="col-span-1">
                <span className="text-primary font-medium">{item.credits}</span>
              </div>
              <div className="col-span-2 text-muted-foreground text-sm flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {item.timestamp}
              </div>
              <div className="col-span-1 text-right">
                <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No results found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between mt-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease-out",
          transitionDelay: "500ms",
        }}
      >
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredData.length}</span> of{" "}
          <span className="font-medium text-foreground">{historyData.length}</span> results
        </p>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
