import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';

/**
 * Hook to sync data with backend when app starts
 * Call this in your main layout or index page
 */
export const useBackendSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  useEffect(() => {
    const syncData = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      setIsSyncing(true);
      setError(null);

      try {
        // Fetch transactions from backend
        const userId = parseInt(user.id);
        if (!isNaN(userId)) {
          await fetchTransactions(userId);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync data';
        setError(errorMessage);
        console.error('Sync error:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncData();
  }, [isAuthenticated, user, fetchTransactions]);

  return { isSyncing, error };
};
