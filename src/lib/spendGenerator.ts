import { UserInputs, SpendRow } from './types';
import { BRAND_CATEGORIES } from './constants';

// ============= Helper Functions =============

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function roundToNearest(num: number, nearest: number): number {
  return Math.round(num / nearest) * nearest;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Deterministic seeded random based on user inputs
function createSeededRandom(inputs: UserInputs): () => number {
  let seed = 0;
  const str = `${inputs.age}-${inputs.gender}-${inputs.maritalStatus}-${inputs.income}-${inputs.spendingStyle}`;
  for (let i = 0; i < str.length; i++) {
    seed = ((seed << 5) - seed) + str.charCodeAt(i);
    seed = seed & seed;
  }
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };
}

// ============= Constants for New Logic =============

const INCOME_MONTHLY_MAP: Record<string, number> = {
  '<6L': 35000,
  '6-10L': 65000,
  '10-18L': 110000,
  '18-30L': 200000,
  '>30L': 300000,
};

const SPEND_RATIO_BY_INCOME: Record<string, number> = {
  '<6L': 0.70,
  '6-10L': 0.62,
  '10-18L': 0.55,
  '18-30L': 0.48,
  '>30L': 0.42,
};

// South cities prefer Swiggy, North cities prefer Zomato
const SOUTH_CITIES = ['bangalore', 'bengaluru', 'chennai', 'hyderabad', 'kochi', 'coimbatore'];
const NORTH_CITIES = ['delhi', 'gurgaon', 'gurugram', 'noida', 'jaipur', 'chandigarh', 'lucknow'];

// ============= Main Generator =============

export function generateSpendRows(inputs: UserInputs): SpendRow[] {
  const { age, gender, maritalStatus, income, spendingStyle, favoriteBrands } = inputs;
  const seededRandom = createSeededRandom(inputs);
  
  // Step 1: Calculate monthly budget with new ratios
  const incomeMonthly = INCOME_MONTHLY_MAP[income] || 65000;
  
  let spendRatio = SPEND_RATIO_BY_INCOME[income] || 0.55;
  
  // Adjustments
  if (maritalStatus === 'married') spendRatio += 0.03;
  if (age === '18-23') spendRatio -= 0.03;
  if (age === '35+') spendRatio += 0.02;
  
  spendRatio = clamp(spendRatio, 0.38, 0.72);
  
  const spendingBudgetMonthly = incomeMonthly * spendRatio;
  
  // Step 2: Determine if rent should be included
  // Exclude rent if income >30L OR married
  const includeRent = income !== '>30L' && maritalStatus !== 'married';
  
  // Step 3: Calculate category allocations (as % of monthly budget)
  let allocations = calculateAllocations(age, maritalStatus, includeRent, seededRandom);
  
  const rows: SpendRow[] = [];
  
  // Step 4: Generate rows for each category
  
  // === FOOD DELIVERY (pick one: Swiggy or Zomato) ===
  const foodBudgetMonthly = spendingBudgetMonthly * allocations.food;
  const foodBrand = pickFoodBrand(favoriteBrands, seededRandom);
  
  rows.push({
    id: generateId(),
    category: 'Q-Com / Food Delivery',
    brandId: foodBrand.id,
    brandName: foodBrand.name,
    amount: Math.max(500, roundToNearest(foodBudgetMonthly, 100)),
    frequency: 'monthly',
  });
  
  // === GROCERIES / Q-COM (pick one: Zepto or Amazon Fresh) ===
  const groceryBudgetMonthly = spendingBudgetMonthly * allocations.groceries;
  const groceryBrand = pickGroceryBrand(favoriteBrands, seededRandom);
  
  rows.push({
    id: generateId(),
    category: 'Q-Com / Food Delivery',
    brandId: groceryBrand.id,
    brandName: groceryBrand.name,
    amount: Math.max(500, roundToNearest(groceryBudgetMonthly, 100)),
    frequency: 'monthly',
  });
  
  // === SHOPPING (Amazon + optionally one more) ===
  const shoppingBudgetMonthly = spendingBudgetMonthly * allocations.shopping;
  const shoppingFrequency = determineShoppingFrequency(income, seededRandom);
  const shoppingBrands = pickShoppingBrands(favoriteBrands, gender, seededRandom);
  
  // Split shopping budget between selected brands
  const shoppingPerBrand = shoppingBudgetMonthly / shoppingBrands.length;
  
  shoppingBrands.forEach(brand => {
    const annualAmount = shoppingPerBrand * 12;
    const periodsPerYear = shoppingFrequency === 'monthly' ? 12 : 4;
    let amount = annualAmount / periodsPerYear;
    
    // Round based on frequency
    if (shoppingFrequency === 'monthly') {
      amount = Math.max(500, roundToNearest(amount, 100));
    } else {
      amount = Math.max(2000, roundToNearest(amount, 500));
    }
    
    rows.push({
      id: generateId(),
      category: 'Shopping',
      brandId: brand.id,
      brandName: brand.name,
      amount,
      frequency: shoppingFrequency,
    });
  });
  
  // === COMMUTE (Uber - always monthly) ===
  const commuteBudgetMonthly = spendingBudgetMonthly * allocations.commute;
  const uberBrand = BRAND_CATEGORIES['Travel'].find(b => b.id === 'uber')!;
  
  rows.push({
    id: generateId(),
    category: 'Travel',
    brandId: uberBrand.id,
    brandName: uberBrand.name,
    amount: Math.max(500, roundToNearest(commuteBudgetMonthly, 100)),
    frequency: 'monthly',
  });
  
  // === TRAVEL (Flights - yearly or quarterly for high income) ===
  const travelBudgetMonthly = spendingBudgetMonthly * allocations.travel;
  const travelFrequency = determineTravelFrequency(income, seededRandom);
  const annualTravelBudget = travelBudgetMonthly * 12;
  const periodsPerYear = travelFrequency === 'quarterly' ? 4 : 1;
  let travelAmount = annualTravelBudget / periodsPerYear;
  
  // Round based on frequency
  if (travelFrequency === 'yearly') {
    travelAmount = Math.max(5000, roundToNearest(travelAmount, 1000));
  } else {
    travelAmount = Math.max(2000, roundToNearest(travelAmount, 500));
  }
  
  const flightsBrand = BRAND_CATEGORIES['Travel'].find(b => b.id === 'mmt-flights')!;
  rows.push({
    id: generateId(),
    category: 'Travel',
    brandId: flightsBrand.id,
    brandName: flightsBrand.name,
    amount: travelAmount,
    frequency: travelFrequency,
  });
  
  // === RENT (only if included) ===
  if (includeRent) {
    // Single: 15-28% of spendingBudgetMonthly
    const rentRatio = 0.15 + (seededRandom() * 0.13); // 15% to 28%
    const rentAmount = roundToNearest(spendingBudgetMonthly * rentRatio, 500);
    
    const rentBrand = BRAND_CATEGORIES['Non-Brand Spends'].find(b => b.id === 'rent')!;
    rows.push({
      id: generateId(),
      category: 'Non-Brand Spends',
      brandId: rentBrand.id,
      brandName: rentBrand.name,
      amount: Math.max(5000, rentAmount),
      frequency: 'monthly',
    });
  }
  
  // NOTE: CC Bill is NOT auto-generated (to avoid double counting)
  // It's available as a manual add option only
  
  return rows;
}

