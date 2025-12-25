import { motion } from 'framer-motion';
import { TrendingUp, Gift, Percent } from 'lucide-react';
import { CalculatedTotals } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface SummaryCardProps {
  totals: CalculatedTotals;
}

export function SummaryCard({ totals }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="premium-card p-5 space-y-4"
    >
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Est. Yearly Spends
          </p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatCurrency(totals.totalAnnualSpend)}
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            You could be better off by
          </p>
          <p className="text-2xl font-display font-bold gradient-text-gold">
            {formatCurrency(totals.totalBetterOff)}
            <span className="text-sm font-normal text-muted-foreground">/yr</span>
          </p>
        </div>
      </div>
      
      {/* Breakdown */}
      <div className="pt-3 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gift className="w-4 h-4 text-primary" />
            <span>From brand discounts</span>
          </div>
          <span className="font-medium text-foreground">
            {formatCurrency(totals.totalExtraBrandDisc)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
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
