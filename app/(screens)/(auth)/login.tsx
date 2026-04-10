import { SignInForm } from '@/components/sign-in-form';
import ScreenHeader from '@/components/common/ScreenHeader';
import Screen from '@/app/provider/Screen';

export default function LoginScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Login" showBack />
      <SignInForm />
    </Screen>
  );
}
