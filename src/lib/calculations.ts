import { SpendRow, CalculatedTotals } from './types';
import { DISCOUNT_RATES, RATE_DIFF, HOLDING_FACTOR, FREQUENCIES } from './constants';

export function calculateRowMetrics(row: SpendRow) {
  const freqData = FREQUENCIES.find(f => f.value === row.frequency);
  const periodsPerYear = freqData?.periods || 12;
  const annualSpend = row.amount * periodsPerYear;
  const discountRate = DISCOUNT_RATES[row.brandId] || 0;
  const extraBrandDiscount = annualSpend * discountRate;
  const averageBalance = annualSpend * HOLDING_FACTOR;
  const extraYield = averageBalance * RATE_DIFF;
  
  return {
    annualSpend,
    extraBrandDiscount,
    extraYield,
  };
}

export function calculateTotals(rows: SpendRow[]): CalculatedTotals {
  let totalAnnualSpend = 0;
  let totalExtraBrandDisc = 0;
  let totalExtraYield = 0;
  
  rows.forEach(row => {
    const metrics = calculateRowMetrics(row);
    totalAnnualSpend += metrics.annualSpend;
    totalExtraBrandDisc += metrics.extraBrandDiscount;
    totalExtraYield += metrics.extraYield;
  });
  
  return {
    totalAnnualSpend,
    totalExtraBrandDisc,
    totalExtraYield,
    totalBetterOff: totalExtraBrandDisc + totalExtraYield,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatCurrencyFull(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
