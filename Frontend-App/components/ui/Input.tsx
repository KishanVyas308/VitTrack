import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  value,
  secureTextEntry,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -8],
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.border;

  return (
    <View style={[{ marginBottom: 20 }, containerStyle]}>
      <View
        style={{
          borderWidth: 1.5,
          borderColor,
          borderRadius: 12,
          backgroundColor: colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          height: 56,
        }}
      >
        {leftIcon && <View style={{ marginRight: 12 }}>{leftIcon}</View>}
        
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={{
              position: 'absolute',
              left: 0,
              top: labelTop,
              fontSize: labelFontSize,
              color: error ? colors.error : isFocused ? colors.primary : colors.textSecondary,
              backgroundColor: colors.surface,
              paddingHorizontal: 4,
              fontWeight: '500',
            }}
          >
            {label}
          </Animated.Text>
          <TextInput
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            placeholderTextColor={colors.textTertiary}
            style={{
              color: colors.text,
              fontSize: 16,
              paddingTop: 12,
              paddingBottom: 0,
            }}
            {...props}
          />
        </View>

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={{ marginLeft: 12 }}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <Text
          style={{
            color: colors.error,
            fontSize: 12,
            marginTop: 6,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
