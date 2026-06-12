import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '@/components/PrivateRoute'
import PublicRoute from '@/components/PublicRoute'
import AdminRoute from '@/components/AdminRoute'

// Landing
const LandingPage = lazy(() => import('@/pages/page'))

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/login/page'))
const SignupPage = lazy(() => import('@/pages/auth/signup/page'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password/page'))

// Dashboard
const DashboardLayout = lazy(() => import('@/pages/dashboard/layout'))
const DashboardPage = lazy(() => import('@/pages/dashboard/page'))
const DashboardApiKeys = lazy(() => import('@/pages/dashboard/api-keys/page'))
const DashboardHistory = lazy(() => import('@/pages/dashboard/history/page'))
const DashboardPricing = lazy(() => import('@/pages/dashboard/pricing/page'))
const DashboardReferrals = lazy(() => import('@/pages/dashboard/referrals/page'))
const DashboardTopup = lazy(() => import('@/pages/dashboard/topup/page'))
const DashboardRedeem = lazy(() => import('@/pages/dashboard/redeem/page'))

// Standalone invoice
const TopupInvoicePage = lazy(() => import('@/pages/topup-invoice/page'))

// Admin
const AdminLayout = lazy(() => import('@/pages/admin/layout'))
const AdminPage = lazy(() => import('@/pages/admin/page'))
const AdminUsers = lazy(() => import('@/pages/admin/users/page'))
const AdminUserDetail = lazy(() => import('@/pages/admin/users/[id]/page'))
const AdminAnalytics = lazy(() => import('@/pages/admin/analytics/page'))
const AdminSolutions = lazy(() => import('@/pages/admin/solutions/page'))
const AdminPackages = lazy(() => import('@/pages/admin/packages/page'))
const AdminExtensions = lazy(() => import('@/pages/admin/extensions/page'))
const AdminCrypto = lazy(() => import('@/pages/admin/crypto/page'))
const AdminOrders = lazy(() => import('@/pages/admin/orders/page'))
const AdminHistory = lazy(() => import('@/pages/admin/history/page'))
const AdminCacheControl = lazy(() => import('@/pages/admin/cache-control/page'))
const AdminRedeemCodes = lazy(() => import('@/pages/admin/redeem-codes/page'))
const AdminPromoOffers = lazy(() => import('@/pages/admin/promo-offers/page'))
const AdminSettings = lazy(() => import('@/pages/admin/settings/page'))
const AdminNotifications = lazy(() => import('@/pages/admin/notifications/page'))
const AdminEmail = lazy(() => import('@/pages/admin/email/page'))
const AdminDatabase = lazy(() => import('@/pages/admin/database/page'))
const AdminDatabaseTransfer = lazy(() => import('@/pages/admin/database/transfer/page'))
const AdminUploadModel = lazy(() => import('@/pages/admin/upload-model/page'))
const AdminBots = lazy(() => import('@/pages/admin/bots/page'))
const AdminBotEndpoints = lazy(() => import('@/pages/admin/ai-training/bot-endpoints/page'))
const AdminTrainingBots = lazy(() => import('@/pages/admin/ai-training/bots/page'))
const AdminHealthCheck = lazy(() => import('@/pages/admin/ai-training/health-check/page'))
const AdminTrainingData = lazy(() => import('@/pages/admin/ai-training/training-data/page'))
const AdminSmtp = lazy(() => import('@/pages/admin/system/smtp/page'))
const AdminPermissions = lazy(() => import('@/pages/admin/permissions/page'))
const AdminUserPackages = lazy(() => import('@/pages/admin/user-packages/page'))

// Public pages
const AboutPage = lazy(() => import('@/pages/about/page'))
const FeaturesPage = lazy(() => import('@/pages/features/page'))
const HowItWorksPage = lazy(() => import('@/pages/how-it-works/page'))
const ExtensionsPage = lazy(() => import('@/pages/extensions/page'))
const ApiDocsPage = lazy(() => import('@/pages/api-docs/page'))
const CookiesPage = lazy(() => import('@/pages/cookies/page'))
const PrivacyPage = lazy(() => import('@/pages/privacy/page'))
const TermsPage = lazy(() => import('@/pages/terms/page'))
const ContactPage = lazy(() => import('@/pages/contact/page'))
const RefundPage = lazy(() => import('@/pages/refund/page'))
const ProfilePage = lazy(() => import('@/pages/profile/page'))
const ForgotPasswordAltPage = lazy(() => import('@/pages/forgot-password/page'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password/page'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes (guest only) */}
        <Route path="/auth/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/auth/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/auth/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordAltPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* Dashboard routes (private) */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="api-keys" element={<DashboardApiKeys />} />
          <Route path="history" element={<DashboardHistory />} />
          <Route path="pricing" element={<DashboardPricing />} />
          <Route path="referrals" element={<DashboardReferrals />} />
          <Route path="topup" element={<DashboardTopup />} />
          <Route path="redeem" element={<DashboardRedeem />} />
        </Route>

        {/* Direct topup route (from history Pay Now) */}
        <Route path="/topup" element={<PrivateRoute><TopupInvoicePage /></PrivateRoute>} />

        {/* Admin routes (private) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminPage />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="solutions" element={<AdminSolutions />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="extensions" element={<AdminExtensions />} />
          <Route path="crypto" element={<AdminCrypto />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="cache-control" element={<AdminCacheControl />} />
          <Route path="redeem-codes" element={<AdminRedeemCodes />} />
          <Route path="promo-offers" element={<AdminPromoOffers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="email" element={<AdminEmail />} />
          <Route path="database" element={<AdminDatabase />} />
          <Route path="database/transfer" element={<AdminDatabaseTransfer />} />
          <Route path="upload-model" element={<AdminUploadModel />} />
          <Route path="bots" element={<AdminBots />} />
          <Route path="ai-training/bot-endpoints" element={<AdminBotEndpoints />} />
          <Route path="ai-training/bots" element={<AdminTrainingBots />} />
          <Route path="ai-training/health-check" element={<AdminHealthCheck />} />
          <Route path="ai-training/training-data" element={<AdminTrainingData />} />
          <Route path="system/smtp" element={<AdminSmtp />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="user-packages" element={<AdminUserPackages />} />
        </Route>

        {/* Public pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/extensions" element={<ExtensionsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
