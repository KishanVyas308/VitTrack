import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '../../hooks/useCurrency';
import { useHaptics } from '../../hooks/useHaptics';
import { Transaction } from '../../types';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editTransaction?: Transaction;
}

// Income Categories
const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'wallet', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase', color: '#8b5cf6' },
  { id: 'investment', name: 'Investment', icon: 'trending-up', color: '#3b82f6' },
  { id: 'gift', name: 'Gift', icon: 'gift', color: '#ec4899' },
  { id: 'other_income', name: 'Other Income', icon: 'add-circle', color: '#6b7280' },
];

// Expense Categories
const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'restaurant', color: '#ef4444' },
  { id: 'transportation', name: 'Transportation', icon: 'car', color: '#3b82f6' },
  { id: 'groceries', name: 'Groceries', icon: 'cart', color: '#06b6d4' },
  { id: 'shopping', name: 'Shopping', icon: 'bag-handle', color: '#f59e0b' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#8b5cf6' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'receipt', color: '#ec4899' },
  { id: 'health', name: 'Health & Fitness', icon: 'fitness', color: '#10b981' },
  { id: 'education', name: 'Education', icon: 'school', color: '#6366f1' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-circle', color: '#6b7280' },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onSave,
  editTransaction,
}) => {
  const { trigger } = useHaptics();
  const { formatAmount } = useCurrency();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategoryId(editTransaction.categoryId);
      setDescription(editTransaction.description);
      setDate(new Date(editTransaction.date));
    } else {
      resetForm();
    }
  }, [editTransaction, visible]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategoryId('');
    setDescription('');
    setDate(new Date());
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      trigger('error');
      return;
    }

    if (!categoryId) {
      trigger('error');
      return;
    }

    trigger('success');
    onSave({
      type,
      amount: parseFloat(amount),
      categoryId,
      description: description.trim() || 'No description',
      date,
    });
    onClose();
    resetForm();
  };

  const handleCancel = () => {
    trigger('light');
    onClose();
    resetForm();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <StatusBar barStyle="light-content" />
        
        {/* Modal Container */}
        <View className="flex-1 justify-end">
          <SafeAreaView className="bg-[#1a1d29] rounded-t-3xl" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-gray-700">
              <Text className="text-white text-2xl font-black">
                {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </Text>
              <TouchableOpacity onPress={handleCancel} className="w-10 h-10 items-center justify-center">
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              className="max-h-[85vh]" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="px-5">
                {/* Transaction Type Toggle */}
                <View className="mt-5 mb-5">
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => {
                        setType('expense');
                        setCategoryId('');
                        trigger('light');
                      }}
                      className={`flex-1 py-4 rounded-2xl ${
                        type === 'expense' ? '' : 'bg-[#2d3548]'
                      }`}
                    >
                      {type === 'expense' ? (
                        <LinearGradient
                          colors={['#ef4444', '#dc2626']}
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
                        className={`text-center text-base font-bold ${
                          type === 'expense' ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        Expense
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setType('income');
                        setCategoryId('');
                        trigger('light');
                      }}
                      className={`flex-1 py-4 rounded-2xl ${
                        type === 'income' ? '' : 'bg-[#2d3548]'
                      }`}
                    >
                      {type === 'income' ? (
                        <LinearGradient
                          colors={['#10b981', '#059669']}
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
                        className={`text-center text-base font-bold ${
                          type === 'income' ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        Income
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Amount Section */}
                <View className="mb-5">
                  <Text className="text-white text-base font-bold mb-3">Amount</Text>
                  <View className="bg-[#252938] rounded-2xl px-5 py-4 flex-row items-center">
                    <Text className="text-white text-3xl font-black mr-2">$</Text>
                    <TextInput
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#6b7280"
                      className="flex-1 text-white text-3xl font-black"
                    />
                  </View>
                </View>

                {/* Category Section */}
                <View className="mb-5">
                  <Text className="text-white text-base font-bold mb-3">Category</Text>
                  <View className="flex-row flex-wrap gap-3">
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => {
                          setCategoryId(category.id);
                          trigger('light');
                        }}
                        className={`bg-[#252938] rounded-2xl p-4 flex-row items-center gap-3`}
                        style={[
                          { width: '47%' },
                          categoryId === category.id && {
                            borderWidth: 2,
                            borderColor: '#8b5cf6',
                            shadowColor: '#8b5cf6',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                            elevation: 8,
                          },
                        ]}
                      >
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center"
                          style={{ backgroundColor: `${category.color}30` }}
                        >
                          <Ionicons name={category.icon as any} size={20} color={category.color} />
                        </View>
                        <Text className="text-white text-sm font-semibold flex-1" numberOfLines={1}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Description Section */}
                <View className="mb-5">
                  <Text className="text-white text-base font-bold mb-3">Description</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description (optional)"
                    placeholderTextColor="#6b7280"
                    multiline
                    numberOfLines={3}
                    className="bg-[#252938] rounded-2xl px-5 py-4 text-white text-base"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                {/* Date Section */}
                <View className="mb-5">
                  <Text className="text-white text-base font-bold mb-3">Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(true);
                      trigger('light');
                    }}
                    className="bg-[#252938] rounded-2xl px-5 py-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={20} color="#8b5cf6" />
                      <Text className="text-white text-base font-semibold ml-3">
                        {formatDate(date)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setDate(selectedDate);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-2 mb-5">
                  <TouchableOpacity
                    onPress={handleCancel}
                    className="bg-[#252938] rounded-2xl py-4 items-center justify-center"
                    style={{ width: '35%' }}
                  >
                    <Text className="text-white text-base font-bold">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSave}
                    className="rounded-2xl py-4 items-center justify-center"
                    style={{ width: '62%' }}
                  >
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
                    <Text className="text-white text-base font-black">Save Transaction</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};
