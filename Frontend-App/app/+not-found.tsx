import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🤷‍♂️</Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
          }}
        >
          This screen doesn't exist.
        </Text>
        <Link
          href="/"
          style={{
            marginTop: 15,
            paddingVertical: 15,
            color: colors.primary,
            fontSize: 16,
          }}
        >
          Go to home screen!
        </Link>
      </View>
    </>
  );
}
