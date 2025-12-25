import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        
        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'progress-step',
                isCompleted && 'completed',
                isActive && 'active',
                !isCompleted && !isActive && 'pending'
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'mx-1.5 h-0.5 w-8 rounded-full transition-colors duration-300',
                  step < currentStep ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
