
import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Check, X, Settings, Plus, Trash2, Eye } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: 2024-01-20 02:00-04:00 UTC',
      type: 'maintenance',
      recipients: 1245,
      sent: true,
      createdAt: '2024-01-18 10:30',
      sentAt: '2024-01-18 10:35',
    },
    {
      id: 2,
      title: 'New Feature Release: Batch API',
      message: 'Introducing batch processing for captcha solving with up to 50% speed improvement',
      type: 'feature',
      recipients: 2150,
      sent: true,
      createdAt: '2024-01-17 14:20',
      sentAt: '2024-01-17 14:25',
    },
    {
      id: 3,
      title: 'Security Alert: Update Required',
      message: 'Critical security update available. Please update your API client.',
      type: 'security',
      recipients: 1850,
      sent: true,
      createdAt: '2024-01-16 09:15',
      sentAt: '2024-01-16 09:20',
    },
    {
      id: 4,
      title: 'API Rate Limit Changes',
      message: 'Rate limits updated for Enterprise tier users',
      type: 'info',
      recipients: 450,
      sent: false,
      createdAt: '2024-01-18 16:00',
      sentAt: null,
    },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-700'
      case 'feature':
        return 'bg-blue-500/20 text-blue-700'
      case 'security':
        return 'bg-red-500/20 text-red-700'
      default:
        return 'bg-purple-500/20 text-purple-700'
    }
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const stats = [
    { label: 'Total Sent', value: notifications.filter((n) => n.sent).length },
    { label: 'Total Recipients', value: notifications.reduce((sum, n) => sum + n.recipients, 0) },
    { label: 'Pending', value: notifications.filter((n) => !n.sent).length },
    { label: 'Active Campaigns', value: 3 },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Send Notification
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-border">
              <CardContent className="pt-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Templates */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notification Templates</CardTitle>
            <CardDescription>Pre-configured templates for quick sending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Maintenance Alert', 'Feature Announcement', 'Security Update', 'Billing Update', 'API Deprecation', 'General Announcement'].map((template, idx) => (
                <Button key={idx} variant="outline" className="justify-start bg-secondary/50 hover:bg-secondary border-border h-auto py-3 px-4 text-left">
                  <div>
                    <p className="font-medium text-foreground">{template}</p>
                    <p className="text-xs text-muted-foreground mt-1">Use template</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>All sent and pending notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(notif.type)}`}>
                          {notif.type.toUpperCase()}
                        </span>
                        <h3 className="font-semibold text-foreground">{notif.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{notif.recipients.toLocaleString()} recipients</span>
                        <span>Created: {notif.createdAt}</span>
                        {notif.sent && <span>Sent: {notif.sentAt}</span>}
                        {!notif.sent && <span className="text-yellow-600">Pending</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {notif.sent ? (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-700">
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-medium">Sent</span>
                        </div>
                      ) : (
                        <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                          <span>Send Now</span>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="hover:bg-secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">Show notifications in user dashboard</p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Webhook Notifications</p>
                <p className="text-sm text-muted-foreground">Send notifications via webhooks</p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
