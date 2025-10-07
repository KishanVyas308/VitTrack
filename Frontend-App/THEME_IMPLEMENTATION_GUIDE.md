# Theme Implementation Guide for VitTrack

## ✅ What Has Been Implemented

### 1. **Theme System Created**
- **Colors Constant** (`constants/Colors.ts`): Updated with proper light and dark themes
- **useTheme Hook** (`hooks/useTheme.ts`): Already existed and works with settingsStore
- **Theme Colors**: 
  - Light Theme: Clean white (#f5f5f7 background, #ffffff cards)
  - Dark Theme: Deep purple-dark (#1a1d29 background, #252938 cards)
  - Brand Purple: #8b5cf6 (consistent across both themes)

### 2. **Screens Updated**
#### ✅ Profile Screen (COMPLETE)
- Background color adapts to theme
- All card backgrounds use `colors.card`
- All text uses `colors.text`, `colors.textSecondary`, `colors.textTertiary`
- All borders use `colors.border`
- Status bar adapts (light-content for dark, dark-content for light)
- Icons use theme colors
- Theme selection modal functional

#### 🟡 Dashboard Screen (PARTIAL - needs completion)
- Theme hook imported and initialized
- Background color updated
- Header text updated
- Status bar updated
- **Needs**: Update all cards, quick stats, transaction list

## 📋 Remaining Screens to Update

### Analytics Screen (`app/(tabs)/analytics.tsx`)
**What to add:**
```typescript
import { useTheme } from '../../hooks/useTheme';

// In component:
const { colors, isDark } = useTheme();

// Updates needed:
- Main container: style={{ backgroundColor: colors.background }}
- StatusBar: barStyle={isDark ? 'light-content' : 'dark-content'}
- All Text: style={{ color: colors.text }} or colors.textSecondary
- Cards: style={{ backgroundColor: colors.card }}
- Borders: style={{ borderColor: colors.border }}
```

### Transactions Screen (`app/(tabs)/transactions.tsx`)
**What to add:**
```typescript
import { useTheme } from '../../hooks/useTheme';

// In component:
const { colors, isDark } = useTheme();

// Updates needed:
- Same pattern as Analytics
- Transaction cards background
- Filter buttons
- Category badges
```

### Explore Screen (`app/(tabs)/explore.tsx`)
**Same pattern as above**

## 🎨 Theme Color Reference

### Light Theme Colors
```typescript
{
  background: '#f5f5f7',        // Main background (light gray)
  surface: '#ffffff',            // Page surface
  card: '#ffffff',               // Card background (white)
  text: '#000000',               // Primary text (black)
  textSecondary: '#6b7280',     // Secondary text (gray)
  textTertiary: '#9ca3af',      // Tertiary text (lighter gray)
  border: '#e5e7eb',            // Borders
  primary: '#8b5cf6',           // Brand purple
  success: '#10b981',           // Green
  error: '#ef4444',             // Red
}
```

### Dark Theme Colors
```typescript
{
  background: '#1a1d29',        // Main background (deep purple-dark)
  surface: '#252938',            // Page surface
  card: '#252938',               // Card background (purple-dark)
  text: '#ffffff',               // Primary text (white)
  textSecondary: '#9ca3af',     // Secondary text (gray)
  textTertiary: '#6b7280',      // Tertiary text (darker gray)
  border: '#374151',            // Borders
  primary: '#8b5cf6',           // Brand purple (same)
  success: '#10b981',           // Green (same)
  error: '#ef4444',             // Red (same)
}
```

## 🔄 Quick Replace Pattern

For any screen, follow this pattern:

### 1. Add Import and Hook
```typescript
import { useTheme } from '../../hooks/useTheme';

const { colors, isDark } = useTheme();
```

### 2. Replace Hardcoded Colors

**Background:**
```typescript
// Before:
className="flex-1 bg-[#1a1d29]"

// After:
className="flex-1" style={{ backgroundColor: colors.background }}
```

**Card:**
```typescript
// Before:
className="bg-[#252938] rounded-2xl"

// After:
className="rounded-2xl" style={{ backgroundColor: colors.card }}
```

**Text:**
```typescript
// Before:
className="text-white text-xl"

// After:
className="text-xl" style={{ color: colors.text }}

// For secondary text:
style={{ color: colors.textSecondary }}
```

**Border:**
```typescript
// Before:
className="border-b border-gray-700"

// After:
className="border-b" style={{ borderColor: colors.border }}
```

**Status Bar:**
```typescript
// Before:
<StatusBar barStyle="light-content" />

// After:
<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
```

### 3. Update Icons
```typescript
// Before:
<Ionicons name="icon-name" size={20} color="#8b5cf6" />

// After:
<Ionicons name="icon-name" size={20} color={colors.primary} />
```

## 📝 Example: Complete Screen Update

```typescript
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function ExampleScreen() {
  const { colors, isDark } = useTheme();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView className="flex-1">
        <ScrollView>
          {/* Header */}
          <View className="px-5 pt-4 pb-6">
            <Text className="text-3xl font-black" style={{ color: colors.text }}>
              Screen Title
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Subtitle
            </Text>
          </View>

          {/* Card */}
          <View className="px-5 mb-6">
            <View className="rounded-2xl p-5" style={{ backgroundColor: colors.card }}>
              <Text className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                Card Title
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Card Content
              </Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            className="mx-5 rounded-xl p-4 items-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-bold">Button Text</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```

## 🎯 Testing Your Theme

1. **Go to Profile Screen**
2. **Tap on "Theme"**
3. **Select different options:**
   - Light Mode - Should show white background with black text
   - Dark Mode - Should show dark purple background with white text
   - System Default - Follows device settings

4. **Check all updated screens:**
   - Profile ✅ (Already done)
   - Dashboard 🟡 (Needs completion)
   - Analytics ❌ (Needs update)
   - Transactions ❌ (Needs update)
   - Explore ❌ (Needs update)

## 💡 Pro Tips

1. **Always use `colors.x` instead of hardcoded colors**
2. **Use inline `style` prop for dynamic colors** (className doesn't support dynamic values)
3. **Keep gradients purple** (LinearGradient colors stay the same)
4. **Test both themes** after making changes
5. **Icons should use theme colors** (except gradients)

## 🚀 Next Steps

1. Apply this pattern to Analytics screen
2. Apply to Transactions screen
3. Apply to Explore screen
4. Apply to any modals (AddTransaction, VoiceInput, etc.)
5. Test thoroughly in both light and dark modes

---

**Theme is now functional!** Users can switch between Light/Dark/System modes and it will persist via AsyncStorage. 🎉
