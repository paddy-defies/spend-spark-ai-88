import { motion } from 'framer-motion';
import { TrendingUp, Gift, Info, Wallet, Sparkles } from 'lucide-react';
import { CalculatedTotals } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BenefitCardProps {
  totals: CalculatedTotals;
}

export function BenefitCard({ totals }: BenefitCardProps) {
  const recommendedBalance = totals.totalAnnualSpend * 0.5;
  const monthlySavings = Math.round(totals.totalBetterOff / 12);
  const monthlySpends = Math.round(totals.totalAnnualSpend / 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      {/* Main Savings Card */}
      <div className="premium-card-elevated overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">
            What you could save with Multipl
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            If you move your spending money into Multipl's Higher-Yield Spending Account.
          </p>
        </div>

        {/* Main Value */}
        <div className="px-5 pb-4">
          <div className="bg-primary/10 rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Estimated savings per year
            </p>
            <p className="text-3xl font-display font-bold text-primary">
              {formatCurrency(totals.totalBetterOff)}
              <span className="text-base font-normal text-muted-foreground ml-1">/year</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ≈ <span className="font-medium text-foreground">{formatCurrency(monthlySavings)}/month</span>
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="px-5 pb-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Where this comes from
          </p>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="w-4 h-4 text-primary" />
              <span>Brand offers on eligible spends</span>
            </div>
            <span className="font-medium text-foreground text-sm">
              {formatCurrency(totals.totalExtraBrandDisc)}/yr
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Higher yield vs a 2.5% bank account</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] text-xs">
                    Illustrative: compares liquid mutual fund returns (~7% p.a.) vs 2.5% bank interest on an estimated average balance.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium text-foreground text-sm">
              {formatCurrency(totals.totalExtraYield)}/yr
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-5" />

        {/* Recommended Spending Balance Strip */}
        <div className="p-5 bg-secondary/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Recommended spending balance on Multipl
              </p>
              <p className="text-2xl font-display font-bold text-foreground mt-1">
                {formatCurrency(recommendedBalance)}
              </p>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <p>Your spending money flows in and out through the year.</p>
                <p>We estimate your average balance as ~6 months of your yearly spends.</p>
                <p className="text-muted-foreground/70">
                  Approx monthly spends: {formatCurrency(monthlySpends)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How Multipl Works Strip */}
      <div className="premium-card p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          How Multipl works
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Higher-yield spending balance</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your spending balance is invested in liquid mutual funds (illustrative ~7% p.a.).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Discounts when you spend</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                On eligible brands, you also get instant offers/discounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground px-4">
        Illustrative estimates. Returns are market-linked and not guaranteed.
        Actual yields/discounts may vary.
      </p>
    </motion.div>
  );
}
