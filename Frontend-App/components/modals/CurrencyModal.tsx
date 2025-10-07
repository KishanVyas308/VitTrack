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
import { CURRENCIES, Currency } from '../../constants/Currencies';
import { useHaptics } from '../../hooks/useHaptics';

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onSelectCurrency: (currencyCode: string) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  visible,
  onClose,
  selectedCurrency,
  onSelectCurrency,
}) => {
  const { trigger } = useHaptics();

  const handleSelectCurrency = (currency: Currency) => {
    trigger('light');
    onSelectCurrency(currency.code);
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
              <Text className="text-white text-2xl font-black">Select Currency</Text>
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

            {/* Currency List */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 500 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="px-5 pt-4 pb-4">
                {CURRENCIES.map((currency, index) => (
                  <TouchableOpacity
                    key={currency.code}
                    onPress={() => handleSelectCurrency(currency)}
                    className={`flex-row items-center justify-between py-4 ${
                      index !== CURRENCIES.length - 1 ? 'border-b border-gray-800' : ''
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      {/* Currency Icon */}
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                      >
                        <Text className="text-white text-xl font-black">{currency.symbol}</Text>
                      </View>

                      {/* Currency Info */}
                      <View className="flex-1">
                        <Text className="text-white text-base font-bold mb-1">
                          {currency.name}
                        </Text>
                        <Text className="text-gray-400 text-sm font-medium">
                          {currency.code} • {currency.symbol}
                        </Text>
                      </View>
                    </View>

                    {/* Selected Indicator */}
                    {selectedCurrency === currency.code && (
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
