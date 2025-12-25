import { AppState, UserInputs, SpendRow } from './types';

const STORAGE_KEY = 'multipl-spend-analyzer';

const defaultState: AppState = {
  inputs: null,
  spendRows: [],
  hasCompletedAnalysis: false,
};

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state:', e);
  }
}

export function saveInputs(inputs: UserInputs): void {
  const state = loadState();
  state.inputs = inputs;
  saveState(state);
}

export function saveSpendRows(rows: SpendRow[]): void {
  const state = loadState();
  state.spendRows = rows;
  saveState(state);
}

export function markAnalysisComplete(): void {
  const state = loadState();
  state.hasCompletedAnalysis = true;
  saveState(state);
}
