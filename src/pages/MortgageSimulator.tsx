import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, TrendingUp, Banknote, Clock } from 'lucide-react';
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
      <div className="text-center mb-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-accent" />
          {isFr ? 'Simulateur de Crédit Immobilier' : 'محاكي القرض العقاري'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isFr ? 'Calculez vos mensualités et le coût total de votre crédit' : 'احسب أقساطك الشهرية والتكلفة الإجمالية لقرضك'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Inputs */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{isFr ? 'Paramètres du crédit' : 'معايير القرض'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isFr ? 'Montant du bien' : 'مبلغ العقار'} ({currency})
              </label>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min={100000}
                step={50000}
              />
              <Slider
                value={[principal]}
                onValueChange={([v]) => setPrincipal(v)}
                min={100000}
                max={10000000}
                step={50000}
                className="mt-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100K</span>
                <span>10M</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isFr ? 'Taux annuel' : 'النسبة السنوية'} (%)
              </label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                min={0}
                max={15}
                step={0.1}
              />
              <Slider
                value={[rate]}
                onValueChange={([v]) => setRate(v)}
                min={0}
                max={15}
                step={0.1}
                className="mt-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isFr ? 'Durée' : 'المدة'} ({isFr ? 'ans' : 'سنة'})
              </label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min={1}
                max={30}
              />
              <Slider
                value={[years]}
                onValueChange={([v]) => setYears(v)}
                min={1}
                max={30}
                step={1}
                className="mt-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Banknote,
                label: isFr ? 'Mensualité' : 'القسط الشهري',
                value: `${fmt(monthly)} ${currency}`,
                color: 'text-accent',
              },
              {
                icon: TrendingUp,
                label: isFr ? 'Coût total' : 'التكلفة الإجمالية',
                value: `${fmt(totalCost)} ${currency}`,
                color: 'text-primary',
              },
              {
                icon: Clock,
                label: isFr ? 'Total intérêts' : 'إجمالي الفوائد',
                value: `${fmt(totalInterest)} ${currency}`,
                color: 'text-destructive',
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-5 text-center">
                  <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                  <div className={`font-display text-xl font-bold ${item.color}`}>{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual breakdown */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm font-medium">{isFr ? 'Répartition' : 'التوزيع'}</span>
              </div>
              <div className="h-6 rounded-full overflow-hidden flex bg-muted">
                <div
                  className="bg-primary transition-all duration-500"
                  style={{ width: `${(principal / totalCost) * 100}%` }}
                />
                <div
                  className="bg-destructive transition-all duration-500"
                  style={{ width: `${(totalInterest / totalCost) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-primary rounded-sm inline-block" />
                  {isFr ? 'Capital' : 'رأس المال'}: {fmt(principal)} {currency}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-destructive rounded-sm inline-block" />
                  {isFr ? 'Intérêts' : 'الفوائد'}: {fmt(totalInterest)} {currency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Amortization schedule */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSchedule(!showSchedule)}
          >
            {showSchedule
              ? (isFr ? 'Masquer le tableau d\'amortissement' : 'إخفاء جدول الاستهلاك')
              : (isFr ? 'Voir le tableau d\'amortissement' : 'عرض جدول الاستهلاك')
            }
          </Button>

          {showSchedule && schedule.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isFr ? 'Mois' : 'الشهر'}</TableHead>
                        <TableHead>{isFr ? 'Mensualité' : 'القسط'}</TableHead>
                        <TableHead>{isFr ? 'Capital' : 'رأس المال'}</TableHead>
                        <TableHead>{isFr ? 'Intérêts' : 'الفوائد'}</TableHead>
                        <TableHead>{isFr ? 'Reste' : 'المتبقي'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1).map((row) => (
                        <TableRow key={row.month}>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MortgageSimulator;
