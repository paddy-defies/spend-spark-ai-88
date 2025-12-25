export const AGE_RANGES = [
  { value: '18-23', label: '18-23' },
  { value: '24-30', label: '24-30' },
  { value: '31-35', label: '31-35' },
  { value: '35+', label: '35+' },
];

export const GENDERS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

export const MARITAL_STATUS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
];

export const INCOME_RANGES = [
  { value: '<6L', label: '< ₹6L p.a.' },
  { value: '6-10L', label: '₹6-10L p.a.' },
  { value: '10-18L', label: '₹10-18L p.a.' },
  { value: '18-30L', label: '₹18-30L p.a.' },
  { value: '>30L', label: '> ₹30L p.a.' },
];

export const SPENDING_STYLES = [
  { value: 'mixed', label: 'UPI for small, Card for big', short: 'Mixed' },
  { value: 'card', label: 'All in on Credit Card', short: 'Card' },
  { value: 'upi', label: 'All in on UPI', short: 'UPI' },
];

export const BRAND_CATEGORIES = {
  'Q-Com / Food Delivery': [
    { id: 'swiggy', name: 'Swiggy', initial: 'S', color: '#FC8019' },
    { id: 'zomato', name: 'Zomato', initial: 'Z', color: '#E23744' },
    { id: 'zepto', name: 'Zepto', initial: 'Z', color: '#8B5CF6' },
    { id: 'amazon-fresh', name: 'Amazon Fresh', initial: 'A', color: '#FF9900' },
  ],
  'Shopping': [
    { id: 'amazon', name: 'Amazon', initial: 'A', color: '#FF9900' },
    { id: 'flipkart', name: 'Flipkart', initial: 'F', color: '#2874F0' },
    { id: 'tata-cliq', name: 'Tata Cliq', initial: 'T', color: '#FF6161' },
    { id: 'nykaa', name: 'Nykaa', initial: 'N', color: '#FC2779' },
    { id: 'ajio', name: 'Ajio', initial: 'A', color: '#3C3C3C' },
    { id: 'myntra', name: 'Myntra', initial: 'M', color: '#FF3F6C' },
    { id: 'decathlon', name: 'Decathlon', initial: 'D', color: '#0082C3' },
  ],
  'Travel': [
    { id: 'mmt-flights', name: 'MMT Flights', initial: 'M', color: '#E74C3C' },
    { id: 'mmt-hotels', name: 'MMT Hotels', initial: 'M', color: '#2980B9' },
    { id: 'uber', name: 'Uber', initial: 'U', color: '#000000' },
  ],
  'Non-Brand Spends': [
    { id: 'rent', name: 'Rent Payment', initial: 'R', color: '#6B7280' },
    { id: 'cc-bill', name: 'CC Bill Payment', initial: 'C', color: '#374151' },
  ],
};

export const DISCOUNT_RATES: Record<string, number> = {
  'swiggy': 0.05,
  'zomato': 0.05,
  'zepto': 0.05,
  'amazon-fresh': 0.05,
  'amazon': 0.02,
  'flipkart': 0.02,
  'tata-cliq': 0.06,
  'nykaa': 0.06,
  'ajio': 0.06,
  'myntra': 0.06,
  'decathlon': 0.06,
  'mmt-flights': 0.06,
  'mmt-hotels': 0.10,
  'uber': 0.05,
  'rent': 0.00,
  'cc-bill': 0.00,
};

export const INCOME_MONTHLY: Record<string, number> = {
  '<6L': 35000,
  '6-10L': 65000,
  '10-18L': 110000,
  '18-30L': 200000,
  '>30L': 300000,
};

export const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly', periods: 12 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'yearly', label: 'Yearly', periods: 1 },
];

export const MF_RATE = 0.07;
export const BANK_RATE = 0.025;
export const RATE_DIFF = 0.045;
export const HOLDING_FACTOR = 0.5;
