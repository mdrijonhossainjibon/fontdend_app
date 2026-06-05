
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Loader2, Eye, Trash2, Download } from "lucide-react"
import { Solution, Pagination, TYPE_ICONS, TYPE_COLORS, SERVICE_COLORS, b64ToSrc, formatSolution } from "./_types"

// â”€â”€ Solutions Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        if (interval >= 1) return interval + "m"; // month
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + "d";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + "h";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + "m"; // minute
        return Math.floor(seconds) + "s";
    }
    const handleDownload = (sol: Solution, e: React.MouseEvent) => {
        e.stopPropagation()
        const images = [...(sol.imageData || []), ...(sol.examples || [])]
        if (images.length === 0) return

        images.forEach((b64, idx) => {
            const src = b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`
            const a = document.createElement('a')
            a.href = src
            const label = idx < (sol.imageData?.length || 0) ? 'img' : 'ref'
            a.download = `${sol.hash}-${label}-${idx + 1}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Solution Cache</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    {pagination?.total ?? 0} cached solutions Â· Click a row to view images
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-14">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : solutions.length === 0 ? (
                    <div className="text-center py-14 text-muted-foreground">
                        <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No cached solutions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    {["Question", "Service", "Type", "Preview", "Images", "Cached At", "Age", ""].map(h => (
                                        <th key={h} className="py-2.5 px-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {solutions.map((sol, i) => {
                                    const TypeIcon = TYPE_ICONS[sol.type] || Database
                                    const hasImages = sol.imageData?.length > 0
                                    return (
                                        <tr key={sol.id}
                                            className="border-b border-border hover:bg-secondary/60 transition-colors cursor-pointer group"
                                            style={{ opacity: 0, animation: `slideInUp 0.4s ease-out ${i * 30}ms forwards` }}
                                            onClick={() => onRowClick(sol)}
                                        >
                                            <td className="py-2.5 px-3 text-xs max-w-[180px]">
                                                <p className="truncate group-hover:text-primary transition-colors" title={sol.question}>{sol.question || 'â€”'}</p>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${SERVICE_COLORS[sol.service] || 'bg-muted text-muted-foreground'}`}>
                                                    {sol.service}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${TYPE_COLORS[sol.type] || 'bg-muted/50 text-muted-foreground border-border'}`}>
                                                    <TypeIcon className="w-3 h-3" />
                                                    {sol.type?.replace('object', '') || 'â€”'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-[11px] text-muted-foreground font-mono max-w-[140px] truncate" title={JSON.stringify(sol.solution)}>
                                                {formatSolution(sol.solution, sol.type)}
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <div className="flex flex-col gap-1">
                                                    {hasImages ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex -space-x-1.5">
                                                                {sol.imageData.slice(0, 3).map((img, idx) => (
                                                                    <div key={idx} className="w-6 h-6 rounded overflow-hidden border-2 border-card ring-1 ring-border">
                                                                        <img src={b64ToSrc(img)} alt="" className="w-full h-full object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {sol.imageData.length > 3 && (
                                                                <span className="text-[11px] text-muted-foreground">+{sol.imageData.length - 3}</span>
                                                            )}
                                                            <Eye className="w-3 h-3 text-primary/70 ml-0.5" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-muted-foreground/50">No images</span>
                                                    )}
                                                    {sol.examples?.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-6 h-6 rounded overflow-hidden border-2 border-teal-500/60">
                                                                <img src={b64ToSrc(sol.examples[0])} alt="ref" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-teal-600 bg-teal-500/10 px-1 py-0.5 rounded">
                                                                REF{sol.examples.length > 1 ? ` Ã—${sol.examples.length}` : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 text-[11px] text-muted-foreground whitespace-nowrap">
                                                {new Date(sol.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="py-2.5 px-3 text-[11px] font-medium text-primary whitespace-nowrap">
                                                {timeAgo(sol.createdAt)}
                                            </td>
                                            <td className="py-2.5 px-3" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" variant="outline"
                                                        className="bg-transparent border-blue-500/40 text-blue-500 hover:bg-blue-500 hover:text-white h-7 w-7 p-0"
                                                        onClick={(e) => handleDownload(sol, e)}>
                                                        <Download className="w-3 h-3" />
                                                    </Button>
                                                    <Button size="sm" variant="outline"
                                                        className="bg-transparent border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white h-7 w-7 p-0"
                                                        onClick={(e) => onDelete(sol.id, e)}>
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// â”€â”€ Pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface PaginationBarProps {
    currentPage: number
    itemsPerPage: number
    pagination: Pagination
    loading: boolean
    solutionCount: number
    onPrev: () => void
    onNext: () => void
    onPageChange: (page: number) => void
}

export function PaginationBar({
    currentPage,
    itemsPerPage,
    pagination,
    loading,
    solutionCount,
    onPrev,
    onNext,
    onPageChange
}: PaginationBarProps) {
    if (loading || solutionCount === 0) return null

    const totalPages = pagination.totalPages || 1
    const [jumpPage, setJumpPage] = useState(currentPage.toString())

    useEffect(() => {
        setJumpPage(currentPage.toString())
    }, [currentPage])

    const handleJump = (e: React.FormEvent) => {
        e.preventDefault()
        const p = parseInt(jumpPage)
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            onPageChange(p)
        } else {
            setJumpPage(currentPage.toString())
        }
    }

    const getPageNumbers = () => {
        const pages = []
        const showMax = 5
        
        if (totalPages <= showMax + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push('...')
            
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)
            
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i)
            }
            
            if (currentPage < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-card/50 rounded-xl border border-border/50">
            <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-sm font-medium text-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}â€“{Math.min(currentPage * itemsPerPage, pagination.total)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                    Total {pagination.total} entries
                </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onPrev} 
                    disabled={!pagination.hasPrevPage} 
                    className="h-8 w-8 text-xs rounded-lg"
                >
                    <span className="sr-only">Previous</span>
                    &lt;
                </Button>
                
                <div className="flex items-center gap-1.5 mx-1">
                    {getPageNumbers().map((p, i) => (
                        p === '...' ? (
                            <span key={`dots-${i}`} className="px-1 text-muted-foreground text-xs font-bold tracking-widest">...</span>
                        ) : (
                            <Button
                                key={`page-${p}`}
                                variant={currentPage === p ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(p as number)}
                                className={`h-8 min-w-[32px] text-xs font-medium rounded-lg transition-all ${
                                    currentPage === p 
                                        ? "shadow-sm shadow-primary/20 scale-105" 
                                        : "hover:bg-primary/5 hover:border-primary/30"
                                }`}
                            >
                                {p}
                            </Button>
                        )
                    ))}
                </div>

                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onNext} 
                    disabled={!pagination.hasNextPage} 
                    className="h-8 w-8 text-xs rounded-lg"
                >
                    <span className="sr-only">Next</span>
                    &gt;
                </Button>
            </div>

            <form onSubmit={handleJump} className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-border/50">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">Go to</span>
                <input
                    type="text"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    className="w-10 h-7 bg-background border border-border/50 rounded text-center text-xs font-medium focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
                <Button type="submit" variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-tight px-2 hover:bg-primary hover:text-white rounded transition-colors">
                    Jump
                </Button>
            </form>
        </div>
    )
}
