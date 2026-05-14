"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RefreshCw, HeartPulse, Server, AlertCircle, CheckCircle, XCircle, Clock, Activity } from "lucide-react"
import { toast } from "sonner"
import {
    fetchHealthStatusesRequest,
    runHealthCheckRequest,
} from "@/modules/admin/health-check/actions"
import type { RootState } from "@/modules/rootReducer"

interface HealthStatus {
    _id: string
    botName: string
    endpoint: string
    status: "healthy" | "unhealthy" | "unknown"
    responseTime: number
    lastChecked: string
    uptime: number
    errorMessage?: string
    healthData?: {
        status?: string
        timestamp?: string
        system?: {
            uptime_seconds?: number
            uptime_formatted?: string
            boot_time?: string
            process_count?: number
        }
        cpu?: {
            usage_percent?: number
            count_logical?: number
            count_physical?: number
            frequency_mhz?: {
                current?: number
                min?: number
                max?: number
            }
        }
        memory?: {
            total_gb?: number
            available_gb?: number
            used_gb?: number
            percent?: number
            swap_total_gb?: number
            swap_used_gb?: number
            swap_percent?: number
        }
        disk?: {
            total_gb?: number
            used_gb?: number
            free_gb?: number
            percent?: number
            io?: {
                read_mb?: number
                write_mb?: number
                read_count?: number
                write_count?: number
            }
        }
        network?: {
            bytes_sent_mb?: number
            bytes_recv_mb?: number
            packets_sent?: number
            packets_recv?: number
            errors_in?: number
            errors_out?: number
            drops_in?: number
            drops_out?: number
        }
        gpu?: {
            available?: boolean
            device?: string
            device_name?: string
            device_count?: number
            memory_allocated_gb?: number
            memory_reserved_gb?: number
        }
        database?: {
            status?: string
            name?: string
            collections_count?: number
        }
        application?: {
            version?: string
            clip_model?: string
            object_classes_count?: number
            color_classes_count?: number
        }
    }
}

