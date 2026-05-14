import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, message } from 'antd'
import {
    Package,
    Upload,
    Trash2,
    RefreshCw,
    Download,
    Eye,
    EyeOff,
    Plus,
    Loader2,
    FileArchive,
    CheckCircle2,
    XCircle,
    ToggleLeft,
    ToggleRight,
    Monitor,

    Globe,
    Edit2,
    AlertCircle,
    Copy,
    Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { ChromeIcon } from '@/components/chrome-icon'
import { RootState } from '@/modules/rootReducer'
import { fetchExtensionsRequest, uploadExtensionRequest, updateExtensionRequest, deleteExtensionRequest } from '@/modules/admin/extensions/actions'
import type { AdminExtension } from '@/modules/admin/extensions/reducer'

const platformIcons: Record<string, React.ElementType> = {
    Chrome: ChromeIcon,
    Firefox: Globe,
    Windows: Monitor,
    macOS: Monitor,
    Linux: Monitor,
    All: Globe,
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function AdminExtensionsPage() {
    const dispatch = useDispatch()
    const { extensions, stats, loading, uploading, saving } = useSelector(
        (state: RootState) => state.adminExtensions,
    )

    // Upload Modal state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Edit Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingExt, setEditingExt] = useState<AdminExtension | null>(null)

    const [uploadForm, setUploadForm] = useState({
        name: '',
        description: '',
        version: '',
        platform: 'All',
        changelog: '',
        icon: '',
    })

    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        version: '',
        changelog: '',
    })

    useEffect(() => {
        dispatch(fetchExtensionsRequest())
    }, [dispatch])

    const handleFileSelect = async (file: File) => {
        setSelectedFile(file)

        // Auto-detect version and name for .zip and .crx files
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (ext === 'zip' || ext === 'crx') {
            try {
                setIsScanning(true)
                const formData = new FormData()
                formData.append('file', file)

                const token = localStorage.getItem("authToken")
                const res = await fetch('/api/admin/extensions/scan', {
                    method: 'POST',
                    headers: {
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    },
                    body: formData
                })
                const data = await res.json()

                if (data.success) {
                    setUploadForm(prev => ({
                        ...prev,
                        name: data.data.name || prev.name || '',
                        version: data.data.version || prev.version || '',
                        description: data.data.description || prev.description || '',
                        platform: data.data.platform || prev.platform || 'All',
                        changelog: data.data.changelog || prev.changelog || '',
                        releaseNote: data.data.releaseNote || prev.releaseNote || ''
                    }))
                    message.success(`Detected: ${data.data.name || 'Extension'} v${data.data.version || ''}`)
                }
            } catch (err) {
                console.warn('Auto-detection failed', err)
            } finally {
                setIsScanning(false)
            }
        } else if (!uploadForm.name) {
            // Basic fallback: Auto-fill name from file name for non-zip files
            const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
            setUploadForm((f) => ({ ...f, name: baseName }))
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            message.error('Please select a file')
            return
        }
        if (!uploadForm.name || !uploadForm.version) {
            message.error('Name and version are required')
            return
        }

        dispatch(uploadExtensionRequest({
            file: selectedFile,
            name: uploadForm.name,
            description: uploadForm.description,
            version: uploadForm.version,
            platform: uploadForm.platform,
            changelog: uploadForm.changelog,
            icon: uploadForm.icon || undefined,
        }))

        setIsUploadModalOpen(false)
        resetUploadForm()
    }

    const resetUploadForm = () => {
        setSelectedFile(null)
        setUploadForm({ name: '', description: '', version: '', platform: 'All', changelog: '', icon: '' })
    }

    const handleCopyLink = (ext: AdminExtension) => {
        const url = `${window.location.origin}${ext.downloadUrl}`
        navigator.clipboard.writeText(url)
        toast({
            title: "Direct link copied!",
            description: "Direct download link is now in your clipboard.",
        })
    }

    const handleSocialShare = (ext: AdminExtension) => {
        const url = `${window.location.origin}/extensions`
        const text = `Check out this extension: ${ext.name}`

        if (navigator.share) {
            navigator.share({
                title: ext.name,
                text: text,
                url: url,
            }).catch(console.error)
        } else {
            // Fallback to Telegram
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        }
    }

    const handleToggleActive = (ext: AdminExtension) => {
        dispatch(updateExtensionRequest({ id: ext._id, isActive: !ext.isActive }))
    }

    const handleDelete = (ext: AdminExtension) => {
        Modal.confirm({
            title: 'Delete Extension',
            content: `Are you sure you want to delete "${ext.name}"? This will permanently remove the file.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => dispatch(deleteExtensionRequest(ext._id)),
        })
    }

    const openEdit = (ext: AdminExtension) => {
        setEditingExt(ext)
        setEditForm({
            name: ext.name,
            description: ext.description,
            version: ext.version,
            changelog: ext.changelog,
        })
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = () => {
        if (!editingExt) return
        dispatch(updateExtensionRequest({ id: editingExt._id, data: editForm }))
        setIsEditModalOpen(false)
    }

    const getFileIcon = (fileType: string) => {
        const icons: Record<string, string> = {
            '.zip': '🗜️',
            '.crx': '🧩',
            '.xpi': '🦊',
            '.exe': '🖥️',
            '.dmg': '🍎',
            '.deb': '🐧',
        }
        return icons[fileType] || '📦'
    }

    return (
        <div>
            {/* Header & Actions */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Extensions</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Upload and manage downloadable extensions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => dispatch(fetchExtensionsRequest())} disabled={loading} className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        className="bg-amber-500 hover:bg-amber-600 gap-2"
                        onClick={() => {
                            resetUploadForm()
                            setIsUploadModalOpen(true)
                        }}
                    >
                        <Upload className="w-4 h-4" />
                        Upload Extension
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total Extensions</p>
                    <p className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.active ?? 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                    <p className="text-2xl font-bold text-amber-500">{(stats?.totalDownloads ?? 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Extensions List */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : extensions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
                    <FileArchive className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-medium">No extensions uploaded yet</p>
                    <p className="text-sm mt-1">Click "Upload Extension" to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {extensions.map((ext, idx) => {
                        const PlatformIcon = platformIcons[ext.platform] || Globe
                        return (
                            <div
                                key={ext._id}
                                className="relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-amber-500/40 transition-all duration-300 group"
                                style={{ opacity: 0, animation: `slideInUp 0.4s ease-out ${idx * 60}ms forwards` }}
                            >
                                {/* Status indicator */}
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    {ext.isActive ? (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-500/10 px-2 py-1 rounded-full">
                                            <XCircle className="w-3 h-3" /> Inactive
                                        </span>
                                    )}
                                </div>

                                {/* File icon & name */}
                                <div className="flex items-start gap-3 mb-4 pr-20">
                                    <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                                        {ext.iconUrl ? (
                                            <img src={ext.iconUrl} alt={ext.name} className="w-full h-full object-cover" />
                                        ) : (
                                            getFileIcon(ext.fileType)
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-foreground truncate">{ext.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">v{ext.version}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                {ext.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ext.description}</p>
                                )}

                                {/* Meta info */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-muted/30 rounded-lg p-2">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Platform</p>
                                        <div className="flex items-center gap-1.5">
                                            <PlatformIcon className="w-3 h-3 text-foreground" />
                                            <p className="text-sm font-bold text-foreground">{ext.platform}</p>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-2">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Size</p>
                                        <p className="text-sm font-bold text-foreground">{formatBytes(ext.fileSize)}</p>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-2">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Downloads</p>
                                        <div className="flex items-center gap-1.5">
                                            <Download className="w-3 h-3 text-amber-500" />
                                            <p className="text-sm font-bold text-foreground">{(ext.downloads ?? 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-2">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Type</p>
                                        <p className="text-sm font-bold text-foreground font-mono">{ext.fileType}</p>
                                    </div>
                                </div>

                                {/* Uploaded date */}
                                <p className="text-xs text-muted-foreground mb-4">
                                    Uploaded: {new Date(ext.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(ext)}
                                        className="flex-1 py-2 rounded-lg bg-transparent border border-blue-500/40 text-blue-500 font-bold text-xs hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(ext)}
                                        className={`flex-1 py-2 rounded-lg bg-transparent border font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1 ${ext.isActive
                                            ? 'border-yellow-500/40 text-yellow-500 hover:bg-yellow-500 hover:text-white'
                                            : 'border-green-500/40 text-green-500 hover:bg-green-500 hover:text-white'
                                            }`}
                                    >
                                        {ext.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        {ext.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleCopyLink(ext)}
                                        className="py-2 px-3 rounded-lg bg-transparent border border-blue-500/40 text-blue-500 font-bold text-xs hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center justify-center"
                                        title="Copy Link"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleSocialShare(ext)}
                                        className="py-2 px-3 rounded-lg bg-transparent border border-amber-500/40 text-amber-500 font-bold text-xs hover:bg-amber-500 hover:text-white transition-all duration-200 flex items-center justify-center"
                                        title="Share/Post"
                                    >
                                        <Share2 className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ext)}
                                        className="py-2 px-3 rounded-lg bg-transparent border border-red-500/40 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>

                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                title={
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Upload Extension</h2>
                        <p className="text-sm text-muted-foreground">Upload a new extension file for users to download</p>
                    </div>
                }
                open={isUploadModalOpen}
                onCancel={() => {
                    setIsUploadModalOpen(false)
                    resetUploadForm()
                }}
                footer={[
                    <Button
                        key="cancel"
                        variant="outline"
                        onClick={() => {
                            setIsUploadModalOpen(false)
                            resetUploadForm()
                        }}
                        disabled={uploading}
                        className="bg-transparent"
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="upload"
                        className="bg-amber-500 hover:bg-amber-600 gap-2"
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload
                            </>
                        )}
                    </Button>,
                ]}
                width={680}
                centered
            >
                <div className="space-y-5 py-4">
                    {/* Drop Zone */}
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${dragOver
                            ? 'border-amber-500 bg-amber-500/5'
                            : selectedFile
                                ? 'border-green-500 bg-green-500/5'
                                : 'border-border hover:border-amber-500/50 hover:bg-muted/20'
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setDragOver(true)
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault()
                            setDragOver(false)
                            const file = e.dataTransfer.files?.[0]
                            if (file) handleFileSelect(file)
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".zip,.crx,.xpi,.exe,.dmg,.deb"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileSelect(file)
                            }}
                        />
                        {selectedFile ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="text-3xl">{isScanning ? '🔍' : '📦'}</div>
                                <div className="text-left">
                                    <p className="font-bold text-green-600">
                                        {isScanning ? 'Scanning manifest...' : selectedFile.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                                </div>
                                {isScanning ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                                    <Upload className="w-6 h-6 text-amber-500" />
                                </div>
                                <p className="font-semibold text-foreground mb-1">Drop your extension file here</p>
                                <p className="text-sm text-muted-foreground">or click to browse</p>
                                <p className="text-xs text-muted-foreground mt-2 bg-muted/50 inline-block px-3 py-1 rounded-full">
                                    .zip • .crx • .xpi • .exe • .dmg • .deb (max 500MB)
                                </p>
                            </>
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">
                            Extension Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., CaptchaMaster Chrome Extension"
                            value={uploadForm.name}
                            onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                        <textarea
                            rows={2}
                            placeholder="Brief description of what this extension does..."
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Version & Platform */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Version <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 1.0.0"
                                value={uploadForm.version}
                                onChange={(e) => setUploadForm({ ...uploadForm, version: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Platform</label>
                            <select
                                value={uploadForm.platform}
                                onChange={(e) => setUploadForm({ ...uploadForm, platform: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                            >
                                <option value="All">All Platforms</option>
                                <option value="Chrome">Chrome</option>
                                <option value="Firefox">Firefox</option>
                                <option value="Windows">Windows</option>
                                <option value="macOS">macOS</option>
                                <option value="Linux">Linux</option>
                            </select>
                        </div>
                    </div>

                    {/* Changelog */}
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Changelog / Release Notes</label>
                        <textarea
                            rows={3}
                            placeholder={"What's new in this version?\n- Bug fixes\n- New features"}
                            value={uploadForm.changelog}
                            onChange={(e) => setUploadForm({ ...uploadForm, changelog: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all resize-none font-mono text-sm"
                        />
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title={
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Edit Extension</h2>
                        <p className="text-sm text-muted-foreground">Update extension information</p>
                    </div>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={[
                    <Button key="cancel" variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={saving} className="bg-transparent">
                        Cancel
                    </Button>,
                    <Button key="save" className="bg-amber-500 hover:bg-amber-600" onClick={handleSaveEdit} disabled={saving}>
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : 'Save Changes'}
                    </Button>,
                ]}
                width={560}
                centered
            >
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Name</label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                        <textarea
                            rows={2}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Version</label>
                        <input
                            type="text"
                            value={editForm.version}
                            onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Changelog</label>
                        <textarea
                            rows={4}
                            value={editForm.changelog}
                            onChange={(e) => setEditForm({ ...editForm, changelog: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-foreground outline-none transition-all resize-none font-mono text-sm"
                        />
                    </div>
                </div>
            </Modal>

            <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}
