"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/modules/rootReducer"
import { fetchBotEndpointsRequest } from "@/modules/admin/upload-model/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, Loader2, Cloud, Database, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface BotEndpoint {
    _id: string
    botName: string
    endpoint: string
    port: number
    protocol: string
    isActive: boolean
}

type UploadPhase = "idle" | "uploading" | "processing" | "done" | "error"

interface UploadState {
    phase: UploadPhase
    progress: number
    message: string
    botResult: any | null
}

function UploadCard({
    title,
    description,
    icon: Icon,
    accent,
    showEndpointSelect,
    endpoints,
    loadingEndpoints,
    selectedEndpoint,
    onEndpointChange,
    uploadTarget,
    file,
    onFileChange,
    onUpload,
    uploadState,
}: {
    title: string
    description: string
    icon: any
    accent: string
    showEndpointSelect?: boolean
    endpoints?: BotEndpoint[]
    loadingEndpoints?: boolean
    selectedEndpoint?: string
    onEndpointChange?: (v: string) => void
    uploadTarget: string
    file: File | null
    onFileChange: (f: File | null) => void
    onUpload: () => void
    uploadState: UploadState
}) {
    const isBusy = uploadState.phase === "uploading" || uploadState.phase === "processing"
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile && droppedFile.name.endsWith(".pt")) {
            onFileChange(droppedFile)
        } else if (droppedFile) {
            toast({ title: "Invalid File", description: "Only .pt files are allowed.", variant: "destructive" })
        }
    }

    return (
        <Card className="border-border/60 overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent.replace("from-", "bg-").replace("/80", "/10").split(" ")[0].replace("via-", "").replace("to-", ""))}>
                        <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <CardDescription className="text-xs">{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {showEndpointSelect && endpoints && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Bot Endpoint</label>
                        {loadingEndpoints ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </div>
                        ) : endpoints.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No endpoints found.{" "}
                                <a href="/admin/ai-training/bot-endpoints" className="text-primary hover:underline">
                                    Create one
                                </a>
                            </p>
                        ) : (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const el = document.getElementById(`dd-${uploadTarget}`)
                                        const backdrop = document.getElementById(`dd-backdrop-${uploadTarget}`)
                                        const isHidden = el?.classList.contains("hidden")
                                        document.querySelectorAll("[id^='dd-']:not([id*='backdrop'])").forEach(e => e.classList.add("hidden"))
                                        if (isHidden) {
                                            el?.classList.remove("hidden")
                                            backdrop?.classList.remove("hidden")
                                        }
                                    }}
                                    className="w-full h-11 px-3 rounded-xl bg-secondary/50 border border-border text-sm flex items-center justify-between gap-2 hover:bg-secondary/80 transition-colors"
                                >
                                    <span className="truncate text-foreground">
                                        {endpoints.find((ep: BotEndpoint) => ep._id === selectedEndpoint)?.botName || "Select endpoint"}
                                    </span>
                                    <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div
                                    id={`dd-backdrop-${uploadTarget}`}
                                    className="hidden fixed inset-0 z-40"
                                    onClick={() => {
                                        document.getElementById(`dd-${uploadTarget}`)?.classList.add("hidden")
                                        document.getElementById(`dd-backdrop-${uploadTarget}`)?.classList.add("hidden")
                                    }}
                                />
                                <div
                                    id={`dd-${uploadTarget}`}
                                    className="hidden absolute top-full mt-1 left-0 right-0 z-50 rounded-xl bg-card border border-border shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                                >
                                    {endpoints.map((ep: BotEndpoint) => {
                                        const isActive = ep.isActive
                                        const selected = ep._id === selectedEndpoint
                                        return (
                                            <button
                                                key={ep._id}
                                                type="button"
                                                onClick={() => {
                                                    onEndpointChange?.(ep._id)
                                                    document.getElementById(`dd-${uploadTarget}`)?.classList.add("hidden")
                                                    document.getElementById(`dd-backdrop-${uploadTarget}`)?.classList.add("hidden")
                                                }}
                                                className={`w-full px-3 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors ${
                                                    selected
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-foreground hover:bg-secondary/50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-green-500" : "bg-gray-500"}`} />
                                                    <span className="truncate font-medium">{ep.botName}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground shrink-0">{ep.protocol}://{ep.endpoint}:{ep.port}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Model File (.pt)</label>
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                            isDragOver
                                ? "border-primary border-solid bg-primary/5 scale-[1.02]"
                                : "border-border hover:border-primary/40"
                        }`}
                        onClick={() => document.getElementById(`upload-${uploadTarget}`)?.click()}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            id={`upload-${uploadTarget}`}
                            type="file"
                            accept=".pt"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0]
                                if (f && f.name.endsWith(".pt")) {
                                    onFileChange(f)
                                } else {
                                    toast({ title: "Invalid File", description: "Only .pt files are allowed.", variant: "destructive" })
                                    e.target.value = ""
                                }
                            }}
                        />
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <File className="w-8 h-8 text-primary" />
                                <p className="text-sm font-medium text-foreground truncate max-w-full">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onFileChange(null) }} disabled={isBusy}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Drop or click to browse .pt files</p>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    onClick={onUpload}
                    disabled={!file || isBusy}
                    className="w-full h-11 rounded-xl font-semibold"
                >
                    {uploadState.phase === "uploading" ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                        </div>
                    ) : uploadState.phase === "processing" ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload to {title}
                        </div>
                    )}
                </Button>

                {/* Phase-based progress display */}
                {uploadState.phase === "uploading" && (
                    <div className="space-y-2">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${uploadState.progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            <span>Uploading...</span>
                            <span>{uploadState.progress}%</span>
                        </div>
                    </div>
                )}

                {uploadState.phase === "processing" && (
                    <div className="space-y-2">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 animate-pulse rounded-full" style={{ width: "100%" }} />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Server processing...</span>
                            </div>
                            {uploadState.message && (
                                <span className="text-[9px]">{uploadState.message}</span>
                            )}
                        </div>
                    </div>
                )}

                {uploadState.phase === "done" && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                {uploadState.botResult?.success
                                    ? "Model uploaded & processed on bot"
                                    : "Model uploaded & saved locally"}
                            </div>
                        </div>
                    </div>
                )}

                {uploadState.phase === "error" && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs text-red-600 dark:text-red-400">{uploadState.message || "Upload failed"}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function UploadModelContent() {
    const dispatch = useDispatch()
    const { endpoints, loading: loadingEndpoints } = useSelector((state: RootState) => state.adminUploadModel)
    const [isVisible, setIsVisible] = useState(false)

    const [awsEndpointId, setAwsEndpointId] = useState("")
    const [kbsEndpointId, setKbsEndpointId] = useState("")
    const [awsFile, setAwsFile] = useState<File | null>(null)
    const [kbsFile, setKbsFile] = useState<File | null>(null)

    const [awsState, setAwsState] = useState<UploadState>({ phase: "idle", progress: 0, message: "", botResult: null })
    const [kbsState, setKbsState] = useState<UploadState>({ phase: "idle", progress: 0, message: "", botResult: null })

    useEffect(() => {
        setIsVisible(true)
        dispatch(fetchBotEndpointsRequest())
    }, [dispatch])

    // Auto-select first endpoint when list loads
    useEffect(() => {
        if (endpoints.length > 0) {
            if (!awsEndpointId) setAwsEndpointId(endpoints[0]._id)
            if (!kbsEndpointId) setKbsEndpointId(endpoints[0]._id)
        }
    }, [endpoints, awsEndpointId, kbsEndpointId])

    const doUpload = async (
        file: File,
        modelType: "aws" | "kbs",
        endpointId: string | undefined,
        setState: Dispatch<SetStateAction<UploadState>>
    ) => {
        if (!endpointId) {
            toast({ title: "Error", description: "Please select an endpoint first.", variant: "destructive" })
            return
        }

        const endpoint = endpoints.find(ep => ep._id === endpointId)
        if (!endpoint) {
            toast({ title: "Error", description: "Selected endpoint not found.", variant: "destructive" })
            return
        }

        // Upload via Main Backend /api/admin/upload-model
        const botUrl = `${endpoint.protocol}://${endpoint.endpoint}:${endpoint.port}/upload-model`
        const url = `/api/admin/upload-model`

        const formData = new FormData()
        formData.append("file", file)
        formData.append("botUrl", botUrl)
        formData.append("botEndpointId", endpointId)
        formData.append("modelType", modelType)

        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open("POST", url)

            // Auth Token
            const token = localStorage.getItem("authToken")
            if (token) {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`)
            }

            // Cache Control
            xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            xhr.setRequestHeader("Pragma", "no-cache")
            xhr.setRequestHeader("Expires", "0")

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100)
                    setState({
                        phase: "uploading",
                        progress: percent,
                        message: "",
                        botResult: null,
                    })
                }
            })

            xhr.addEventListener("load", () => {
                try {
                    const data = JSON.parse(xhr.responseText)

                    if (data.success) {
                        // Upload complete — show done with real bot result
                        setState({
                            phase: "done",
                            progress: 100,
                            message: "Bot processing complete",
                            botResult: data,
                        })

                        const botMsg = `${file.name} uploaded & processed by ${modelType.toUpperCase()} bot successfully.`

                        toast({
                            title: "Success ✓",
                            description: botMsg,
                            variant: "default",
                        })
                        resolve()
                    } else {
                        const errMsg = typeof data.error === 'object' ? data.message || data.error?.message || 'Bot rejected upload' : data.error || data.message || 'Bot rejected upload'
                        setState({
                            phase: "error",
                            progress: 0,
                            message: errMsg,
                            botResult: null,
                        })
                        toast({
                            title: "Upload Failed",
                            description: errMsg,
                            variant: "destructive",
                        })
                        reject()
                    }
                } catch {
                    setState({
                        phase: "error",
                        progress: 0,
                        message: "Failed to parse server response",
                        botResult: null,
                    })
                    toast({
                        title: "Error",
                        description: "Failed to parse server response.",
                        variant: "destructive",
                    })
                    reject()
                }
            })

            xhr.upload.addEventListener("load", () => {
                // Upload finished (100% sent), server is now processing
                setState(prev => ({
                    ...prev,
                    phase: "processing",
                    message: "Bot processing model...",
                }))
            })

            xhr.addEventListener("error", () => {
                setState({
                    phase: "error",
                    progress: 0,
                    message: "Network error. Please try again.",
                    botResult: null,
                })
                toast({
                    title: "Error",
                    description: "Network error. Please try again.",
                    variant: "destructive",
                })
                reject()
            })

            xhr.send(formData)
        })
    }

    const handleUpload = async (modelType: "aws" | "kbs") => {
        const file = modelType === "aws" ? awsFile : kbsFile
        const endpointId = modelType === "aws" ? awsEndpointId : kbsEndpointId
        const setState = modelType === "aws" ? setAwsState : setKbsState

        if (!file) return

        // Reset
        setState({ phase: "uploading", progress: 0, message: "", botResult: null })

        try {
            await doUpload(file, modelType, endpointId, setState)
        } catch {
            // Error state already set by doUpload
        }
    }

    return (
        <div
            className="space-y-6 p-4 sm:p-6"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s ease-out",
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UploadCard
                    title="AWS"
                    description="Upload model to AWS cloud"
                    icon={Cloud}
                    accent="from-orange-500/80 via-orange-400/40 to-transparent"
                    showEndpointSelect
                    endpoints={endpoints}
                    loadingEndpoints={loadingEndpoints}
                    selectedEndpoint={awsEndpointId}
                    onEndpointChange={setAwsEndpointId}
                    uploadTarget="aws"
                    file={awsFile}
                    onFileChange={(f) => {
                        setAwsFile(f)
                        if (f) setAwsState({ phase: "idle", progress: 0, message: "", botResult: null })
                    }}
                    uploadState={awsState}
                    onUpload={() => handleUpload("aws")}
                />

                <UploadCard
                    title="KBS"
                    description="Upload model to KBS"
                    icon={Database}
                    accent="from-emerald-500/80 via-emerald-400/40 to-transparent"
                    showEndpointSelect
                    endpoints={endpoints}
                    loadingEndpoints={loadingEndpoints}
                    selectedEndpoint={kbsEndpointId}
                    onEndpointChange={setKbsEndpointId}
                    uploadTarget="kbs"
                    file={kbsFile}
                    onFileChange={(f) => {
                        setKbsFile(f)
                        if (f) setKbsState({ phase: "idle", progress: 0, message: "", botResult: null })
                    }}
                    uploadState={kbsState}
                    onUpload={() => handleUpload("kbs")}
                />
            </div>
        </div>
    )
}
