import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Building2, Loader2 } from 'lucide-react';

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(6).max(72);
const nameSchema = z.string().trim().min(2).max(100);

const Auth = () => {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const nav = useNavigate();
  const loc = useLocation();
  const [busy, setBusy] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPwd, setSignupPwd] = useState('');

  useEffect(() => {
    if (!loading && user) {
      const from = (loc.state as { from?: string })?.from || '/dashboard';
      nav(from, { replace: true });
    }
  }, [user, loading, nav, loc.state]);

  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast({ title: t('Échec Google', 'فشل Google'), description: String(result.error.message ?? result.error), variant: 'destructive' });
    }
  };

  const handleHN = () => {
    const HN = (window as any).HN;
    if (!HN?.auth?.login) {
      toast({ title: t('HN SSO non disponible', 'HN SSO غير متاح'), variant: 'destructive' });
      return;
    }
    HN.auth.login({ returnTo: window.location.origin + (((loc.state as { from?: string })?.from) || '/dashboard') });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPwd);
    } catch {
      toast({ title: t('Vérifiez vos informations', 'تحقق من معلوماتك'), variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPwd });
    setBusy(false);
    if (error) {
      toast({ title: t('Échec de connexion', 'فشل تسجيل الدخول'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('Bienvenue !', 'مرحباً بك !') });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      nameSchema.parse(signupName);
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPwd);
    } catch {
      toast({ title: t('Vérifiez vos informations', 'تحقق من معلوماتك'), variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPwd,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: signupName },
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: t('Échec d\'inscription', 'فشل التسجيل'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('Compte créé !', 'تم إنشاء الحساب !'), description: t('Vérifiez votre email', 'تحقق من بريدك') });
    }
  };

  return (
    <div className="container max-w-md py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Building2 className="h-10 w-10 text-primary" />
          <span className="font-display text-2xl font-bold">
            <span className="text-gradient-cyber">HN</span> <span className="text-gradient-gold">IMMO</span>
          </span>
        </Link>

        <div className="glass-strong rounded-2xl p-6 glow-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full mb-4 glow-border bg-background/40 hover:bg-primary/10 font-display tracking-wider gap-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.5 6.7 2.5 12s4.2 9.6 9.5 9.6c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"/>
            </svg>
            {t('Continuer avec Google', 'المتابعة عبر Google')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleHN}
            disabled={busy}
            className="w-full mb-4 glow-border bg-background/40 hover:bg-accent/10 font-display tracking-wider gap-2"
          >
            <span className="font-bold text-accent">HN</span>
            {t('Continuer avec HN (SSO)', 'المتابعة عبر HN (الدخول الموحّد)')}
          </Button>
          <div className="relative mb-4 text-center">
            <div className="neon-line" />
            <span className="relative -top-2 px-3 bg-card text-xs text-muted-foreground font-display tracking-widest">
              {t('OU', 'أو')}
            </span>
          </div>
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('Connexion', 'تسجيل الدخول')}</TabsTrigger>
              <TabsTrigger value="signup">{t('Inscription', 'إنشاء حساب')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="le">Email</Label>
                  <Input id="le" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="lp">{t('Mot de passe', 'كلمة المرور')}</Label>
                  <Input id="lp" type="password" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} required />
                </div>
                <Button type="submit" disabled={busy} className="w-full glow-primary">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('Se connecter', 'دخول')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="sn">{t('Nom complet', 'الاسم الكامل')}</Label>
                  <Input id="sn" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="se">Email</Label>
                  <Input id="se" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="sp">{t('Mot de passe', 'كلمة المرور')}</Label>
                  <Input id="sp" type="password" minLength={6} value={signupPwd} onChange={(e) => setSignupPwd(e.target.value)} required />
                </div>
                <Button type="submit" disabled={busy} className="w-full glow-primary">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('Créer un compte', 'إنشاء حساب')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;