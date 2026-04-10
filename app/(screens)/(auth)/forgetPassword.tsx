// import { useState } from 'react';
// import { View, Text, Image, ScrollView } from 'react-native';
// import Toast from 'react-native-toast-message';
// import { useRouter } from 'expo-router';

// import { Button } from '@/components/ui/button';
// import ScreenHeader from '@/components/common/ScreenHeader';
// import { forgotPassword } from '@/api/auth';
// import { Input } from '@/components/ui/input';
// import Screen from '@/app/provider/Screen';

// export default function ForgotPasswordScreen() {
//   const router = useRouter();
//   const [username, setUsername] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendOtp = async () => {
//     if (!username) {
//       Toast.show({ type: 'error', text1: 'Please enter email or phone' });
//       return;
//     }

//     try {
//       setLoading(true);
//       await forgotPassword({ email: username });

//       Toast.show({ type: 'success', text1: 'OTP sent successfully' });

//       router.push({
//         pathname: '/otpVerification',
//         params: { email: username, flow: 'forgotPassword' },
//       });
//     } catch {
//       Toast.show({ type: 'error', text1: 'Something went wrong', text2: 'Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Screen scroll>
//       <ScreenHeader title="Forgot Password" rightType="menu" showBack={false} />

//       <ScrollView className="flex-1 px-4">
//         {/* LOGO */}
//         <View className="items-center pt-8">
//           <Image
//             source={require('@/assets/images/freeky-icon.png')}
//             className="h-20 w-40"
//             resizeMode="contain"
//           />
//         </View>

//         {/* TITLE */}
//         <View className="items-center px-6 pt-6">
//           <Text className="text-3xl font-semibold text-foreground">Forgot Password</Text>
//           <Text className="pt-2 text-center text-base text-muted-foreground">
//             Enter your email or phone number to receive the OTP
//           </Text>
//         </View>

//         {/* INPUT */}
//         <View className="px-2 pt-16">
//           <Text className="text-md mb-2 font-medium text-muted-foreground">Email / Phone No.</Text>
//           <Input
//             value={username}
//             onChangeText={setUsername}
//             placeholder="Enter email or phone number"
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         {/* SEND OTP BUTTON */}
//         <Button
//           variant="default"
//           size="lg"
//           className="mt-24"
//           onPress={handleSendOtp}
//           disabled={loading}>
//           Send OTP
//         </Button>
//       </ScrollView>
//     </Screen>
//   );
// }


// app/(auth)/forgot-password.tsx

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { ForgotPasswordForm } from '@/components/forgot-password-form';

export default function ForgotPasswordScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Forgot Password" showBack />
      <ForgotPasswordForm />
    </Screen>
  );
}