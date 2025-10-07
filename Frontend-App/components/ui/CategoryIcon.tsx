import { Ionicons } from '@expo/vector-icons';
import React, { JSX } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  color,
  size = 'md',
  showBackground = true,
}) => {
  const { colors } = useTheme();

  const sizeConfig = {
    sm: { container: 32, icon: 16 },
    md: { container: 40, icon: 20 },
    lg: { container: 56, icon: 28 },
  };

  const config = sizeConfig[size];

  // Map icon names to Expo vector icons
  const getIconComponent = () => {
    const iconColor = showBackground ? '#ffffff' : color;
    
    const iconMap: Record<string, JSX.Element> = {
      'utensils': <Ionicons name="restaurant" size={config.icon} color={iconColor} />,
      'car': <Ionicons name="car" size={config.icon} color={iconColor} />,
      'shopping-bag': <Ionicons name="bag-handle" size={config.icon} color={iconColor} />,
      'receipt': <Ionicons name="receipt" size={config.icon} color={iconColor} />,
      'film': <Ionicons name="film" size={config.icon} color={iconColor} />,
      'heart': <Ionicons name="heart" size={config.icon} color={iconColor} />,
      'book-open': <Ionicons name="book" size={config.icon} color={iconColor} />,
      'plane': <Ionicons name="airplane" size={config.icon} color={iconColor} />,
      'gift': <Ionicons name="gift" size={config.icon} color={iconColor} />,
      'more-horizontal': <Ionicons name="ellipsis-horizontal" size={config.icon} color={iconColor} />,
      'briefcase': <Ionicons name="briefcase" size={config.icon} color={iconColor} />,
      'laptop': <Ionicons name="laptop" size={config.icon} color={iconColor} />,
      'trending-up': <Ionicons name="trending-up" size={config.icon} color={iconColor} />,
      'building-2': <Ionicons name="business" size={config.icon} color={iconColor} />,
      'plus-circle': <Ionicons name="add-circle" size={config.icon} color={iconColor} />,
    };
    
    return iconMap[icon] || <Ionicons name="ellipse" size={config.icon} color={iconColor} />;
  };

  if (!showBackground) {
    return <View>{getIconComponent()}</View>;
  }

  return (
    <View
      style={{
        width: config.container,
        height: config.container,
        borderRadius: config.container / 2,
        backgroundColor: `${color}20`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: config.container - 8,
          height: config.container - 8,
          borderRadius: (config.container - 8) / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {getIconComponent()}
      </View>
    </View>
  );
};
