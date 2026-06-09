import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Eye, Trash2, Download, Copy } from "lucide-react"
import { Solution, Pagination, TYPE_ICONS, TYPE_COLORS, SERVICE_COLORS, b64ToSrc, formatSolution, copyToClipboard } from "./_types"
import { SERVICE_SVG_ICONS, TableSkeleton, EmptyStateSvg } from "./_svgs"

// ── Solutions Table ─────────────────────────────────────────────────────────
interface TableProps {
    solutions: Solution[]
    loading: boolean
    pagination: Pagination | null
    onRowClick: (sol: Solution) => void
    onDelete: (id: string, e: React.MouseEvent) => void
}

export function SolutionsTable({ solutions, loading, pagination, onRowClick, onDelete }: TableProps) {
    const timeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + "y";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + "m";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + "d";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + "h";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + "m";
        return Math.floor(seconds) + "s";
    }

    const handleDownload = (sol: Solution, e: React.MouseEvent) => {
        e.stopPropagation()
        const images = [...(sol.imageData || []), ...(sol.examples || [])]
        if (images.length === 0) return

        images.forEach((b64, i) => {
            const link = document.createElement('a')
            link.download = `captcha_${sol.hash?.slice(0, 8) || i}_${i}.png`
            link.href = b64ToSrc(b64)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    }

    if (loading) {
        return (
            <Card className="border-border">
                <CardHeader className="pb-3">
                    <div className="h-5 w-40 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-60 rounded bg-muted/60 animate-pulse" />
                </CardHeader>
                <CardContent>
                    <TableSkeleton rows={6} />
                </CardContent>
            </Card>
        )
    }

    if (!solutions || solutions.length === 0) {
        return (
            <Card className="border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <EmptyStateSvg />
                    <h3 className="text-lg font-semibold mt-4 text-muted-foreground/80">No solutions found</h3>
                    <p className="text-sm text-muted-foreground/50 mt-1 text-center max-w-xs">
                        Try adjusting your search or filters, or wait for new captcha solutions to be cached.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Database size={16} className="text-primary/70" />
                    Cached Solutions
                    {pagination && (
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                            ({pagination.total} total)
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/60">
                                <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3">Service</th>
                                <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3">Hash</th>
                                <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3 hidden md:table-cell">Question</th>
                                <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3">Type</th>
                                <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3">Images</th>
                                <th className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Age</th>
                                <th className="text-right text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solutions.map((sol, idx) => {
                                const TypeIcon = TYPE_ICONS[sol.type]
                                const SvgsIcon = SERVICE_SVG_ICONS[sol.service?.toLowerCase()]
                                const serviceColorClass = SERVICE_COLORS[sol.service?.toLowerCase()] || "bg-gray-500/10 text-gray-600"
                                const typeColorClass = TYPE_COLORS[sol.type] || "bg-gray-500/10 text-gray-600"
                                const imgCount = (sol.imageData?.length || 0) + (sol.examples?.length || 0)

                                return (
                                    <tr key={sol.id}
                                        onClick={() => onRowClick(sol)}
                                        className="border-b border-border/30 hover:bg-muted/40 cursor-pointer transition-colors duration-150 group"
                                        style={{ animationDelay: `${idx * 30}ms` }}
                                    >
                                        {/* Service */}
                                        <td className="px-4 py-3">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${serviceColorClass}`}>
                                                {SvgsIcon ? <SvgsIcon size={14} /> : null}
                                                {sol.service}
                                            </div>
                                        </td>

                                        {/* Hash */}
                                        <td className="px-4 py-3">
                                            <code className="text-xs font-mono text-muted-foreground/80 bg-muted/50 px-1.5 py-0.5 rounded">
                                                {sol.hash?.slice(0, 12)}...
                                            </code>
                                            <button
                                                onClick={e => { e.stopPropagation(); copyToClipboard(sol.hash, 'Hash copied!') }}
                                                className="ml-1.5 inline-flex text-muted-foreground/40 hover:text-primary/70 transition-colors"
                                                title="Copy hash"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </td>

                                        {/* Question */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-muted-foreground/80 truncate max-w-[200px] block">
                                                {sol.question || '—'}
                                            </span>
                                        </td>

                                        {/* Type */}
                                        <td className="px-4 py-3">
                                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${typeColorClass}`}>
                                                {TypeIcon ? <TypeIcon size={12} /> : null}
                                                {sol.type?.replace('object', '') || '—'}
                                            </div>
                                        </td>

                                        {/* Images count */}
                                        <td className="px-4 py-3 text-muted-foreground/70 text-xs">{imgCount}</td>

                                        {/* Age */}
                                        <td className="px-4 py-3 text-muted-foreground/60 text-xs hidden lg:table-cell">
                                            {sol.createdAt ? timeAgo(sol.createdAt) : '—'}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost" size="icon" className="h-7 w-7"
                                                    onClick={e => { e.stopPropagation(); onRowClick(sol) }}
                                                    title="View images"
                                                >
                                                    <Eye size={13} />
                                                </Button>
                                                {imgCount > 0 && (
                                                    <Button
                                                        variant="ghost" size="icon" className="h-7 w-7"
                                                        onClick={e => handleDownload(sol, e)}
                                                        title="Download all images"
                                                    >
                                                        <Download size={13} />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                    onClick={e => { e.stopPropagation(); onDelete(sol.id, e) }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

// ── Pagination Bar ──────────────────────────────────────────────────────────
interface PaginationProps {
    pagination: Pagination | null
    currentPage: number
    onPageChange: (page: number) => void
    loading: boolean
}

export function PaginationBar({ pagination, currentPage, onPageChange, loading }: PaginationProps) {
    if (!pagination || pagination.totalPages <= 1) return null

    const totalPages = pagination.totalPages
    const maxVisible = 5

    const getPages = (): (number | '...')[] => {
        const pages: (number | '...')[] = []
        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
            return pages
        }

        pages.push(1)
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)

        if (currentPage <= 3) { start = 2; end = Math.min(maxVisible, totalPages - 1) }
        if (currentPage >= totalPages - 2) { start = Math.max(2, totalPages - maxVisible + 1); end = totalPages - 1 }

        if (start > 2) pages.push('...')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)

        return pages
    }

    return (
        <div className="flex items-center justify-between gap-3 mt-4 px-1">
            <p className="text-xs text-muted-foreground/60">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-border/60 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    Prev
                </button>
                {getPages().map((p, i) =>
                    p === '...' ? (
                        <span key={`e${i}`} className="px-1.5 text-xs text-muted-foreground/40">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            disabled={p === currentPage || loading}
                            className={`min-w-[30px] h-8 text-xs rounded-md border transition-all ${
                                p === currentPage
                                    ? 'bg-primary text-primary-foreground border-primary font-medium'
                                    : 'border-border/60 hover:bg-muted disabled:opacity-50'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="px-2.5 py-1.5 text-xs rounded-md border border-border/60 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
