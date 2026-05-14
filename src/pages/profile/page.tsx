import { Header } from "@/components/header"
import { ProfileCard } from "@/components/profile-card"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileActivity } from "@/components/profile-activity"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and view activity</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <ProfileStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <ProfileActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
