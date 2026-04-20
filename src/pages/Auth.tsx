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