// ============= Category Allocation Calculator =============

function calculateAllocations(
  age: string, 
  maritalStatus: string, 
  includeRent: boolean,
  seededRandom: () => number
): {
  food: number;
  groceries: number;
  shopping: number;
  commute: number;
  travel: number;
  rent: number;
} {
  // Base allocations (mid-range values)
  let food = 0.10;      // 8-12%
  let groceries = 0.13; // 10-16%
  let shopping = 0.14;  // 10-18%
  let commute = 0.06;   // 4-8%
  let travel = 0.05;    // 3-8%
  let rent = includeRent ? 0.22 : 0; // ~22% when included
  
  // Add some randomness within ranges
  food += (seededRandom() - 0.5) * 0.04;      // ±2%
  groceries += (seededRandom() - 0.5) * 0.06; // ±3%
  shopping += (seededRandom() - 0.5) * 0.08;  // ±4%
  commute += (seededRandom() - 0.5) * 0.04;   // ±2%
  travel += (seededRandom() - 0.5) * 0.05;    // ±2.5%
  
  // Age adjustments
  if (age === '18-23') {
    food += 0.03;      // More food delivery
    travel -= 0.02;    // Less travel
    groceries -= 0.02; // Less groceries
  } else if (age === '35+') {
    groceries += 0.03; // More groceries
    food -= 0.02;      // Less food delivery
  }
  
  // Marital status adjustments (even though rent excluded for married)
  if (maritalStatus === 'married') {
    groceries += 0.03;  // More groceries
    shopping -= 0.02;   // Less shopping
  }
  
  // Clamp to reasonable ranges
  food = clamp(food, 0.08, 0.12);
  groceries = clamp(groceries, 0.10, 0.16);
  shopping = clamp(shopping, 0.10, 0.18);
  commute = clamp(commute, 0.04, 0.08);
  travel = clamp(travel, 0.03, 0.08);
  
  // If rent excluded, reallocate that budget to shopping/travel
  if (!includeRent) {
    const reallocate = 0.12; // ~12% to redistribute
    shopping += reallocate * 0.6;
    travel += reallocate * 0.4;
  }
  
  return { food, groceries, shopping, commute, travel, rent };
}

