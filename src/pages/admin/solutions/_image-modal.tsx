
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, CheckCircle2, ImageIcon, BookImage } from "lucide-react"
import { Solution, SERVICE_COLORS, TYPE_COLORS, b64ToSrc, formatSolution } from "./_types"

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

    useEffect(() => {
        setActiveIdx(0)
        setTab('images')
    }, [solution])

    if (!solution) return null

    const images = solution.imageData || []
    const examples = solution.examples || []
    const hasExamples = examples.length > 0

    const isClassify = solution.type === 'objectClassify'
    const isGridType = isClassify
        || solution.type?.toLowerCase().includes('grid')
        || images.length === 4
        || images.length === 9

    // solutionArr: boolean[] for classify, or index array (e.g. [2,3,5,6,9]) â†’ convert to boolean[]
    const solutionArr: boolean[] = (() => {
        if (!Array.isArray(solution.solution)) return []
        const arr = solution.solution
        // all booleans â†’ use directly
        if (arr.every((v: any) => typeof v === 'boolean')) return arr
        // numeric indices â†’ map to boolean grid
        if (arr.every((v: any) => typeof v === 'number')) {
            const result: boolean[] = Array(images.length).fill(false)
            arr.forEach((idx: number) => {
                // handle both 0-based and 1-based indices
                const i0 = idx - 1  // try 1-based first
                if (i0 >= 0 && i0 < images.length) result[i0] = true
                else if (idx >= 0 && idx < images.length) result[idx] = true
            })
            return result
        }
        return []
    })()

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-150"
            onClick={onClose}
        >
            <div
                className="
                    bg-card border border-border shadow-2xl
                    flex flex-col
                    w-full sm:max-w-lg
                    rounded-t-2xl sm:rounded-2xl
                    max-h-[88vh] sm:max-h-[85vh]
                    animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200
                "
                onClick={e => e.stopPropagation()}
            >
                {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex-1 min-w-0 mr-3">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${SERVICE_COLORS[solution.service] || 'bg-muted text-muted-foreground'}`}>
                                {solution.service}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${TYPE_COLORS[solution.type] || 'bg-muted border-border'}`}>
                                {solution.type?.replace('object', '') || 'â€”'}
                            </span>
                        </div>
                        <h2 className="text-sm font-semibold leading-snug line-clamp-2">{solution.question || '(no question)'}</h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono truncate opacity-60">{solution.hash}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0 mt-0.5">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* â”€â”€ Tabs (only if examples exist) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                {hasExamples && (
                    <div className="flex border-b border-border shrink-0 px-4">
                        <TabBtn active={tab === 'images'} onClick={() => setTab('images')} count={images.length}>
                            <ImageIcon className="w-3.5 h-3.5" /> Captcha Images
                        </TabBtn>
                        <TabBtn active={tab === 'examples'} onClick={() => setTab('examples')} count={examples.length} accent>
                            <BookImage className="w-3.5 h-3.5" /> Reference Examples
                        </TabBtn>
                    </div>
                )}

                {/* â”€â”€ Scrollable Body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3 min-h-0">

                    {/* â•â• EXAMPLES TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                    {tab === 'examples' && hasExamples && (
                        <ExamplesView examples={examples} />
                    )}

                    {/* â•â• IMAGES TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                    {tab === 'images' && (
                        <>
                            {/* Inline ref strip (when no tabs shown) */}
                            {!hasExamples && examples.length > 0 && (
                                <div>
                                    <SectionLabel dot="teal">Ref Example{examples.length > 1 ? 's' : ''}</SectionLabel>
                                    <div className="flex gap-2 flex-wrap">
                                        {examples.map((img, i) => (
                                            <RefThumb key={i} src={img} label={`Ref ${i + 1}`} />
                                        ))}
                                    </div>
                                    <div className="mt-2.5 border-b border-border" />
                                </div>
                            )}

                            {images.length === 0 ? (
                                <EmptyImages />
                            ) : isGridType && images.length > 1 ? (
                                <ClassifyGrid images={images} solutionArr={solutionArr} classNames={solution.classNames} />
                            ) : (
                                <CarouselView images={images} activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
                            )}

                            {/* AI Answer */}
                            {images.length > 0 && (
                                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">AI Answer</p>
                                    <p className="text-xs font-mono break-all leading-relaxed">{formatSolution(solution.solution, solution.type)}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1.5">Cached: {new Date(solution.createdAt).toLocaleString()}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TabBtn({ active, onClick, count, children, accent }: {
    active: boolean, onClick: () => void, count: number, children: React.ReactNode, accent?: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all
                ${active
                    ? accent
                        ? 'border-teal-500 text-teal-600'
                        : 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }
            `}
        >
            {children}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active
                ? accent ? 'bg-teal-500/15 text-teal-600' : 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground'
                }`}>{count}</span>
        </button>
    )
}

function SectionLabel({ children, dot }: { children: React.ReactNode, dot: string }) {
    return (
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-${dot}-500 inline-block`} />
            {children}
        </p>
    )
}

