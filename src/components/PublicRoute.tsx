
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = status === 'authenticated';

    useEffect(() => {
        if (status !== 'loading' && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, status, navigate]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return !isAuthenticated ? <>{children}</> : null;
}
