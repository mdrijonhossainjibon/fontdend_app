"use client"

import { FileText, Copy, Check, Code, Key, Shield, Server, Globe, Play, Loader2, Package, ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { API_CALL } from '@/lib/auth-fingerprint'

const sections = [
    { id: 'auth', title: 'Authentication', icon: Shield },
    { id: 'base-url', title: 'Base URL', icon: Globe },
    { id: 'stats', title: 'Dashboard Stats', icon: Shield },
    { id: 'pricing', title: 'Pricing Plans', icon: Server },
    { id: 'buy', title: 'Buy Package', icon: ShoppingCart },
    { id: 'packages', title: 'Customer Packages', icon: Package },
    { id: 'api-keys', title: 'API Keys', icon: Key },
    { id: 'errors', title: 'Error Codes', icon: Shield },
    { id: 'rate-limits', title: 'Rate Limits', icon: Server },
]

const sectionContent: Record<string, { desc: string; endpoints: { method: string; path: string; desc: string; code: string; tryEndpoint?: string; tryMethod?: string; tryBody?: any; tryPath?: string }[] }> = {
    auth: {
        desc: 'All API requests require a valid API key passed via the Authorization header.',
        endpoints: [
            { method: '', path: 'Authorization', desc: '', code: 'Authorization: Bearer rk_live_xxxxxxxxxxxx' },
        ],
    },
    'base-url': {
        desc: 'All endpoints are relative to this base URL. The API automatically uses your current domain.',
        endpoints: [
            { method: '', path: 'Base URL', desc: '', code: 'https://captchamaster.com/api' },
        ],
    },
    stats: {
        desc: 'Get reseller dashboard statistics — customers, API keys, credits, and usage.',
        endpoints: [
            { method: 'GET', path: '/api/reseller/stats', desc: 'Check your reseller wallet balance and stats.', code: 'curl https://captchamaster.com/api/reseller/stats \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryEndpoint: '/reseller/stats' },
        ],
    },
    pricing: {
        desc: 'Get all available pricing plans for purchasing packages.',
        endpoints: [
            { method: 'GET', path: '/api/reseller/pricing-plans', desc: 'List all active pricing plans.', code: 'curl https://captchamaster.com/api/reseller/pricing-plans \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryEndpoint: '/reseller/pricing-plans' },
        ],
    },
    buy: {
        desc: 'Purchase a package for a customer. Requires a valid pricing plan ID and customer email.',
        endpoints: [
            { method: 'POST', path: '/api/reseller/purchase/:planId', desc: 'Buy a package for a customer.', code: 'curl -X POST https://captchamaster.com/api/reseller/purchase/{planId} \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "customerEmail": "customer@example.com"\n  }\'', tryMethod: 'POST', tryPath: '/reseller/purchase/{planId}', tryBody: { customerEmail: 'customer@example.com' } },
        ],
    },
    packages: {
        desc: 'List all customer packages or delete a specific one.',
        endpoints: [
            { method: 'GET', path: '/api/reseller/packages', desc: 'Get all customer packages with API keys, credits, and expiry.', code: 'curl https://captchamaster.com/api/reseller/packages \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryEndpoint: '/reseller/packages' },
            { method: 'DELETE', path: '/api/reseller/packages/:id', desc: 'Delete a customer package.', code: 'curl -X DELETE https://captchamaster.com/api/reseller/packages/{id} \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryMethod: 'DELETE', tryPath: '/reseller/packages/{id}' },
        ],
    },
    'api-keys': {
        desc: 'Manage standalone API keys — list, create, regenerate, and delete.',
        endpoints: [
            { method: 'GET', path: '/api/reseller/api-keys', desc: 'List all API keys.', code: 'curl https://captchamaster.com/api/reseller/api-keys \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryEndpoint: '/reseller/api-keys' },
            { method: 'POST', path: '/api/reseller/api-keys', desc: 'Create a new API key.', code: 'curl -X POST https://captchamaster.com/api/reseller/api-keys \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "name": "My App Key"\n  }\'', tryEndpoint: '/reseller/api-keys', tryMethod: 'POST', tryBody: { name: 'Test Key' } },
            { method: 'PUT', path: '/api/reseller/api-keys/:id/regenerate', desc: 'Regenerate an API key.', code: 'curl -X PUT https://captchamaster.com/api/reseller/api-keys/{id}/regenerate \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryMethod: 'PUT', tryPath: '/reseller/api-keys/{id}/regenerate' },
            { method: 'DELETE', path: '/api/reseller/api-keys/:id', desc: 'Delete an API key.', code: 'curl -X DELETE https://captchamaster.com/api/reseller/api-keys/{id} \\\n  -H "Authorization: Bearer rk_live_xxxxxxxxxxxx"', tryMethod: 'DELETE', tryPath: '/reseller/api-keys/{id}' },
        ],
    },
    errors: {
        desc: 'Common API error responses:',
        endpoints: [
            { method: '401', path: 'Unauthorized', desc: 'Invalid or missing API key', code: '' },
            { method: '402', path: 'Payment Required', desc: 'Insufficient balance', code: '' },
            { method: '404', path: 'Not Found', desc: 'Resource not found (plan, key, package)', code: '' },
            { method: '429', path: 'Too Many Requests', desc: 'Rate limit exceeded', code: '' },
            { method: '500', path: 'Server Error', desc: 'Internal server error', code: '' },
        ],
    },
    'rate-limits': {
        desc: 'API rate limits depend on your package. Exceeding the limit will return a 429 response.',
        endpoints: [],
    },
}

function PayloadPopup({ open, onClose, method, payloadText, setPayloadText, onSend, trying }: {
    open: boolean; onClose: () => void; method?: string; payloadText: string; setPayloadText: (v: string) => void; onSend: () => void; trying: boolean
}) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-xl mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div>
                        <h3 className="font-semibold text-sm">Request Payload</h3>
                        <p className="text-[11px] text-muted-foreground">Edit the JSON body for this {method} request.</p>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4">
                    <textarea
                        value={payloadText}
                        onChange={e => setPayloadText(e.target.value)}
                        className="w-full text-xs font-mono bg-muted border border-border rounded-lg p-3 h-48 resize-y focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors">Cancel</button>
                    <button onClick={onSend} disabled={trying} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {trying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    )
}

function CodeBlock({ code, tryEndpoint, tryMethod, tryBody, tryPath }: { code: string; tryEndpoint?: string; tryMethod?: string; tryBody?: any; tryPath?: string }) {
    const [copied, setCopied] = useState(false)
    const [trying, setTrying] = useState(false)
    const [tryResult, setTryResult] = useState<any>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [payloadText, setPayloadText] = useState(tryBody ? JSON.stringify(tryBody, null, 2) : '')
    const [pathValues, setPathValues] = useState<Record<string, string>>({})

    const pathParams = tryPath ? tryPath.match(/\{(\w+)\}/g)?.map(p => p.replace(/[{}]/g, '')) || [] : []
    const isBodyMethod = tryMethod && tryMethod !== 'GET'
    const urlReady = !pathParams.length || pathParams.every(p => pathValues[p]?.trim())

    const buildUrl = () => {
        if (!tryEndpoint) return ''
        let url = tryEndpoint
        if (tryPath) {
            let idx = 0
            url = tryPath.replace(/\{(\w+)\}/g, () => pathValues[pathParams[idx++]] || `{${pathParams[idx - 1]}}`)
        }
        return url
    }

    const handleTry = async () => {
        const url = buildUrl()
        if (!url || url.includes('{')) return
        setTrying(true)
        setTryResult(null)
        setShowPopup(false)
        try {
            const opts: any = { method: tryMethod || 'GET', url }
            const bodyText = payloadText || (tryBody ? JSON.stringify(tryBody) : '')
            if (bodyText && isBodyMethod) {
                try { opts.body = JSON.parse(bodyText) } catch { opts.body = bodyText }
            }
            const res = await API_CALL(opts)
            setTryResult({ success: true, data: res.response || res })
        } catch (err: any) {
            setTryResult({ success: false, error: err?.message || 'Request failed' })
        } finally {
            setTrying(false)
        }
    }

    const handleTryClick = () => {
        if (!tryEndpoint) return
        if (isBodyMethod && !tryBody) {
            setPayloadText('{\n  \n}')
            setShowPopup(true)
            return
        }
        handleTry()
    }

    return (
        <div className="relative group">
            <PayloadPopup open={showPopup} onClose={() => setShowPopup(false)} method={tryMethod} payloadText={payloadText} setPayloadText={setPayloadText} onSend={handleTry} trying={trying} />

            <pre className="text-xs font-mono bg-background/80 rounded-lg p-3 overflow-x-auto whitespace-pre text-foreground/80 pr-16">{code}</pre>

            <div className="absolute top-2 right-2 flex items-center gap-1">
                {tryEndpoint && (
                    <button onClick={handleTryClick} disabled={trying || !urlReady}
                        className="p-1.5 rounded-md bg-primary/10 opacity-70 hover:opacity-100 transition-opacity hover:bg-primary/20 disabled:opacity-30"
                        title="Try this request">
                        {trying ? <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" /> : <Play className="w-3.5 h-3.5 text-primary" />}
                    </button>
                )}
                <button onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); toast.success('Copied to clipboard'); setTimeout(() => setCopied(false), 2000) }}
                    className="p-1.5 rounded-md bg-muted/50 opacity-70 hover:opacity-100 transition-opacity hover:bg-muted">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
            </div>

            {pathParams.length > 0 && (
                <div className="mt-2 space-y-1">
                    {pathParams.map(p => (
                        <div key={p} className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground w-16">{p}:</span>
                            <input value={pathValues[p] || ''} onChange={e => setPathValues(prev => ({ ...prev, [p]: e.target.value }))}
                                className="flex-1 text-xs font-mono bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={`Enter ${p}`} />
                        </div>
                    ))}
                </div>
            )}

            {tryResult && (
                <div className={`mt-2 rounded-lg p-2 text-[11px] font-mono whitespace-pre overflow-x-auto ${tryResult.success ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                    {tryResult.success ? JSON.stringify(tryResult.data, null, 2) : tryResult.error}
                </div>
            )}
        </div>
    )
}

export default function ResellerDocs() {
    const [active, setActive] = useState('auth')

    const content = sectionContent[active]
    const activeSection = sections.find(s => s.id === active)

    return (
        <div className="flex gap-6">
            {/* Left Sidebar */}
            <div className="w-56 flex-shrink-0">
                <div className="sticky top-6 space-y-1">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Endpoints</h2>
                    {sections.map(s => {
                        const Icon = s.icon
                        const isActive = active === s.id
                        return (
                            <button key={s.id} onClick={() => setActive(s.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all ${isActive ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                                <Icon className="w-4 h-4" />
                                <span>{s.title}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">API Documentation</h1>
                        <p className="text-muted-foreground">Integrate CaptchaMaster into your application using simple REST API calls.</p>
                    </div>
                </div>

                {content && (
                    <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {activeSection && <activeSection.icon className="w-4 h-4 text-primary" />}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{activeSection?.title}</h2>
                                    <p className="text-xs text-muted-foreground">{content.desc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-4 space-y-4">
                            {content.endpoints.length === 0 && active === 'rate-limits' && (
                                <p className="text-sm text-muted-foreground">API rate limits depend on your package. Exceeding the limit will return a <span className="font-medium text-red-500">429</span> response.</p>
                            )}
                            {active === 'auth' && content.endpoints.length > 0 && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm">
                                    <p className="font-medium text-amber-600 mb-1">⚠️ Keep your API key secure</p>
                                    <p className="text-amber-600/80">Never share your API key publicly. Regenerate it immediately if compromised.</p>
                                </div>
                            )}
                            {content.endpoints.map((ep, i) => (
                                <div key={i}>
                                    {ep.method && ep.path && (
                                        <div className="flex items-center gap-2 mb-2">
                                            {['GET', 'POST', 'PUT', 'DELETE'].includes(ep.method) ? (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ep.method === 'GET' ? 'bg-green-500/10 text-green-500' : ep.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : ep.method === 'PUT' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {ep.method}
                                                </span>
                                            ) : (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ep.method.startsWith('4') || ep.method.startsWith('5') ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'}`}>
                                                    {ep.method}
                                                </span>
                                            )}
                                            <span className="text-xs font-mono text-foreground/80">{ep.path}</span>
                                        </div>
                                    )}
                                    {ep.desc && <p className="text-xs text-muted-foreground mb-2">{ep.desc}</p>}
                                    {ep.code && (
                                        <CodeBlock code={ep.code} tryEndpoint={ep.tryEndpoint} tryMethod={ep.tryMethod} tryBody={ep.tryBody} tryPath={ep.tryPath} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rounded-xl border bg-card p-6 text-center">
                    <Code className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Need help? Contact support at{' '}
                        <a href="mailto:support@captchamaster.com" className="text-primary hover:underline">support@captchamaster.com</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
