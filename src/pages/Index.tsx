import { useState, useEffect } from 'react';
import { InputScreen } from '@/components/InputScreen';
import { LoaderScreen } from '@/components/LoaderScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { UserInputs, SpendRow, AppState } from '@/lib/types';
import { generateSpendRows } from '@/lib/spendGenerator';
import { loadState, saveState, clearState } from '@/lib/storage';

type Screen = 'input' | 'loading' | 'results';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('input');
  const [inputs, setInputs] = useState<UserInputs | null>(null);
  const [spendRows, setSpendRows] = useState<SpendRow[]>([]);
  
  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved.hasCompletedAnalysis && saved.inputs && saved.spendRows.length > 0) {
      setInputs(saved.inputs);
      setSpendRows(saved.spendRows);
      setScreen('results');
    }
  }, []);
  
  const handleInputComplete = (userInputs: UserInputs) => {
    setInputs(userInputs);
    setScreen('loading');
    
    // Generate spend rows
    const rows = generateSpendRows(userInputs);
    setSpendRows(rows);
    
    // Save to storage
    saveState({
      inputs: userInputs,
      spendRows: rows,
      hasCompletedAnalysis: true,
    });
  };
  
  const handleLoadingComplete = () => {
    setScreen('results');
  };
  
  const handleUpdateRows = (rows: SpendRow[]) => {
    setSpendRows(rows);
    
    // Save updated rows
    if (inputs) {
      saveState({
        inputs,
        spendRows: rows,
        hasCompletedAnalysis: true,
      });
    }
  };
  
  const handleStartOver = () => {
    clearState();
    setInputs(null);
    setSpendRows([]);
    setScreen('input');
  };
  
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {screen === 'input' && (
        <InputScreen 
          onComplete={handleInputComplete}
          initialInputs={inputs || undefined}
        />
      )}
      
      {screen === 'loading' && (
        <LoaderScreen onComplete={handleLoadingComplete} />
      )}
      
      {screen === 'results' && inputs && (
        <ResultsScreen
          rows={spendRows}
          inputs={inputs}
          onUpdateRows={handleUpdateRows}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default Index;
