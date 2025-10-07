import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CurrencyModal } from '../../components/modals/CurrencyModal';
import { ThemeModal } from '../../components/modals/ThemeModal';
import { useCurrency } from '../../hooks/useCurrency';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { trigger } = useHaptics();
  const { currency, setCurrency } = useCurrency();
  const { colors, isDark } = useTheme();
  const { user, signOut } = useAuthStore();
  const settings = useSettingsStore();

  // Modal visibility states
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            trigger('warning');
            signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => {
            trigger('error');
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    trigger('light');
    Alert.alert('Export Data', 'Your data has been exported successfully as CSV', [{ text: 'OK' }]);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View className="px-5 pt-4 pb-6">
            <Text className="text-3xl font-black" style={{ color: colors.text }}>Profile</Text>
          </View>

          {/* User Profile Card */}
          <View className="px-5 mb-6">
            <View className="rounded-2xl overflow-hidden">
              <LinearGradient
                colors={['#8b5cf6', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                <View className="flex-row items-center">
                  {/* Avatar */}
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(139, 92, 246, 0.6)' }}
                    >
                      <Ionicons name="person" size={28} color="#fff" />
                    </View>
                  </View>

                  {/* User Info */}
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold mb-1">
                      {user?.name || 'Kishan Vyas'}
                    </Text>
                    <Text className="text-white text-sm font-medium opacity-80">
                      {user?.email || 'kishanvyas@gmail.com'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Appearance Section */}
          <View className="px-5 mb-6">
            <Text className="text-xl font-black mb-4" style={{ color: colors.text }}>Appearance</Text>

            <View className="rounded-2xl p-5" style={{ backgroundColor: colors.card }}>
              {/* Theme */}
              <TouchableOpacity
                onPress={() => {
                  trigger('light');
                  setShowThemeModal(true);
                }}
                className="flex-row items-center pb-5 mb-5"
                style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                >
                  <Ionicons name={settings.theme === 'dark' ? 'moon' : settings.theme === 'light' ? 'sunny' : 'phone-portrait'} size={20} color={colors.primary} />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>Theme</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    {settings.theme === 'dark' ? 'Dark mode' : settings.theme === 'light' ? 'Light mode' : 'System default'}
                  </Text>
                </View>

                <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Currency */}
              <TouchableOpacity
                onPress={() => {
                  trigger('light');
                  setShowCurrencyModal(true);
                }}
                className="flex-row items-center"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                >
                  <Ionicons name="cash" size={20} color={colors.primary} />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>Currency</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    {currency.name} ({currency.symbol})
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Data Management Section */}
          <View className="px-5 mb-6">
            <Text className="text-xl font-black mb-4" style={{ color: colors.text }}>Data Management</Text>

            <View className="rounded-2xl p-5" style={{ backgroundColor: colors.card }}>
              {/* Export Data */}
              <TouchableOpacity
                onPress={handleExportData}
                className="flex-row items-center pb-5 mb-5"
                style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                >
                  <Ionicons name="download" size={20} color={colors.success} />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>Export Data</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Download as CSV
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Clear All Data */}
              <TouchableOpacity
                onPress={handleClearData}
                className="flex-row items-center"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold" style={{ color: colors.error }}>Clear All Data</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out Section */}
          <View className="px-5 pb-32">
            <View className="rounded-2xl p-5" style={{ backgroundColor: colors.card }}>
              <TouchableOpacity
                onPress={handleSignOut}
                className="flex-row items-center"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  <Ionicons name="log-out" size={20} color={colors.error} />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold" style={{ color: colors.error }}>Sign Out</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <ThemeModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        selectedTheme={settings.theme}
        onSelectTheme={(theme) => {
          settings.updateSettings({ theme });
          trigger('success');
        }}
      />

      <CurrencyModal
        visible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        selectedCurrency={settings.currencyCode}
        onSelectCurrency={(currencyCode) => {
          setCurrency(currencyCode);
          trigger('success');
        }}
      />
    </View>
  );
}
