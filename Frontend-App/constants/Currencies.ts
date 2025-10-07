export interface Currency {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
  decimalSeparator: '.' | ',';
  thousandSeparator: ',' | '.' | ' ';
}

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandSeparator: '.',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'CHF',
    symbol: 'Fr',
    name: 'Swiss Franc',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandSeparator: '.',
  },
  {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
  {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
];

export const formatCurrency = (
  amount: number,
  currency: Currency,
  showSymbol: boolean = true
): string => {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  // Format the number with separators
  const parts = absAmount.toFixed(2).split('.');
  const integerPart = parts[0].replace(
    /\B(?=(\d{3})+(?!\d))/g,
    currency.thousandSeparator
  );
  const decimalPart = parts[1];
  
  const formattedNumber = `${integerPart}${currency.decimalSeparator}${decimalPart}`;
  
  if (!showSymbol) {
    return `${sign}${formattedNumber}`;
  }
  
  if (currency.symbolPosition === 'before') {
    return `${sign}${currency.symbol}${formattedNumber}`;
  } else {
    return `${sign}${formattedNumber}${currency.symbol}`;
  }
};

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD
