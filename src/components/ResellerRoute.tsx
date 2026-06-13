import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const ResellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  if (checking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;
  if (!['reseller', 'superadmin'].includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ResellerRoute;
