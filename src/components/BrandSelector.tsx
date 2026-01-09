import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND_CATEGORIES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandSelectorProps {
  selectedBrands: string[];
  onToggleBrand: (brandId: string) => void;
}

export function BrandSelector({ selectedBrands, onToggleBrand }: BrandSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Q-Com / Food Delivery');
  
  const categories = Object.entries(BRAND_CATEGORIES).filter(
    ([cat]) => cat !== 'Non-Brand Spends'
  );
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-3">
        Optional: Select your favorite brands for a more personalized analysis
      </p>
      
      {categories.map(([category, brands]) => {
        const isExpanded = expandedCategory === category;
        const selectedInCategory = brands.filter(b => selectedBrands.includes(b.id)).length;
        
        return (
          <div key={category} className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{category}</span>
                {selectedInCategory > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {selectedInCategory} selected
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-4 gap-3">
                    {brands.map(brand => {
                      const isSelected = selectedBrands.includes(brand.id);
                      return (
                        <motion.button
                          key={brand.id}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onToggleBrand(brand.id)}
                          className={cn('brand-tile', isSelected && 'active')}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden"
                            style={{ backgroundColor: brand.color + '20', color: brand.color }}
                          >
                            {brand.logo ? (
                              <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              brand.initial
                            )}
                          </div>
                          <span className="text-xs text-center leading-tight line-clamp-2">
                            {brand.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
