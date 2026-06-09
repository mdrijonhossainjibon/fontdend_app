import { useState, useEffect, useCallback, useRef } from "react"
import { X, ChevronLeft, ChevronRight, CheckCircle2, ImageIcon, BookImage, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Solution, SERVICE_COLORS, TYPE_COLORS, b64ToSrc, formatSolution, copyToClipboard } from "./_types"
import { SERVICE_SVG_ICONS } from "./_svgs"
import { Button } from "@/components/ui/button"

type Tab = 'images' | 'examples'

export function ImageViewModal({
    solution,
    onClose,
}: {
    solution: Solution | null
    onClose: () => void
}) {
    const [activeIdx, setActiveIdx] = useState(0)
    const [tab, setTab] = useState<Tab>('images')
    const [zoomed, setZoomed] = useState(false)
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        setActiveIdx(0)
        setTab('images')
        setZoomed(false)
    }, [solution])

    // Keyboard & ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setZoomed(false); onClose() }
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        if (solution) window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [solution, activeIdx, tab])

    if (!solution) return null

    const images = solution.imageData || []
    const examples = solution.examples || []
    const hasExamples = examples.length > 0
    const currentSet = tab === 'images' ? images : examples
    const totalItems = currentSet.length

    const isClassify = solution.type === 'objectClassify'
    const isGridType = isClassify
        || solution.type?.toLowerCase().includes('grid')
        || images.length === 4
        || images.length === 9

    const solutionArr: boolean[] = (() => {
        if (!Array.isArray(solution.solution)) return []
        const arr = solution.solution
        if (arr.every((v: any) => typeof v === 'boolean')) return arr
        if (arr.every((v: any) => typeof v === 'number')) {
            const result: boolean[] = Array(images.length).fill(false)
            arr.forEach((idx: number) => {
                const i0 = idx - 1
                if (i0 >= 0 && i0 < images.length) result[i0] = true
                else if (idx >= 0 && idx < images.length) result[idx] = true
            })
            return result
        }
        return []
    })()

    const prev = useCallback(() => {
        setActiveIdx(i => (i - 1 + totalItems) % totalItems)
        setZoomed(false)
    }, [totalItems])

    const next = useCallback(() => {
        setActiveIdx(i => (i + 1) % totalItems)
        setZoomed(false)
    }, [totalItems])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoomed || !imgRef.current) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    }

    const ServiceIcon = solution.service ? SERVICE_SVG_ICONS[solution.service?.toLowerCase()] : null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-background rounded-2xl shadow-2xl w-[95vw] max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-2">
                            {ServiceIcon && (
                                <div className="p-1.5 rounded-lg bg-secondary/50">
                                    <ServiceIcon size={18} className="text-primary/70" />
                                </div>
                            )}
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary/80">
                                {solution.service}
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground/80">
                                {solution.type}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground/50 hidden sm:inline font-mono">
                            {solution.hash?.slice(0, 16)}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* ── Tabs ── */}
                {hasExamples && (
                    <div className="flex border-b border-border/40 px-5 pt-2 gap-1 shrink-0">
                        {(['images', 'examples'] as Tab[]).map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setActiveIdx(0); setZoomed(false) }}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border border-b-0 transition-all ${
                                    tab === t
                                        ? 'bg-background border-border/60 text-foreground -mb-[1px]'
                                        : 'border-transparent text-muted-foreground/50 hover:text-muted-foreground'
                                }`}
                            >
                                {t === 'images' ? <ImageIcon size={13} /> : <BookImage size={13} />}
                                {t === 'images' ? `Captcha (${images.length})` : `Examples (${examples.length})`}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Carousel controls - top */}
                    {totalItems > 1 && (
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button onClick={prev}
                                className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                                disabled={totalItems <= 1}>
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-xs text-muted-foreground/70 tabular-nums">
                                {activeIdx + 1} / {totalItems}
                            </span>
                            <button onClick={next}
                                className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                                disabled={totalItems <= 1}>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Zoom controls */}
                    <div className="flex justify-center gap-2 mb-3">
                        <button
                            onClick={() => setZoomed(!zoomed)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
                                zoomed
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'border-border/60 hover:bg-muted text-muted-foreground/70'
                            }`}
                        >
                            {zoomed ? <ZoomOut size={13} /> : <ZoomIn size={13} />}
                            {zoomed ? 'Zoom Out' : 'Zoom In'}
                        </button>
                        {zoomed && (
                            <button
                                onClick={() => setZoomPos({ x: 50, y: 50 })}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border/60 hover:bg-muted text-muted-foreground/70 transition-all"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Main image area */}
                    {currentSet.length > 0 ? (
                        <div
                            className={`relative mx-auto flex items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-muted/30 ${
                                zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                            }`}
                            style={{
                                maxWidth: 600,
                                height: zoomed ? 500 : 380,
                            }}
                            onClick={() => setZoomed(!zoomed)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                ref={imgRef}
                                src={b64ToSrc(currentSet[activeIdx])}
                                alt={`${tab} ${activeIdx + 1}`}
                                className={`max-w-full max-h-full object-contain transition-all duration-200 ${
                                    zoomed ? 'scale-[2.5]' : ''
                                }`}
                                style={zoomed ? {
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                } : undefined}
                                draggable={false}
                            />
                            {zoomed && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none">
                                    Click to zoom out · Hover to pan
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
                            <ImageIcon size={48} strokeWidth={1} />
                            <p className="mt-3 text-sm">No images available</p>
                        </div>
                    )}

                    {/* Grid/Classify solution overlay */}
                    {tab === 'images' && isClassify && solutionArr.length > 0 && (
                        <div className="mt-5">
                            <h4 className="text-xs font-medium text-muted-foreground/70 mb-2 flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-green-500" />
                                Solution Grid
                            </h4>
                            <div className={`grid gap-1.5 mx-auto`}
                                style={{
                                    gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(solutionArr.length))}, 1fr)`,
                                    maxWidth: 280,
                                }}
                            >
                                {solutionArr.map((checked, i) => (
                                    <div key={i}
                                        className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                            checked
                                                ? 'border-green-500 bg-green-500/10 text-green-600 shadow-lg shadow-green-500/20 scale-105'
                                                : 'border-border/40 bg-muted/30 text-muted-foreground/30'
                                        }`}
                                    >
                                        {checked ? '✓' : i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Solution details */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground/70">
                        <div className="bg-muted/30 rounded-lg p-3">
                            <span className="font-medium text-muted-foreground/50 block mb-0.5">Question</span>
                            <span>{solution.question || '—'}</span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <span className="font-medium text-muted-foreground/50 block mb-0.5">Solution</span>
                            <span className="font-mono text-[11px] break-all">{formatSolution(solution.solution, solution.type)}</span>
                        </div>
                        {solution.classNames && solution.classNames.length > 0 && (
                            <div className="bg-muted/30 rounded-lg p-3 sm:col-span-2">
                                <span className="font-medium text-muted-foreground/50 block mb-1.5">Class Names</span>
                                <div className="flex flex-wrap gap-1">
                                    {solution.classNames.map((cn, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground/70 text-[11px] font-mono">
                                            {cn}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Created at */}
                    <p className="mt-4 text-[11px] text-muted-foreground/40 text-center">
                        Created: {solution.createdAt ? new Date(solution.createdAt).toLocaleString() : '—'}
                        {' · '}
                        <button
                            onClick={() => copyToClipboard(solution.id, 'ID copied!')}
                            className="hover:text-primary/70 underline underline-offset-2 decoration-dotted"
                        >
                            Copy ID
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
