import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends TouchableOpacityProps {
  variant?: 'elevated' | 'flat' | 'outlined';
  children: React.ReactNode;
  style?: ViewStyle;
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  style,
  pressable = false,
  onPress,
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const { trigger } = useHaptics();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'flat':
        return {
          backgroundColor: colors.card,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.card,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: 16,
    padding: 16,
    ...getVariantStyles(),
  };

  const handlePress = (e: any) => {
    trigger('light');
    onPress?.(e);
  };

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[cardStyle, style]}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
