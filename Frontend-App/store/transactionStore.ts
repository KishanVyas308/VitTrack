import AsyncStorage from '@react-native-async-storage/async-storage';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Transaction, TransactionFilter } from '../types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactions: (filter?: TransactionFilter) => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  clearAllTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date() } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      getTransactions: (filter) => {
        const { transactions } = get();
        
        if (!filter) return transactions;

        return transactions.filter((transaction) => {
          // Filter by type
          if (filter.type && filter.type !== 'all' && transaction.type !== filter.type) {
            return false;
          }

          // Filter by category
          if (filter.categoryIds && filter.categoryIds.length > 0) {
            if (!filter.categoryIds.includes(transaction.categoryId)) {
              return false;
            }
          }

          // Filter by date range
          if (filter.startDate || filter.endDate) {
            const transactionDate = new Date(transaction.date);
            const start = filter.startDate ? startOfDay(filter.startDate) : null;
            const end = filter.endDate ? endOfDay(filter.endDate) : null;

            if (start && end) {
              if (!isWithinInterval(transactionDate, { start, end })) {
                return false;
              }
            } else if (start && transactionDate < start) {
              return false;
            } else if (end && transactionDate > end) {
              return false;
            }
          }

          // Filter by amount range
          if (filter.minAmount !== undefined && transaction.amount < filter.minAmount) {
            return false;
          }
          if (filter.maxAmount !== undefined && transaction.amount > filter.maxAmount) {
            return false;
          }

          // Filter by search query
          if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            return (
              transaction.description.toLowerCase().includes(query) ||
              transaction.categoryId.toLowerCase().includes(query)
            );
          }

          return true;
        });
      },

      getTransactionById: (id) => {
        return get().transactions.find((t) => t.id === id);
      },

      clearAllTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
