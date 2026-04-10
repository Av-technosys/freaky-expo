import { useColorScheme } from 'nativewind';
import { Platform, View, Text } from 'react-native';
import { AppButton } from './common/AppButton';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: 'oauth_apple',
    icon: (color: string) => (
      <FontAwesome name="apple" size={18} color={color} />
    ),
    name: 'Apple',
    hideOnAndroid: true,
  },
  {
    type: 'oauth_google',
    icon: () => (
      <AntDesign name="google" size={18} color="#DB4437" />
    ),
    name: 'Google',
  },
  {
    type: 'oauth_facebook',
    icon: () => (
      <FontAwesome name="facebook" size={18} color="#1877F2" />
    ),
    name: 'Facebook',
  },
];

export function SocialConnections() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        // if (strategy.hideOnAndroid && Platform.OS !== 'ios') return null;

        const iconColor =
          colorScheme === 'dark' ? '#fff' : '#000';

        return (
          <AppButton
            key={strategy.type}
            variant="outline"
            className="flex-row items-center justify-center h-11"
            onPress={() => {
              console.log(`Login with ${strategy.type}`);
            }}
          >
            {/* ✅ FIXED ICON BOX */}
            <View className="w-5 items-center mr-2">
              {strategy.icon(iconColor)}
            </View>

            <Text className="text-sm font-medium">
              Continue with {strategy.name}
            </Text>
          </AppButton>
        );
      })}
    </View>
  );
}