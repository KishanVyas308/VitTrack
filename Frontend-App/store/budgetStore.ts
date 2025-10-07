import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Budget } from '../types';

interface BudgetState {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetByCategory: (categoryId: string) => Budget | undefined;
  getAllBudgets: () => Budget[];
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      updateBudget: (id, data) => {
        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...data } : b)),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      getBudgetByCategory: (categoryId) => {
        return get().budgets.find((b) => b.categoryId === categoryId);
      },

      getAllBudgets: () => {
        return get().budgets;
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
