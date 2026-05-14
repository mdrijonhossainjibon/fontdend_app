"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ShieldCheck, Scale, FileText, AlertCircle, RefreshCcw } from "lucide-react"

export default function TermsPage() {
    const lastUpdated = "February 09, 2026"

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-24 pb-16 sm:pt-32">
                {/* Header Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-16">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-10 bg-primary/20 rounded-full" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </section>

                {/* Content Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 sm:p-12 shadow-2xl space-y-12">

                        {/* Introduction */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <FileText className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing and using Captcha Master ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our extension or API services. We provide an automated captcha-solving utility intended for personal and research productivity.
                            </p>
                        </div>

                        {/* User Responsibilities */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Scale className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">2. Proper Usage</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                You are responsible for ensuring that your use of Captcha Master complies with the terms of service of the websites you visit. Our service should NOT be used for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Spamming or mass automated account creation.</li>
                                <li>DDoS attacks or overwhelming server resources.</li>
                                <li>Any illegal activities in your jurisdiction.</li>
                                <li>Bypassing security measures for malicious intent.</li>
                            </ul>
                        </div>

                        {/* Service Availability */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <RefreshCcw className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">3. Service Modifications</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                We continuously improve our AI models. We reserve the right to modify, suspend, or discontinue any part of the Service at any time. While we strive for 99.9% uptime, we do not guarantee uninterrupted access to the Service.
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <ShieldCheck className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">4. Intellectual Property</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                The software, AI models, and technology underlying Captcha Master are the exclusive property of Captcha Master and its licensors. You are granted a limited, non-exclusive license to use the extension for its intended purpose.
                            </p>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="space-y-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-3 text-amber-500 mb-2">
                                <AlertCircle className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                CAPTCHA MASTER IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO ACCOUNT BANS FROM THIRD-PARTY WEBSITES.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="text-center pt-8 border-t border-border/50">
                            <p className="text-muted-foreground mb-4">Have questions about our terms?</p>
                            <button className="px-8 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all">
                                Contact Legal Support
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
