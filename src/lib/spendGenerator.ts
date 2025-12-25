import { UserInputs, SpendRow } from './types';
import { INCOME_MONTHLY, BRAND_CATEGORIES, DISCOUNT_RATES } from './constants';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function roundToHundred(num: number): number {
  return Math.round(num / 100) * 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function generateSpendRows(inputs: UserInputs): SpendRow[] {
  const { age, maritalStatus, income, spendingStyle, favoriteBrands } = inputs;
  
  // Step 1: Calculate monthly budget
  const incomeMonthly = INCOME_MONTHLY[income] || 65000;
  
  let spendRatio = 0.55;
  if (maritalStatus === 'married') spendRatio += 0.05;
  if (age === '18-23') spendRatio -= 0.05;
  if (age === '35+') spendRatio += 0.03;
  spendRatio = clamp(spendRatio, 0.45, 0.65);
  
  const spendingBudgetMonthly = incomeMonthly * spendRatio;
  
  // Step 2: Category weights
  let weights = {
    food: 0.18,
    shopping: 0.16,
    travel: 0.10,
    nonBrand: 0.56,
  };
  
  // Age adjustments
  if (age === '18-23') {
    weights.food += 0.05;
    weights.nonBrand -= 0.05;
  } else if (age === '24-30') {
    weights.shopping += 0.03;
    weights.nonBrand -= 0.03;
  } else if (age === '31-35') {
    weights.nonBrand += 0.03;
    weights.food -= 0.03;
  }
  
  // Marital status adjustments
  if (maritalStatus === 'married') {
    weights.nonBrand += 0.08;
    weights.food -= 0.04;
    weights.shopping -= 0.04;
  }
  
  // Spending style adjustments
  if (spendingStyle === 'card') {
    weights.shopping += 0.04;
    weights.travel += 0.02;
    weights.nonBrand -= 0.06;
  } else if (spendingStyle === 'upi') {
    weights.food += 0.04;
    weights.shopping -= 0.04;
  }
  
  // Normalize weights
  const totalWeight = weights.food + weights.shopping + weights.travel + weights.nonBrand;
  weights.food /= totalWeight;
  weights.shopping /= totalWeight;
  weights.travel /= totalWeight;
  weights.nonBrand /= totalWeight;
  
  const rows: SpendRow[] = [];
  
  // Step 3: Generate rows per category
  const foodBrands = BRAND_CATEGORIES['Q-Com / Food Delivery'];
  const shoppingBrands = BRAND_CATEGORIES['Shopping'];
  const travelBrands = BRAND_CATEGORIES['Travel'];
  const nonBrandOptions = BRAND_CATEGORIES['Non-Brand Spends'];
  
  // Helper to check if brand is in favorites
  const isFavorite = (brandId: string) => favoriteBrands.includes(brandId);
  
  // Food category (2 rows)
  const foodBudget = spendingBudgetMonthly * weights.food;
  const favoriteFoodBrands = foodBrands.filter(b => isFavorite(b.id));
  const selectedFoodBrands = favoriteFoodBrands.length > 0 
    ? favoriteFoodBrands.slice(0, 2)
    : [foodBrands[0], foodBrands[1]]; // Swiggy, Zomato
  
  const foodAmountPer = roundToHundred(foodBudget / selectedFoodBrands.length);
  selectedFoodBrands.forEach(brand => {
    rows.push({
      id: generateId(),
      category: 'Q-Com / Food Delivery',
      brandId: brand.id,
      brandName: brand.name,
      amount: Math.max(500, foodAmountPer),
      frequency: 'monthly',
    });
  });
  
  // Shopping category (2-3 rows)
  const shoppingBudget = spendingBudgetMonthly * weights.shopping;
  const favoriteShoppingBrands = shoppingBrands.filter(b => isFavorite(b.id));
  let selectedShoppingBrands = favoriteShoppingBrands.length > 0
    ? favoriteShoppingBrands.slice(0, 3)
    : [shoppingBrands[0], shoppingBrands[1]]; // Amazon, Flipkart
  
  // Weight Amazon heavier
  const shoppingAmounts: number[] = [];
  if (selectedShoppingBrands.some(b => b.id === 'amazon')) {
    const amazonShare = 0.5;
    const othersShare = 0.5 / (selectedShoppingBrands.length - 1 || 1);
    selectedShoppingBrands.forEach(brand => {
      shoppingAmounts.push(
        roundToHundred(shoppingBudget * (brand.id === 'amazon' ? amazonShare : othersShare))
      );
    });
  } else {
    const perBrand = roundToHundred(shoppingBudget / selectedShoppingBrands.length);
    selectedShoppingBrands.forEach(() => shoppingAmounts.push(perBrand));
  }
  
  selectedShoppingBrands.forEach((brand, i) => {
    rows.push({
      id: generateId(),
      category: 'Shopping',
      brandId: brand.id,
      brandName: brand.name,
      amount: Math.max(500, shoppingAmounts[i]),
      frequency: 'monthly',
    });
  });
  
  // Travel category (1-2 rows)
  const travelBudget = spendingBudgetMonthly * weights.travel;
  
  // Uber (monthly)
  const uberBrand = travelBrands.find(b => b.id === 'uber')!;
  const uberBudget = roundToHundred(travelBudget * 0.5);
  rows.push({
    id: generateId(),
    category: 'Travel',
    brandId: uberBrand.id,
    brandName: uberBrand.name,
    amount: Math.max(500, uberBudget),
    frequency: 'monthly',
  });
  
  // MMT Flights (yearly or quarterly for high income)
  const flightsBrand = travelBrands.find(b => b.id === 'mmt-flights')!;
  const flightFreq = (income === '18-30L' || income === '>30L') ? 'quarterly' : 'yearly';
  const flightPeriodsPerYear = flightFreq === 'quarterly' ? 4 : 1;
  const annualFlightBudget = travelBudget * 0.5 * 12;
  const flightAmount = roundToHundred(annualFlightBudget / flightPeriodsPerYear);
  
  rows.push({
    id: generateId(),
    category: 'Travel',
    brandId: flightsBrand.id,
    brandName: flightsBrand.name,
    amount: Math.max(2000, flightAmount),
    frequency: flightFreq as 'quarterly' | 'yearly',
  });
  
  // Non-brand category
  const nonBrandBudget = spendingBudgetMonthly * weights.nonBrand;
  
  // Rent (always present)
  const rentBrand = nonBrandOptions.find(b => b.id === 'rent')!;
  let rentRatio = maritalStatus === 'married' ? 0.28 : 0.22;
  const rentAmount = roundToHundred(spendingBudgetMonthly * rentRatio);
  
  rows.push({
    id: generateId(),
    category: 'Non-Brand Spends',
    brandId: rentBrand.id,
    brandName: rentBrand.name,
    amount: Math.max(5000, rentAmount),
    frequency: 'monthly',
  });
  
  // CC Bill (only if using credit card)
  if (spendingStyle === 'mixed' || spendingStyle === 'card') {
    const ccBrand = nonBrandOptions.find(b => b.id === 'cc-bill')!;
    const shoppingTravelTotal = (shoppingBudget + travelBudget);
    const ccRatio = spendingStyle === 'card' ? 0.5 : 0.35;
    const ccAmount = roundToHundred(shoppingTravelTotal * ccRatio);
    
    rows.push({
      id: generateId(),
      category: 'Non-Brand Spends',
      brandId: ccBrand.id,
      brandName: ccBrand.name,
      amount: Math.max(2000, ccAmount),
      frequency: 'monthly',
    });
  }
  
  return rows;
}
