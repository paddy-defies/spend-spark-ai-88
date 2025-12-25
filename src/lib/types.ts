export interface UserInputs {
  age: string;
  gender: string;
  maritalStatus: string;
  income: string;
  spendingStyle: string;
  favoriteBrands: string[];
}

export interface SpendRow {
  id: string;
  category: string;
  brandId: string;
  brandName: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface CalculatedTotals {
  totalAnnualSpend: number;
  totalExtraBrandDisc: number;
  totalExtraYield: number;
  totalBetterOff: number;
}

export interface AppState {
  inputs: UserInputs | null;
  spendRows: SpendRow[];
  hasCompletedAnalysis: boolean;
}
