import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';

export default function ExploreScreen() {
  const { trigger } = useHaptics();
  const { colors, isDark } = useTheme();

  const features = [
    {
      icon: 'bar-chart',
      title: 'Smart Analytics',
      description: 'Track your spending patterns and financial trends',
      color: '#8b5cf6',
    },
    {
      icon: 'wallet',
      title: 'Budget Management',
      description: 'Set and monitor budgets for different categories',
      color: '#10b981',
    },
    {
      icon: 'trending-up',
      title: 'Financial Goals',
      description: 'Set goals and track your progress over time',
      color: '#3b82f6',
    },
    {
      icon: 'notifications',
      title: 'Smart Reminders',
      description: 'Get notified about bills and spending limits',
      color: '#f59e0b',
    },
    {
      icon: 'shield-checkmark',
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely',
      color: '#ef4444',
    },
    {
      icon: 'cloud-upload',
      title: 'Cloud Sync',
      description: 'Access your data across all your devices',
      color: '#06b6d4',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <Text style={{ color: colors.text }} className="text-3xl font-black mb-2">
              Explore
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-base font-medium">
              Discover powerful features to manage your finances
            </Text>
          </View>

          {/* Hero Card */}
          <View className="px-6 mb-6">
            <View className="rounded-3xl overflow-hidden">
              <LinearGradient
                colors={['#8b5cf6', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6"
              >
                <View className="items-center py-4">
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <Ionicons name="rocket" size={40} color="#fff" />
                  </View>
                  <Text className="text-white text-2xl font-black mb-2 text-center">
                    Take Control of Your Finances
                  </Text>
                  <Text className="text-white/90 text-sm font-medium text-center">
                    VitTrack helps you understand where your money goes and make smarter financial decisions
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Features Grid */}
          <View className="px-6 mb-6">
            <Text style={{ color: colors.text }} className="text-xl font-black mb-4">
              Features
            </Text>
            <View className="gap-3">
              {features.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => trigger('light')}
                  activeOpacity={0.7}
                  style={{ backgroundColor: colors.card }}
                  className="rounded-2xl p-5"
                >
                  <View className="flex-row items-start">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <Ionicons
                        name={feature.icon as any}
                        size={24}
                        color={feature.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text style={{ color: colors.text }} className="text-base font-bold mb-1">
                        {feature.title}
                      </Text>
                      <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                        {feature.description}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textTertiary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tips Section */}
          <View className="px-6 pb-6">
            <Text style={{ color: colors.text }} className="text-xl font-black mb-4">
              Quick Tips
            </Text>
            <View style={{ backgroundColor: colors.card }} className="rounded-2xl p-5">
              <View className="flex-row items-start mb-4">
                <Ionicons name="bulb" size={24} color="#f59e0b" />
                <View className="flex-1 ml-3">
                  <Text style={{ color: colors.text }} className="text-sm font-bold mb-1">
                    Track Every Transaction
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                    The more you track, the better insights you'll get about your spending habits
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start mb-4">
                <Ionicons name="bulb" size={24} color="#f59e0b" />
                <View className="flex-1 ml-3">
                  <Text style={{ color: colors.text }} className="text-sm font-bold mb-1">
                    Set Realistic Budgets
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                    Start with your average spending and gradually optimize your budget
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Ionicons name="bulb" size={24} color="#f59e0b" />
                <View className="flex-1 ml-3">
                  <Text style={{ color: colors.text }} className="text-sm font-bold mb-1">
                    Review Weekly
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                    Take a few minutes each week to review your expenses and adjust
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
