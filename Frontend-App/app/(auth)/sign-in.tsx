import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';

export default function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useAuthStore();
  const { trigger } = useHaptics();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    // Reset errors
    setErrors({ email: '', password: '' });

    // Validation
    let hasErrors = false;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = t('validation.required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = t('validation.invalidEmail');
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = t('validation.required');
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      trigger('error');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      trigger('success');
      router.replace('/(tabs)');
    } catch (error) {
      trigger('error');
      setErrors({ email: '', password: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingTop: 40, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* App Logo */}
            <View className="items-center mb-10">
              <View className="mb-5">
                <LinearGradient
                  colors={['#8b5cf6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#8b5cf6',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                >
                  <Ionicons name="trending-up" size={48} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={{ color: colors.text }} className="text-4xl font-black mb-2 tracking-tight">VitTrack</Text>
              <Text style={{ color: colors.textSecondary }} className="text-base font-medium">Smart expense tracking made simple</Text>
            </View>

            {/* Form Card */}
            <View style={{ backgroundColor: colors.card }} className="rounded-3xl p-7 mb-6">
              {/* Welcome Section */}
              <View className="mb-7">
                <Text style={{ color: colors.text }} className="text-3xl font-black mb-2 tracking-tight">Welcome Back</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">Sign in to continue to your account</Text>
              </View>

              {/* Email Input */}
              <View className="mb-5">
                <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="flex-row items-center rounded-2xl px-5 py-4 border">
                  <Ionicons name="mail-outline" size={22} color={colors.textTertiary} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ color: colors.text }}
                    className="flex-1 ml-3 text-base font-medium"
                  />
                </View>
                {errors.email ? (
                  <Text className="text-red-500 text-xs mt-2 ml-2 font-semibold">{errors.email}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View className="mb-5">
                <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="flex-row items-center rounded-2xl px-5 py-4 border">
                  <Ionicons name="lock-closed-outline" size={22} color={colors.textTertiary} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={!showPassword}
                    style={{ color: colors.text }}
                    className="flex-1 ml-3 text-base font-medium"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color={colors.textTertiary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text className="text-red-500 text-xs mt-2 ml-2 font-semibold">{errors.password}</Text>
                ) : null}
              </View>

              {/* Remember Me & Forgot Password */}
              <View className="flex-row justify-between items-center mb-7">
                <TouchableOpacity
                  onPress={() => {
                    setRememberMe(!rememberMe);
                    trigger('light');
                  }}
                  className="flex-row items-center"
                >
                  <View
                    style={{ borderColor: rememberMe ? colors.primary : colors.border }}
                    className={`w-5 h-5 rounded-md border-2 ${
                      rememberMe ? 'bg-purple-500' : ''
                    } items-center justify-center mr-2`}
                  >
                    {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                  <Text style={{ color: colors.textSecondary }} className="text-sm font-semibold">Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => trigger('light')}>
                  <Text style={{ color: colors.primary }} className="text-sm font-bold">Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#8b5cf6',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Text className="text-white text-lg font-black tracking-wide">
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text style={{ color: colors.textSecondary }} className="text-base font-medium">Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  trigger('light');
                  router.push('/(auth)/sign-up');
                }}
              >
                <Text style={{ color: colors.primary }} className="text-base font-black">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
