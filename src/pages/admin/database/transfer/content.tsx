"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowRightLeft,
  Server,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Terminal,
  RefreshCw,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/modules/rootReducer"
import {
  fetchSourceInfoRequest,
  connectTargetRequest,
  transferDatabasesRequest,
  resetTransfer,
} from "@/modules/admin/database-transfer/actions"
import type { DatabaseInfo } from "@/modules/admin/database-transfer/reducer"

interface TransferLog {
  type: "info" | "success" | "error" | "warning"
  message: string
  timestamp: string
}

export default function TransferContent() {
  const dispatch = useDispatch()
  const {
    sourceInfo,
    sourceLoading,
    connecting,
    connected,
    databases,
    transferring,
    transferComplete,
    transferError,
    connectError,
  } = useSelector((state: RootState) => state.adminDatabaseTransfer)

  // Target connection
  const [targetHost, setTargetHost] = useState("")
  const [targetPort, setTargetPort] = useState("27017")
  const [targetUser, setTargetUser] = useState("")
  const [targetPass, setTargetPass] = useState("")
  const [targetAuthDb, setTargetAuthDb] = useState("admin")

  // Local state
  const [selectedDbs, setSelectedDbs] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<TransferLog[]>([])

  // Auto-load source info on mount
  useEffect(() => {
    dispatch(fetchSourceInfoRequest())
  }, [dispatch])

  const addLog = (type: TransferLog["type"], message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { type, message, timestamp }])
  }

  // Track connection result
  useEffect(() => {
    if (connected) {
      addLog("success", `Connected to target! ${databases.length} databases found on source`)
    }
  }, [connected])

  useEffect(() => {
    if (connectError) {
      addLog("error", `Connection failed: ${connectError}`)
      toast.error(`Connection failed: ${connectError}`)
    }
  }, [connectError])

  useEffect(() => {
    if (transferError) {
      addLog("error", `Transfer failed: ${transferError}`)
      toast.error(`Transfer failed: ${transferError}`)
    }
  }, [transferError])

  const handleConnect = () => {
    if (!targetHost) {
      toast.error("Please enter target host address")
      return
    }

    setLogs([])
    addLog("info", `Source server: ${sourceInfo?.host}:${sourceInfo?.port} (auto-detected)`)
    addLog("info", `Connecting to target: ${targetHost}:${targetPort}...`)

    dispatch(connectTargetRequest({
      host: targetHost,
      port: parseInt(targetPort),
      user: targetUser || undefined,
      password: targetPass || undefined,
      authDb: targetAuthDb,
    }))
  }

  const toggleDatabase = (name: string) => {
    setSelectedDbs((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedDbs.size === databases.length) {
      setSelectedDbs(new Set())
    } else {
      setSelectedDbs(new Set(databases.map((d: DatabaseInfo) => d.name)))
    }
  }

  const handleTransfer = () => {
    if (selectedDbs.size === 0) {
      toast.error("Please select at least one database to transfer")
      return
    }

    addLog("info", `Starting transfer of ${selectedDbs.size} database(s) to ${targetHost}...`)

    dispatch(transferDatabasesRequest({
      target: {
        host: targetHost,
        port: parseInt(targetPort),
        user: targetUser || undefined,
        password: targetPass || undefined,
        authDb: targetAuthDb,
      },
      databases: Array.from(selectedDbs),
    }))
  }

  // Listen for transfer complete
  useEffect(() => {
    if (transferComplete) {
      addLog("success", `Successfully transferred database(s) to ${targetHost}`)
      toast.success("Transfer complete!")
    }
  }, [transferComplete])

  const handleReset = () => {
    dispatch(resetTransfer())
    setSelectedDbs(new Set())
    setLogs([])
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-end">
        {connected && (
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            New Transfer
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Server — auto-detected */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Source Server</CardTitle>
                <CardDescription>Current server (auto-detected)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sourceLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading source info...
              </div>
            ) : sourceInfo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">This server's database configuration</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Host</span>
                    <span className="font-mono font-medium">{sourceInfo.host}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Port</span>
                    <span className="font-mono font-medium">{sourceInfo.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database</span>
                    <span className="font-mono font-medium">{sourceInfo.dbName}</span>
                  </div>
                  {(sourceInfo as any).version && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version</span>
                      <span className="font-mono font-medium">{(sourceInfo as any).version}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Could not auto-detect source info. Make sure the backend is running.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Target Server — manual */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Server className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Target Server</CardTitle>
                <CardDescription>Enter destination server details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="targetHost">Host / IP</Label>
                <Input
                  id="targetHost"
                  placeholder="192.168.1.101"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  disabled={connected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPort">Port</Label>
                <Input
                  id="targetPort"
                  placeholder="27017"
                  value={targetPort}
                  onChange={(e) => setTargetPort(e.target.value)}
                  disabled={connected}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="targetUser">Username (optional)</Label>
                <Input
                  id="targetUser"
                  placeholder="admin"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  disabled={connected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPass">Password</Label>
                <Input
                  id="targetPass"
                  type="password"
                  placeholder="••••••••"
                  value={targetPass}
                  onChange={(e) => setTargetPass(e.target.value)}
                  disabled={connected}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAuthDb">Auth Database</Label>
              <Input
                id="targetAuthDb"
                placeholder="admin"
                value={targetAuthDb}
                onChange={(e) => setTargetAuthDb(e.target.value)}
                disabled={connected}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connect Button (before connected) */}
      {!connected && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleConnect}
            disabled={connecting || !targetHost || sourceLoading}
            className="gap-3 px-8"
          >
            {connecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-5 h-5" />
                Connect & Fetch Databases
              </>
            )}
          </Button>
        </div>
      )}

      {/* Database Selection (after connected) */}
      {connected && (
        <>
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Database className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Select Databases</CardTitle>
                    <CardDescription>
                      Choose databases to copy from source to target
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {selectedDbs.size} / {databases.length} selected
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={toggleAll} className="text-xs">
                    {selectedDbs.size === databases.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {databases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No databases found on source server
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {databases.map((db: DatabaseInfo) => {
                    const isSelected = selectedDbs.has(db.name)
                    return (
                      <label
                        key={db.name}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:border-border/80 hover:bg-secondary/50",
                        )}
                        onClick={() => toggleDatabase(db.name)}
                      >
                        <Checkbox checked={isSelected} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{db.name}</p>
                          {db.collections !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              {db.collections} collection{db.collections !== 1 ? "s" : ""}
                              {db.size ? ` · ${db.size}` : ""}
                            </p>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleTransfer}
              disabled={transferring || selectedDbs.size === 0}
              className="gap-3 px-10 text-base"
            >
              {transferring ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transferring {selectedDbs.size} database(s) to {targetHost}...
                </>
              ) : transferComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  Transfer Complete
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Transfer to {targetHost}
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Transfer Logs */}
      {logs.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-500/10">
                <Terminal className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Transfer Log</CardTitle>
                <CardDescription>Real-time operation logs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1.5 max-h-60 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
                  {log.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                  {log.type === "error" && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                  {log.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                  {log.type === "info" && <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                  <span
                    className={cn(
                      log.type === "success" && "text-green-600",
                      log.type === "error" && "text-red-500",
                      log.type === "warning" && "text-amber-500",
                      log.type === "info" && "text-foreground",
                    )}
                  >
                    {log.message}
                  </span>
                </div>
              ))}
              {(transferring || connecting) && (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
