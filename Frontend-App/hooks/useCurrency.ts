import { useCallback } from 'react';
import { CURRENCIES, Currency, formatCurrency as formatCurrencyUtil } from '../constants/Currencies';
import { useSettingsStore } from '../store/settingsStore';

interface UseCurrencyReturn {
  currency: Currency;
  setCurrency: (currencyCode: string) => void;
  formatCurrency: (amount: number, showSymbol?: boolean) => string;
  formatAmount: (amount: number) => string;
  allCurrencies: Currency[];
}

export const useCurrency = (): UseCurrencyReturn => {
  const { currencyCode, updateSettings } = useSettingsStore();

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  const setCurrency = useCallback((code: string) => {
    updateSettings({ currencyCode: code });
  }, [updateSettings]);

  const formatCurrency = useCallback((amount: number, showSymbol: boolean = true) => {
    return formatCurrencyUtil(amount, currency, showSymbol);
  }, [currency]);

  const formatAmount = useCallback((amount: number) => {
    return formatCurrencyUtil(amount, currency, true);
  }, [currency]);

  return {
    currency,
    setCurrency,
    formatCurrency,
    formatAmount,
    allCurrencies: CURRENCIES,
  };
};
