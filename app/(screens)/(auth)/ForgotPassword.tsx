import { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { Button } from '@/components/ui/button';
import ScreenHeader from '@/components/common/ScreenHeader';
import { forgotPassword } from '@/api/auth';
import Toast from 'react-native-toast-message';
import { Input } from '@/components/ui/input';
import Screen from '@/app/provider/Screen';


export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!username) {
      Toast.show({
        type: 'error',
        text1: 'Please enter email or phone',
      });
      return;
    }

    try {
      setLoading(true);
      await forgotPassword({ email: username });

      Toast.show({
        type: 'success',
        text1: 'OTP sent successfully',
      });

      navigation.navigate('OtpVerification', {
        email: username,
        flow: 'forgotPassword',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Forgot Password" rightType="menu" showBack={false} />

      <ScrollView className="flex-1 px-4">
        {/* LOGO */}
        <View className="items-center pt-8">
          <Image
            source={require('@/assets/images/freeky-icon.png')}
            className="h-20 w-40"
            resizeMode="contain"
          />
        </View>

        {/* TITLE */}
        <View className="items-center px-6 pt-6">
          <Text className="text-3xl font-semibold text-foreground">Forgot Password</Text>
          <Text className="pt-2 text-center text-base text-muted-foreground">
            Enter your email or phone number to receive the OTP
          </Text>
        </View>

        {/* INPUT */}
        <View className="px-2 pt-16">
          <Text className="text-md mb-2 font-medium text-muted-foreground">Email / Phone No.</Text>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Enter email or phone number"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* SEND OTP BUTTON */}
        <Button
          variant="default"
          size="lg"
          className="mt-24"
          onPress={handleSendOtp}
          disabled={loading}>
          Send OTP
        </Button>
      </ScrollView>
    </Screen>
  );
}
