import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, ChevronDown } from 'lucide-react';
import { SpendRow } from '@/lib/types';
import { BRAND_CATEGORIES, FREQUENCIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SpendTableProps {
  rows: SpendRow[];
  onUpdateRow: (id: string, updates: Partial<SpendRow>) => void;
  onDeleteRow: (id: string) => void;
  onAddRow: () => void;
}

export function SpendTable({ rows, onUpdateRow, onDeleteRow, onAddRow }: SpendTableProps) {
  const categories = ['Q-Com / Food Delivery', 'Shopping', 'Travel', 'Non-Brand Spends'];

  const groupedRows = categories.map(category => ({
    category,
    rows: rows.filter(r => r.category === category),
  })).filter(g => g.rows.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="premium-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-card">
        <h3 className="font-display font-semibold text-foreground">Your Spend Mix</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add spend
        </button>
      </div>

      {/* Rows grouped by category */}
      <div>
        {groupedRows.map(({ category, rows: categoryRows }) => (
          <div key={category}>
            {/* Category Header */}
            <div className="category-header">{category}</div>

            {/* Spend Rows */}
            <div className="divide-y divide-border/50">
              {categoryRows.map((row) => (
                <SpendRowItem
                  key={row.id}
                  row={row}
                  onUpdate={(updates) => onUpdateRow(row.id, updates)}
                  onDelete={() => onDeleteRow(row.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface SpendRowItemProps {
  row: SpendRow;
  onUpdate: (updates: Partial<SpendRow>) => void;
  onDelete: () => void;
}

function SpendRowItem({ row, onUpdate, onDelete }: SpendRowItemProps) {
  const [showFreqDropdown, setShowFreqDropdown] = useState(false);

  const brandInfo = Object.values(BRAND_CATEGORIES)
    .flat()
    .find(b => b.id === row.brandId);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
    onUpdate({ amount: value });
  };

  const frequencyLabel = FREQUENCIES.find(f => f.value === row.frequency)?.label || row.frequency;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="px-4 py-3 bg-card"
    >
      {/* Line 1: Brand name + Amount */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              backgroundColor: (brandInfo?.color || '#6B7280') + '20',
              color: brandInfo?.color || '#6B7280'
            }}
          >
            {brandInfo?.initial || row.brandName[0]}
          </div>
          <span className="font-medium text-foreground">{row.brandName}</span>
        </div>

        <input
          type="text"
          value={`₹${row.amount.toLocaleString('en-IN')}`}
          onChange={handleAmountChange}
          className="w-24 bg-transparent text-right font-semibold text-foreground focus:outline-none focus:text-primary transition-colors"
        />
      </div>

      {/* Line 2: Frequency dropdown + Trash */}
      <div className="flex items-center justify-between pl-10">
        <div className="relative">
          <button
            onClick={() => setShowFreqDropdown(!showFreqDropdown)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{frequencyLabel}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <AnimatePresence>
            {showFreqDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowFreqDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden min-w-[120px]"
                >
                  {FREQUENCIES.map(freq => (
                    <button
                      key={freq.value}
                      onClick={() => {
                        onUpdate({ frequency: freq.value as SpendRow['frequency'] });
                        setShowFreqDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors',
                        row.frequency === freq.value && 'text-primary bg-primary/10'
                      )}
                    >
                      {freq.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onDelete}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}