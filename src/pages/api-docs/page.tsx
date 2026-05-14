import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/landing/footer'
import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  Copy,
  Check,
  Code2,
  Terminal,
  Shield,
  Zap,
  BookOpen,
  ExternalLink,
  ArrowRight,
  Server,
  Lock,
  AlertTriangle,
  Info,
  Globe,
  Key,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Settings,
} from 'lucide-react'

/* ─────────────── Data ─────────────── */

const navLinks = ['Home', 'Docs', 'Pricing', 'Support', 'Login']

const sidebarSections = [
  { id: 'introduction', label: 'Introduction', icon: BookOpen },
  { id: 'authentication', label: 'Authentication', icon: Lock },
  { id: 'endpoints', label: 'Endpoints', icon: Server },
  { id: 'parameters', label: 'Parameters', icon: Settings },
  { id: 'responses', label: 'Responses', icon: FileText },
  { id: 'error-codes', label: 'Error Codes', icon: AlertTriangle },
  { id: 'examples', label: 'Examples', icon: Code2 },
]

const endpoints = [
  {
    method: 'POST',
    methodColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    path: '/api/captcha/solve',
    description: 'Submit a captcha image or URL for AI-powered solving.',
    params: [
      { name: 'image', type: 'string (base64 | url)', required: true, description: 'The captcha image data or public URL.' },
      { name: 'captcha_type', type: 'string', required: true, description: 'Type of captcha: recaptcha_v2, recaptcha_v3, hcaptcha, turnstile, etc.' },
      { name: 'user_id', type: 'string', required: false, description: 'Optional identifier for rate limiting & analytics.' },
    ],
    response: JSON.stringify({ solution: '3x7k9m', time_ms: 1234, confidence: 0.98, is_correct: true }, null, 2),
  },
  {
    method: 'GET',
    methodColor: 'text-green-400 bg-green-500/10 border-green-500/30',
    path: '/api/status',
    description: 'Get current service status, queue depth, and average solve time.',
    params: [],
    response: JSON.stringify({ status: 'operational', queue_size: 234, avg_time_ms: 1200, uptime: '99.97%' }, null, 2),
  },
  {
    method: 'POST',
    methodColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    path: '/api/batch/solve',
    description: 'Submit multiple captchas for batch processing.',
    params: [
      { name: 'captchas', type: 'array', required: true, description: 'Array of captcha objects with image & type fields.' },
      { name: 'priority', type: 'string', required: false, description: 'Processing priority: high | normal | low.' },
    ],
    response: JSON.stringify({ batch_id: 'batch_8f2a', total: 10, status: 'processing', estimated_ms: 8500 }, null, 2),
  },
  {
    method: 'POST',
    methodColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    path: '/api/webhooks/create',
    description: 'Create a webhook endpoint for asynchronous solve callbacks.',
    params: [
      { name: 'url', type: 'string', required: true, description: 'HTTPS endpoint that will receive POST callbacks.' },
      { name: 'events', type: 'string[]', required: true, description: 'Event types to subscribe to: solve.completed, solve.failed.' },
      { name: 'secret', type: 'string', required: true, description: 'Secret used to sign webhook payloads (HMAC-SHA256).' },
    ],
    response: JSON.stringify({ webhook_id: 'wh_4e1b', url: 'https://api.myapp.com/captcha-callback', status: 'active' }, null, 2),
  },
]

const errorCodes = [
  { code: 400, name: 'Bad Request', message: 'Invalid request parameters. Check your payload format.', icon: AlertCircle },
  { code: 401, name: 'Unauthorized', message: 'Missing or invalid API key. Include it in the Authorization header.', icon: Lock },
  { code: 403, name: 'Forbidden', message: 'API key does not have permission for this resource.', icon: Shield },
  { code: 404, name: 'Not Found', message: 'The requested endpoint or resource does not exist.', icon: Info },
  { code: 429, name: 'Rate Limited', message: 'Too many requests. Respect the Retry-After header.', icon: AlertTriangle },
  { code: 500, name: 'Server Error', message: 'Internal failure. Our team has been notified.', icon: Server },
]

