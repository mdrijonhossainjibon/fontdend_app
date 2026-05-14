
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, Ghost } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Animated Illustration */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                    <div className="relative flex justify-center">
                        <div className="relative">
                            <Ghost className="w-32 h-32 text-primary animate-bounce" />
                            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/50">
                                404
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 relative">
                    <h1 className="text-7xl font-black text-foreground tracking-tighter">
                        Lost in <span className="text-primary">Space?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                        The page you're looking for has vanished into the digital void. Don't worry, we'll help you find your way back.
                    </p>
                </div>

                {/* Search Bar (Visual only) */}
                <div className="max-w-md mx-auto relative group">
                    <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center bg-secondary/50 border border-border rounded-2xl p-2 pl-4 backdrop-blur-sm">
                        <Search className="w-5 h-5 text-muted-foreground mr-3" />
                        <input
                            type="text"
                            placeholder="Search for something else..."
                            className="bg-transparent border-none outline-none text-foreground flex-1 placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        variant="default"
                        size="lg"
                        asChild
                        className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2"
                    >
                        <Link href="/">
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.history.back()}
                        className="h-14 px-8 rounded-2xl border-border bg-card/50 hover:bg-secondary text-foreground font-bold backdrop-blur-sm transition-all hover:scale-105 active:scale-95 gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous Page
                    </Button>
                </div>

                {/* Bottom Decorative Element */}
                <div className="pt-12 flex justify-center gap-8 opacity-30 select-none">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-transparent" />
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-4">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-transparent" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-transparent" />
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
        </div>
    )
}
