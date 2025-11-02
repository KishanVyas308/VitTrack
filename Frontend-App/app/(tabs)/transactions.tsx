import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddTransactionModal } from '../../components/transaction/AddTransactionModal';
import { useCurrency } from '../../hooks/useCurrency';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';
import { Transaction } from '../../types';

type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const { t } = useTranslation();
  const { trigger } = useHaptics();
  const { formatAmount } = useCurrency();
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore();
  
  const { transactions, addTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactionStore();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await fetchTransactions(parseInt(user.id));
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filter !== 'all') {
      result = result.filter((t) => t.type === filter);
    }

    // Filter by search
    if (search) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [transactions, filter, search]);

  // Calculate filtered total
  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
  }, [filteredTransactions]);

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, string> = {
      'food': 'restaurant',
      'transportation': 'car',
      'groceries': 'cart',
      'shopping': 'bag',
      'entertainment': 'game-controller',
      'healthcare': 'medical',
      'bills': 'receipt',
      'education': 'school',
      'gift': 'gift',
      'salary': 'wallet',
      'freelance': 'briefcase',
      'investment': 'trending-up',
    };
    return icons[categoryId.toLowerCase()] || 'ellipse';
  };

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      'food': '#ef4444',
      'transportation': '#3b82f6',
      'groceries': '#06b6d4',
      'shopping': '#ec4899',
      'entertainment': '#a855f7',
      'healthcare': '#10b981',
      'bills': '#f59e0b',
      'education': '#6366f1',
      'gift': '#f43f5e',
      'salary': '#10b981',
      'freelance': '#8b5cf6',
      'investment': '#14b8a6',
    };
    return colors[categoryId.toLowerCase()] || '#8b5cf6';
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setModalVisible(true);
    trigger('light');
  };

  const handleDelete = async (id: string) => {
    trigger('warning');
    await deleteTransaction(id);
    // Refresh from backend to ensure sync
    if (user?.id) {
      await fetchTransactions(parseInt(user.id));
    }
  };

  const handleSave = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editTransaction) {
      await updateTransaction(editTransaction.id, data);
      setEditTransaction(undefined);
      // Refresh from backend to ensure sync
      if (user?.id) {
        await fetchTransactions(parseInt(user.id));
      }
    } else {
      // New transaction: persist to backend
      if (user?.id) {
        await addTransaction(data, parseInt(user.id));
        // Refresh to ensure we have the authoritative list (optional because store prepends)
        await fetchTransactions(parseInt(user.id));
      } else {
        // Fallback: add locally if no user
        addTransaction(data as any, 1).catch((e) => console.error(e));
      }
    }
    setModalVisible(false);
    trigger('success');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8b5cf6"
            />
          }
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <Text style={{ color: colors.text }} className="text-3xl font-black mb-6">Transactions</Text>

            {/* Search Bar */}
            <View style={{ backgroundColor: colors.card }} className="rounded-2xl px-4 py-3 flex-row items-center mb-4">
              <Ionicons name="search" size={20} color={colors.textTertiary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search transactions..."
                placeholderTextColor={colors.textTertiary}
                style={{ color: colors.text }}
                className="flex-1 ml-3 text-base font-medium"
              />
              {search ? (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter and Sort Buttons */}
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={() => {
                  setShowFilters(!showFilters);
                  trigger('light');
                }}
                className="flex-1 bg-purple-500 rounded-2xl px-4 py-3 flex-row items-center justify-center"
                style={{
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Ionicons name="options" size={20} color="#fff" />
                <Text className="text-white text-sm font-bold ml-2">Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => trigger('light')}
                style={{ backgroundColor: colors.card }}
                className="flex-1 rounded-2xl px-4 py-3 flex-row items-center justify-center"
              >
                <Ionicons name="swap-vertical" size={20} color={colors.textTertiary} />
                <Text style={{ color: colors.textSecondary }} className="text-sm font-bold ml-2">Sort</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            {showFilters && (
              <View className="flex-row gap-2 mb-4">
                {(['all', 'income', 'expense'] as FilterType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setFilter(type);
                      trigger('light');
                    }}
                    style={{ backgroundColor: filter === type ? colors.primary : colors.card }}
                    className="px-4 py-2 rounded-full"
                  >
                    <Text style={{ color: filter === type ? '#fff' : colors.textSecondary }} className="text-sm font-semibold">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Filtered Total Card */}
          {filteredTransactions.length > 0 && (
            <View className="px-6 mb-6">
              <View className="bg-teal-500 rounded-2xl p-5" style={{
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}>
                <Text className="text-white text-sm font-medium mb-2">
                  Filtered Total ({filteredTransactions.length} transactions)
                </Text>
                <Text className="text-white text-4xl font-black">
                  {filteredTotal >= 0 ? '+' : ''}{formatAmount(Math.abs(filteredTotal))}
                </Text>
              </View>
            </View>
          )}

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6 py-20">
              <Ionicons name="receipt-outline" size={80} color={colors.textTertiary} />
              <Text style={{ color: colors.text }} className="text-lg font-bold mt-4 mb-2">
                {search ? 'No results found' : 'No transactions yet'}
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm text-center">
                {search
                  ? 'Try adjusting your search or filters'
                  : 'Add your first transaction to get started'}
              </Text>
            </View>
          ) : (
            <View className="px-6 gap-3">
              {filteredTransactions.map((transaction) => {
                const categoryColor = getCategoryColor(transaction.categoryId);
                return (
                  <View
                    key={transaction.id}
                    style={{ backgroundColor: colors.card }}
                    className="rounded-2xl p-4"
                  >
                    <View className="flex-row items-start mb-3">
                      {/* Category Icon */}
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: `${categoryColor}30` }}
                      >
                        <Ionicons
                          name={getCategoryIcon(transaction.categoryId) as any}
                          size={24}
                          color={categoryColor}
                        />
                      </View>

                      {/* Transaction Details */}
                      <View className="flex-1">
                        <Text style={{ color: colors.text }} className="text-base font-bold mb-1">
                          {transaction.description}
                        </Text>
                        <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')} • {format(new Date(transaction.date), 'hh:mm a')}
                        </Text>
                      </View>

                      {/* Amount */}
                      <View className="items-end">
                        <Text
                          className="text-lg font-black mb-1"
                          style={{ color: transaction.type === 'income' ? '#10b981' : '#ef4444' }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatAmount(transaction.amount)}
                        </Text>
                        <View style={{ backgroundColor: colors.border }} className="rounded-full px-2 py-1">
                          <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold">
                            {transaction.categoryId}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleEdit(transaction)}
                        className="flex-1 bg-purple-500/20 rounded-xl py-3 flex-row items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="create-outline" size={18} color="#8b5cf6" />
                        <Text className="text-purple-500 text-sm font-bold ml-2">Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDelete(transaction.id)}
                        className="flex-1 bg-red-500/20 rounded-xl py-3 flex-row items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        <Text className="text-red-500 text-sm font-bold ml-2">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* FAB Button */}
        <TouchableOpacity
          onPress={() => {
            setEditTransaction(undefined);
            setModalVisible(true);
            trigger('medium');
          }}
          className="absolute bottom-24 right-6 w-16 h-16 rounded-full bg-purple-500 items-center justify-center"
          style={{
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Add/Edit Transaction Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditTransaction(undefined);
        }}
        onSave={handleSave}
        editTransaction={editTransaction}
      />
    </View>
  );
}
