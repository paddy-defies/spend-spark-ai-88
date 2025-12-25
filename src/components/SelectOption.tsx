import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SelectOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SelectOption({ value, label, isSelected, onClick }: SelectOptionProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn('select-option', isSelected && 'active')}
    >
      {label}
    </motion.button>
  );
}
