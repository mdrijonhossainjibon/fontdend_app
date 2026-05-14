
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Mail,
    Save,
    RefreshCw,
    ShieldCheck,
    AlertCircle,
    Send,
    CheckCircle2
} from "lucide-react"
import { message, Spin } from 'antd'
import { API_CALL } from '@/lib/auth-fingerprint'

export default function SmtpSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const [settings, setSettings] = useState({
        host: '',
        port: 587,
        secure: false,
        user: '',
        pass: '',
        from: '',
        isActive: true
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
                setSettings({ ...response, pass: '' }) // Clear password for UI
            }
        } catch (error) {
            message.error('Failed to load SMTP settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const { response, status } = await API_CALL({
                method: 'POST',
                url: '/admin/system/smtp',
                body: settings
            })
            if (status === 200) {
                message.success('SMTP settings saved successfully')
            } else {
                message.error(response.error || 'Failed to save settings')
            }
        } catch (error) {
            message.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const handleTest = async () => {
        setTesting(true)
        try {
            const { response, status } = await API_CALL({
                method: 'PUT',
                url: '/admin/system/smtp',
                body: settings
            })
            if (status === 200) {
                message.success('SMTP connection verified successfully')
            } else {
                message.error(response.error || 'Connection test failed')
            }
        } catch (error: any) {
            message.error(error.message || 'Connection test failed')
        } finally {
            setTesting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Mail className="w-8 h-8" />
                        </div>
                        SMTP Configuration
                    </h1>
                    <p className="text-muted-foreground">Manage your outgoing email server settings</p>
                </div>
            </div>

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
                                <Label htmlFor="pass text-muted-foreground">Password / App Key</Label>
                                <Input
                                    id="pass"
                                    type="password"
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                    value={settings.pass}
                                    onChange={e => setSettings({ ...settings, pass: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground">Leave blank to keep existing password</p>
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

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 py-6 rounded-2xl hover:bg-secondary/50"
                        onClick={handleTest}
                        disabled={testing || saving}
                    >
                        {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Test Connection
                    </Button>
                    <Button
                        className="flex-[2] gap-2 py-6 rounded-2xl shadow-lg shadow-primary/20"
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
