import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, HelpCircle } from 'lucide-react';
import { SpendRow, UserInputs } from '@/lib/types';
import { calculateTotals, formatCurrency } from '@/lib/calculations';
import { BenefitCard } from './BenefitCard';
import { SpendTable } from './SpendTable';
import { AddSpendSheet } from './AddSpendSheet';
import { WhyTheseSpends } from './WhyTheseSpends';

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=xyz.multipl.multipl&hl=en_IN";
const APP_STORE_URL = "https://apps.apple.com/in/app/multipl-invest-for-spends/id1518208782";
const APP_STORE_DEEP_LINK = "itms-apps://apps.apple.com/in/app/multipl-invest-for-spends/id1518208782";

const isIOSDevice = (): boolean => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIOS || isIPadOS;
};

const getStoreUrl = (): string => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isAndroid = /Android/i.test(ua);
  const isMacDesktop = /Mac/i.test(platform) && !isIPadOS;
  
  if (isIOS || isIPadOS) {
    return APP_STORE_URL;
  }
  if (isAndroid) {
    return PLAY_STORE_URL;
  }
  if (isMacDesktop) {
    return APP_STORE_URL;
  }
  return PLAY_STORE_URL;
};

const openStoreUrl = (): void => {
  const url = getStoreUrl();
  const isInIframe = window.self !== window.top;
  
  // For iOS devices, try deep link first
  if (isIOSDevice()) {
    // Try deep link - this will silently fail if App Store app isn't available
    const deepLinkTimeout = setTimeout(() => {
      // Deep link didn't work, fallback to web URL
      navigateToUrl(APP_STORE_URL, isInIframe);
    }, 500);
    
    // Attempt deep link
    window.location.href = APP_STORE_DEEP_LINK;
    
    // If page visibility changes, deep link worked - clear timeout
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(deepLinkTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return;
  }
  
  navigateToUrl(url, isInIframe);
};

const navigateToUrl = (url: string, isInIframe: boolean): void => {
  // If in iframe, navigate top-level
  if (isInIframe) {
    try {
      window.top!.location.href = url;
      return;
    } catch {
      // Cross-origin iframe, fallback to other methods
    }
  }
  
  // Try to open in new tab
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  
  // If popup was blocked or returned null, fallback to direct navigation
  if (!newWindow || newWindow.closed) {
    window.location.href = url;
  }
};

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
    <div className="min-h-screen bg-background pb-36">
      {/* App Bar */}
      <div className="p-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-display font-semibold text-foreground">multipl</span>
        </div>

        <button
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </button>
      </div>

      {/* Page Title */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            AI Spend Analysis
          </span>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Your Spend Analysis
        </h1>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {/* 1. Estimated Yearly Spends - Top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-4"
        >
          <p className="text-sm text-muted-foreground mb-1">Estimated Yearly Spends</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatCurrency(totals.totalAnnualSpend)}
          </p>
        </motion.div>

        {/* 2. Spend Mix (editable) */}
        <SpendTable
          rows={rows}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
          onAddRow={() => setShowAddSheet(true)}
        />

        {/* Why these spends link */}
        <button
          onClick={() => setShowWhySheet(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto py-2"
        >
          <HelpCircle className="w-4 h-4" />
          Why these spends?
        </button>

        {/* 3. What you could save with Multipl */}
        <BenefitCard totals={totals} />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={openStoreUrl}
            className="btn-primary w-full text-base"
          >
            Activate my Spending Account
          </motion.button>
          <p className="text-xs text-center text-muted-foreground">
            You can start small and adjust anytime.
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