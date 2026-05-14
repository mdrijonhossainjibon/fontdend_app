import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();
    const location = useLocation();

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
