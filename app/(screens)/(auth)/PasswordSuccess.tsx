import React from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/button';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

export default function PasswordSuccessScreen() {
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    Toast.show({ type: 'success', text1: 'Welcome back!' });
    navigation.getParent()?.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <Screen>
      <ScreenHeader title="Password Updated" showBack={false} />

      {/* CONTENT */}
      <View className="flex-1 justify-center items-center px-6">
        {/* LOGO */}
        <Image
          source={require('@/assets/images/freeky-icon.png')}
          resizeMode="contain"
          className="w-64 h-28 mb-10"
        />

        {/* MESSAGE */}
        <Text className="text-2xl font-semibold text-foreground text-center mb-3">
          Congratulations, Piyush
        </Text>
        <Text className="text-muted-foreground text-center text-base leading-6 px-6">
          Your password has been updated successfully.
        </Text>
      </View>

      {/* BUTTON */}
      <Button
        variant="default"
        size="lg"
        className="mb-10"
        onPress={handleContinue}
      >
        Continue
      </Button>
    </Screen>
  );
}
