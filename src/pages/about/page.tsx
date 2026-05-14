"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Sparkles, Target, Users, Zap, Shield, Globe, Cpu } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-24 pb-16 sm:pt-32">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-24">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-20 bg-primary/30 rounded-full" />

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
                        Our Mission
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
                        Reclaiming Your <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Digital Time</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        At Captcha Master, we believe the internet should be seamless. We're dedicated to eliminating one of the web's most frustrating hurdles through cutting-edge AI technology, so you can focus on what truly matters.
                    </p>
                </section>

                {/* Vision & Values */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700" />
                            <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-3xl">
                                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Target className="text-primary w-8 h-8" />
                                    Our Vision
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Founded in 2024, Captcha Master emerged from a simple observation: humans spend an average of 10 seconds on every captcha, totaling millions of hours globally every day.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We envisioned a world where "human verification" happens silently and securely in the background, making the web accessible and efficient for everyone, from individual researchers to enterprise data scientists.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Users, title: "Community Driven", desc: "Built by developers for developers." },
                                { icon: Shield, title: "Privacy First", desc: "Your data never leaves your browser." },
                                { icon: Zap, title: "Infinite Speed", desc: "Solving captchas in under 1s." },
                                { icon: Globe, title: "Global Scale", desc: "Supporting 100+ captcha types." }
                            ].map((value, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-card/30 border border-border/50 hover:border-primary/50 transition-colors group">
                                    <value.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Tech Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 py-24 bg-primary/5 border-y border-primary/10 overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-full -z-10 pointer-events-none opacity-10">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8">
                            <Cpu className="text-primary w-10 h-10" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Built on Advanced Neural Networks</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-10">
                            Our proprietary V3 Engine utilizes specialized computer vision models trained on millions of samples. Unlike traditional OCR, our AI understands context, identifies patterns, and mimics human interaction patterns to ensure 99.9% pass rates across all major platforms.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {["Neural Nets", "Edge Computing", "Real-time AI", "Zero-trust Auth"].map((tech) => (
                                <span key={tech} className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="px-4 sm:px-6 lg:px-8 py-32 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-8">Join the Master Race of Browsing</h2>
                    <p className="text-lg text-muted-foreground mb-12">
                        Thousands of users are already saving hours every week. It's time to stop checking boxes and start doing more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] hover:scale-105 transition-all">
                            Install Master Extension
                        </button>
                        <button className="px-10 py-4 bg-card border border-border text-foreground font-bold rounded-2xl hover:bg-accent transition-all">
                            Read API Documentation
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
