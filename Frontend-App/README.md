# VitTrack - Modern Expense Tracker App 💰

A professional, feature-rich expense tracking application built with React Native, Expo Router, and NativeWind.

## ✨ Features

- 🔐 **Authentication Flow** - Beautiful glassmorphism sign-in/sign-up screens
- 🎨 **Modern UI/UX** - Clean interface with smooth animations
- 🎙️ **Voice Input** - Add expenses using voice commands with NLP parsing
- 📊 **Analytics Dashboard** - Visual insights into spending patterns
- 💱 **Multi-Currency Support** - Support for 12+ currencies
- 🌍 **Multi-Language** - English, Spanish, French, German, Hindi
- 🌓 **Dark/Light Theme** - System-aware theme switching
- 💾 **Persistent Storage** - Data saved locally with AsyncStorage
- 🎯 **Budget Tracking** - Set and monitor budgets by category
- 📱 **Native Animations** - Smooth animations using Reanimated

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on your device**
   
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your physical device

## 📁 Project Structure

```
app/
├── (auth)/              # Authentication screens
│   ├── sign-in.tsx     # Login screen
│   └── sign-up.tsx     # Registration screen
├── (tabs)/             # Main app tabs
│   ├── index.tsx       # Dashboard/Home
│   ├── transactions.tsx
│   ├── analytics.tsx
│   └── profile.tsx
├── _layout.tsx         # Root navigation
└── +not-found.tsx

components/
├── ui/                 # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── CategoryIcon.tsx
└── voice/              # Voice input components
    └── VoiceInputModal.tsx

constants/
├── Colors.ts           # Theme colors
├── Categories.ts       # Expense categories
└── Currencies.ts       # Currency definitions

hooks/
├── useTheme.ts         # Theme management
├── useCurrency.ts      # Currency formatting
├── useHaptics.ts       # Haptic feedback
├── useAnalytics.ts     # Analytics calculations
└── useVoiceInput.ts    # Voice recognition

store/
├── authStore.ts        # Authentication state
├── transactionStore.ts # Transaction management
├── settingsStore.ts    # App preferences
└── budgetStore.ts      # Budget tracking

i18n/
├── index.ts            # i18n configuration
└── locales/            # Translation files
    ├── en.json
    ├── es.json
    ├── fr.json
    ├── de.json
    └── hi.json
```

## 🎯 Key Technologies

- **React Native** - Cross-platform mobile framework
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State management
- **React Native Reanimated** - Smooth animations
- **i18next** - Internationalization
- **date-fns** - Date utilities
- **Expo AV** - Audio/voice recording
- **AsyncStorage** - Local data persistence

## 🎨 UI Components

### Button Component
```tsx
<Button 
  variant="primary" 
  size="lg" 
  gradient
  loading={false}
>
  Sign In
</Button>
```

### Input Component
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  leftIcon={<Icon />}
/>
```

### Card Component
```tsx
<Card variant="elevated" pressable onPress={handlePress}>
  <Text>Card Content</Text>
</Card>
```

## 🎙️ Voice Input

The app features intelligent voice input for adding expenses:

- Natural language processing
- Automatic amount detection
- Category recognition from keywords
- Confidence scoring
- Manual editing option

Example voice commands:
- "Spent 50 dollars on groceries"
- "Paid 100 for electricity bill"
- "Bought coffee for 5 bucks"

## 🌍 Internationalization

Supported languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)

Add new languages by creating translation files in `i18n/locales/`.

## 💱 Currency Support

Supported currencies:
- USD, EUR, GBP, INR, JPY, CNY
- AUD, CAD, CHF, BRL, MXN, ZAR

Each currency includes:
- Symbol and position
- Decimal separator
- Thousand separator
- Proper formatting

## 🎨 Theming

The app supports three theme modes:
- Light mode
- Dark mode
- System (auto-switch based on OS)

Colors are automatically adjusted for better accessibility.

## 📱 Screens

### Authentication
- **Sign In** - Email/password login with social options
- **Sign Up** - Registration with password strength meter

### Main App
- **Dashboard** - Balance overview, quick stats, recent transactions
- **Transactions** - List all transactions with filters
- **Analytics** - Charts and spending insights
- **Profile** - Settings and account management
- **Voice Input** - Modal for voice-based expense entry

## 🔧 Development

### Adding a New Screen

1. Create file in `app/` directory
2. Export default component
3. Add to navigation if needed

### Adding a New Component

1. Create in `components/` with proper folder structure
2. Use TypeScript for props
3. Follow existing component patterns

### Adding Translations

1. Add keys to `i18n/locales/en.json`
2. Translate to other languages
3. Use with `t('key.path')`

## 🚀 Building for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# Both
npx expo build:all
```

## 📝 Next Steps

Features to be implemented:
- [ ] Full analytics with charts
- [ ] Complete transaction management
- [ ] Profile settings implementation
- [ ] Cloud sync
- [ ] Recurring transactions
- [ ] Export to CSV/PDF
- [ ] Category management
- [ ] Budget alerts

## 🤝 Contributing

This is a private freelance project. For questions or issues, contact the development team.

## 📄 License

Copyright © 2025 VitTrack. All rights reserved.