export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate <= 0) return Math.round((principal / (years * 12)) * 100) / 100;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(payment * 100) / 100;
}

export function calculateTotalCost(principal: number, annualRate: number, years: number): number {
  return Math.round(calculateMonthlyPayment(principal, annualRate, years) * years * 12 * 100) / 100;
}

export function calculateTotalInterest(principal: number, annualRate: number, years: number): number {
  return Math.round((calculateTotalCost(principal, annualRate, years) - principal) * 100) / 100;
}

export function generateAmortizationSchedule(principal: number, annualRate: number, years: number): AmortizationRow[] {
  const r = annualRate > 0 ? annualRate / 100 / 12 : 0;
  const monthly = calculateMonthlyPayment(principal, annualRate, years);
  const n = years * 12;
  let balance = principal;
  const rows: AmortizationRow[] = [];

  for (let i = 0; i < n; i++) {
    const interestPart = balance * r;
    const principalPart = monthly - interestPart;
    balance = Math.max(0, balance - principalPart);
    rows.push({
      month: i + 1,
      payment: Math.round(monthly * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interestPart * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }
  return rows;
}
