import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY } from '../constants/Currencies';
import { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  currencyCode: DEFAULT_CURRENCY.code,
  firstDayOfWeek: 1, // Monday
  notifications: true,
  haptics: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },

      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