export default function HealthCheckPage() {
    const dispatch = useDispatch()
    const { healthStatuses, loading } = useSelector((state: RootState) => state.adminHealthCheck)
    const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        dispatch(fetchHealthStatusesRequest())
    }, [dispatch])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(fetchHealthStatusesRequest())
        }, 30000)
        return () => clearInterval(interval)
    }, [dispatch])

    const runHealthCheck = async (endpointId?: string) => {
        if (endpointId) {
            setCheckingIds(prev => new Set(prev).add(endpointId))
        }

        dispatch(runHealthCheckRequest(endpointId))

        // Keep the checking spinner for the API call, then remove it
        // The saga will update the store with results
        setTimeout(() => {
            if (endpointId) {
                setCheckingIds(prev => {
                    const next = new Set(prev)
                    next.delete(endpointId)
                    return next
                })
            }
        }, 2000)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
                return "text-green-500 bg-green-500/10"
            case "unhealthy":
                return "text-red-500 bg-red-500/10"
            default:
                return "text-orange-500 bg-orange-500/10"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "healthy":
                return <CheckCircle className="w-5 h-5" />
            case "unhealthy":
                return <XCircle className="w-5 h-5" />
            default:
                return <AlertCircle className="w-5 h-5" />
        }
    }

    const healthyCount = healthStatuses.filter((s: HealthStatus) => s.status === "healthy").length
    const unhealthyCount = healthStatuses.filter((s: HealthStatus) => s.status === "unhealthy").length
    const avgResponseTime = healthStatuses.length > 0
        ? Math.round(healthStatuses.reduce((sum: number, s: HealthStatus) => sum + s.responseTime, 0) / healthStatuses.length)
        : 0

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <HeartPulse className="w-8 h-8 text-primary" />
                            Health Check
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor bot health and uptime
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Bots</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {healthStatuses.length}
                                </p>
                            </div>
                            <Server className="w-10 h-10 text-primary/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Healthy</p>
                                <p className="text-2xl font-bold text-green-500 mt-1">
                                    {healthyCount}
                                </p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Unhealthy</p>
                                <p className="text-2xl font-bold text-red-500 mt-1">
                                    {unhealthyCount}
                                </p>
                            </div>
                            <XCircle className="w-10 h-10 text-red-500/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Response</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {avgResponseTime}ms
                                </p>
                            </div>
                            <Activity className="w-10 h-10 text-blue-500/50" />
                        </div>
                    </div>
                </div>

                {/* Health Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : healthStatuses.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground bg-card border border-border rounded-lg">
                            <AlertCircle className="w-12 h-12 mb-4" />
                            <p className="text-lg">No bots to monitor</p>
                            <p className="text-sm">Add bot endpoints to start monitoring</p>
                        </div>
                    ) : (
                        (healthStatuses as HealthStatus[]).map((health) => (
                            <div
                                key={health._id}
                                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                            {health.botName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono truncate">
                                            {health.endpoint}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => runHealthCheck(health._id)}
                                            disabled={checkingIds.has(health._id)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
                                            title="Run Health Check"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${checkingIds.has(health._id) ? "animate-spin" : ""}`} />
                                        </button>
                                        <div className={`p-2 rounded-lg ${getStatusColor(health.status)}`}>
                                            {getStatusIcon(health.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-4">
                                    <span
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            health.status
                                        )}`}
                                    >
                                        {health.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Metrics */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Response Time
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {health.responseTime}ms
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Uptime
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {health.uptime.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            Last Checked
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {new Date(health.lastChecked).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {health.errorMessage && (
                                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <p className="text-xs text-red-500 font-medium">
                                            {health.errorMessage}
                                        </p>
                                    </div>
                                )}

                                {/* Detailed Health Metrics */}
                                {health.healthData && health.status === "healthy" && (
                                    <details className="mt-4 cursor-pointer">
                                        <summary className="text-sm font-medium text-muted-foreground hover:text-foreground p-2 bg-muted/30 rounded">
                                            View Detailed Metrics
                                        </summary>
                                        <div className="mt-3 space-y-3 text-xs">
                                            {/* System Info */}
                                            {health.healthData.system && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">System</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Uptime: {health.healthData.system.uptime_formatted}</p>
                                                        <p>Processes: {health.healthData.system.process_count}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CPU Info */}
                                            {health.healthData.cpu && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">CPU</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Usage: {health.healthData.cpu.usage_percent}%</p>
                                                        <p>Cores: {health.healthData.cpu.count_physical} physical, {health.healthData.cpu.count_logical} logical</p>
                                                        {health.healthData.cpu.frequency_mhz?.current && (
                                                            <p>Frequency: {health.healthData.cpu.frequency_mhz.current} MHz</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Memory Info */}
                                            {health.healthData.memory && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">Memory</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Used: {health.healthData.memory.used_gb} GB / {health.healthData.memory.total_gb} GB ({health.healthData.memory.percent}%)</p>
                                                        <p>Available: {health.healthData.memory.available_gb} GB</p>
                                                        {(health.healthData.memory.swap_total_gb ?? 0) > 0 && (
                                                            <p>Swap: {health.healthData.memory.swap_used_gb} GB / {health.healthData.memory.swap_total_gb} GB</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Disk Info */}
                                            {health.healthData.disk && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">Disk</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Used: {health.healthData.disk.used_gb} GB / {health.healthData.disk.total_gb} GB ({health.healthData.disk.percent}%)</p>
                                                        <p>Free: {health.healthData.disk.free_gb} GB</p>
                                                        {health.healthData.disk.io && (
                                                            <>
                                                                <p className="pt-1 text-xs opacity-75">I/O Operations:</p>
                                                                <p>Read: {health.healthData.disk.io.read_mb} MB ({health.healthData.disk.io.read_count?.toLocaleString()} ops)</p>
                                                                <p>Write: {health.healthData.disk.io.write_mb} MB ({health.healthData.disk.io.write_count?.toLocaleString()} ops)</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Network Info */}
                                            {health.healthData.network && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">Network</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Sent: {health.healthData.network.bytes_sent_mb} MB ({health.healthData.network.packets_sent?.toLocaleString()} packets)</p>
                                                        <p>Received: {health.healthData.network.bytes_recv_mb} MB ({health.healthData.network.packets_recv?.toLocaleString()} packets)</p>
                                                        {((health.healthData.network.errors_in ?? 0) > 0 || (health.healthData.network.errors_out ?? 0) > 0) && (
                                                            <p className="text-orange-500">Errors: In {health.healthData.network.errors_in}, Out {health.healthData.network.errors_out}</p>
                                                        )}
                                                        {((health.healthData.network.drops_in ?? 0) > 0 || (health.healthData.network.drops_out ?? 0) > 0) && (
                                                            <p className="text-red-500">Drops: In {health.healthData.network.drops_in}, Out {health.healthData.network.drops_out}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* GPU Info */}
                                            {health.healthData.gpu?.available && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">GPU</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Device: {health.healthData.gpu.device_name}</p>
                                                        <p>Count: {health.healthData.gpu.device_count}</p>
                                                        {health.healthData.gpu.memory_allocated_gb && (
                                                            <p>Memory: {health.healthData.gpu.memory_allocated_gb} GB allocated, {health.healthData.gpu.memory_reserved_gb} GB reserved</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Database Info */}
                                            {health.healthData.database && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">Database</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Status: <span className={health.healthData.database.status === "connected" ? "text-green-500" : "text-red-500"}>{health.healthData.database.status}</span></p>
                                                        <p>Name: {health.healthData.database.name}</p>
                                                        <p>Collections: {health.healthData.database.collections_count}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Application Info */}
                                            {health.healthData.application && (
                                                <div className="p-3 bg-muted/30 rounded">
                                                    <p className="font-semibold text-foreground mb-2">Application</p>
                                                    <div className="space-y-1 text-muted-foreground">
                                                        <p>Version: {health.healthData.application.version}</p>
                                                        <p>Model: {health.healthData.application.clip_model}</p>
                                                        <p>Object Classes: {health.healthData.application.object_classes_count}</p>
                                                        <p>Color Classes: {health.healthData.application.color_classes_count}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                )}

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${health.status === "healthy"
                                                ? "bg-green-500"
                                                : health.status === "unhealthy"
                                                    ? "bg-red-500"
                                                    : "bg-orange-500"
                                                }`}
                                            style={{ width: `${health.uptime}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Auto-refresh indicator */}
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Auto-refreshing every 30 seconds
                </div>
            </div>
        </div>
    )
}
