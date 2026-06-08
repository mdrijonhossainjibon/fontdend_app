import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/modules/rootReducer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, HardDrive, Activity, FileText, RefreshCw, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchDatabaseStatsRequest, backupCollectionRequest, clearBackupResult } from '@/modules/admin/database/actions'

export default function DatabasePage() {
  const dispatch = useDispatch()
  const { collections, stats, loading } = useSelector((state: RootState) => state.adminDatabase)
  const [downloadingCollection, setDownloadingCollection] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchDatabaseStatsRequest())
  }, [dispatch])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const { backupResult, backupError } = useSelector((state: RootState) => state.adminDatabase)

  useEffect(() => {
    if (backupResult) {
      const { collectionName, data } = backupResult
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${collectionName}_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)

      toast.dismiss()
      toast.success(`${collectionName} exported successfully (${data?.documentCount || '?'} documents)`)
      setDownloadingCollection(null)
      dispatch(clearBackupResult())
    }
  }, [backupResult])

  useEffect(() => {
    if (backupError) {
      toast.dismiss()
      toast.error(backupError)
      setDownloadingCollection(null)
      dispatch(clearBackupResult())
    }
  }, [backupError])

  const handleDownloadBackup = (collectionName: string) => {
    setDownloadingCollection(collectionName)
    toast.loading(`Exporting ${collectionName}...`)
    dispatch(backupCollectionRequest(collectionName))
  }

  const dbStats = [
    {
      title: 'Total Size',
      value: formatBytes(stats.totalSize),
      icon: HardDrive,
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Collections',
      value: stats.totalCollections.toString(),
      icon: Database,
      color: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500/10',
      iconColor: 'text-green-600',
    },
    {
      title: 'Storage Size',
      value: formatBytes(stats.totalStorageSize),
      icon: Activity,
      color: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-end gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchDatabaseStatsRequest())}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dbStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="border-border hover:border-primary/50 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stats.databaseName && (
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Database Name</p>
                <p className="text-xl font-bold text-foreground">{stats.databaseName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Object Size</p>
                <p className="text-xl font-bold text-foreground">{formatBytes(stats.avgObjSize)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Index Size</p>
                <p className="text-xl font-bold text-foreground">{formatBytes(stats.totalIndexSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>MongoDB collections in your database</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No collections found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Collection Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Documents</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Storage Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Doc Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Indexes</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection: any, index: number) => (
                    <tr
                      key={collection.name}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                      style={{
                        opacity: 0,
                        animation: `slideInUp 0.5s ease-out ${index * 50}ms forwards`,
                      }}
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground font-mono">{collection.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-foreground">
                          {(collection.count ?? 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500/10 text-blue-700">
                          {formatBytes(collection.size || 0)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatBytes(collection.storageSize || 0)}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatBytes(collection.avgObjSize || 0)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-700">
                          {(collection.indexes?.length ?? collection.indexes ?? 0)} indexes
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white gap-2"
                            onClick={() => handleDownloadBackup(collection.name)}
                            disabled={downloadingCollection === collection.name}
                          >
                            {downloadingCollection === collection.name ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Exporting...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Backup
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
