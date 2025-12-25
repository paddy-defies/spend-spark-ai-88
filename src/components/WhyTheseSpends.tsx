import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface WhyTheseSpendsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyTheseSpends({ isOpen, onClose }: WhyTheseSpendsProps) {
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Why these spends?
                </h3>
              </div>
              <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              We used your age, income, and spending style to estimate a typical monthly spend mix. 
              This is based on illustrative patterns from users with similar profiles.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mt-3">
              <span className="text-foreground font-medium">Edit any line</span> to match your reality 
              and see how your potential benefits change instantly.
            </p>
            
            <p className="text-xs text-muted-foreground/70 mt-4 italic">
              Note: This is not a real ML model. Estimates are illustrative and for educational purposes.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
