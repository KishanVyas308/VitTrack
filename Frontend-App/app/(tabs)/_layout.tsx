import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
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
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';

export default function TabLayout() {
  const { t } = useTranslation();
  const { trigger } = useHaptics();
  const { colors } = useTheme();
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const pulseAnimation = useSharedValue(1);

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
        onClose={() => setVoiceModalVisible(false)}
        onSave={(data) => {
          setVoiceModalVisible(false);
          // Handle save transaction
        }}
      />
    </>
  );
}
