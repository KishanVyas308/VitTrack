import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useCurrency } from '../../hooks/useCurrency';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';

type PeriodType = 'today' | 'week' | 'month' | 'year';

export default function AnalyticsScreen() {
  const { trigger } = useHaptics();
  const { formatAmount } = useCurrency();
  const { colors, isDark } = useTheme();
  const { getPeriodStats, getCategoryStats } = useAnalytics();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  const stats = getPeriodStats('monthly', new Date());
  const categoryStats = getCategoryStats('monthly', new Date());

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    trigger('light');
  };

  // Get date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'today':
        return format(now, 'MMM dd, yyyy');
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(now.setDate(weekStart.getDate() + 6));
        return `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`;
      case 'month':
        return `${format(new Date(now.getFullYear(), now.getMonth(), 1), 'MMM dd')} - ${format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'MMM dd, yyyy')}`;
      case 'year':
        return `${format(new Date(now.getFullYear(), 0, 1), 'MMM dd')} - ${format(new Date(now.getFullYear(), 11, 31), 'MMM dd, yyyy')}`;
      default:
        return format(now, 'MMM dd, yyyy');
    }
  };

  // Get top 3 categories for spending breakdown
  const topCategories = categoryStats
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const getCategoryIcon = (categoryId: string): any => {
    const iconMap: Record<string, any> = {
      food: 'restaurant',
      transportation: 'car',
      groceries: 'cart',
      shopping: 'bag-handle',
      entertainment: 'game-controller',
      bills: 'receipt',
      health: 'fitness',
      education: 'school',
      other: 'ellipsis-horizontal-circle',
    };
    return iconMap[categoryId] || 'pricetag';
  };

  const getCategoryColor = (categoryId: string): string => {
    const colorMap: Record<string, string> = {
      food: '#ef4444',
      transportation: '#3b82f6',
      groceries: '#06b6d4',
      shopping: '#f59e0b',
      entertainment: '#8b5cf6',
      bills: '#ec4899',
      health: '#10b981',
      education: '#6366f1',
      other: '#6b7280',
    };
    return colorMap[categoryId] || '#6b7280';
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View className="px-5 pt-4 pb-6">
            <Text className="text-3xl font-black mb-2" style={{ color: colors.text }}>Analytics</Text>
            <Text className="text-base font-medium" style={{ color: colors.textSecondary }}>{getDateRange()}</Text>
          </View>

          {/* Time Period Selector */}
          <View className="px-5 mb-6">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => handlePeriodChange('today')}
                className="flex-1 py-3 rounded-2xl"
                style={{ backgroundColor: selectedPeriod === 'today' ? 'transparent' : colors.card }}
              >
                {selectedPeriod === 'today' ? (
                  <LinearGradient
                    colors={['#8b5cf6', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                    }}
                  />
                ) : null}
                <Text
                  className={`text-center text-sm font-bold ${
                    selectedPeriod === 'today' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  Today
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePeriodChange('week')}
                className="flex-1 py-3 rounded-2xl"
                style={{ backgroundColor: selectedPeriod === 'week' ? 'transparent' : colors.card }}
              >
                {selectedPeriod === 'week' ? (
                  <LinearGradient
                    colors={['#8b5cf6', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                    }}
                  />
                ) : null}
                <Text
                  className="text-center text-sm font-bold"
                  style={{ color: selectedPeriod === 'week' ? '#fff' : colors.textSecondary }}
                >
                  Week
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePeriodChange('month')}
                className="flex-1 py-3 rounded-2xl"
                style={{ backgroundColor: selectedPeriod === 'month' ? 'transparent' : colors.card }}
              >
                {selectedPeriod === 'month' ? (
                  <LinearGradient
                    colors={['#8b5cf6', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                    }}
                  />
                ) : null}
                <Text
                  className="text-center text-sm font-bold"
                  style={{ color: selectedPeriod === 'month' ? '#fff' : colors.textSecondary }}
                >
                  Month
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePeriodChange('year')}
                className="flex-1 py-3 rounded-2xl"
                style={{ backgroundColor: selectedPeriod === 'year' ? 'transparent' : colors.card }}
              >
                {selectedPeriod === 'year' ? (
                  <LinearGradient
                    colors={['#8b5cf6', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                    }}
                  />
                ) : null}
                <Text
                  className="text-center text-sm font-bold"
                  style={{ color: selectedPeriod === 'year' ? '#fff' : colors.textSecondary }}
                >
                  Year
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Financial Overview Section */}
          <View className="px-5 mb-6">
            <Text className="text-xl font-black mb-4" style={{ color: colors.text }}>Financial Overview</Text>

            {/* Total Income Card */}
            <View className="mb-3 rounded-3xl overflow-hidden">
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white text-sm font-semibold mb-2">Total Income</Text>
                    <Text className="text-white text-4xl font-black">
                      {formatAmount(stats.totalIncome)}
                    </Text>
                  </View>
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <Ionicons name="arrow-up" size={24} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Total Expenses Card */}
            <View className="mb-3 rounded-3xl overflow-hidden">
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white text-sm font-semibold mb-2">Total Expenses</Text>
                    <Text className="text-white text-4xl font-black">
                      {formatAmount(stats.totalExpense)}
                    </Text>
                  </View>
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <Ionicons name="arrow-down" size={24} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Net Balance Card */}
            <View className="mb-3 rounded-3xl overflow-hidden">
              <LinearGradient
                colors={['#8b5cf6', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white text-sm font-semibold mb-2">Net Balance</Text>
                    <Text className="text-white text-4xl font-black">
                      {formatAmount(stats.netAmount)}
                    </Text>
                  </View>
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <Ionicons name="cash" size={24} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Spending by Category Section */}
          <View className="px-5 mb-6">
            <Text className="text-xl font-black mb-4" style={{ color: colors.text }}>Spending by Category</Text>

            <View className="rounded-2xl p-5" style={{ backgroundColor: colors.card }}>
              {topCategories.length === 0 ? (
                <View className="py-8 items-center">
                  <Ionicons name="pie-chart-outline" size={48} color={colors.textTertiary} />
                  <Text className="text-sm font-medium mt-3" style={{ color: colors.textSecondary }}>
                    No spending data available
                  </Text>
                </View>
              ) : (
                topCategories.map((stat, index) => {
                  const categoryColor = getCategoryColor(stat.categoryId);
                  const categoryIcon = getCategoryIcon(stat.categoryId);
                  const percentage = stat.percentage;

                  return (
                    <View key={stat.categoryId} className={index < topCategories.length - 1 ? 'mb-5' : ''}>
                      <View className="flex-row items-center mb-3">
                        {/* Category Icon */}
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${categoryColor}30` }}
                        >
                          <Ionicons name={categoryIcon} size={20} color={categoryColor} />
                        </View>

                        {/* Category Name and Percentage */}
                        <View className="flex-1">
                          <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
                            {stat.categoryId.charAt(0).toUpperCase() + stat.categoryId.slice(1)}
                          </Text>
                          <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                            {percentage.toFixed(1)}% of total
                          </Text>
                        </View>

                        {/* Amount */}
                        <Text className="text-lg font-black" style={{ color: colors.text }}>
                          {formatAmount(stat.amount)}
                        </Text>
                      </View>

                      {/* Progress Bar */}
                      <View
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.border }}
                      >
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: categoryColor,
                          }}
                        />
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>

          {/* Quick Stats Section */}
          <View className="px-5 pb-32">
            <Text className="text-xl font-black mb-4" style={{ color: colors.text }}>Quick Stats</Text>

            <View className="rounded-2xl p-5" style={{ backgroundColor: colors.card }}>
              <View className="flex-row justify-between items-center mb-4 pb-4 border-b" style={{ borderColor: colors.border }}>
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>Total Transactions</Text>
                <Text className="text-lg font-black" style={{ color: colors.text }}>{stats.transactionCount}</Text>
              </View>

              <View className="flex-row justify-between items-center mb-4 pb-4 border-b" style={{ borderColor: colors.border }}>
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>Average Expense</Text>
                <Text className="text-lg font-black" style={{ color: colors.text }}>
                  {formatAmount(
                    stats.transactionCount > 0 ? stats.totalExpense / stats.transactionCount : 0
                  )}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>Active Categories</Text>
                <Text className="text-lg font-black" style={{ color: colors.text }}>{categoryStats.length}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
