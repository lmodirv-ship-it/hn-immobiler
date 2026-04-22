import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Globe, Menu, X, LayoutDashboard, LogOut, MessageSquare, GitCompare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import GeoBadge from '@/components/GeoBadge';
import VisitorCounter from '@/components/VisitorCounter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { t, lang, setLang } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const pickLang = (l: 'fr' | 'ar') => {
    localStorage.setItem('hn_lang_picked', '1');
    setLang(l);
  };

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/properties', label: t.nav.properties },
    { to: '/map', label: lang === 'ar' ? 'الخريطة' : 'Carte' },
    { to: '/simulator', label: lang === 'ar' ? 'محاكي القرض' : 'Simulateur' },
    { to: '/pricing', label: lang === 'ar' ? 'الأسعار' : 'Tarifs' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="neon-line" />
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <Building2 className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="font-display text-lg font-bold tracking-wider">
              <span className="text-gradient-cyber">HN</span>{' '}
              <span className="text-gradient-gold">IMMO</span>
            </span>
          </Link>
          <VisitorCounter />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive(item.to)
                  ? 'text-primary glow-border bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {item.label}
              {isActive(item.to) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <GeoBadge />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-display tracking-wider uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => pickLang('fr')} className="gap-2">
                🇫🇷 Français {lang === 'fr' && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => pickLang('ar')} className="gap-2">
                🇲🇦 العربية {lang === 'ar' && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <>
              <Link to="/dashboard/messages">
                <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/compare">
                <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary">
                  <GitCompare className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" variant="ghost" className="gap-1 text-primary">
                  <LayoutDashboard className="h-4 w-4" />
                  {lang === 'ar' ? 'لوحتي' : 'Espace'}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut} className="gap-1 text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 glow-primary font-display text-xs tracking-wider">
                {t.nav.login}
              </Button>
            </Link>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.to) ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <GeoBadge />
                <Button variant="ghost" size="sm" onClick={() => pickLang(lang === 'fr' ? 'ar' : 'fr')}>
                  <Globe className="h-4 w-4 mr-1" />
                  {lang === 'fr' ? 'العربية' : 'Français'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
