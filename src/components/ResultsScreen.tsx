import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, HelpCircle } from 'lucide-react';
import { SpendRow, UserInputs } from '@/lib/types';
import { calculateTotals } from '@/lib/calculations';
import { SummaryCard } from './SummaryCard';
import { SpendTable } from './SpendTable';
import { AddSpendSheet } from './AddSpendSheet';
import { WhyTheseSpends } from './WhyTheseSpends';

interface ResultsScreenProps {
  rows: SpendRow[];
  inputs: UserInputs;
  onUpdateRows: (rows: SpendRow[]) => void;
  onStartOver: () => void;
}

export function ResultsScreen({ rows, inputs, onUpdateRows, onStartOver }: ResultsScreenProps) {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showWhySheet, setShowWhySheet] = useState(false);
  
  const totals = useMemo(() => calculateTotals(rows), [rows]);
  
  const handleUpdateRow = (id: string, updates: Partial<SpendRow>) => {
    const updated = rows.map(row => 
      row.id === id ? { ...row, ...updates } : row
    );
    onUpdateRows(updated);
  };
  
  const handleDeleteRow = (id: string) => {
    const updated = rows.filter(row => row.id !== id);
    onUpdateRows(updated);
  };
  
  const handleAddRow = (newRow: Omit<SpendRow, 'id'>) => {
    const row: SpendRow = {
      ...newRow,
      id: Math.random().toString(36).substring(2, 9),
    };
    onUpdateRows([...rows, row]);
  };
  
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="p-4 pt-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI Spend Analysis</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Your Spend Analysis
          </h1>
        </div>
        
        <button
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </button>
      </div>
      
      {/* Content */}
      <div className="px-4 space-y-4">
        <SummaryCard totals={totals} />
        
        <SpendTable
          rows={rows}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onAddRow={() => setShowAddSheet(true)}
        />
        
        {/* Why these spends link */}
        <button
          onClick={() => setShowWhySheet(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <HelpCircle className="w-4 h-4" />
          Why these spends?
        </button>
      </div>
      
      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <div className="max-w-md mx-auto space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full glow-primary"
          >
            Activate my Spending Account
          </motion.button>
          
          <p className="text-xs text-center text-muted-foreground/70 px-4">
            Illustrative estimates. Returns are market-linked and not guaranteed. 
            Actual yields/discounts may vary.
          </p>
        </div>
      </div>
      
      {/* Sheets */}
      <AddSpendSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={handleAddRow}
      />
      
      <WhyTheseSpends
        isOpen={showWhySheet}
        onClose={() => setShowWhySheet(false)}
      />
    </div>
  );
}
