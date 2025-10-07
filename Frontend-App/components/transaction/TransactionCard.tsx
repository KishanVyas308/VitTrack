import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { ALL_CATEGORIES } from '../../constants/Categories';
import { useCurrency } from '../../hooks/useCurrency';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';
import { Transaction } from '../../types';
import { CategoryIcon } from '../ui/CategoryIcon';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete?: () => void;
  onEdit?: () => void;
  onPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onDelete,
  onEdit,
  onPress,
}) => {
  const { colors } = useTheme();
  const { formatAmount } = useCurrency();
  const { trigger } = useHaptics();
  
  const translateX = useSharedValue(0);
  const category = ALL_CATEGORIES.find((c) => c.id === transaction.categoryId);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateX = event.translationX;
      if (newTranslateX < 0 && newTranslateX > -150) {
        translateX.value = newTranslateX;
      } else if (newTranslateX > 0 && newTranslateX < 150) {
        translateX.value = newTranslateX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -75) {
        // Swipe left - show delete
        translateX.value = withSpring(-75);
        runOnJS(trigger)('light');
      } else if (event.translationX > 75) {
        // Swipe right - show edit
        translateX.value = withSpring(75);
        runOnJS(trigger)('light');
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleDelete = () => {
    trigger('warning');
    translateX.value = withSpring(0);
    onDelete?.();
  };

  const handleEdit = () => {
    trigger('light');
    translateX.value = withSpring(0);
    onEdit?.();
  };

  return (
    <View style={{ marginBottom: 12, position: 'relative' }}>
      {/* Action Buttons Background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {/* Edit Button */}
        <TouchableOpacity
          onPress={handleEdit}
          style={{
            width: 75,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            width: 75,
            backgroundColor: colors.error,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Transaction Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={() => {
              trigger('light');
              onPress?.();
            }}
            activeOpacity={0.9}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Category Icon */}
            {category && (
              <CategoryIcon
                icon={category.icon}
                color={category.color}
                size="md"
              />
            )}

            {/* Transaction Details */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {transaction.description}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  {category?.name || 'Other'}
                </Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.textTertiary,
                  }}
                />
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  {format(new Date(transaction.date), 'MMM d, h:mm a')}
                </Text>
              </View>
            </View>

            {/* Amount */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color:
                    transaction.type === 'income'
                      ? colors.income
                      : colors.expense,
                }}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatAmount(transaction.amount)}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
