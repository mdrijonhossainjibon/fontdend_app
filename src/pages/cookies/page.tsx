"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Cookie, ShieldCheck, Settings2, BarChart3, Info } from "lucide-react"

export default function CookiesPage() {
    const lastUpdated = "February 09, 2026"

    const cookieTypes = [
        {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
            title: "Essential Cookies",
            description: "These are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or logging in.",
            status: "Always Active"
        },
        {
            icon: <Settings2 className="w-6 h-6 text-blue-500" />,
            title: "Functional Cookies",
            description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.",
            status: "Optional"
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
            title: "Performance Cookies",
            description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.",
            status: "Optional"
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-24 pb-16 sm:pt-32">
                {/* Header Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-16">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-10 bg-primary/20 rounded-full" />
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Cookie className="w-4 h-4" />
                        Privacy Matters
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Cookie Policy</h1>
                    <p className="text-muted-foreground italic">Transparency about how we use your data. Last updated: {lastUpdated}</p>
                </section>

                {/* Introduction */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
                    <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 flex items-start gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Info className="text-primary w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">How we use cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Captcha Master uses cookies to improve your browsing experience. Some cookies are necessary for the service to function, while others help us understand how you interact with our extension and website. Below is a detailed breakdown of the cookies we use.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Cookie Types Grid */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
                    {cookieTypes.map((type, idx) => (
                        <div key={idx} className="group relative bg-card/20 hover:bg-card/40 border border-border/50 hover:border-primary/30 rounded-3xl p-8 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0 shadow-inner">
                                        {type.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{type.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${type.status === 'Always Active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'bg-primary/10 text-primary border border-primary/20'
                                        }`}>
                                        {type.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Manage Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-20 text-center">
                    <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-background border border-border/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                        <h2 className="text-3xl font-bold mb-6">Take Control of Your Privacy</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            You can manage your cookie preferences at any time through your browser settings. Disabling certain cookies may impact the performance of our automated solving engine.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:scale-105 transition-all">
                                Accept All Cookies
                            </button>
                            <button className="px-8 py-4 bg-background border border-border text-foreground font-bold rounded-2xl hover:bg-accent transition-all">
                                Strictly Necessary Only
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
