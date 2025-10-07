import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHaptics } from '../../hooks/useHaptics';

interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  name: string;
  description: string;
  icon: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    name: 'Light Mode',
    description: 'Light theme for all screens',
    icon: 'sunny',
  },
  {
    value: 'dark',
    name: 'Dark Mode',
    description: 'Dark theme for all screens',
    icon: 'moon',
  },
  {
    value: 'system',
    name: 'System Default',
    description: 'Follows system settings',
    icon: 'phone-portrait',
  },
];

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTheme: 'light' | 'dark' | 'system';
  onSelectTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  visible,
  onClose,
  selectedTheme,
  onSelectTheme,
}) => {
  const { trigger } = useHaptics();

  const handleSelectTheme = (theme: 'light' | 'dark' | 'system') => {
    trigger('light');
    onSelectTheme(theme);
    onClose();
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
          <View className="bg-[#1a1d29] rounded-t-3xl">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-gray-700">
              <Text className="text-white text-2xl font-black">Select Theme</Text>
              <TouchableOpacity
                onPress={() => {
                  trigger('light');
                  onClose();
                }}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Theme Options */}
            <View className="px-5 py-4 pb-8">
              {THEME_OPTIONS.map((theme, index) => (
                <TouchableOpacity
                  key={theme.value}
                  onPress={() => handleSelectTheme(theme.value)}
                  className={`flex-row items-center justify-between py-4 ${
                    index !== THEME_OPTIONS.length - 1 ? 'border-b border-gray-800' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    {/* Theme Icon */}
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                    >
                      <Ionicons name={theme.icon as any} size={24} color="#8b5cf6" />
                    </View>

                    {/* Theme Info */}
                    <View className="flex-1">
                      <Text className="text-white text-base font-bold mb-1">
                        {theme.name}
                      </Text>
                      <Text className="text-gray-400 text-sm font-medium">
                        {theme.description}
                      </Text>
                    </View>
                  </View>

                  {/* Selected Indicator */}
                  {selectedTheme === theme.value && (
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{ backgroundColor: '#8b5cf6' }}
                    >
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <SafeAreaView edges={['bottom']} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
