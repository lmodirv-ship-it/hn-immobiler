import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-7 w-7 text-accent" />
              <span className="font-display text-xl font-bold">
                HN <span className="text-accent">Immobilier</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">{t.footer.quickLinks}</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">{t.nav.home}</Link>
              <Link to="/properties" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">{t.nav.properties}</Link>
              <Link to="/about" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">{t.nav.about}</Link>
              <Link to="/contact" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">{t.nav.contact}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">{t.footer.contactInfo}</h3>
            <div className="space-y-3 text-sm text-primary-foreground/70">
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

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
