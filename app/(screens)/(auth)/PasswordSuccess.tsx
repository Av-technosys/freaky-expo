// app/(auth)/password-success.tsx

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { SuccessScreen } from '@/components/success-screen';
import { useRouter } from 'expo-router';

export default function PasswordSuccessScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScreenHeader title="Password Updated" showBack />

      <SuccessScreen
        title="Congratulations 🎉"
        description="Your password has been updated successfully."
        buttonText="Continue"
        onPress={() => {
          router.replace('/login');
        }}
      />
    </Screen>
  );
}