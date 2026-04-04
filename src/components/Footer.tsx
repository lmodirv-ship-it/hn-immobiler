import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden">
      <div className="neon-line" />
      <div className="glass-strong">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-7 w-7 text-primary" />
                <span className="font-display text-lg font-bold tracking-wider">
                  <span className="text-gradient-cyber">HN</span>{' '}
                  <span className="text-gradient-gold">IMMO</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.footer.description}
              </p>
            </div>

            <div>
              <h3 className="font-display text-xs tracking-widest uppercase text-primary mb-4">{t.footer.quickLinks}</h3>
              <nav className="space-y-2">
                {[
                  { to: '/', label: t.nav.home },
                  { to: '/properties', label: t.nav.properties },
                  { to: '/blog', label: 'Blog' },
                  { to: '/about', label: t.nav.about },
                  { to: '/contact', label: t.nav.contact },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-display text-xs tracking-widest uppercase text-primary mb-4">{t.footer.contactInfo}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>{t.contact.addressValue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <span>{t.contact.phoneValue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <span>{t.contact.emailValue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="neon-line mt-8 mb-6" />
          <div className="text-center text-xs text-muted-foreground font-display tracking-wider">
            {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