const codeSnippets = [
  {
    lang: 'cURL',
    code: `curl -X POST https://api.captchamaster.io/v1/solve \\
  -H "Authorization: Bearer cm_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "https://example.com/captcha.png",
    "captcha_type": "recaptcha_v2"
  }'`,
  },
  {
    lang: 'Python',
    code: `from captchamaster import Client

cm = Client(api_key="cm_live_xxxxxxxxxxxx")

result = cm.captcha.solve(
    image_url="https://example.com/captcha.png",
    captcha_type="recaptcha_v2",
)

print(result.solution)  # "3x7k9m"`,
  },
  {
    lang: 'JavaScript',
    code: `import { CaptchaMaster } from 'captchamaster-sdk';

const cm = new CaptchaMaster({
  apiKey: 'cm_live_xxxxxxxxxxxx',
});

const result = await cm.captcha.solve({
  imageUrl: 'https://example.com/captcha.png',
  captchaType: 'recaptcha_v2',
});

console.log(result.solution); // "3x7k9m"`,
  },
]

/* ─────────────── Floating Particles ─────────────── */

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float-up"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 30}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}
      {/* Larger floating gold accents */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`accent-${i}`}
          className="absolute w-16 h-16 rounded-full bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-xl animate-float"
          style={{
            left: `${10 + i * 25}%`,
            top: `${20 + (i % 2) * 40}%`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────── Syntax Highlighted Block ─────────────── */

function CodeBlock({ code, lang, className = '' }: { code: string; lang?: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className={`group relative rounded-xl border border-border/60 bg-black/40 backdrop-blur-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-black/20">
        {lang && <span className="text-xs font-mono text-primary/70">{lang}</span>}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono text-foreground/90 [&_.hljs-string]:text-green-400 [&_.hljs-keyword]:text-purple-400 [&_.hljs-comment]:text-muted-foreground [&_.hljs-function]:text-blue-400 [&_.hljs-number]:text-orange-400 [&_.hljs-built_in]:text-cyan-400">
          {code}
        </code>
      </pre>
    </div>
  )
}

/* ─────────────── Endpoint Card ─────────────── */

function EndpointCard({ ep, index }: { ep: (typeof endpoints)[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      id={`endpoint-${index}`}
      className="group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <span
          className={`shrink-0 px-3 py-1 rounded-md text-xs font-mono font-semibold border ${ep.methodColor}`}
        >
          {ep.method}
        </span>
        <code className="flex-1 text-sm font-mono text-primary/90 font-medium">{ep.path}</code>
        <p className="hidden lg:block flex-1 text-sm text-muted-foreground truncate">{ep.description}</p>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-5">
            {/* Description */}
            <p className="text-sm text-muted-foreground lg:hidden">{ep.description}</p>

            {/* Parameters */}
            {ep.params.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Parameters</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Type</th>
                        <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Required</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((p) => (
                        <tr key={p.name} className="border-b border-border/20 last:border-0">
                          <td className="py-2 pr-4 font-mono text-primary/80">{p.name}</td>
                          <td className="py-2 pr-4 text-xs text-muted-foreground">{p.type}</td>
                          <td className="py-2 pr-4">
                            {p.required ? (
                              <span className="text-xs text-red-400 font-medium">Required</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Optional</span>
                            )}
                          </td>
                          <td className="py-2 text-xs text-muted-foreground">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Response */}
            <div>
              <h5 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Example Response</h5>
              <CodeBlock code={ep.response} />
            </div>

            {/* Try It */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Terminal className="w-4 h-4" />
              Try it out
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── Main Component ─────────────── */

export default function ApiDocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('introduction')
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeSnippet, setActiveSnippet] = useState(0)

  /* Scrollspy via IntersectionObserver */
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }, [])

  useEffect(() => {
    setHeroVisible(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-90px 0px -50% 0px', threshold: 0.1 },
    )

    const refs = sectionRefs.current
    for (const id of Object.keys(refs)) {
      const el = refs[id]
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* ════════ Navbar ════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-xs font-bold text-black shadow-lg shadow-primary/30">
                CM
              </div>
              <span className="text-lg font-bold tracking-tight">
                Captcha<span className="text-primary">Ɱ</span>aster
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const href = link === 'Docs' ? '/api-docs' : `/${link.toLowerCase()}`
                const isActive = link === 'Docs'
                return (
                  <Link
                    key={link}
                    to={href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary/80 to-yellow-500/80 rounded-full" />
                    )}
                  </Link>
                )
              })}
              <Link to="/auth/login">
                <Button
                  size="sm"
                  className="ml-3 bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold hover:from-primary/90 hover:to-yellow-500/90 shadow-lg shadow-primary/25"
                >
                  Get API Key
                  <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const href = link === 'Docs' ? '/api-docs' : `/${link.toLowerCase()}`
                const isActive = link === 'Docs'
                return (
                  <Link
                    key={link}
                    to={href}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                  >
                    {link}
                  </Link>
                )
              })}
              <Link to="/auth/login" className="block mt-2">
                <Button className="w-full bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold">
                  Get API Key
                  <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ════════ Hero ════════ */}
      <section className="relative pt-32 pb-20 lg:pb-28 overflow-hidden">
        <Particles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`max-w-3xl transition-all duration-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
              <Zap className="w-3.5 h-3.5" />
              API v2.0 — Now with batch processing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
              Integrate CAPTCHA Automation{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-yellow-500">
                Instantly
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              Fast, secure, and AI-powered CAPTCHA solving API for developers. 
              Get 1,000 free solves/month — no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold hover:from-primary/90 hover:to-yellow-500/90 shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105"
              >
                <Key className="w-5 h-5" />
                Get Your API Key
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-border/50 text-foreground hover:bg-secondary/30"
              >
                <BookOpen className="w-5 h-5" />
                Read the Docs
              </Button>
            </div>

            {/* Hero code snippet */}
            <CodeBlock
              code={codeSnippets[activeSnippet].code}
              lang={codeSnippets[activeSnippet].lang}
              className="max-w-2xl shadow-2xl shadow-primary/5"
            />

            {/* Snippet tabs below code */}
            <div className="flex gap-2 mt-3">
              {codeSnippets.map((s, i) => (
                <button
                  key={s.lang}
                  onClick={() => setActiveSnippet(i)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                    activeSnippet === i
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {s.lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Docs Layout ════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-8 lg:gap-12 relative">
          {/* ─── Mobile sidebar toggle ─── */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-yellow-500 text-black shadow-xl shadow-primary/30 flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* ─── Mobile sidebar overlay ─── */}
          {mobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          {/* ─── Sidebar ─── */}
          <aside
            className={`fixed lg:sticky top-20 lg:top-24 bottom-0 left-0 z-50 lg:z-auto w-72 lg:w-[280px] shrink-0 bg-background/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r border-border/30 lg:border-0 
            transform transition-transform duration-300 ease-in-out overflow-y-auto
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          >
            <div className="p-5 lg:py-0 lg:pr-4 h-full lg:h-auto">
              {/* Close button — mobile only */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                Close
              </button>

              <h4 className="text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-4">
                Documentation
              </h4>

              <nav className="space-y-1">
                {sidebarSections.map((s) => {
                  const Icon = s.icon
                  const isActive = activeSection === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'text-primary bg-primary/10 border-l-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30 border-l-2 border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{s.label}</span>
                      {s.id === 'endpoints' && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-mono">
                          4
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>

              {/* Quick links */}
              <div className="mt-8 pt-6 border-t border-border/40 space-y-3">
                <Link
                  to="/pricing"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Pricing
                </Link>
                <Link
                  to="/support"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  Support
                </Link>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <main className="flex-1 min-w-0 space-y-20 lg:pl-0">
            {/* Introduction */}
            <section
              id="introduction"
              ref={setSectionRef('introduction')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Overview</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">
                  Captcha<span className="text-primary">Ɱ</span>aster API
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  The CaptchaMaster API provides developers with fast, reliable, and AI-powered CAPTCHA solving capabilities.
                  Our RESTful API allows you to integrate automated CAPTCHA solving into your applications with minimal code.
                  With 99.9% uptime and sub-second response times, you can trust CaptchaMaster for mission-critical operations.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: Zap, label: '99.9%', desc: 'Uptime SLA' },
                    { icon: Shield, label: '256-bit', desc: 'Encryption' },
                    { icon: Globe, label: '50+', desc: 'CAPTCHA types' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border/40 bg-secondary/20 p-4 text-center hover:border-primary/20 transition-all"
                    >
                      <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xl font-bold text-foreground">{stat.label}</p>
                      <p className="text-xs text-muted-foreground">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section
              id="authentication"
              ref={setSectionRef('authentication')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Security</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">Authentication</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  All API requests require authentication via an API key. Include your key in the 
                  <code className="mx-1.5 px-2 py-0.5 rounded bg-black/40 text-primary font-mono text-xs">Authorization</code>
                  header as a Bearer token. Generate keys from your dashboard.
                </p>

                <CodeBlock
                  code={`# Include your API key in all requests
Authorization: Bearer cm_live_xxxxxxxxxxxx

# Or pass as query parameter (not recommended for production)
?api_key=cm_live_xxxxxxxxxxxx`}
                  lang="HTTP Headers"
                />

                <div className="mt-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Keep your key secure</p>
                    <p className="text-xs text-muted-foreground">Never expose your API key in client-side code, public repositories, or logs. Rotate keys regularly from your dashboard.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Endpoints */}
            <section
              id="endpoints"
              ref={setSectionRef('endpoints')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Reference</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">API Endpoints</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  Our API is organized around RESTful principles. All requests should be made to the base URL 
                  <code className="mx-1.5 px-2 py-0.5 rounded bg-black/40 text-primary font-mono text-xs">https://api.captchamaster.io/v1</code>.
                </p>

                <div className="space-y-3">
                  {endpoints.map((ep, i) => (
                    <EndpointCard key={ep.path} ep={ep} index={i} />
                  ))}
                </div>
              </div>
            </section>

            {/* Parameters */}
            <section
              id="parameters"
              ref={setSectionRef('parameters')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Configuration</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">Common Parameters</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  These parameters are shared across multiple endpoints. Refer to individual endpoint docs for endpoint-specific parameters.
                </p>

                <div className="overflow-x-auto rounded-xl border border-border/40">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-border/40">
                        <th className="text-left p-4 text-muted-foreground font-semibold">Parameter</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold">Type</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold">Required</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'image', type: 'string', req: true, desc: 'Base64-encoded image data or public URL to the captcha image.' },
                        { name: 'captcha_type', type: 'string', req: true, desc: 'Supported: recaptcha_v2, recaptcha_v3, hcaptcha, turnstile, funcaptcha, geetest.' },
                        { name: 'timeout', type: 'number', req: false, desc: 'Max wait time in milliseconds before timing out (default: 30000).' },
                        { name: 'priority', type: 'string', req: false, desc: 'Request priority: high, normal, or low (default: normal).' },
                        { name: 'callback_url', type: 'string', req: false, desc: 'Webhook URL for async result delivery.' },
                      ].map((p, i) => (
                        <tr key={p.name} className="border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-mono text-primary/90 font-medium">{p.name}</td>
                          <td className="p-4">
                            <code className="px-2 py-0.5 rounded bg-black/30 text-xs text-cyan-400">{p.type}</code>
                          </td>
                          <td className="p-4">
                            {p.req ? (
                              <span className="px-2 py-0.5 rounded text-xs font-medium text-red-400 bg-red-500/10">Required</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs text-muted-foreground bg-secondary/30">Optional</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Responses */}
            <section
              id="responses"
              ref={setSectionRef('responses')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Data</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">Response Format</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  All successful responses return a JSON object with a consistent structure. The 
                  <code className="mx-1.5 px-2 py-0.5 rounded bg-black/40 text-primary font-mono text-xs">status</code>
                  field indicates the result, and
                  <code className="mx-1.5 px-2 py-0.5 rounded bg-black/40 text-primary font-mono text-xs">data</code>
                  contains the payload.
                </p>

                <CodeBlock
                  code={`// Successful Response
{
  "status": "success",
  "data": {
    "solution": "3x7k9m",
    "confidence": 0.98,
    "time_ms": 1234,
    "is_correct": true
  },
  "meta": {
    "request_id": "req_a1b2c3d4",
    "credits_used": 1
  }
}

// Error Response
{
  "status": "error",
  "error": {
    "code": "INVALID_CAPTCHA_TYPE",
    "message": "The provided captcha type is not supported.",
    "details": {
      "provided": "unknown_type",
      "supported": ["recaptcha_v2", "hcaptcha", "turnstile"]
    }
  },
  "meta": {
    "request_id": "req_e5f6g7h8"
  }
}`}
                  lang="JSON"
                />

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-foreground">Success Fields</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li><code className="text-primary">status</code> — Always &quot;success&quot;</li>
                      <li><code className="text-primary">data.solution</code> — Solved captcha text</li>
                      <li><code className="text-primary">data.confidence</code> — AI confidence score</li>
                      <li><code className="text-primary">data.time_ms</code> — Processing time</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-foreground">Error Fields</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li><code className="text-primary">status</code> — Always &quot;error&quot;</li>
                      <li><code className="text-primary">error.code</code> — Machine-readable code</li>
                      <li><code className="text-primary">error.message</code> — Human-readable message</li>
                      <li><code className="text-primary">meta.request_id</code> — Trace identifier</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Codes */}
            <section
              id="error-codes"
              ref={setSectionRef('error-codes')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Troubleshooting</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">Error Codes</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  Our API uses standard HTTP status codes and returns detailed error messages to help you debug quickly.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {errorCodes.map((err) => {
                    const Icon = err.icon
                    const colors: Record<number, string> = {
                      400: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
                      401: 'border-red-500/20 bg-red-500/5 text-red-400',
                      403: 'border-orange-500/20 bg-orange-500/5 text-orange-400',
                      404: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
                      429: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
                      500: 'border-red-600/20 bg-red-600/5 text-red-500',
                    }
                    return (
                      <div
                        key={err.code}
                        className={`rounded-xl border p-4 transition-all hover:scale-[1.02] ${colors[err.code] || 'border-border/40 bg-secondary/10'}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-sm">{err.code}</span>
                              <span className="text-xs font-medium opacity-80">{err.name}</span>
                            </div>
                            <p className="text-xs opacity-80">{err.message}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Examples */}
            <section
              id="examples"
              ref={setSectionRef('examples')}
              className="scroll-mt-24 animate-slideUp"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Code</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">Code Examples</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  Get started quickly with these ready-to-use examples for your preferred language.
                </p>

                {/* Language tabs */}
                <div className="flex gap-1 mb-5 p-1 rounded-xl bg-secondary/30 border border-border/40 w-fit">
                  {codeSnippets.map((s, i) => (
                    <button
                      key={s.lang}
                      onClick={() => setActiveSnippet(i)}
                      className={`px-4 py-2 text-sm font-mono rounded-lg transition-all ${
                        activeSnippet === i
                          ? 'bg-card text-primary shadow-sm border border-border/30'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {s.lang}
                    </button>
                  ))}
                </div>

                <CodeBlock code={codeSnippets[activeSnippet].code} lang={codeSnippets[activeSnippet].lang} />

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-yellow-500/5 border border-primary/10 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Pro Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Set up webhooks to receive solve results asynchronously instead of polling. 
                      Check the Endpoints section for webhook configuration details.
                    </p>
                  </div>
                </div>

                {/* CTA within docs */}
                <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Ready to integrate?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Get your free API key and start solving in minutes.</p>
                  <Button className="bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold hover:from-primary/90 hover:to-yellow-500/90 shadow-lg shadow-primary/25">
                    <Key className="w-4 h-4" />
                    Get Your Free API Key
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ════════ Footer ════════ */}
      <Footer />
    </div>
  )
}
