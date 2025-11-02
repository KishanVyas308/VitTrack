import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
} from 'react-native-reanimated';
import { VoiceInputModal } from '../../components/voice/VoiceInputModal';
import { ExpenseReviewModal } from '../../components/voice/ExpenseReviewModal';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';
import { Transaction } from '../../types';

export default function TabLayout() {
  const { t } = useTranslation();
  const { trigger } = useHaptics();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [pendingExpenses, setPendingExpenses] = useState<Transaction[]>([]);
  const [lastTransactionCount, setLastTransactionCount] = useState(0);

  const pulseAnimation = useSharedValue(1);

  // Detect new transactions from voice input
  useEffect(() => {
    // When voice modal opens, capture the current transaction count as baseline
    if (voiceModalVisible) {
      console.log('Voice modal opened, setting baseline count:', transactions.length);
      setLastTransactionCount(transactions.length);
      return;
    }

    // Check if new transactions were added (after voice modal closes)
    if (transactions.length > lastTransactionCount && !voiceModalVisible) {
      const newExpenses = transactions.slice(0, transactions.length - lastTransactionCount);
      console.log('New expenses detected:', newExpenses.length, 'total:', transactions.length, 'baseline:', lastTransactionCount);
      setPendingExpenses(newExpenses);
      setReviewModalVisible(true);
      setLastTransactionCount(transactions.length);
    }
  }, [transactions.length, lastTransactionCount, voiceModalVisible]);

  React.useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withSpring(1.05, { damping: 2, stiffness: 100 }),
        withSpring(1, { damping: 2, stiffness: 100 })
      ),
      -1,
      false
    );
  }, []);

  const handleVoiceComplete = async () => {
    console.log('Voice modal closing, waiting for new expenses...');
    setVoiceModalVisible(false);
    // Transactions will be automatically detected by the useEffect above
  };

  const handleSaveEdits = async (updatedExpenses: Transaction[]) => {
    console.log('Saving edited expenses:', updatedExpenses.length);
    setReviewModalVisible(false);
    setPendingExpenses([]);
    
    // Refresh to get updated data from backend
    if (user?.id) {
      console.log('Refreshing transactions after edit...');
      await fetchTransactions(parseInt(user.id));
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'ios' ? 85 : 70,
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 10,
            paddingHorizontal: 8,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center">
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
          listeners={{
            tabPress: () => {
              trigger('light');
            },
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center">
                <Ionicons
                  name={focused ? 'list' : 'list-outline'}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
          listeners={{
            tabPress: () => {
              trigger('light');
            },
          }}
        />
        <Tabs.Screen
          name="voice"
          options={{
            title: '',
            tabBarIcon: () => (
              <Animated.View style={[{ marginTop: -35 }, pulseStyle]}>
                <TouchableOpacity
                  onPress={() => {
                    trigger('medium');
                    setVoiceModalVisible(true);
                  }}
                  activeOpacity={0.85}
                  className="items-center justify-center"
                >
                  <LinearGradient
                    colors={['#8b5cf6', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 32.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 5,
                      borderColor: colors.card,
                      shadowColor: '#8b5cf6',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.5,
                      shadowRadius: 12,
                      elevation: 12,
                    }}
                  >
                    <Ionicons name="mic" size={28} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center">
                <Ionicons
                  name={focused ? 'bar-chart' : 'bar-chart-outline'}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
          listeners={{
            tabPress: () => {
              trigger('light');
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center justify-center">
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
          listeners={{
            tabPress: () => {
              trigger('light');
            },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <VoiceInputModal
        visible={voiceModalVisible}
        onClose={handleVoiceComplete}
        onSave={handleVoiceComplete}
      />

      <ExpenseReviewModal
        visible={reviewModalVisible}
        expenses={pendingExpenses}
        onClose={() => {
          setReviewModalVisible(false);
          setPendingExpenses([]);
        }}
        onSave={handleSaveEdits}
      />
    </>
  );
}
