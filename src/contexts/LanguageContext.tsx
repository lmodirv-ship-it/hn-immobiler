import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lang, translations, Translations } from '@/lib/i18n';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Record<string, any>;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('fr');

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('hn_lang', newLang); } catch {}
  }, []);

  // Restore saved language on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('hn_lang') as Lang | null;
      if (saved && translations[saved]) {
        setLangState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      }
    } catch {}
  }, []);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
