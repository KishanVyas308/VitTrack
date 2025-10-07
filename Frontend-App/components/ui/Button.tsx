import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { useHaptics } from '../../hooks/useHaptics';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  gradient?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  gradient = false,
  disabled,
  children,
  style,
  onPress,
  ...props
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: 16, borderRadius: 8 },
    md: { height: 44, paddingHorizontal: 20, borderRadius: 10 },
    lg: { height: 52, paddingHorizontal: 24, borderRadius: 12 },
  };

  const textSizeStyles = {
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: colors.primary },
          text: { color: '#ffffff', fontWeight: '600' },
        };
      case 'secondary':
        return {
          container: { backgroundColor: colors.secondary },
          text: { color: '#ffffff', fontWeight: '600' },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
          text: { color: colors.text, fontWeight: '500' },
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.error },
          text: { color: '#ffffff', fontWeight: '600' },
        };
      case 'success':
        return {
          container: { backgroundColor: colors.success },
          text: { color: '#ffffff', fontWeight: '600' },
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: '#ffffff', fontWeight: '600' },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const buttonContainerStyle: ViewStyle = {
    ...sizeStyles[size],
    ...variantStyles.container,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || loading ? 0.5 : 1,
  };

  const buttonTextStyle: TextStyle = {
    ...textSizeStyles[size],
    ...variantStyles.text,
  };

  const handlePress = (e: any) => {
    trigger('light');
    onPress?.(e);
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[
            buttonTextStyle, 
            leftIcon ? { marginLeft: 8 } : undefined, 
            rightIcon ? { marginRight: 8 } : undefined
          ]}>
            {children}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={handlePress}
        activeOpacity={0.8}
        style={style}
        {...props}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[buttonContainerStyle, { backgroundColor: 'transparent' }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={handlePress}
      activeOpacity={0.8}
      style={[buttonContainerStyle, style]}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};
