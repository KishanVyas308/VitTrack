import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '../../hooks/useCurrency';
import { useTheme } from '../../hooks/useTheme';
import { useBackendSync } from '../../hooks/useBackendSync';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Sync data with backend on mount
  useBackendSync();

  const onRefresh = React.useCallback(async () => {
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
  }, [user, fetchTransactions]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculate category totals for top spending
  const categoryTotals = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }));

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Food & Dining': 'restaurant',
      'Transportation': 'car',
      'Groceries': 'cart',
      'Shopping': 'bag',
      'Entertainment': 'game-controller',
      'Healthcare': 'medical',
      'Bills': 'receipt',
      'Education': 'school',
    };
    return icons[category] || 'ellipse';
  };

  const getCategoryColor = (index: number) => {
    const colors = ['#ef4444', '#3b82f6', '#06b6d4'];
    return colors[index] || '#8b5cf6';
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
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
              tintColor={colors.primary}
            />
          }
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6">
            <Text className="text-3xl font-black mb-1" style={{ color: colors.text }}>
              {getGreeting()}, {user?.name || 'User'}!
            </Text>
            <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>

          {/* Total Balance Card */}
          <View className="px-6 mb-6">
            <LinearGradient
              colors={['#8b5cf6', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 24,
                padding: 24,
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Text className="text-white text-sm font-medium mb-2">Total Balance</Text>
              <Text className="text-white text-5xl font-black mb-6">{formatAmount(balance)}</Text>

              <View className="flex-row justify-between">
                {/* Income */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Ionicons name="arrow-down" size={20} color="#10b981" />
                  </View>
                  <View>
                    <Text className="text-white/80 text-xs font-medium">Income</Text>
                    <Text className="text-white text-lg font-bold">{formatAmount(totalIncome)}</Text>
                  </View>
                </View>

                {/* Expense */}
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Ionicons name="arrow-up" size={20} color="#ef4444" />
                  </View>
                  <View>
                    <Text className="text-white/80 text-xs font-medium">Expense</Text>
                    <Text className="text-white text-lg font-bold">{formatAmount(totalExpense)}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Quick Stats Section */}
          <View className="px-6 mb-6">
            <Text className="text-xl font-black mb-4" style={{ color: colors.text }}>Quick Stats</Text>
            <View className="flex-row gap-3">
              {/* Transactions */}
              <View className="flex-1 rounded-2xl p-4" style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center mb-3">
                  <Ionicons name="trending-up" size={20} color="#3b82f6" />
                </View>
                <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Transactions</Text>
                <Text className="text-2xl font-black" style={{ color: colors.text }}>{transactions.length}</Text>
              </View>

              {/* Avg Expense */}
              <View className="flex-1 rounded-2xl p-4" style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center mb-3">
                  <Ionicons name="trending-down" size={20} color={colors.success} />
                </View>
                <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Avg. Expense</Text>
                <Text className="text-2xl font-black" style={{ color: colors.text }}>
                  {formatAmount(transactions.length > 0 ? totalExpense / transactions.filter(t => t.type === 'expense').length : 0)}
                </Text>
              </View>

              {/* Categories */}
              <View className="flex-1 rounded-2xl p-4" style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View className="w-10 h-10 rounded-full bg-purple-500/20 items-center justify-center mb-3">
                  <Ionicons name="apps" size={20} color={colors.primary} />
                </View>
                <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Categories</Text>
                <Text className="text-2xl font-black" style={{ color: colors.text }}>{Object.keys(categoryTotals).length}</Text>
              </View>
            </View>
          </View>

          {/* Top Spending Section */}
          <View className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-black" style={{ color: colors.text }}>Top Spending</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/analytics')}>
                <Text className="text-sm font-bold" style={{ color: colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>

            <View className="rounded-2xl p-5" style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}>
              {topCategories.length === 0 ? (
                <Text className="text-center py-4" style={{ color: colors.textSecondary }}>No spending data</Text>
              ) : (
                topCategories.map((item, index) => (
                  <View key={item.categoryId} className={index < topCategories.length - 1 ? 'mb-5' : ''}>
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center flex-1">
                        <View 
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${getCategoryColor(index)}20` }}
                        >
                          <Ionicons name={getCategoryIcon(item.categoryId) as any} size={20} color={getCategoryColor(index)} />
                        </View>
                        <Text className="text-base font-semibold flex-1" style={{ color: colors.text }}>{item.categoryId}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-lg font-bold" style={{ color: colors.text }}>{formatAmount(item.amount)}</Text>
                        <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>{item.percentage}%</Text>
                      </View>
                    </View>
                    <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.borderLight }}>
                      <View 
                        className="h-full rounded-full"
                        style={{ width: `${item.percentage}%`, backgroundColor: getCategoryColor(index) }}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Recent Transactions Section */}
          <View className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-black" style={{ color: colors.text }}>Recent</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                <Text className="text-sm font-bold" style={{ color: colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <View className="rounded-2xl p-8 items-center" style={{ backgroundColor: colors.card }}>
                <Ionicons name="wallet-outline" size={48} color={colors.textSecondary} />
                <Text className="text-base font-medium mt-4 text-center" style={{ color: colors.textSecondary }}>
                  No transactions yet
                </Text>
                <Text className="text-sm mt-2 text-center" style={{ color: colors.textTertiary }}>
                  Add your first transaction to get started
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {transactions.slice(0, 3).map((transaction) => (
                  <View key={transaction.id} className="rounded-2xl p-4 flex-row items-center" style={{
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}>
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: transaction.type === 'income' ? '#10b98120' : '#ef444420' }}
                    >
                      <Ionicons
                        name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                        size={24}
                        color={transaction.type === 'income' ? colors.income : colors.expense}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
                        {transaction.description}
                      </Text>
                      <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                        {format(new Date(transaction.date), 'MMM d, h:mm a')}
                      </Text>
                    </View>
                    <Text 
                      className="text-lg font-black"
                      style={{ color: transaction.type === 'income' ? colors.income : colors.expense }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatAmount(transaction.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
