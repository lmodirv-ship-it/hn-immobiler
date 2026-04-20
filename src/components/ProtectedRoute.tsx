import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: JSX.Element; requireAdmin?: boolean }) => {
  const { user, loading, isAdmin } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" state={{ from: loc.pathname }} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return children;
};