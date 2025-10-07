import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears
} from 'date-fns';
import { useCallback } from 'react';
import { useBudgetStore } from '../store/budgetStore';
import { useTransactionStore } from '../store/transactionStore';
import { CategoryStatistic, PeriodStats } from '../types';

type Period = 'monthly' | 'weekly' | 'yearly' | 'custom';

interface UseAnalyticsReturn {
  getPeriodStats: (period: Period, customStart?: Date, customEnd?: Date) => PeriodStats;
  getComparisonStats: (period: Period) => { current: PeriodStats; previous: PeriodStats; changePercentage: number };
  getCategoryStats: (period: Period, customStart?: Date, customEnd?: Date) => CategoryStatistic[];
  getBudgetProgress: () => Array<{
    categoryId: string;
    budgetAmount: number;
    spentAmount: number;
    percentage: number;
    status: 'on-track' | 'warning' | 'exceeded';
  }>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { getTransactions } = useTransactionStore();
  const { budgets } = useBudgetStore();

  const getDateRange = useCallback((period: Period, customStart?: Date, customEnd?: Date) => {
    const now = new Date();
    
    switch (period) {
      case 'monthly':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'weekly':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'yearly':
        return { start: startOfYear(now), end: endOfYear(now) };
      case 'custom':
        return { 
          start: customStart || startOfMonth(now), 
          end: customEnd || endOfMonth(now) 
        };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, []);

  const getPeriodStats = useCallback((
    period: Period, 
    customStart?: Date, 
    customEnd?: Date
  ): PeriodStats => {
    const { start, end } = getDateRange(period, customStart, customEnd);
    
    const transactions = getTransactions({
      startDate: start,
      endDate: end,
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const existing = categoryMap.get(t.categoryId) || { amount: 0, count: 0 };
        categoryMap.set(t.categoryId, {
          amount: existing.amount + t.amount,
          count: existing.count + 1,
        });
      });

    const categoryStats: CategoryStatistic[] = Array.from(categoryMap.entries()).map(
      ([categoryId, { amount, count }]) => ({
        categoryId,
        amount,
        count,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      })
    );

    categoryStats.sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      transactionCount: transactions.length,
      categoryStats,
    };
  }, [getTransactions, getDateRange]);

  const getComparisonStats = useCallback((period: Period) => {
    const now = new Date();
    let previousStart: Date;
    let previousEnd: Date;
    
    switch (period) {
      case 'monthly':
        previousStart = startOfMonth(subMonths(now, 1));
        previousEnd = endOfMonth(subMonths(now, 1));
        break;
      case 'weekly':
        previousStart = startOfWeek(subWeeks(now, 1));
        previousEnd = endOfWeek(subWeeks(now, 1));
        break;
      case 'yearly':
        previousStart = startOfYear(subYears(now, 1));
        previousEnd = endOfYear(subYears(now, 1));
        break;
      default:
        previousStart = startOfMonth(subMonths(now, 1));
        previousEnd = endOfMonth(subMonths(now, 1));
    }

    const current = getPeriodStats(period);
    const previous = getPeriodStats('custom', previousStart, previousEnd);

    const changePercentage = previous.totalExpense > 0
      ? ((current.totalExpense - previous.totalExpense) / previous.totalExpense) * 100
      : 0;

    return { current, previous, changePercentage };
  }, [getPeriodStats]);

  const getCategoryStats = useCallback((
    period: Period, 
    customStart?: Date, 
    customEnd?: Date
  ): CategoryStatistic[] => {
    const stats = getPeriodStats(period, customStart, customEnd);
    return stats.categoryStats;
  }, [getPeriodStats]);

  const getBudgetProgress = useCallback(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return budgets
      .filter(b => b.period === 'monthly')
      .map(budget => {
        const spent = getTransactions({
          type: 'expense',
          categoryIds: [budget.categoryId],
          startDate: monthStart,
          endDate: monthEnd,
        }).reduce((sum, t) => sum + t.amount, 0);

        const percentage = (spent / budget.amount) * 100;
        
        let status: 'on-track' | 'warning' | 'exceeded';
        if (percentage >= 100) {
          status = 'exceeded';
        } else if (percentage >= 80) {
          status = 'warning';
        } else {
          status = 'on-track';
        }

        return {
          categoryId: budget.categoryId,
          budgetAmount: budget.amount,
          spentAmount: spent,
          percentage,
          status,
        };
      });
  }, [budgets, getTransactions]);

  return {
    getPeriodStats,
    getComparisonStats,
    getCategoryStats,
    getBudgetProgress,
  };
};
