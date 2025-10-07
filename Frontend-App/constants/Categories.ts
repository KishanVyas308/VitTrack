export interface Category {
  id: string;
  name: string;
  nameKey: string; // For i18n
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export const EXPENSE_CATEGORIES: Category[] = [
  { 
    id: 'food', 
    name: 'Food & Dining', 
    nameKey: 'categories.food',
    icon: 'utensils', 
    color: '#ef4444',
    type: 'expense'
  },
  { 
    id: 'transport', 
    name: 'Transportation', 
    nameKey: 'categories.transport',
    icon: 'car', 
    color: '#3b82f6',
    type: 'expense'
  },
  { 
    id: 'shopping', 
    name: 'Shopping', 
    nameKey: 'categories.shopping',
    icon: 'shopping-bag', 
    color: '#8b5cf6',
    type: 'expense'
  },
  { 
    id: 'bills', 
    name: 'Bills & Utilities', 
    nameKey: 'categories.bills',
    icon: 'receipt', 
    color: '#f59e0b',
    type: 'expense'
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    nameKey: 'categories.entertainment',
    icon: 'film', 
    color: '#ec4899',
    type: 'expense'
  },
  { 
    id: 'health', 
    name: 'Health & Fitness', 
    nameKey: 'categories.health',
    icon: 'heart', 
    color: '#10b981',
    type: 'expense'
  },
  { 
    id: 'education', 
    name: 'Education', 
    nameKey: 'categories.education',
    icon: 'book-open', 
    color: '#6366f1',
    type: 'expense'
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    nameKey: 'categories.travel',
    icon: 'plane', 
    color: '#06b6d4',
    type: 'expense'
  },
  { 
    id: 'gifts', 
    name: 'Gifts & Donations', 
    nameKey: 'categories.gifts',
    icon: 'gift', 
    color: '#f43f5e',
    type: 'expense'
  },
  { 
    id: 'other-expense', 
    name: 'Other', 
    nameKey: 'categories.other',
    icon: 'more-horizontal', 
    color: '#6b7280',
    type: 'expense'
  },
];

export const INCOME_CATEGORIES: Category[] = [
  { 
    id: 'salary', 
    name: 'Salary', 
    nameKey: 'categories.salary',
    icon: 'briefcase', 
    color: '#10b981',
    type: 'income'
  },
  { 
    id: 'freelance', 
    name: 'Freelance', 
    nameKey: 'categories.freelance',
    icon: 'laptop', 
    color: '#8b5cf6',
    type: 'income'
  },
  { 
    id: 'investment', 
    name: 'Investment', 
    nameKey: 'categories.investment',
    icon: 'trending-up', 
    color: '#3b82f6',
    type: 'income'
  },
  { 
    id: 'business', 
    name: 'Business', 
    nameKey: 'categories.business',
    icon: 'building-2', 
    color: '#6366f1',
    type: 'income'
  },
  { 
    id: 'other-income', 
    name: 'Other Income', 
    nameKey: 'categories.otherIncome',
    icon: 'plus-circle', 
    color: '#059669',
    type: 'income'
  },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

// Voice recognition keywords
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ['food', 'meal', 'lunch', 'dinner', 'breakfast', 'coffee', 'restaurant', 'groceries', 'ate', 'eating', 'grocery'],
  transport: ['uber', 'taxi', 'gas', 'fuel', 'bus', 'train', 'parking', 'metro', 'transport', 'car', 'bike'],
  shopping: ['shopping', 'clothes', 'amazon', 'bought', 'purchase', 'store', 'mall'],
  bills: ['bill', 'electricity', 'water', 'rent', 'internet', 'phone', 'utility'],
  entertainment: ['movie', 'cinema', 'game', 'concert', 'party', 'entertainment'],
  health: ['doctor', 'medicine', 'hospital', 'pharmacy', 'gym', 'fitness', 'health'],
  education: ['book', 'course', 'class', 'tuition', 'education', 'school'],
  travel: ['hotel', 'flight', 'vacation', 'trip', 'travel'],
  gifts: ['gift', 'present', 'donation', 'charity'],
};
