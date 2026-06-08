
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Save,
    RefreshCw,
    ShieldCheck,
    AlertCircle,
    Send,
    CheckCircle2,
    Eye,
    EyeOff,
    Power
} from "lucide-react"
import { toast } from 'sonner'
import { API_CALL } from '@/lib/auth-fingerprint'

export default function SmtpSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [hasPass, setHasPass] = useState(false)
    const [settings, setSettings] = useState({
        host: '',
        port: 587,
        secure: false,
        user: '',
        pass: '',
        from: '',
        status: 'active'
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const { response, status } = await API_CALL({
                method: 'GET',
                url: '/admin/system/smtp'
            })
            if (status === 200) {
                const s = response.settings || response
                setSettings({
                    host: s.host || '',
                    port: s.port || 587,
                    secure: s.secure ?? false,
                    user: s.user || '',
                    pass: s.pass || '',
                    from: s.from || '',
                    isActive: s.status === 'active',
                })
                setHasPass(!!s.pass)
            }
        } catch (error) {
            toast.error('Failed to load SMTP settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const { response, status } = await API_CALL({
                method: 'PATCH',
                url: '/admin/system/smtp',
                body: { ...settings, isActive: undefined, status: settings.isActive ? 'active' : 'inactive', pass: !settings.pass && hasPass ? undefined : settings.pass }
            })
            if (status === 200) {
                toast.success('SMTP settings saved successfully')
            } else {
                toast.error(response.error || 'Failed to save settings')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const handleTest = async () => {
        setTesting(true)
        try {
            const { response, status } = await API_CALL({
                method: 'POST',
                url: '/admin/system/smtp/test',
                body: { ...settings, pass: !settings.pass && hasPass ? undefined : settings.pass }
            })
            if (status === 200) {
                toast.success('SMTP connection verified successfully')
            } else {
                toast.error(response.error || 'Connection test failed')
            }
        } catch (error: any) {
            toast.error(error.message || 'Connection test failed')
        } finally {
            setTesting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Server Details
                        </CardTitle>
                        <CardDescription>Configure the connection to your mail server</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="host">SMTP Host</Label>
                                <Input
                                    id="host"
                                    placeholder="smtp.example.com"
                                    value={settings.host}
                                    onChange={e => setSettings({ ...settings, host: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="port">Port</Label>
                                <Input
                                    id="port"
                                    type="number"
                                    placeholder="587"
                                    value={settings.port}
                                    onChange={e => setSettings({ ...settings, port: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-secondary/30 p-4 rounded-xl">
                            <Switch
                                id="secure"
                                checked={settings.secure}
                                onCheckedChange={checked => setSettings({ ...settings, secure: checked })}
                            />
                            <Label htmlFor="secure" className="cursor-pointer">
                                Use SSL/TLS Secure Connection (Port 465 usually)
                            </Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="user">Username</Label>
                                <Input
                                    id="user"
                                    placeholder="user@example.com"
                                    value={settings.user}
                                    onChange={e => setSettings({ ...settings, user: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pass">Password / App Key</Label>
                                <div className="relative">
                                    <Input
                                        id="pass"
                                        type={showPass ? "text" : "password"}
                                        placeholder={hasPass ? "Leave blank to keep existing" : "Enter password"}
                                        value={settings.pass}
                                        onChange={e => setSettings({ ...settings, pass: e.target.value })}
                                    />
                                        <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground">Use eye icon to show/hide password</p>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-border pt-6">
                            <Label htmlFor="from">From Email Address</Label>
                            <Input
                                id="from"
                                placeholder="noreply@example.com"
                                value={settings.from}
                                onChange={e => setSettings({ ...settings, from: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground italic">
                                This address will appear in the "From" field of outgoing emails.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${settings.isActive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                <Power className={`w-5 h-5 ${settings.isActive ? 'text-green-600' : 'text-red-500'}`} />
                            </div>
                            <div>
                                <CardTitle className="text-lg">SMTP Status</CardTitle>
                                <CardDescription>Enable or disable the SMTP service</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${settings.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <div>
                                    <p className="font-medium text-foreground">{settings.isActive ? 'Active' : 'Inactive'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {settings.isActive ? 'SMTP service is running and sending emails' : 'SMTP service is disabled'}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={settings.isActive}
                                onCheckedChange={(checked) => setSettings({ ...settings, isActive: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3 justify-end">
                    <Button
                        variant="outline"
                        className="gap-2 py-5 px-6 rounded-xl hover:bg-secondary/50"
                        onClick={handleTest}
                        disabled={testing || saving}
                    >
                        {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Test Connection
                    </Button>
                    <Button
                        className="gap-2 py-5 px-6 rounded-xl shadow-lg shadow-primary/20"
                        onClick={handleSave}
                        disabled={saving || testing}
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Configuration
                    </Button>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-xs text-amber-700 dark:text-amber-400">
                        <p className="font-bold mb-1">Important Note:</p>
                        Changing these settings will immediately affect all outgoing emails including OTPs, password resets, and notifications. We recommend testing the connection before saving.
                    </div>
                </div>
            </div>
        </div>
    )
}
