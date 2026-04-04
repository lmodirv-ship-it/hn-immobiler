import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Header = () => {
  const { t, lang, setLang } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/properties', label: t.nav.properties },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-accent" />
          <span className="font-display text-xl font-bold text-primary">
            HN <span className="text-accent">Immobilier</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(item.to) ? 'text-accent' : 'text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="gap-1"
          >
            <Globe className="h-4 w-4" />
            {lang === 'fr' ? 'العربية' : 'Français'}
          </Button>
          <Link to="/auth">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t.nav.login}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium ${
                isActive(item.to) ? 'text-accent' : 'text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            >
              <Globe className="h-4 w-4 mr-1" />
              {lang === 'fr' ? 'العربية' : 'Français'}
            </Button>
            <Link to="/auth" onClick={() => setMobileOpen(false)}>
              <Button size="sm">{t.nav.login}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
