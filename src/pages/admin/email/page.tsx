import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Mail, Plus, Edit, Trash2, Eye, Search,
    RefreshCw, Save, X, AlertCircle, FileText, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import * as actions from '@/modules/admin/actions'

const EMPTY_TEMPLATE = {
    name: '', subject: '', content: '', description: '', type: 'default'
}

const EmailPage = () => {
    const dispatch = useDispatch()
    const { emailTemplates = [], emailLoading: loading } = useSelector((state: any) => state.admin)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [editing, setEditing] = useState<any>(null)
    const [previewTemplate, setPreviewTemplate] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(actions.fetchEmailTemplatesRequest())
    }, [dispatch])

    const handleSave = useCallback(() => {
        if (!editing) return
        if (!editing.name || !editing.subject || !editing.content) {
            toast({ title: 'Name, subject, and content are required', variant: 'destructive' })
            return
        }
        if (editing._id) {
            const { _id, ...body } = editing
            dispatch(actions.updateEmailTemplateRequest({ id: _id, ...body }))
        } else {
            dispatch(actions.createEmailTemplateRequest(editing))
        }
        setEditing(null)
    }, [editing, dispatch])

    const handleDelete = useCallback(() => {
        if (deleteId) {
            dispatch(actions.deleteEmailTemplateRequest(deleteId))
            setDeleteId(null)
        }
    }, [deleteId, dispatch])

    const openCreateModal = () => setEditing({ ...EMPTY_TEMPLATE })
    const openEditModal = (tpl: any) => setEditing({ ...tpl })
    const closeModal = () => setEditing(null)

    const filtered = (emailTemplates || []).filter((t: any) =>
        !searchTerm ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-end">
                <Button onClick={openCreateModal} className="gap-2" size="lg">
                    <Plus className="w-5 h-5" />
                    Create Template
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search templates..."
                    className="pl-10 max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Template Cards Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>{searchTerm ? 'No matching templates found' : 'No email templates yet'}</p>
                    <Button variant="link" onClick={openCreateModal} className="mt-2">Create your first template</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((tpl: any) => (
                        <Card key={tpl._id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <CardTitle className="text-base">{tpl.name}</CardTitle>
                                        </div>
                                        {tpl.description && (
                                            <CardDescription className="text-xs">{tpl.description}</CardDescription>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => { e.stopPropagation(); setPreviewTemplate(tpl) }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => openEditModal(tpl)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => setDeleteId(tpl._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                        <Hash className="w-3 h-3" /> Subject
                                    </div>
                                    <p className="text-sm truncate">{tpl.subject}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog open={!!editing} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            {editing?._id ? 'Edit Template' : 'Create Template'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure the email template fields below
                        </DialogDescription>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                    placeholder="e.g. Welcome Email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    value={editing.subject}
                                    onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                                    placeholder="e.g. Welcome to {{siteName}}!"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content (HTML)</Label>
                                <Textarea
                                    value={editing.content}
                                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                                    placeholder="<h1>Hello {{name}}</h1>..."
                                    className="min-h-[200px] font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={editing.description}
                                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            {editing?._id ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Modal */}
            <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            {previewTemplate?.name || 'Template Preview'}
                        </DialogTitle>
                        <DialogDescription>
                            {previewTemplate?.subject && (
                                <span className="text-primary font-medium">Subject: {previewTemplate.subject}</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="border rounded-lg p-4 bg-white dark:bg-gray-950 min-h-[200px]">
                        {previewTemplate?.content ? (
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-blue-600 [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                            />
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-12">No content</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                            Close
                        </Button>
                        <Button onClick={() => { setPreviewTemplate(null); openEditModal(previewTemplate) }}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            Delete Template
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. The template will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EmailPage
