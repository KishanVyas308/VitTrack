import { useColorScheme as useNativeColorScheme } from 'react-native';
import { Colors, ColorScheme, ThemeColors } from '../constants/Colors';
import { useSettingsStore } from '../store/settingsStore';

interface UseThemeReturn {
  theme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const systemColorScheme = useNativeColorScheme();
  const { theme: themeSetting, updateSettings } = useSettingsStore();

  const theme: ColorScheme = 
    themeSetting === 'system' 
      ? (systemColorScheme || 'light')
      : themeSetting;

  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const isDark = theme === 'dark';

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: newTheme });
  };

  const toggleTheme = () => {
    const currentTheme = themeSetting === 'system' ? systemColorScheme || 'light' : themeSetting;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  return {
    theme,
    colors,
    isDark,
    setTheme,
    toggleTheme,
  };
};
