import {
    Grid3X3, MousePointerClick, Grip, Tag,
} from "lucide-react"

export interface Solution {
    id: string
    hash: string
    question: string
    type: string
    service: string
    solution: any
    imageData: string[]
    examples: string[]
    classNames: string[]
    createdAt: string
}

export interface Stats {
    total: number
    today: number
    byService: Record<string, number>
    byType: Record<string, number>
}

export interface Pagination {
    total: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
}

export const TYPE_ICONS: Record<string, any> = {
    objectClassify: Grid3X3,
    objectClick: MousePointerClick,
    objectDrag: Grip,
    objectTag: Tag,
}

export const TYPE_COLORS: Record<string, string> = {
    objectClassify: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    objectClick: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    objectDrag: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    objectTag: "bg-green-500/10 text-green-600 border-green-500/20",
}

export const SERVICE_COLORS: Record<string, string> = {
    hcaptcha: "bg-teal-500/10 text-teal-600",
    awswaf: "bg-orange-500/10 text-orange-600",
    recaptcha: "bg-indigo-500/10 text-indigo-600",
}

export function formatSolution(solution: any, type: string): string {
    if (!solution) return '—'
    if (type === 'objectClassify') {
        const arr = Array.isArray(solution) ? solution : []
        return `${arr.filter(Boolean).length}/${arr.length} selected`
    }
    if (type === 'objectClick') {
        const arr = Array.isArray(solution) ? solution : []
        return arr.map((p: any) => `(${p.x?.toFixed(0)}, ${p.y?.toFixed(0)})`).join(' → ')
    }
    if (type === 'objectDrag') {
        const arr = Array.isArray(solution) ? solution : []
        return arr.map((d: any) => `[${d.start}] → [${d.end}]`).join(', ')
    }
    if (type === 'objectTag') {
        return Array.isArray(solution) ? solution.join(', ') : String(solution)
    }
    return JSON.stringify(solution).slice(0, 60)
}

export function b64ToSrc(b64: string) {
    if (b64.startsWith('data:')) return b64
    return `data:image/png;base64,${b64}`
}
