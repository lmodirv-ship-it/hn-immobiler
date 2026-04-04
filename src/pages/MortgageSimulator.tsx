import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, TrendingUp, Banknote, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  calculateMonthlyPayment,
  calculateTotalCost,
  calculateTotalInterest,
  generateAmortizationSchedule,
} from '@/lib/mortgage';

const MortgageSimulator = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(20);
  const [showSchedule, setShowSchedule] = useState(false);

  const monthly = useMemo(() => calculateMonthlyPayment(principal, rate, years), [principal, rate, years]);
  const totalCost = useMemo(() => calculateTotalCost(principal, rate, years), [principal, rate, years]);
  const totalInterest = useMemo(() => calculateTotalInterest(principal, rate, years), [principal, rate, years]);
  const schedule = useMemo(
    () => (showSchedule ? generateAmortizationSchedule(principal, rate, years) : []),
    [principal, rate, years, showSchedule]
  );

  const fmt = (n: number) => new Intl.NumberFormat(isFr ? 'fr-MA' : 'ar-MA', { maximumFractionDigits: 2 }).format(n);
  const currency = isFr ? 'DH' : 'درهم';

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Calculator className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-gradient-cyber">{isFr ? 'Simulateur de Crédit' : 'محاكي القرض'}</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          {isFr ? 'Calculez vos mensualités et le coût total' : 'احسب أقساطك الشهرية والتكلفة الإجمالية'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass rounded-2xl p-6 glow-border space-y-6">
            <h3 className="font-display text-xs tracking-widest uppercase text-primary">{isFr ? 'Paramètres' : 'المعايير'}</h3>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isFr ? 'Montant' : 'المبلغ'} ({currency})
              </label>
              <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} min={100000} step={50000} className="bg-secondary/50 border-border/50" />
              <Slider value={[principal]} onValueChange={([v]) => setPrincipal(v)} min={100000} max={10000000} step={50000} className="mt-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>100K</span><span>10M</span></div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isFr ? 'Taux annuel' : 'النسبة السنوية'} (%)
              </label>
              <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} min={0} max={15} step={0.1} className="bg-secondary/50 border-border/50" />
              <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={0} max={15} step={0.1} className="mt-3" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isFr ? 'Durée' : 'المدة'} ({isFr ? 'ans' : 'سنة'})
              </label>
              <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={30} className="bg-secondary/50 border-border/50" />
              <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={30} step={1} className="mt-3" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Banknote, label: isFr ? 'Mensualité' : 'القسط الشهري', value: `${fmt(monthly)} ${currency}`, gradient: 'text-gradient-gold' },
              { icon: TrendingUp, label: isFr ? 'Coût total' : 'التكلفة الإجمالية', value: `${fmt(totalCost)} ${currency}`, gradient: 'text-gradient-cyber' },
              { icon: Clock, label: isFr ? 'Total intérêts' : 'إجمالي الفوائد', value: `${fmt(totalInterest)} ${currency}`, gradient: 'text-destructive' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-5 text-center glow-border animate-glow-pulse">
                <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-xs text-muted-foreground mb-1 font-display tracking-wider uppercase">{item.label}</div>
                <div className={`font-display text-lg font-bold ${item.gradient}`}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Bar */}
          <div className="glass rounded-xl p-5 glow-border">
            <div className="text-xs text-muted-foreground font-display tracking-wider uppercase mb-3">{isFr ? 'Répartition' : 'التوزيع'}</div>
            <div className="h-4 rounded-full overflow-hidden flex bg-secondary/50">
              <div className="bg-primary transition-all duration-500 rounded-l-full" style={{ width: `${(principal / totalCost) * 100}%` }} />
              <div className="bg-destructive transition-all duration-500 rounded-r-full" style={{ width: `${(totalInterest / totalCost) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded-sm" />{isFr ? 'Capital' : 'رأس المال'}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-destructive rounded-sm" />{isFr ? 'Intérêts' : 'الفوائد'}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full glow-border hover:glow-primary font-display text-xs tracking-wider" onClick={() => setShowSchedule(!showSchedule)}>
            {showSchedule ? (isFr ? 'Masquer le tableau' : 'إخفاء الجدول') : (isFr ? 'Tableau d\'amortissement' : 'جدول الاستهلاك')}
          </Button>

          {showSchedule && schedule.length > 0 && (
            <div className="glass rounded-xl glow-border overflow-hidden">
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>{isFr ? 'Mois' : 'الشهر'}</TableHead>
                      <TableHead>{isFr ? 'Mensualité' : 'القسط'}</TableHead>
                      <TableHead>{isFr ? 'Capital' : 'رأس المال'}</TableHead>
                      <TableHead>{isFr ? 'Intérêts' : 'الفوائد'}</TableHead>
                      <TableHead>{isFr ? 'Reste' : 'المتبقي'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1).map((row) => (
                      <TableRow key={row.month} className="border-border/50">
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{fmt(row.payment)}</TableCell>
                        <TableCell>{fmt(row.principal)}</TableCell>
                        <TableCell>{fmt(row.interest)}</TableCell>
                        <TableCell>{fmt(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MortgageSimulator;
