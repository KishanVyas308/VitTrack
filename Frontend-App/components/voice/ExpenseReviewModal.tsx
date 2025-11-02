import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useCurrency } from '../../hooks/useCurrency';
import { EXPENSE_CATEGORIES, Category } from '../../constants/Categories';
import { Transaction } from '../../types';
import { expenseApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface ExpenseReviewModalProps {
  visible: boolean;
  expenses: Transaction[];
  onClose: () => void;
  onSave: (updatedExpenses: Transaction[]) => void;
}

// Category mapping from frontend to backend
const FRONTEND_TO_BACKEND_CATEGORY: Record<string, number> = {
  'food': 1,           // Groceries
  'entertainment': 2,
  'transport': 3,
  'bills': 4,
  'shopping': 5,
  'other-expense': 6,  // Miscellaneous
};

export const ExpenseReviewModal: React.FC<ExpenseReviewModalProps> = ({
  visible,
  expenses,
  onClose,
  onSave,
}) => {
  const { colors, isDark } = useTheme();
  const { formatAmount, currency } = useCurrency();
  const { user } = useAuthStore();
  const [editedExpenses, setEditedExpenses] = useState<Transaction[]>(expenses);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [deletedExpenseIds, setDeletedExpenseIds] = useState<string[]>([]);

  React.useEffect(() => {
    setEditedExpenses(expenses);
    setDeletedExpenseIds([]);
    if (expenses.length > 0) {
      setExpandedIndex(0);
    }
  }, [expenses]);

  const updateExpense = (index: number, field: keyof Transaction, value: any) => {
    const updated = [...editedExpenses];
    updated[index] = { ...updated[index], [field]: value };
    setEditedExpenses(updated);
  };

  const getCategoryById = (categoryId: string): Category | undefined => {
    return EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving expenses:', editedExpenses.length);
      console.log('Deleting expenses:', deletedExpenseIds.length);
      
      // Update edited expenses
      for (const expense of editedExpenses) {
        const expenseId = parseInt(expense.id);
        const categoryId = FRONTEND_TO_BACKEND_CATEGORY[expense.categoryId] || 6;
        
        console.log(`Updating expense ${expenseId}:`, {
          amount: expense.amount,
          description: expense.description,
          category_id: categoryId,
        });
        
        await expenseApi.updateExpense(expenseId, {
          amount: expense.amount,
          description: expense.description,
          category_id: categoryId,
          user_id: parseInt(user.id),
        });
      }

      // Delete removed expenses
      for (const expenseId of deletedExpenseIds) {
        console.log(`Deleting expense ${expenseId}`);
        await expenseApi.deleteExpense(parseInt(expenseId));
      }

      console.log('All changes saved successfully');
      onSave(editedExpenses);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save changes');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const removeExpense = (index: number) => {
    const expense = editedExpenses[index];
    setDeletedExpenseIds([...deletedExpenseIds, expense.id]);
    
    const updated = editedExpenses.filter((_, i) => i !== index);
    setEditedExpenses(updated);
    
    if (expandedIndex >= updated.length) {
      setExpandedIndex(Math.max(0, updated.length - 1));
    }
  };

  if (editedExpenses.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView className="flex-1" edges={['top']}>
          {/* Header */}
          <View className="px-5 py-4 border-b" style={{ borderColor: colors.border }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-black" style={{ color: colors.text }}>
                  Review Expenses
                </Text>
                <Text className="text-sm font-medium mt-1" style={{ color: colors.textSecondary }}>
                  {editedExpenses.length} expense{editedExpenses.length !== 1 ? 's' : ''} detected
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.card }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-5 py-4">
            {editedExpenses.map((expense, index) => {
              const category = getCategoryById(expense.categoryId);
              const isExpanded = expandedIndex === index;

              return (
                <View
                  key={index}
                  className="mb-4 rounded-2xl overflow-hidden"
                  style={{ backgroundColor: colors.card }}
                >
                  {/* Expense Header */}
                  <TouchableOpacity
                    onPress={() => setExpandedIndex(isExpanded ? -1 : index)}
                    className="p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: category?.color + '20' }}
                      >
                        <Ionicons
                          name={category?.icon as any || 'ellipsis-horizontal'}
                          size={24}
                          color={category?.color || colors.primary}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold" style={{ color: colors.text }}>
                          {formatAmount(expense.amount)}
                        </Text>
                        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                          {category?.name || 'Other'}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  {/* Expanded Edit Form */}
                  {isExpanded && (
                    <View className="px-4 pb-4 border-t" style={{ borderColor: colors.border }}>
                      {/* Amount Input */}
                      <View className="mt-4">
                        <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                          Amount
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-2xl font-bold mr-2" style={{ color: colors.text }}>
                            {currency.symbol}
                          </Text>
                          <TextInput
                            value={expense.amount.toString()}
                            onChangeText={(text) => {
                              const amount = parseFloat(text) || 0;
                              updateExpense(index, 'amount', amount);
                            }}
                            keyboardType="decimal-pad"
                            className="flex-1 text-2xl font-bold px-3 py-2 rounded-lg"
                            style={{
                              color: colors.text,
                              backgroundColor: colors.background,
                            }}
                          />
                        </View>
                      </View>

                      {/* Description Input */}
                      <View className="mt-4">
                        <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                          Description
                        </Text>
                        <TextInput
                          value={expense.description}
                          onChangeText={(text) => updateExpense(index, 'description', text)}
                          placeholder="Add a description..."
                          placeholderTextColor={colors.textSecondary}
                          className="px-3 py-3 rounded-lg text-base"
                          style={{
                            color: colors.text,
                            backgroundColor: colors.background,
                          }}
                          multiline
                        />
                      </View>

                      {/* Category Selection */}
                      <View className="mt-4">
                        <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                          Category
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                          {EXPENSE_CATEGORIES.map((cat) => {
                            const isSelected = expense.categoryId === cat.id;
                            return (
                              <TouchableOpacity
                                key={cat.id}
                                onPress={() => updateExpense(index, 'categoryId', cat.id)}
                                className="px-4 py-2 rounded-full flex-row items-center mr-2"
                                style={{
                                  backgroundColor: isSelected ? cat.color : colors.background,
                                }}
                              >
                                <Ionicons
                                  name={cat.icon as any}
                                  size={16}
                                  color={isSelected ? '#fff' : cat.color}
                                />
                                <Text
                                  className="ml-2 text-sm font-semibold"
                                  style={{
                                    color: isSelected ? '#fff' : colors.text,
                                  }}
                                >
                                  {cat.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>

                      {/* Delete Button */}
                      <TouchableOpacity
                        onPress={() => removeExpense(index)}
                        className="mt-4 py-3 rounded-lg flex-row items-center justify-center"
                        style={{ backgroundColor: '#ef4444' + '20' }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                        <Text className="ml-2 text-sm font-bold" style={{ color: '#ef4444' }}>
                          Remove Expense
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Actions */}
          <View className="px-5 py-4 border-t" style={{ borderColor: colors.border }}>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-4 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.card }}
              >
                <Text className="text-base font-black" style={{ color: colors.text }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-2xl overflow-hidden"
              >
                <LinearGradient
                  colors={isSaving ? ['#6b7280', '#4b5563'] : ['#8b5cf6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="py-4 items-center flex-row justify-center"
                >
                  {isSaving && <ActivityIndicator color="#fff" className="mr-2" />}
                  <Text className="text-white text-base font-black">
                    {isSaving ? 'Saving...' : `Save All (${editedExpenses.length})`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
