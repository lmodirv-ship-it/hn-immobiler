import { Outlet, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const OwnerLayout = () => {
  const { user, loading, isOwner } = useAuth();
  const { lang } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isOwner) return <Navigate to="/dashboard" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-[calc(100vh-4rem)] flex w-full">
        <OwnerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border/40 glass sticky top-0 z-10 px-3 gap-2">
            <SidebarTrigger />
            <span className="font-display text-sm tracking-wider text-primary/80">
              {lang === 'ar' ? 'لوحة تحكم المالك' : 'Espace propriétaire'}
            </span>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OwnerLayout;