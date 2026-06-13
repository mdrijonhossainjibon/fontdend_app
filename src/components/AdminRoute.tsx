import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!['admin', 'superadmin'].includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
