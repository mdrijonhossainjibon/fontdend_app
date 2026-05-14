// This layout is no longer used as root layout in Vite.
// The root providers (StoreProvider, AuthProvider, BrowserRouter) are in main.tsx.
// This file exists as a pass-through for page-level layouts.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
