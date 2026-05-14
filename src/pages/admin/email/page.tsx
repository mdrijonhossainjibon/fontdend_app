
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import {
  Mail,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Send,
  Copy,
  Check,
  X,
  Code,
  Layout,
  History,
  Save,
  ChevronRight,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react'

export default function EmailPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [htmlContent, setHtmlContent] = useState('')
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', subject: '', content: '<html><body><h1>New Template</h1></body></html>' })
  const { toast } = useToast()

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/email-templates')
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      toast({ title: 'Error', description: 'Failed to load templates from the registry.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  // Dynamic Variable Reflection Logic
  const variableMap: Record<string, string> = {
    '{{USER_NAME}}': '<span style="color: #6366f1; font-weight: bold;">[Recipient Name]</span>',
    '{{EMAIL}}': 'user@example.com',
    '{{OTP}}': '<span style="letter-spacing: 2px; font-family: monospace; font-weight: 900; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">123456</span>',
    '{{LINK}}': '<a href="#" style="color: #6366f1; text-decoration: underline;">https://sparkai.link/action</a>',
    '{{COPYRIGHT}}': `&copy; ${new Date().getFullYear()} SparkAI Inc. All rights reserved.`,
    '{{YEAR}}': new Date().getFullYear().toString(),
    '{{EXPIRY_TIME}}': '15 minutes',
    '{{COMPANY_NAME}}': 'SparkAI Inc.',
    '{{DASHBOARD_URL}}': 'https://sparkai.link/dashboard',
  }

  const renderPreviewHtml = (content: string) => {
    let rendered = content
    Object.entries(variableMap).forEach(([key, value]) => {
      rendered = rendered.replaceAll(key, value)
    })
    return rendered
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('forge-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)

    setHtmlContent(before + variable + after)

    // Reset focus and cursor position after state update
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + variable.length, start + variable.length)
    }, 10)
  }

  const handleEdit = (template: any) => {
    setEditingTemplate(template)
    setHtmlContent(template.content)
  }

  const handleSave = async () => {
    if (!editingTemplate?._id) {
      toast({ title: 'Error', description: 'Template identity missing.', variant: 'destructive' })
      return
    }

    try {
      setIsSaving(true)
      const res = await fetch(`/api/admin/email-templates/${editingTemplate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingTemplate.name,
          description: editingTemplate.description,
          subject: editingTemplate.subject,
          content: htmlContent,
          status: editingTemplate.status
        })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Success', description: 'Template committed to the matrix.' })
        setEditingTemplate(null)
        fetchTemplates()
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to commit changes.', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({ title: 'Error', description: 'Network error during forge commit.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreate = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Initialized', description: 'New sequence established in the database.' })
        setShowModal(false)
        setNewTemplate({ name: '', description: '', subject: '', content: '<html><body><h1>New Template</h1></body></html>' })
        fetchTemplates()
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to initialize sequence.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this template? This action is irreversible.')) return

    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Purged', description: 'Template successfully removed from the matrix.' })
        fetchTemplates()
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to purge template.', variant: 'destructive' })
    }
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: 'Copied', description: 'HTML source copied to clipboard.' })
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Comms Logic</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground -mt-1">Email Forge</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-70 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> High-precision HTML template orchestration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border/40 bg-secondary/30 backdrop-blur-sm gap-2">
            <History className="w-4 h-4" /> Version History
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" /> New Sequence
          </Button>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clusters', value: templates.length.toString(), icon: FileCode, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Transmission Success', value: '99.8%', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Engagement Index', value: (templates.reduce((acc, t) => acc + (t.openRate || 0), 0) / (templates.length || 1)).toFixed(1) + '%', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Registry Status', value: loading ? 'Syncing...' : 'Operational', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/40 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} border border-border/20 shadow-inner`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Editor or Table */}
      {editingTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-6 duration-700">
          {/* Editor Controls */}
          <Card className="lg:col-span-12 border-primary/20 bg-primary/[0.02] backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/40">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(null)} className="h-8 px-2">
                  <X className="w-4 h-4 mr-2" /> Exit Editor
                </Button>
                <div className="h-6 w-[1px] bg-border/40" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Editing: {editingTemplate.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{editingTemplate.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-secondary/50 rounded-lg p-1 flex border border-border/40 mr-4">
                  <Button
                    variant={activeTab === 'editor' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 text-[10px] font-bold uppercase"
                    onClick={() => setActiveTab('editor')}
                  >
                    <Code className="w-3.5 h-3.5 mr-1.5" /> Source
                  </Button>
                  <Button
                    variant={activeTab === 'preview' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 text-[10px] font-bold uppercase"
                    onClick={() => setActiveTab('preview')}
                  >
                    <Layout className="w-3.5 h-3.5 mr-1.5" /> Render
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="h-8 border-border/40 bg-background/50" onClick={handleCopyHtml}>
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-4 transition-all active:scale-95"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {isSaving ? 'Saving...' : 'Commit Changes'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Code Editor */}
          <div className="lg:col-span-7">
            <Card className="h-[600px] border-border/40 bg-[#0d1117] overflow-hidden group shadow-2xl flex flex-col">
              <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">HTML_FORGE.CORE</span>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {Object.keys(variableMap).map((variable) => (
                      <button
                        key={variable}
                        onClick={() => insertVariable(variable)}
                        className="text-[9px] font-black bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20 transition-all uppercase tracking-tighter whitespace-nowrap"
                      >
                        {variable.replace('{{', '').replace('}}', '')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
              </div>
              <textarea
                id="forge-editor"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="flex-1 w-full p-6 bg-transparent text-[#e6edf3] font-mono text-sm resize-none border-0 focus:ring-0 selection:bg-blue-500/30 overflow-auto outline-none"
                spellCheck={false}
              />
            </Card>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-5">
            <Card className="h-[600px] border-border/40 bg-muted/20 overflow-hidden shadow-xl flex flex-col">
              <div className="px-4 py-2 border-b border-border/40 bg-card/60 flex justify-between items-center shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Live Viewport</span>
                <div className="flex gap-1 bg-secondary/30 p-1 rounded-md">
                  <Button variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} size="sm" className="h-6 w-8 p-0" onClick={() => setViewMode('desktop')}>
                    <Monitor className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} size="sm" className="h-6 w-8 p-0" onClick={() => setViewMode('mobile')}>
                    <Smartphone className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-white p-4">
                <div className={`mx-auto transition-all duration-500 ${viewMode === 'mobile' ? 'max-w-[375px] border-x-[12px] border-y-[40px] border-muted rounded-[2.5rem] shadow-2xl' : 'max-w-full'}`}>
                  <iframe
                    title="Template Preview"
                    srcDoc={renderPreviewHtml(htmlContent)}
                    className="w-full h-[500px] border-0 outline-none rounded-sm"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Template List Interface */
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="bg-muted/30 border-b border-border/40 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">Active Matrix</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] mt-1 opacity-70">Email Template Repository</CardDescription>
              </div>
              <div className="bg-primary/5 p-2 rounded-xl border border-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Syncing Repository...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Mail className="w-12 h-12 text-muted-foreground opacity-20" />
                <p className="text-sm font-medium text-muted-foreground">No template sequences found in the registry.</p>
                <Button variant="outline" onClick={() => setShowModal(true)}>Initialize First Sequence</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-secondary/10">
                      <th className="text-left py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-muted-foreground w-[25%]">Entity</th>
                      <th className="text-left py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hidden lg:table-cell">Metrics</th>
                      <th className="text-left py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Lifecycle</th>
                      <th className="text-right py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {templates.map((template, index) => (
                      <tr
                        key={template._id}
                        className="group border-b border-border/40 last:border-0 hover:bg-primary/[0.02] transition-colors"
                      >
                        <td className="py-5 px-6">
                          <div className="font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{template.name}</div>
                          <div className="text-[11px] text-muted-foreground font-medium italic opacity-70">{template.description}</div>
                        </td>
                        <td className="py-5 px-6 hidden lg:table-cell">
                          <div className="flex items-center gap-8">
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Engagement</p>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${template.openRate || 0}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-black">{template.openRate || 0}%</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Volume</p>
                              <span className="text-[11px] font-black text-foreground">{((template.sent || 0) / 1000).toFixed(1)}K</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1.5">
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-current w-fit ${template.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-500'
                              }`}>
                              {template.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium italic">Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-border/40 bg-background/50 backdrop-blur-sm opacity-60 hover:opacity-100 px-3"
                              onClick={() => setSelectedTemplate(template)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" /> Ghost View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-border/40 bg-background/50 hover:bg-primary/[0.05] hover:text-primary hover:border-primary/40 px-3 font-bold"
                              onClick={() => handleEdit(template)}
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Forge
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-border/40 bg-background/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 px-2.5"
                              onClick={() => handleDelete(template._id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* Ghost View Modal (Preview) */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl border-border/40 bg-card shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 px-6 py-4 bg-muted/20">
              <div>
                <CardTitle className="text-lg font-bold">Spectral Preview</CardTitle>
                <CardDescription className="text-xs uppercase font-bold tracking-widest opacity-60">{selectedTemplate.name}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)} className="rounded-full p-2 h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5">System Subject</p>
                  <p className="text-sm font-bold text-foreground">{selectedTemplate.subject}</p>
                </div>
                <div className="border border-border/40 rounded-xl overflow-hidden shadow-inner">
                  <div className="bg-background/80 px-4 py-2 border-b border-border/40 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Render</span>
                    <Layout className="w-3 h-3 opacity-40" />
                  </div>
                  <div className="bg-white p-6 max-h-[400px] overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: renderPreviewHtml(selectedTemplate.content) }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary gap-2" onClick={() => { handleEdit(selectedTemplate); setSelectedTemplate(null); }}>
                    <Edit2 className="w-3.5 h-3.5" /> Edit Template Structure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Creation Modal - Simplified for Forge Style */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in zoom-in-95 duration-300">
          <Card className="w-full max-w-md border-primary/20 bg-background shadow-2xl">
            <CardHeader className="border-b border-border/40 mb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Initialize Sequence
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest font-bold">New Logic Fragment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Protocol Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g. Welcome_Email_V2"
                  className="bg-secondary/20 border-border/40 h-10 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Security Subject</Label>
                <Input
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  placeholder="Global Header String"
                  className="bg-secondary/20 border-border/40 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Protocol Description</Label>
                <Input
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Brief description of this template"
                  className="bg-secondary/20 border-border/40 h-10"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1 font-bold" onClick={() => setShowModal(false)}>ABORT</Button>
                <Button className="flex-1 bg-primary font-black tracking-widest shadow-lg shadow-primary/20" onClick={handleCreate}>INITIALIZE</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