// ============= Brand Selection Helpers =============

function pickFoodBrand(
  favorites: string[], 
  seededRandom: () => number
): { id: string; name: string } {
  const foodBrands = BRAND_CATEGORIES['Q-Com / Food Delivery'];
  const swiggy = foodBrands.find(b => b.id === 'swiggy')!;
  const zomato = foodBrands.find(b => b.id === 'zomato')!;
  
  // If user selected both, include both (handled by caller)
  // If user selected one, use that
  const hasFavoriteSwiggy = favorites.includes('swiggy');
  const hasFavoriteZomato = favorites.includes('zomato');
  
  if (hasFavoriteSwiggy && !hasFavoriteZomato) return swiggy;
  if (hasFavoriteZomato && !hasFavoriteSwiggy) return zomato;
  
  // If both or neither selected, use seeded random (deterministic per persona)
  // This simulates "South vs North" without IP lookup
  return seededRandom() < 0.5 ? swiggy : zomato;
}

function pickGroceryBrand(
  favorites: string[], 
  seededRandom: () => number
): { id: string; name: string } {
  const foodBrands = BRAND_CATEGORIES['Q-Com / Food Delivery'];
  const zepto = foodBrands.find(b => b.id === 'zepto')!;
  const amazonFresh = foodBrands.find(b => b.id === 'amazon-fresh')!;
  
  const hasFavoriteZepto = favorites.includes('zepto');
  const hasFavoriteAmazonFresh = favorites.includes('amazon-fresh');
  
  if (hasFavoriteZepto && !hasFavoriteAmazonFresh) return zepto;
  if (hasFavoriteAmazonFresh && !hasFavoriteZepto) return amazonFresh;
  
  // Default: pick based on seed
  return seededRandom() < 0.6 ? zepto : amazonFresh;
}

function pickShoppingBrands(
  favorites: string[], 
  gender: string,
  seededRandom: () => number
): Array<{ id: string; name: string }> {
  const shoppingBrands = BRAND_CATEGORIES['Shopping'];
  const amazon = shoppingBrands.find(b => b.id === 'amazon')!;
  
  // Check for favorite shopping brands
  const favoriteShoppingBrands = shoppingBrands.filter(b => favorites.includes(b.id));
  
  if (favoriteShoppingBrands.length > 0) {
    // Return favorites, capped at 2
    return favoriteShoppingBrands.slice(0, 2);
  }
  
  // Default: Amazon + optionally one more based on gender/seed
  const result: Array<{ id: string; name: string }> = [amazon];
  
  // 60% chance to add a second brand
  if (seededRandom() < 0.6) {
    // Gender-based secondary brand selection
    if (gender === 'F') {
      // Female: higher chance of Nykaa or Myntra
      const femaleOptions = ['nykaa', 'myntra', 'ajio'];
      const pick = femaleOptions[Math.floor(seededRandom() * femaleOptions.length)];
      const brand = shoppingBrands.find(b => b.id === pick);
      if (brand) result.push(brand);
    } else {
      // Male: Flipkart or Decathlon
      const maleOptions = ['flipkart', 'decathlon', 'ajio'];
      const pick = maleOptions[Math.floor(seededRandom() * maleOptions.length)];
      const brand = shoppingBrands.find(b => b.id === pick);
      if (brand) result.push(brand);
    }
  }
  
  return result;
}

// ============= Frequency Determination =============

function determineShoppingFrequency(
  income: string, 
  seededRandom: () => number
): 'monthly' | 'quarterly' {
  // Frequency rules by income
  const monthlyProbability: Record<string, number> = {
    '<6L': 0.20,     // 80% quarterly
    '6-10L': 0.35,   // 65% quarterly
    '10-18L': 0.35,  // 65% quarterly
    '18-30L': 0.50,  // 50/50
    '>30L': 0.50,    // 50/50
  };
  
  const prob = monthlyProbability[income] || 0.35;
  return seededRandom() < prob ? 'monthly' : 'quarterly';
}

function determineTravelFrequency(
  income: string, 
  seededRandom: () => number
): 'quarterly' | 'yearly' {
  // Quarterly only for higher income (18-30L or >30L)
  if (income === '18-30L' || income === '>30L') {
    // 40% chance of quarterly for high income
    return seededRandom() < 0.4 ? 'quarterly' : 'yearly';
  }
  
  // Default: yearly
  return 'yearly';
}
