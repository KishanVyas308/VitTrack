import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHaptics } from '../../hooks/useHaptics';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (languageCode: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const { trigger } = useHaptics();

  const handleSelectLanguage = (language: Language) => {
    trigger('light');
    onSelectLanguage(language.code);
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
          <View className="bg-[#1a1d29] rounded-t-3xl" style={{ maxHeight: '80%' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-gray-700">
              <Text className="text-white text-2xl font-black">Select Language</Text>
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

            {/* Language List */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 500 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="px-5 pt-4 pb-4">
                {LANGUAGES.map((language, index) => (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => handleSelectLanguage(language)}
                    className={`flex-row items-center justify-between py-4 ${
                      index !== LANGUAGES.length - 1 ? 'border-b border-gray-800' : ''
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      {/* Flag Icon */}
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                      >
                        <Text className="text-3xl">{language.flag}</Text>
                      </View>

                      {/* Language Info */}
                      <View className="flex-1">
                        <Text className="text-white text-base font-bold mb-1">
                          {language.name}
                        </Text>
                        <Text className="text-gray-400 text-sm font-medium">
                          {language.nativeName}
                        </Text>
                      </View>
                    </View>

                    {/* Selected Indicator */}
                    {selectedLanguage === language.code && (
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
            </ScrollView>
            
            <SafeAreaView edges={['bottom']} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
