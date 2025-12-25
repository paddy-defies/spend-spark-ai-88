import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { SelectOption } from './SelectOption';
import { BrandSelector } from './BrandSelector';
import { 
  AGE_RANGES, 
  GENDERS, 
  MARITAL_STATUS, 
  INCOME_RANGES, 
  SPENDING_STYLES 
} from '@/lib/constants';
import { UserInputs } from '@/lib/types';
import { cn } from '@/lib/utils';

interface InputScreenProps {
  onComplete: (inputs: UserInputs) => void;
  initialInputs?: Partial<UserInputs>;
}

const TOTAL_STEPS = 5;

export function InputScreen({ onComplete, initialInputs }: InputScreenProps) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(initialInputs?.age || '');
  const [gender, setGender] = useState(initialInputs?.gender || '');
  const [maritalStatus, setMaritalStatus] = useState(initialInputs?.maritalStatus || '');
  const [income, setIncome] = useState(initialInputs?.income || '');
  const [spendingStyle, setSpendingStyle] = useState(initialInputs?.spendingStyle || '');
  const [favoriteBrands, setFavoriteBrands] = useState<string[]>(initialInputs?.favoriteBrands || []);
  
  const canProceed = () => {
    switch (step) {
      case 1: return !!age;
      case 2: return !!gender && !!maritalStatus;
      case 3: return !!income;
      case 4: return !!spendingStyle;
      case 5: return true; // Brands are optional
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete({
        age,
        gender,
        maritalStatus,
        income,
        spendingStyle,
        favoriteBrands,
      });
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const toggleBrand = (brandId: string) => {
    setFavoriteBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    );
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">AI Spend Analyzer</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Let's understand your spends
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Answer a few questions to get your personalized analysis
        </p>
      </div>
      
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      
      {/* Step Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepContainer key="step1">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                What's your age group?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {AGE_RANGES.map(opt => (
                  <SelectOption
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    isSelected={age === opt.value}
                    onClick={() => setAge(opt.value)}
                  />
                ))}
              </div>
            </StepContainer>
          )}
          
          {step === 2 && (
            <StepContainer key="step2">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                Gender & Marital Status
              </h2>
              
              <p className="text-sm text-muted-foreground mb-3">Gender</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {GENDERS.map(opt => (
                  <SelectOption
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    isSelected={gender === opt.value}
                    onClick={() => setGender(opt.value)}
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">Marital Status</p>
              <div className="grid grid-cols-2 gap-3">
                {MARITAL_STATUS.map(opt => (
                  <SelectOption
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    isSelected={maritalStatus === opt.value}
                    onClick={() => setMaritalStatus(opt.value)}
                  />
                ))}
              </div>
            </StepContainer>
          )}
          
          {step === 3 && (
            <StepContainer key="step3">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                What's your annual income?
              </h2>
              <div className="space-y-3">
                {INCOME_RANGES.map(opt => (
                  <SelectOption
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    isSelected={income === opt.value}
                    onClick={() => setIncome(opt.value)}
                  />
                ))}
              </div>
            </StepContainer>
          )}
          
          {step === 4 && (
            <StepContainer key="step4">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                How do you usually pay?
              </h2>
              <div className="space-y-3">
                {SPENDING_STYLES.map(opt => (
                  <SelectOption
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    isSelected={spendingStyle === opt.value}
                    onClick={() => setSpendingStyle(opt.value)}
                  />
                ))}
              </div>
            </StepContainer>
          )}
          
          {step === 5 && (
            <StepContainer key="step5">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                Your favorite brands
              </h2>
              <BrandSelector
                selectedBrands={favoriteBrands}
                onToggleBrand={toggleBrand}
              />
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <div className="flex gap-3 max-w-md mx-auto">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-14 h-14 rounded-xl border border-border bg-secondary/50 text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'btn-primary flex-1 flex items-center justify-center gap-2',
              !canProceed() && 'opacity-50 cursor-not-allowed'
            )}
          >
            {step === TOTAL_STEPS ? (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze my spends
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      {children}
    </motion.div>
  );
}
