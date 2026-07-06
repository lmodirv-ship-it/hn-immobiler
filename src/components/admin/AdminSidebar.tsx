import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, CalendarCheck2, Receipt, Wrench,
  BarChart3, Bell, Settings, ShieldCheck, UserPlus, CreditCard, ScrollText,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminStats } from '@/hooks/useAdminStats';

export const AdminSidebar = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { pathname } = useLocation();
  const { data: s } = useAdminStats();

  const isActive = (p: string) =>
    pathname === p || (p !== '/admin' && pathname.startsWith(p));

  const items = [
    { url: '/admin', icon: LayoutDashboard, label: t('Vue d’ensemble', 'نظرة عامة') },
    { url: '/admin/users', icon: Users, label: t('Utilisateurs', 'المستخدمون'), badge: s?.total_users || 0 },
    { url: '/admin/properties', icon: Building2, label: t('Biens', 'العقارات'), badge: s?.pending_properties || 0, badgeAlert: true },
    { url: '/admin/bookings', icon: CalendarCheck2, label: t('Réservations', 'الحجوزات'), badge: s?.pending_bookings || 0, badgeAlert: true },
    { url: '/admin/finance', icon: Receipt, label: t('Finance', 'المالية'), badge: s?.unpaid_invoices || 0, badgeAlert: true },
    { url: '/admin/maintenance', icon: Wrench, label: t('Maintenance', 'الصيانة'), badge: s?.open_maintenance || 0, badgeAlert: true },
    { url: '/admin/analytics', icon: BarChart3, label: t('Analytique', 'التحليلات') },
    { url: '/admin/payments', icon: CreditCard, label: t('Paiements', 'المدفوعات') },
    { url: '/admin/role-requests', icon: UserPlus, label: t('Demandes de rôle', 'طلبات الأدوار') },
    { url: '/admin/notifications', icon: Bell, label: t('Diffusion', 'البث') },
    { url: '/admin/audit', icon: ScrollText, label: t('Journal d’audit', 'سجل التدقيق') },
    { url: '/admin/settings', icon: Settings, label: t('Paramètres', 'الإعدادات') },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {!collapsed && t('Super Admin', 'المشرف العام')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === '/admin'} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && Number(item.badge) > 0 && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.badgeAlert
                              ? 'bg-destructive text-destructive-foreground animate-pulse'
                              : 'bg-primary/20 text-primary'
                          }`}
                        >
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
      </SidebarContent>
    </Sidebar>
  );
};