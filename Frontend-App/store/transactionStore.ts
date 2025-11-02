import AsyncStorage from '@react-native-async-storage/async-storage';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Transaction, TransactionFilter } from '../types';
import { buildUrl, API_ENDPOINTS } from '../config/api';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>, userId: number) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactions: (filter?: TransactionFilter) => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  clearAllTransactions: () => void;
  fetchTransactions: (userId: number) => Promise<void>;
  syncTransaction: (transaction: Transaction, userId: number) => Promise<void>;
}

// Category mapping from backend to frontend
const CATEGORY_MAPPING: Record<string, string> = {
  'Groceries': 'food',
  'Entertainment': 'entertainment',
  'Transport': 'transport',
  'Bills': 'bills',
  'Shopping': 'shopping',
  'Miscellaneous': 'other-expense',
};

const CATEGORY_ID_MAPPING: Record<number, string> = {
  1: 'food',       // Groceries
  2: 'entertainment',
  3: 'transport',
  4: 'bills',
  5: 'shopping',
  6: 'other-expense', // Miscellaneous
};

// Category mapping from frontend to backend
const CATEGORY_ID_TO_BACKEND: Record<string, number> = {
  'food': 1,
  'entertainment': 2,
  'transport': 3,
  'bills': 4,
  'shopping': 5,
  'other-expense': 6,
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,

      addTransaction: async (transaction, userId) => {
        set({ isLoading: true, error: null });
        try {
          const categoryId = CATEGORY_ID_TO_BACKEND[transaction.categoryId] || 6;

          const payload = {
            amount: transaction.amount,
            description: transaction.description,
            category_id: categoryId,
            user_id: userId,
            created_at: transaction.date ? transaction.date.toISOString() : new Date().toISOString(),
          };

          const response = await fetch(buildUrl(API_ENDPOINTS.CREATE_EXPENSE), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(err.detail || `HTTP ${response.status}`);
          }

          const created = await response.json();

          // Map backend response to frontend transaction shape
          const newTransaction: Transaction = {
            id: created.id.toString(),
            type: transaction.type,
            amount: created.amount,
            categoryId: CATEGORY_ID_MAPPING[created.category_id] || transaction.categoryId,
            description: created.description || transaction.description,
            date: new Date(created.created_at),
            createdAt: new Date(created.created_at),
            updatedAt: new Date(created.created_at),
          };

          // Prepend to local store
          set((state) => ({ transactions: [newTransaction, ...state.transactions], isLoading: false }));

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add transaction';
          set({ error: errorMessage, isLoading: false });
          console.error('Error adding transaction:', error);
        }
      },

      fetchTransactions: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          // Ensure userId is an integer
          const userIdInt = typeof userId === 'string' ? parseInt(userId) : userId;
          
          if (isNaN(userIdInt)) {
            throw new Error('Invalid user ID');
          }

          console.log('Fetching transactions for user:', userIdInt);
          
          const response = await fetch(buildUrl(API_ENDPOINTS.GET_EXPENSES), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userIdInt }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
          }

          const expenses = await response.json();
          console.log('Fetched expenses:', expenses.length);
          
          // Transform backend expenses to frontend transactions
          const transactions: Transaction[] = expenses.map((expense: any) => ({
            id: expense.id.toString(),
            type: 'expense' as const,
            amount: expense.amount,
            categoryId: CATEGORY_ID_MAPPING[expense.category_id] || 'other-expense',
            description: expense.description || '',
            date: new Date(expense.created_at),
            createdAt: new Date(expense.created_at),
            updatedAt: new Date(expense.created_at),
          }));

          set({ transactions, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
          set({ error: errorMessage, isLoading: false });
          console.error('Error fetching transactions:', error);
        }
      },

      syncTransaction: async (transaction: Transaction, userId: number) => {
        // This would sync a transaction to the backend
        // For now, we handle this through voice input
        // You can implement manual transaction sync here if needed
        console.log('Sync transaction:', transaction, 'for user:', userId);
      },

      updateTransaction: async (id, data) => {
        try {
          // Get the transaction before updating
          const oldTransaction = get().transactions.find(t => t.id === id);
          
          // Update locally first for immediate feedback
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...data, updatedAt: new Date() } : t
            ),
          }));

          // Get the updated transaction
          const transaction = get().transactions.find(t => t.id === id);
          if (transaction && oldTransaction) {
            const categoryId = CATEGORY_ID_TO_BACKEND[transaction.categoryId] || 6;
            
            console.log(`Updating transaction ${id} in backend:`, {
              amount: transaction.amount,
              description: transaction.description,
              category_id: categoryId,
            });
            
            // Update in backend - we need user_id, let's use a workaround
            // The backend transaction already has the user_id, we just need to send the update
            const response = await fetch(buildUrl(`${API_ENDPOINTS.UPDATE_EXPENSE}${id}`), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: transaction.amount,
                description: transaction.description,
                category_id: categoryId,
                user_id: 1, // This will be ignored by backend as it uses existing user_id
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to update transaction');
            }
            
            console.log('Transaction updated successfully in backend');
          }
        } catch (error) {
          console.error('Error updating transaction:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to update' });
        }
      },

      deleteTransaction: async (id) => {
        try {
          console.log(`Deleting transaction ${id}`);
          
          // Save for potential rollback
          const deletedTransaction = get().transactions.find(t => t.id === id);
          
          // Delete locally first for immediate feedback
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          }));

          // Delete from backend
          const response = await fetch(buildUrl(`${API_ENDPOINTS.DELETE_EXPENSE}${id}`), {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete transaction');
          }
          
          console.log('Transaction deleted successfully from backend');
        } catch (error) {
          console.error('Error deleting transaction:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to delete' });
        }
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