function RefThumb({ src, label }: { src: string, label: string }) {
    return (
        <div className="relative rounded-lg overflow-hidden border-2 border-teal-500/60 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
            <img src={b64ToSrc(src)} alt={label} className="h-16 w-auto object-cover" />
            <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-teal-500 text-white text-[9px] font-bold">REF</div>
        </div>
    )
}

function ExamplesView({ examples }: { examples: string[] }) {
    const [idx, setIdx] = useState(0)
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
                Reference images used as <span className="font-semibold text-teal-600">examples</span> for this captcha type.
            </p>
            {/* Navigation */}
            {examples.length > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{idx + 1} / {examples.length}</p>
                    <div className="flex gap-1">
                        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
                            className="p-1 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIdx(i => Math.min(examples.length - 1, i + 1))} disabled={idx === examples.length - 1}
                            className="p-1 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            {/* Main example image */}
            <div className="rounded-xl overflow-hidden border-2 border-teal-500/50 shadow-[0_0_16px_rgba(20,184,166,0.15)] bg-muted/20">
                <img src={b64ToSrc(examples[idx])} alt={`Example ${idx + 1}`} className="w-full object-contain max-h-[280px] sm:max-h-[320px]" />
            </div>
            {/* Thumbnail strip */}
            {examples.length > 1 && (
                <div className="flex gap-1.5 flex-wrap justify-center">
                    {examples.map((img, i) => (
                        <button key={i} onClick={() => setIdx(i)}
                            className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all ${i === idx ? 'border-teal-500' : 'border-border opacity-50 hover:opacity-90'}`}>
                            <img src={b64ToSrc(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
            <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
                <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider mb-1">About Reference Examples</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    These images were provided as reference/example objects for the captcha challenge. They help identify the target objects.
                </p>
            </div>
        </div>
    )
}

function EmptyImages() {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No images stored</p>
            <p className="text-xs mt-1 opacity-60">Saved from the next requests onwards</p>
        </div>
    )
}

function ClassifyGrid({ images, solutionArr, classNames }: { 
    images: string[], 
    solutionArr: boolean[], 
    classNames?: string[] 
}) {
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-2">
                Grid â€” {images.length} tiles Â·&nbsp;
                <span className="text-green-600 font-semibold">{solutionArr.filter(Boolean).length} selected</span>
                {classNames && classNames.length > 0 && (
                    <span className="ml-2 text-blue-600 font-semibold">
                        {classNames.length} classes
                    </span>
                )}
            </p>
            <div className={`grid gap-1.5 ${images.length === 9 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {images.map((img, i) => (
                    <div key={i}
                        className={`relative rounded-md overflow-hidden border-2 transition-all aspect-square ${solutionArr[i]
                            ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.35)]'
                            : 'border-border opacity-75'
                            }`}
                    >
                        <img src={b64ToSrc(img)} alt={`Tile ${i + 1}`} className="w-full h-full object-cover" />
                        {solutionArr[i] && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-1">
                            <span className="text-white text-[10px] font-bold">#{i + 1}</span>
                            {classNames && classNames[i] && (
                                <span className="text-white text-[9px] ml-1 bg-blue-500/60 px-1 rounded">
                                    {classNames[i]}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {classNames && classNames.length > 0 && (
                <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">Detected Classes</p>
                    <div className="flex flex-wrap gap-1">
                        {classNames.map((className, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-700 px-1.5 py-0.5 rounded">
                                {className || `Tile ${i + 1}`}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function CarouselView({ images, activeIdx, setActiveIdx }: {
    images: string[], activeIdx: number, setActiveIdx: (fn: (i: number) => number) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            {images.length > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Image {activeIdx + 1} / {images.length}</p>
                    <div className="flex gap-1">
                        <button onClick={() => setActiveIdx(i => Math.max(0, i - 1))} disabled={activeIdx === 0}
                            className="p-1 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setActiveIdx(i => Math.min(images.length - 1, i + 1))} disabled={activeIdx === images.length - 1}
                            className="p-1 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            <div className="rounded-xl overflow-hidden border border-border w-full bg-muted/20">
                <img src={b64ToSrc(images[activeIdx])} alt="Captcha" className="w-full object-contain max-h-[260px] sm:max-h-[310px]" />
            </div>
            {images.length > 1 && (
                <div className="flex gap-1.5 flex-wrap justify-center">
                    {images.map((img, i) => (
                        <button key={i} onClick={() => setActiveIdx(() => i)}
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-md overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-primary' : 'border-border opacity-50 hover:opacity-90'}`}>
                            <img src={b64ToSrc(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
