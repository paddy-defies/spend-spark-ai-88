import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADER_TEXTS = [
  'Mapping your typical spends…',
  'Estimating monthly patterns…',
  'Calculating your benefit…',
];

interface LoaderScreenProps {
  onComplete: () => void;
}

export function LoaderScreen({ onComplete }: LoaderScreenProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % LOADER_TEXTS.length);
    }, 900);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timeout = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xs"
      >
        {/* Animated Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center"
          >
            <span className="text-primary-foreground font-bold text-3xl">M</span>
          </motion.div>
        </div>

        {/* Cycling Text */}
        <div className="h-8 relative overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-foreground font-medium absolute inset-0"
            >
              {LOADER_TEXTS[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'var(--gradient-primary)',
              width: `${progress}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="loader-dot" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Based on illustrative patterns and your inputs
        </p>
      </motion.div>
    </div>
  );
}