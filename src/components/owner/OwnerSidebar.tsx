import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarCheck2, CalendarDays, MessageSquare, Star, Receipt, Wrench, BarChart3, CreditCard, Settings, Plus } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerStats } from '@/hooks/useOwnerStats';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

export const OwnerSidebar = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { data: stats } = useOwnerStats(user?.id);
  const { unread } = useUnreadMessages(user?.id);

  const isActive = (p: string) => pathname === p || (p !== '/owner' && pathname.startsWith(p));

  const items = [
    { url: '/owner', icon: LayoutDashboard, label: t('Vue d’ensemble', 'نظرة عامة') },
    { url: '/owner/properties', icon: Building2, label: t('Mes biens', 'عقاراتي'), badge: stats?.total_properties || 0 },
    { url: '/owner/bookings', icon: CalendarCheck2, label: t('Réservations', 'الحجوزات'), badge: stats?.pending_bookings || 0, badgeAlert: true },
    { url: '/owner/calendar', icon: CalendarDays, label: t('Calendrier', 'التقويم') },
    { url: '/owner/messages', icon: MessageSquare, label: t('Messages', 'الرسائل'), badge: unread, badgeAlert: true },
    { url: '/owner/reviews', icon: Star, label: t('Avis', 'التقييمات'), badge: stats?.total_reviews || 0 },
    { url: '/owner/analytics', icon: BarChart3, label: t('Analytique', 'التحليلات') },
    { url: '/owner/invoices', icon: Receipt, label: t('Factures', 'الفواتير') },
    { url: '/owner/maintenance', icon: Wrench, label: t('Maintenance', 'الصيانة') },
    { url: '/owner/payouts', icon: CreditCard, label: t('Paiements', 'المدفوعات') },
    { url: '/owner/settings', icon: Settings, label: t('Paramètres', 'الإعدادات') },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('Espace propriétaire', 'مساحة المالك')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === '/owner'} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && Number(item.badge) > 0 && (
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeAlert ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-primary/20 text-primary'}`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/owner/properties/new" className="flex items-center gap-2 text-primary">
                    <Plus className="h-4 w-4" />
                    {!collapsed && <span>{t('Nouveau bien', 'عقار جديد')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};