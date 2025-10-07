export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currencyCode: string;
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  notifications: boolean;
  haptics: boolean;
}

export interface CategoryStatistic {
  categoryId: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface PeriodStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  categoryStats: CategoryStatistic[];
}

export interface VoiceExpenseData {
  amount?: number;
  categoryId?: string;
  description?: string;
  confidence: number;
}

export type TransactionFilter = {
  type?: 'income' | 'expense' | 'all';
  categoryIds?: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
};
