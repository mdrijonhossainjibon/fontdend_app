"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import type { RootState } from "@/modules/rootReducer"
import { fetchPricingPackagesRequest, subscribeToPlanRequest, clearSubscriptionResult } from "@/modules/pricing/actions"
import { Package, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";

// Mobile Popup: Simple Tailwind bottom sheet instead of antd-mobile Popup

// TypeScript interfaces
interface PricingPackage {
    id: string
    type: "count" | "daily" | "minute"
    code: string
    price: string
    priceValue: number
    validity: string
    recognition: string
    isPromo?: boolean
    count?: number
    dailyLimit?: number
    rateLimit?: number
}

interface ApiResponse {
    success: boolean
    data?: PricingPackage[]
    count?: number
    error?: string
}

interface SubscribeResponse {
    success: boolean
    message?: string
    data?: {
        subscriptionId: string
        planCode: string
        price: string
        credits: number
        startDate: string
        endDate: string
    }
    error?: string
}

export function DashboardPricing() {
    const [filterType, setFilterType] = useState<"all" | "count" | "daily" | "minute">("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null)
    const [modalState, setModalState] = useState<"confirm" | "loading" | "success" | "error">("confirm")
    const [mounted, setMounted] = useState(false)
    const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
    const [isMobile, setIsMobile] = useState(false)

    const dispatch = useDispatch()
    const { packages: pricingPackages, loading: isLoading, error } = useSelector((state: RootState) => state.pricing)
    const { subscribing: subscribLoading, subscriptionResult, subscribeError: subError } = useSelector((state: RootState) => state.pricing)
    const activePackageInfo = useSelector((state: RootState) => state.topup.activePackage)
    const activePackage = activePackageInfo?.activePackage?.code ? { code: activePackageInfo.activePackage.code } : null
    const [searchParams] = useSearchParams()
    const offerCode = searchParams.get('offer')
    const [offerHighlighted, setOfferHighlighted] = useState<string | null>(null)

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Fetch pricing packages and active subscription info
        // Initial mount - fetch data
    useEffect(() => {
        setMounted(true)
        dispatch(fetchPricingPackagesRequest())
    }, [dispatch])

    // Filter packages based on selected type
    const filteredPackages = filterType === "all"
        ? pricingPackages
        : pricingPackages.filter(pkg => pkg.type === filterType)

    // Auto-highlight offer package when ?offer= param present
    useEffect(() => {
        if (offerCode && pricingPackages.length > 0 && !offerHighlighted) {
            const match = pricingPackages.find((pkg: PricingPackage) => pkg.code === offerCode)
            if (match) {
                setOfferHighlighted(match.id)
                setTimeout(() => {
                    const el = document.getElementById(`pricing-card-${match.id}`)
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        el.focus()
                    }
                }, 150)
            }
        }
    }, [offerCode, pricingPackages, offerHighlighted])

    // Stagger animation for cards
    useEffect(() => {
        // Reset visible cards when filter changes
        setVisibleCards(new Set())

        const timeouts: NodeJS.Timeout[] = []

        filteredPackages.forEach((pkg, index) => {
            const timeout = setTimeout(() => {
                setVisibleCards(prev => new Set([...prev, pkg.id]))
            }, index * 50) // 50ms stagger delay
            timeouts.push(timeout)
        })

        // Cleanup timeouts on unmount or filter change
        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout))
        }
    }, [filterType, filteredPackages.length, pricingPackages])

    const handleSubscribe = (pkg: PricingPackage) => {
        if (activePackage && activePackage.code === pkg.code) {
            window.location.href = '/dashboard'
            return
        }
        setSelectedPackage(pkg)
        setModalState("confirm")
        dispatch(clearSubscriptionResult())
        setIsModalOpen(true)
    }

    const handleConfirm = async () => {        if (!selectedPackage) return        setModalState("loading")        dispatch(subscribeToPlanRequest({            planId: selectedPackage.id,            planCode: selectedPackage.code,        }))    }    // Watch Redux state for subscription result    useEffect(() => {        if (subscriptionResult) {            setModalState("success")            // Auto-close after 3 seconds            setTimeout(() => {                setIsModalOpen(false)                dispatch(clearSubscriptionResult())            }, 3000)        } else if (subError) {            setModalState("error")        }    }, [subscriptionResult, subError, dispatch])    const handleCancel = () => {
        setIsModalOpen(false)
        setSelectedPackage(null)
        setModalState("confirm")
        dispatch(clearSubscriptionResult())
    }

    const handleRetry = () => {
        setModalState("confirm")
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-background ">
            <div className="max-w-[1600px] mx-auto">

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 md:gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        <button
                            onClick={() => setFilterType("all")}
                            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${filterType === "all"
                                ? "bg-[#9ACD32] text-black shadow-lg shadow-[#9ACD32]/30"
                                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            ALL
                        </button>
                        <button
                            onClick={() => setFilterType("daily")}
                            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${filterType === "daily"
                                ? "bg-[#9ACD32] text-black shadow-lg shadow-[#9ACD32]/30"
                                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            DAILY
                        </button>
                        <button
                            onClick={() => setFilterType("count")}
                            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${filterType === "count"
                                ? "bg-[#9ACD32] text-black shadow-lg shadow-[#9ACD32]/30"
                                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            COUNT
                        </button>
                        {/* 
                        <button
                            onClick={() => setFilterType("minute")}
                            className={`px-5 py-2 rounded-md font-medium text-sm transition-all duration-300 transform hover:scale-105 ${filterType === "minute"
                                ? "bg-[#9ACD32] text-black shadow-lg shadow-[#9ACD32]/30"
                                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            MINUTE
                        </button> */}
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-xs md:text-sm text-muted-foreground">Showing</span>
                        <span className="text-xs md:text-sm font-bold text-foreground">{filteredPackages.length}</span>
                        <span className="text-xs md:text-sm text-muted-foreground">packages</span>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="relative bg-gradient-to-br from-card/90 via-card/60 to-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse"
                            >
                                <div className="h-4 w-16 bg-muted/50 rounded mb-6" />
                                <div className="w-14 h-14 bg-muted/30 rounded-2xl mb-5" />
                                <div className="h-10 w-24 bg-muted/40 rounded mb-2" />
                                <div className="h-3 w-32 bg-muted/30 rounded mb-5" />
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="h-16 bg-muted/20 rounded-xl" />
                                    <div className="h-16 bg-muted/20 rounded-xl" />
                                </div>
                                <div className="h-12 bg-muted/20 rounded-xl mb-5" />
                                <div className="h-12 bg-muted/30 rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Failed to Load Packages</h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">{error}</p>
                        <button
                            onClick={() => dispatch(fetchPricingPackagesRequest())}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#9ACD32] hover:bg-[#8BC320] text-black font-bold transition-all duration-300 hover:scale-105"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredPackages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                            <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No Packages Found</h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                            {filterType === "all"
                                ? "No pricing packages are available at the moment."
                                : `No ${filterType} packages are available. Try a different filter.`}
                        </p>
                        {filterType !== "all" && (
                            <button
                                onClick={() => setFilterType("all")}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold transition-all duration-300"
                            >
                                View All Packages
                            </button>
                        )}
                    </div>
                )}

                {/* Pricing Grid */}
                {!isLoading && !error && filteredPackages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
                        {filteredPackages.map((pkg, index) => (
                            <div
                                key={pkg.id}
                                id={`pricing-card-${pkg.id}`}
                                className={`relative bg-gradient-to-br from-card/90 via-card/60 to-card/30 backdrop-blur-xl rounded-2xl p-6 transition-all duration-700 group overflow-hidden
                                ${visibleCards.has(pkg.id)
                                        ? 'opacity-100 translate-y-0 scale-100'
                                        : 'opacity-0 translate-y-8 scale-95'
                                    }
                                hover:shadow-[0_20px_60px_-15px_rgba(154,205,50,0.3)] hover:-translate-y-3 hover:scale-[1.02]
                                ${offerHighlighted === pkg.id ? 'ring-2 ring-[#9ACD32] ring-offset-2 ring-offset-background shadow-[0_0_30px_rgba(154,205,50,0.5)] scale-[1.02] animate-pulse' : ''}
                            `}
                                style={{
                                    transitionDelay: `${index * 60}ms`,
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px'
                                }}
                            >
                                {/* Animated RGB Border - Working Version */}
                                <div className="absolute -inset-[1.5px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 overflow-hidden">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-[spin_3s_linear_infinite] blur-sm"
                                        style={{ padding: '2px' }} />
                                    <div className="absolute inset-[1.5px] rounded-2xl bg-gradient-to-br from-card/95 via-card/70 to-card/40 backdrop-blur-xl" />
                                </div>

                                {/* Static border for non-hover state */}
                                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-transparent transition-colors duration-500" />



                                {/* Floating orbs background */}
                                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#9ACD32]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150 animate-float" />
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#9ACD32]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200 group-hover:scale-125" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-radial from-[#9ACD32]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Sparkle effects */}
                                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-4 right-8 w-1 h-1 bg-[#9ACD32] rounded-full animate-ping" />
                                    <div className="absolute top-12 right-4 w-0.5 h-0.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                                    <div className="absolute bottom-20 right-12 w-1 h-1 bg-[#9ACD32]/80 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                </div>

                                {/* Package Type Badge */}
                                <div className="absolute -top-1 -left-1 z-20 flex flex-col gap-1">
                                    <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-br-xl rounded-tl-xl text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:scale-105 ${pkg.type === 'count' ? 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white shadow-lg shadow-blue-500/20' :
                                        pkg.type === 'daily' ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/20' :
                                            'bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white shadow-lg shadow-orange-500/20'
                                        }`}>
                                        {pkg.type}
                                    </div>
                                    {activePackage && activePackage.code === pkg.code && (
                                        <div className="px-2 md:px-3 py-0.5 md:py-1 rounded-r-xl bg-[#9ACD32] text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#9ACD32]/20 animate-pulse">
                                            Current Plan
                                        </div>
                                    )}
                                </div>

                                {/* Content wrapper */}
                                <div className="relative z-10 pt-4">
                                    {/* Icon with glow effect */}
                                    <div className="mb-4 md:mb-5 transform transition-all duration-500 group-hover:translate-x-1">
                                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#9ACD32]/25 to-[#9ACD32]/5 border border-[#9ACD32]/40 flex items-center justify-center transition-all duration-500 group-hover:from-[#9ACD32]/40 group-hover:to-[#9ACD32]/15 group-hover:border-[#9ACD32] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_30px_rgba(154,205,50,0.4)]">
                                            <Package className="w-6 h-6 md:w-7 md:h-7 text-[#9ACD32] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(154,205,50,0.5)]" />
                                            {/* Icon glow ring */}
                                            <div className="absolute inset-0 rounded-2xl border-2 border-[#9ACD32]/0 group-hover:border-[#9ACD32]/30 transition-all duration-300 animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Price with gradient and glow */}
                                    <div className="absolute top-4 right-0 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                                        <div className="relative">
                                            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-foreground via-foreground to-foreground bg-clip-text text-transparent transition-all duration-500 group-hover:from-[#9ACD32] group-hover:via-[#8BC320] group-hover:to-[#6B8E23] drop-shadow-sm">
                                                {pkg.price}
                                            </span>
                                            {/* Price glow */}
                                            <div className="absolute inset-0 blur-lg bg-[#9ACD32]/0 group-hover:bg-[#9ACD32]/20 transition-all duration-500 -z-10" />
                                        </div>
                                    </div>

                                    {/* Count/Limit Display */}
                                    <div className="mb-4 md:mb-5 transform transition-all duration-500 delay-100 group-hover:translate-x-1">
                                        {pkg.type === "count" && (
                                            <>
                                                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#9ACD32] group-hover:to-[#8BC320]">
                                                    {pkg.count?.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide transition-colors duration-300 group-hover:text-[#9ACD32]/70 mt-1">TOTAL REQUESTS</p>
                                            </>
                                        )}
                                        {pkg.type === "daily" && (
                                            <>
                                                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#9ACD32] group-hover:to-[#8BC320]">
                                                    {pkg.dailyLimit?.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide transition-colors duration-300 group-hover:text-[#9ACD32]/70 mt-1">REQUESTS PER DAY</p>
                                            </>
                                        )}
                                        {pkg.type === "minute" && (
                                            <>
                                                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#9ACD32] group-hover:to-[#8BC320]">
                                                    {pkg.rateLimit}
                                                </p>
                                                <p className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide transition-colors duration-300 group-hover:text-[#9ACD32]/70 mt-1">REQUESTS PER MINUTE</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Details Grid with glass cards */}
                                    <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 border border-white/10 transition-all duration-300 delay-150 group-hover:bg-[#9ACD32]/10 group-hover:border-[#9ACD32]/30 group-hover:scale-[1.03] group-hover:-translate-y-1">
                                            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-[#9ACD32]/50 to-[#9ACD32] transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(154,205,50,0.5)] flex-shrink-0" />
                                                <span className="text-[9px] md:text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider md:tracking-widest truncate">Validity</span>
                                            </div>
                                            <p className="text-sm md:text-base font-bold text-foreground transition-colors duration-300 group-hover:text-[#9ACD32] truncate">{pkg.validity}</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 border border-white/10 transition-all duration-300 delay-200 group-hover:bg-[#9ACD32]/10 group-hover:border-[#9ACD32]/30 group-hover:scale-[1.03] group-hover:-translate-y-1">
                                            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-[#9ACD32]/50 to-[#9ACD32] transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(154,205,50,0.5)] flex-shrink-0" />
                                                <span className="text-[9px] md:text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider md:tracking-widest truncate">Type</span>
                                            </div>
                                            <p className="text-sm md:text-base font-bold text-foreground transition-colors duration-300 group-hover:text-[#9ACD32] truncate">{pkg.recognition}</p>
                                        </div>
                                    </div>

                                    {/* Package Code with glass effect */}
                                    <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 mb-4 md:mb-5 border border-white/10 transition-all duration-300 delay-250 group-hover:border-[#9ACD32]/40 group-hover:bg-[#9ACD32]/10 group-hover:scale-[1.02] group-hover:-translate-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-[#9ACD32]/50 to-[#9ACD32] animate-pulse flex-shrink-0" />
                                                <span className="text-[9px] md:text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider md:tracking-widest truncate">Package ID</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-bold text-foreground font-mono tracking-wider transition-colors duration-300 group-hover:text-[#9ACD32] flex-shrink-0">{pkg.code}</p>
                                        </div>
                                    </div>

                                    {/* Premium Subscribe Button */}
                                    <button
                                        onClick={() => handleSubscribe(pkg)}
                                        className="relative w-full py-3 md:py-3.5 rounded-lg md:rounded-xl bg-gradient-to-r from-[#9ACD32]/10 to-[#9ACD32]/5 border-2 border-[#9ACD32]/40 text-[#9ACD32] font-bold text-xs md:text-sm transition-all duration-500 overflow-hidden group/btn
                                        hover:border-[#9ACD32] hover:shadow-[0_10px_40px_-10px_rgba(154,205,50,0.5)] active:scale-[0.97]
                                        before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#9ACD32] before:via-[#8BC320] before:to-[#9ACD32] before:translate-y-full before:transition-transform before:duration-500 before:ease-out
                                        hover:before:translate-y-0"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-1.5 md:gap-2 transition-colors duration-300 group-hover/btn:text-black font-extrabold tracking-wide md:tracking-widest">
                                            <span>
                                                {activePackage ? (
                                                    activePackage.code === pkg.code ? 'MANAGE' : 'UPGRADE'
                                                ) : 'SUBSCRIBE'}
                                            </span>
                                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        {/* Shine sweep effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                                        </div>
                                    </button>
                                </div>

                                {/* Corner glow accent */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#9ACD32]/0 group-hover:bg-[#9ACD32]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#9ACD32]/0 group-hover:bg-[#9ACD32]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirmation Modal/Popup - Conditional based on device */}
                {isMobile ? (
                    // Mobile: Use Tailwind bottom sheet
                    isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />
                            <div className="relative w-full max-w-md bg-card/95 backdrop-blur-md border border-border rounded-t-2xl md:rounded-2xl shadow-2xl animate-slideUp"
                                style={{ maxHeight: '90vh', overflow: 'auto', minHeight: '40vh' }}
                            >
                        {selectedPackage && (
                            <div className="relative bg-card/95 backdrop-blur-md p-6">
                                {/* Confirm State */}
                                {modalState === "confirm" && (
                                    <>
                                        {/* Header */}
                                        <div className="mb-6 animate-fadeIn">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 rounded-xl bg-[#9ACD32]/10 border border-[#9ACD32]/30 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                    <Package className="w-6 h-6 text-[#9ACD32]" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-foreground">
                                                        {activePackage ? (
                                                            activePackage.code === selectedPackage.code ? 'Renew Subscription' : 'Upgrade Subscription'
                                                        ) : 'Confirm Subscription'}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">Review your package details</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Package Details */}
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-muted/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-muted-foreground">Package Code</span>
                                                    <span className="text-lg font-bold text-foreground font-mono">{selectedPackage.code}</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-muted-foreground">Price</span>
                                                    <span className="text-2xl font-bold text-[#9ACD32]">{selectedPackage.price}</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-muted-foreground">
                                                        {selectedPackage.type === "count" && "Total Requests"}
                                                        {selectedPackage.type === "daily" && "Daily Limit"}
                                                        {selectedPackage.type === "minute" && "Rate Limit"}
                                                    </span>
                                                    <span className="text-lg font-bold text-foreground">
                                                        {selectedPackage.type === "count" && selectedPackage.count?.toLocaleString()}
                                                        {selectedPackage.type === "daily" && selectedPackage.dailyLimit?.toLocaleString()}
                                                        {selectedPackage.type === "minute" && selectedPackage.rateLimit}
                                                        {selectedPackage.type === "minute" && "/min"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Validity</span>
                                                    <span className="text-sm font-bold text-foreground">{selectedPackage.validity}</span>
                                                </div>
                                            </div>

                                            <div className="bg-[#9ACD32]/10 border border-[#9ACD32]/30 rounded-xl p-4">
                                                <p className="text-sm text-foreground">
                                                    <span className="font-bold">Recognition Type:</span> {selectedPackage.recognition}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleConfirm}
                                                className="flex-1 px-4 py-3 rounded-lg bg-[#9ACD32] hover:bg-[#8BC320] text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#9ACD32]/30 hover:scale-105 active:scale-95"
                                            >
                                                {activePackage ? (
                                                    activePackage.code === selectedPackage.code ? 'Confirm Renewal' : 'Confirm Upgrade'
                                                ) : 'Confirm Purchase'}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Loading State */}
                                {modalState === "loading" && (
                                    <div className="text-center py-8 animate-fadeIn">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9ACD32]/10 border border-[#9ACD32]/30 flex items-center justify-center animate-pulse">
                                            <Loader2 className="w-8 h-8 text-[#9ACD32] animate-spin" />
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground mb-2">Processing...</h2>
                                        <p className="text-sm text-muted-foreground">Please wait while we process your subscription</p>
                                    </div>
                                )}

                                {/* Success State */}
                                {modalState === "success" && (
                                    <div className="text-center py-8 animate-fadeIn">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-scaleIn">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground mb-2">Success!</h2>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Your subscription to package <span className="font-mono font-bold text-foreground">{selectedPackage.code}</span> has been activated
                                        </p>
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                You will receive a confirmation email shortly
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Error State */}
                                {modalState === "error" && (
                                    <div className="text-center py-8 animate-fadeIn">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center animate-shake">
                                            <XCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground mb-2">Payment Failed</h2>
                                        <p className="text-sm text-red-400 font-medium mb-6 px-4">
                                            {subError}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={handleRetry}
                                                className="flex-1 px-4 py-3 rounded-lg bg-[#9ACD32] hover:bg-[#8BC320] text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#9ACD32]/30 hover:scale-105 active:scale-95"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                            </div>
                        </div>
                    )
                ) : (
                    // Desktop: Use Modal
                    isModalOpen && selectedPackage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                            <div className="relative w-full max-w-md animate-slideUp">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#9ACD32]/20 to-[#9ACD32]/10 rounded-2xl blur-xl animate-pulse" />

                                {/* Modal Content */}
                                <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl transform transition-all duration-300">
                                    {/* Confirm State */}
                                    {modalState === "confirm" && (
                                        <>
                                            {/* Header */}
                                            <div className="mb-6 animate-fadeIn">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 rounded-xl bg-[#9ACD32]/10 border border-[#9ACD32]/30 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                                        <Package className="w-6 h-6 text-[#9ACD32]" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-bold text-foreground">
                                                            {activePackage ? (
                                                                activePackage.code === selectedPackage.code ? 'Renew Subscription' : 'Upgrade Subscription'
                                                            ) : 'Confirm Subscription'}
                                                        </h2>
                                                        <p className="text-sm text-muted-foreground">Review your package details</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Package Details */}
                                            <div className="space-y-4 mb-6">
                                                <div className="bg-muted/30 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm text-muted-foreground">Package Code</span>
                                                        <span className="text-lg font-bold text-foreground font-mono">{selectedPackage.code}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm text-muted-foreground">Price</span>
                                                        <span className="text-2xl font-bold text-[#9ACD32]">{selectedPackage.price}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm text-muted-foreground">
                                                            {selectedPackage.type === "count" && "Total Requests"}
                                                            {selectedPackage.type === "daily" && "Daily Limit"}
                                                            {selectedPackage.type === "minute" && "Rate Limit"}
                                                        </span>
                                                        <span className="text-lg font-bold text-foreground">
                                                            {selectedPackage.type === "count" && selectedPackage.count?.toLocaleString()}
                                                            {selectedPackage.type === "daily" && selectedPackage.dailyLimit?.toLocaleString()}
                                                            {selectedPackage.type === "minute" && selectedPackage.rateLimit}
                                                            {selectedPackage.type === "minute" && "/min"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Validity</span>
                                                        <span className="text-sm font-bold text-foreground">{selectedPackage.validity}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-[#9ACD32]/10 border border-[#9ACD32]/30 rounded-xl p-4">
                                                    <p className="text-sm text-foreground">
                                                        <span className="font-bold">Recognition Type:</span> {selectedPackage.recognition}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex-1 px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleConfirm}
                                                    className="flex-1 px-4 py-3 rounded-lg bg-[#9ACD32] hover:bg-[#8BC320] text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#9ACD32]/30 hover:scale-105 active:scale-95"
                                                >
                                                    {activePackage ? (
                                                        activePackage.code === selectedPackage.code ? 'Confirm Renewal' : 'Confirm Upgrade'
                                                    ) : 'Confirm Purchase'}
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Loading State */}
                                    {modalState === "loading" && (
                                        <div className="text-center py-8 animate-fadeIn">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9ACD32]/10 border border-[#9ACD32]/30 flex items-center justify-center animate-pulse">
                                                <Loader2 className="w-8 h-8 text-[#9ACD32] animate-spin" />
                                            </div>
                                            <h2 className="text-xl font-bold text-foreground mb-2">Processing...</h2>
                                            <p className="text-sm text-muted-foreground">Please wait while we process your subscription</p>
                                        </div>
                                    )}

                                    {/* Success State */}
                                    {modalState === "success" && (
                                        <div className="text-center py-8 animate-fadeIn">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-scaleIn">
                                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                            </div>
                                            <h2 className="text-xl font-bold text-foreground mb-2">Success!</h2>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Your subscription to package <span className="font-mono font-bold text-foreground">{selectedPackage.code}</span> has been activated
                                            </p>
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                    You will receive a confirmation email shortly
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error State */}
                                    {modalState === "error" && (
                                        <div className="text-center py-8 animate-fadeIn">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center animate-shake">
                                                <XCircle className="w-8 h-8 text-red-500" />
                                            </div>
                                            <h2 className="text-xl font-bold text-foreground mb-2">Payment Failed</h2>
                                            <p className="text-sm text-red-400 font-medium mb-6 px-4">
                                                {subError}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex-1 px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    onClick={handleRetry}
                                                    className="flex-1 px-4 py-3 rounded-lg bg-[#9ACD32] hover:bg-[#8BC320] text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#9ACD32]/30 hover:scale-105 active:scale-95"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
