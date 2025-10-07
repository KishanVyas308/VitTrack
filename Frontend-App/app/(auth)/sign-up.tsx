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

export default function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp } = useAuthStore();
  const { trigger } = useHaptics();
  const { colors, isDark } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    setErrors({ fullName: '', email: '', password: '', confirmPassword: '', terms: '' });

    let hasErrors = false;
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '', terms: '' };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      trigger('error');
      return;
    }

    setLoading(true);
    try {
      await signUp(fullName, email, password);
      trigger('success');
      router.replace('/(tabs)');
    } catch (error) {
      trigger('error');
      setErrors({ ...newErrors, email: 'This email is already registered' });
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
            <View className="items-center mb-8">
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
              <Text style={{ color: colors.textSecondary }} className="text-base font-medium">Start your financial journey with VitTrack</Text>
            </View>

            {/* Form Card */}
            <View style={{ backgroundColor: colors.card }} className="rounded-3xl p-7 mb-6">
              {/* Header Section */}
              <View className="mb-7">
                <Text style={{ color: colors.text }} className="text-3xl font-black mb-2 tracking-tight">Create Account</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">Fill in your details to get started</Text>
              </View>

              {/* Full Name Input */}
              <View className="mb-5">
                <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="flex-row items-center rounded-2xl px-5 py-4 border">
                  <Ionicons name="person-outline" size={22} color={colors.textTertiary} />
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textTertiary}
                    style={{ color: colors.text }}
                    className="flex-1 ml-3 text-base font-medium"
                  />
                </View>
                {errors.fullName ? (
                  <Text className="text-red-500 text-xs mt-2 ml-2 font-semibold">{errors.fullName}</Text>
                ) : null}
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
                    placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <View className="mb-5">
                <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="flex-row items-center rounded-2xl px-5 py-4 border">
                  <Ionicons name="lock-closed-outline" size={22} color={colors.textTertiary} />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={!showConfirmPassword}
                    style={{ color: colors.text }}
                    className="flex-1 ml-3 text-base font-medium"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color={colors.textTertiary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text className="text-red-500 text-xs mt-2 ml-2 font-semibold">{errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* Terms & Conditions */}
              <View className="mb-7">
                <TouchableOpacity
                  onPress={() => {
                    setAcceptTerms(!acceptTerms);
                    trigger('light');
                  }}
                  className="flex-row items-start"
                >
                  <View
                    style={{ borderColor: acceptTerms ? colors.primary : colors.border }}
                    className={`w-5 h-5 rounded-md border-2 ${
                      acceptTerms ? 'bg-purple-500' : ''
                    } items-center justify-center mr-2 mt-0.5`}
                  >
                    {acceptTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                  <Text style={{ color: colors.textSecondary }} className="text-sm flex-1 font-medium">
                    I agree to the{' '}
                    <Text style={{ color: colors.primary }} className="font-bold">Terms and Conditions</Text>
                    {' '}and{' '}
                    <Text style={{ color: colors.primary }} className="font-bold">Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
                {errors.terms ? (
                  <Text className="text-red-500 text-xs mt-2 ml-2 font-semibold">{errors.terms}</Text>
                ) : null}
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                onPress={handleSignUp}
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center">
              <Text style={{ color: colors.textSecondary }} className="text-base font-medium">Already have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  trigger('light');
                  router.push('/(auth)/sign-in');
                }}
              >
                <Text style={{ color: colors.primary }} className="text-base font-black">Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
