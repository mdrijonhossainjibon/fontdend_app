
import { useEffect, useState } from 'react'
import {
  Activity,
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
  LogIn,
  Settings,
  Zap,
  Shield,
  CreditCard,
  Key,
  Globe,
  X,
  MapPin,
  Monitor,
} from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/modules/rootReducer'
import { fetchActivitiesRequest } from '@/modules/dashboard/actions'
import { SkeletonTable } from '@/components/skeletons'

const filterTabs = ['All', 'Success', 'Failed', 'Warning']
const activityTypes = ['All Types', 'Login', 'Settings', 'Payment', 'API', 'Security']

export function DashboardActivitiesContent() {
  const dispatch = useDispatch()
  const { activities: activitiesData, activitiesLoading: loading } = useSelector((state: RootState) => state.dashboard)

  const [isVisible, setIsVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedType, setSelectedType] = useState('All Types')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)
    dispatch(fetchActivitiesRequest())
  }, [dispatch])

  const filteredData = activitiesData.filter((item: any) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Success' && item.status === 'success') ||
      (activeFilter === 'Failed' && item.status === 'failed') ||
      (activeFilter === 'Warning' && item.status === 'warning')
    const matchesType = selectedType === 'All Types' || item.action.toLowerCase().includes(selectedType.toLowerCase())
    const matchesSearch =
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesType && matchesSearch
  })

  const stats = {
    total: activitiesData.length,
    success: activitiesData.filter((i: any) => i.status === 'success').length,
    failed: activitiesData.filter((i: any) => i.status === 'failed').length,
    warning: activitiesData.filter((i: any) => i.status === 'warning').length,
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return LogIn
      case 'settings':
        return Settings
      case 'payment':
        return CreditCard
      case 'api':
        return Zap
      case 'security':
        return Shield
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-blue-500/10 text-blue-500'
      case 'settings':
        return 'bg-purple-500/10 text-purple-500'
      case 'payment':
        return 'bg-green-500/10 text-green-500'
      case 'api':
        return 'bg-amber-500/10 text-amber-500'
      case 'security':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className="p-8 ">
      {/* Header */}
      <div
        className="mb-8"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
              <p className="text-muted-foreground">View all your account activities and security events</p>
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
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out',
          transitionDelay: '100ms',
        }}
      >
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Activities</p>
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
          <p className="text-sm text-muted-foreground mb-1">Warnings</p>
          <p className="text-2xl font-bold text-amber-500">{stats.warning}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className="flex flex-col md:flex-row gap-4 mb-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out',
          transitionDelay: '200ms',
        }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities, locations..."
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
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeFilter === tab
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
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
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => dispatch(fetchActivitiesRequest())}
          className="p-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Activities Table */}
      <div
        className="rounded-2xl bg-card border border-border overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out',
          transitionDelay: '300ms',
        }}
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-3">Activity</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">IP Address</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="p-4">
            <SkeletonTable />
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {filteredData.map((item: any, index: number) => {
                const IconComponent = getActivityIcon(item.type)
                const colorClass = getActivityColor(item.type)

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors cursor-pointer ${selectedItem === item.id ? 'bg-primary/5' : ''
                      }`}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                      transition: 'all 0.3s ease-out',
                      transitionDelay: `${index * 50}ms`,
                    }}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                  >
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-muted-foreground text-sm flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {item.location}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'success'
                          ? 'bg-green-500/10 text-green-500'
                          : item.status === 'failed'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-amber-500/10 text-amber-500'
                          }`}
                      >
                        {item.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : item.status === 'failed' ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-2 text-muted-foreground text-sm font-mono">{item.ip}</div>
                    <div className="col-span-2 text-muted-foreground text-sm flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedActivity(item)
                        }}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-1">No activities found</p>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between mt-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out',
          transitionDelay: '500ms',
        }}
      >
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredData.length}</span> of{' '}
          <span className="font-medium text-foreground">{activitiesData.length}</span> results
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
              className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
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
