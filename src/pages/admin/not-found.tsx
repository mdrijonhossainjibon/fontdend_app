
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft, Users } from "lucide-react"
import { useNavigate } from 'react-router-dom'
export default function AdminNotFound() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative bg-card border border-border p-8 rounded-3xl shadow-2xl">
                    <ShieldAlert className="w-20 h-20 text-red-500 mx-auto" />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-4xl font-black text-foreground tracking-tight">Resource Not Found</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The admin resource or page you are looking for does not exist or has been moved.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button
                    variant="default"
                    onClick={() => router.back()}
                    className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </Button>

                <Button
                    variant="outline"
                    asChild
                    className="h-12 px-6 rounded-xl border-border bg-card/50 hover:bg-secondary text-foreground font-bold backdrop-blur-sm hover:scale-105 transition-transform gap-2"
                >
                    <Link to="/admin/users">
                        <Users className="w-4 h-4" />
                        Manage Users
                    </Link>
                </Button>
            </div>

            <div className="text-xs font-mono text-muted-foreground opacity-50 pt-8">
                ERR_ADMIN_PAGE_NOT_FOUND_404
            </div>
        </div>
    )
}
