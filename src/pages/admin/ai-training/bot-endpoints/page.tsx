"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Pencil, Trash2, Search, Server, Globe, AlertCircle, CheckCircle, Link as LinkIcon, RotateCw } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import {
    fetchBotEndpointsRequest,
    createBotEndpointRequest,
    updateBotEndpointRequest,
    deleteBotEndpointRequest,
    refreshBotClassesRequest
} from "@/modules/ai-training/actions"
import { RootState } from "@/modules/rootReducer"

interface BotEndpoint {
    _id: string
    botName: string
    endpoint: string
    port: number
    protocol: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export default function BotEndpointsPage() {
    const dispatch = useDispatch()

    // Redux state
    const { botEndpoints, botEndpointsLoading, isSaving, isDeleting, isRefreshing, refreshResponse } = useSelector(
        (state: RootState) => state.aiTraining
    )

    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isRebootModalOpen, setIsRebootModalOpen] = useState(false)
    const [currentEndpoint, setCurrentEndpoint] = useState<BotEndpoint | null>(null)
    const [editingEndpoint, setEditingEndpoint] = useState<BotEndpoint | null>(null)
    const [formData, setFormData] = useState({
        botName: "",
        endpoint: "",
        port: 80,
        protocol: "http",
        isActive: true
    })

    useEffect(() => {
        dispatch(fetchBotEndpointsRequest())
    }, [dispatch])

    // Show toast for refresh response
    useEffect(() => {
        if (refreshResponse && !isRefreshing) {
            if (refreshResponse.status === "ok") {
                toast.success(refreshResponse.message || "Classes refreshed successfully")
            } else {
                toast.error(refreshResponse.message || "Failed to refresh classes")
            }
        }
    }, [refreshResponse, isRefreshing])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (editingEndpoint) {
            dispatch(updateBotEndpointRequest({
                id: editingEndpoint._id,
                endpoint: formData
            }))
        } else {
            dispatch(createBotEndpointRequest(formData))
        }

        setIsModalOpen(false)
        setFormData({ botName: "", endpoint: "", port: 80, protocol: "http", isActive: true })
        setEditingEndpoint(null)
    }

    const handleEdit = (endpoint: BotEndpoint) => {
        setEditingEndpoint(endpoint)
        setFormData({
            botName: endpoint.botName,
            endpoint: endpoint.endpoint,
            port: endpoint.port,
            protocol: endpoint.protocol,
            isActive: endpoint.isActive
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bot endpoint?")) return
        dispatch(deleteBotEndpointRequest(id))
    }

    const toggleStatus = async (endpoint: BotEndpoint) => {
        dispatch(updateBotEndpointRequest({
            id: endpoint._id,
            endpoint: {
                ...endpoint,
                isActive: !endpoint.isActive
            }
        }))
    }

    const handleReboot = async (endpoint: BotEndpoint) => {
        setCurrentEndpoint(endpoint)
        setIsRebootModalOpen(true)
        dispatch(refreshBotClassesRequest(endpoint))
    }

    const filteredEndpoints = botEndpoints.filter(
        (endpoint: BotEndpoint) =>
            endpoint.botName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            endpoint.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const activeEndpoints = botEndpoints.filter((ep: BotEndpoint) => ep.isActive).length

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <Server className="w-8 h-8 text-primary" />
                            Bot Endpoints
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage bot endpoints (IP or URL)
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingEndpoint(null)
                            setFormData({ botName: "", endpoint: "", port: 80, protocol: "http", isActive: true })
                            setIsModalOpen(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Endpoint
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search endpoints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Endpoints</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {botEndpoints.length}
                                </p>
                            </div>
                            <Server className="w-10 h-10 text-primary/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Endpoints</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {activeEndpoints}
                                </p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500/50" />
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Inactive Endpoints</p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {botEndpoints.length - activeEndpoints}
                                </p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-orange-500/50" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    {botEndpointsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredEndpoints.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <AlertCircle className="w-12 h-12 mb-4" />
                            <p className="text-lg">No bot endpoints found</p>
                            <p className="text-sm">Add your first endpoint to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Bot Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Endpoint (IP/URL)
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Port
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredEndpoints.map((endpoint: BotEndpoint) => (
                                        <tr key={endpoint._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                                                {endpoint.botName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                <a
                                                    href={`${endpoint.protocol}://${endpoint.endpoint}:${endpoint.port}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-500 hover:underline font-mono"
                                                >
                                                    {endpoint.endpoint}
                                                    <LinkIcon className="w-3 h-3" />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                                                {endpoint.port}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(endpoint)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${endpoint.isActive
                                                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                        : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                                        }`}
                                                >
                                                    {endpoint.isActive ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleReboot(endpoint)}
                                                        className="p-2 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                                                        title="Reboot"
                                                    >
                                                        <RotateCw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(endpoint)}
                                                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(endpoint._id)}
                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            {editingEndpoint ? "Edit Bot Endpoint" : "Add Bot Endpoint"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Bot Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.botName}
                                    onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., CAPTCHA Bot 1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Endpoint (IP or URL)
                                </label>
                                <input
                                    type="text"
                                    value={formData.endpoint}
                                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                    placeholder="e.g., 192.168.1.100 or bot.example.com"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Protocol
                                    </label>
                                    <select
                                        value={formData.protocol}
                                        onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="http">HTTP</option>
                                        <option value="https">HTTPS</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Port
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.port}
                                        onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                        placeholder="80"
                                        min="1"
                                        max="65535"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-foreground">
                                    Active
                                </label>
                            </div>
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : editingEndpoint ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setEditingEndpoint(null)
                                        setFormData({ botName: "", endpoint: "", port: 80, protocol: "http", isActive: true })
                                    }}
                                    className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reboot Modal */}
            {isRebootModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh Classes - {currentEndpoint?.botName}
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Endpoint:</p>
                                <p className="text-sm font-mono text-foreground break-all">
                                    {currentEndpoint?.protocol}://{currentEndpoint?.endpoint}:{currentEndpoint?.port}/refresh_classes
                                </p>
                            </div>

                            {isRefreshing ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-sm text-muted-foreground">Fetching response...</p>
                                </div>
                            ) : refreshResponse ? (
                                <div className="space-y-3">
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-foreground mb-2">Response:</p>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${refreshResponse.status === "ok"
                                            ? "bg-green-500/10 text-green-500"
                                            : "bg-red-500/10 text-red-500"
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${refreshResponse.status === "ok" ? "bg-green-500" : "bg-red-500"
                                                }`} />
                                            {refreshResponse.status?.toUpperCase()}
                                        </div>
                                        <p className="text-sm text-foreground mb-3">
                                            <span className="font-medium">Message:</span> {refreshResponse.message}
                                        </p>
                                        <details className="cursor-pointer">
                                            <summary className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                                View Full Response
                                            </summary>
                                            <pre className="mt-2 p-3 bg-background rounded text-xs overflow-auto max-h-48 font-mono">
                                                {JSON.stringify(refreshResponse, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRebootModalOpen(false)
                                        setCurrentEndpoint(null)
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
