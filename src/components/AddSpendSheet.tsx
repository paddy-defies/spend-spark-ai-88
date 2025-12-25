import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BRAND_CATEGORIES, FREQUENCIES } from '@/lib/constants';
import { SpendRow } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AddSpendSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (row: Omit<SpendRow, 'id'>) => void;
}

export function AddSpendSheet({ isOpen, onClose, onAdd }: AddSpendSheetProps) {
  const [category, setCategory] = useState('');
  const [brandId, setBrandId] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<SpendRow['frequency']>('monthly');
  
  const categories = Object.keys(BRAND_CATEGORIES);
  const brands = category ? BRAND_CATEGORIES[category as keyof typeof BRAND_CATEGORIES] : [];
  const selectedBrand = brands.find(b => b.id === brandId);
  
  const handleSubmit = () => {
    if (!category || !brandId || !amount) return;
    
    onAdd({
      category,
      brandId,
      brandName: selectedBrand?.name || '',
      amount: parseInt(amount) || 0,
      frequency,
    });
    
    // Reset
    setCategory('');
    setBrandId('');
    setAmount('');
    setFrequency('monthly');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bottom-sheet z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Add a Spend
              </h3>
              <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setBrandId(''); }}
                      className={cn(
                        'select-option text-sm py-2',
                        category === cat && 'active'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Brand */}
              {category && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm text-muted-foreground mb-2">Brand/Spend</label>
                  <div className="grid grid-cols-3 gap-2">
                    {brands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => setBrandId(brand.id)}
                        className={cn('brand-tile', brandId === brand.id && 'active')}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: brand.color + '20', color: brand.color }}
                        >
                          {brand.initial}
                        </div>
                        <span className="text-xs text-center leading-tight">{brand.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Amount & Frequency */}
              {brandId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="5,000"
                        className="input-field pl-7"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as SpendRow['frequency'])}
                      className="input-field"
                    >
                      {FREQUENCIES.map(freq => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
              
              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!category || !brandId || !amount}
                className={cn(
                  'btn-primary w-full mt-4',
                  (!category || !brandId || !amount) && 'opacity-50 cursor-not-allowed'
                )}
              >
                Add Spend
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
