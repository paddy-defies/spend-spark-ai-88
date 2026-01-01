import { motion } from 'framer-motion';
import { TrendingUp, Gift } from 'lucide-react';
import { CalculatedTotals } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface SummaryCardProps {
  totals: CalculatedTotals;
}

export function SummaryCard({ totals }: SummaryCardProps) {
  // Recommended balance = totalAnnualSpend * holdingFactor (0.5)
  const recommendedBalance = totals.totalAnnualSpend * 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="premium-card-elevated overflow-hidden"
    >
      {/* Metrics Section */}
      <div className="p-5">
        {/* Estimated Yearly Spends */}
        <div className="metric-block">
          <p className="metric-label">Estimated Yearly Spends</p>
          <p className="metric-value">{formatCurrency(totals.totalAnnualSpend)}</p>
        </div>

        {/* Recommended Spending Balance */}
        <div className="metric-block">
          <p className="metric-label">Recommended Spending Balance on Multipl</p>
          <p className="metric-value">{formatCurrency(recommendedBalance)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ≈ 6 months of your typical spends (illustrative)
          </p>
        </div>

        {/* Better Off Amount */}
        <div className="metric-block">
          <p className="metric-label">You could be better off by</p>
          <p className="metric-value-accent">
            {formatCurrency(totals.totalBetterOff)}
            <span className="text-sm font-normal text-muted-foreground ml-1">/yr</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-5" />

      {/* Breakdown Section */}
      <div className="p-5 pt-4 space-y-1">
        <div className="breakdown-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gift className="w-4 h-4 text-primary" />
            <span>From brand discounts</span>
          </div>
          <span className="font-medium text-foreground">
            {formatCurrency(totals.totalExtraBrandDisc)}
          </span>
        </div>

        <div className="breakdown-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span>From higher yield vs bank</span>
          </div>
          <span className="font-medium text-foreground">
            {formatCurrency(totals.totalExtraYield)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}