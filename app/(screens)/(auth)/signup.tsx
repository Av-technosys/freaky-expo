// import React, { useState } from 'react';
// import { View, Text, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message';

// import Screen from '@/app/provider/Screen';
// import ScreenHeader from '@/components/common/ScreenHeader';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Signup } from '@/api';
// import { loginSuccess } from '@/store/slices/authSlice';

// export default function SignUpScreen() {
//   const navigation = useNavigation<any>();
//   const dispatch = useDispatch();

//   const [secure, setSecure] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   const onChange = (key: keyof typeof form, value: string) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   const handleSignup = async () => {
//     await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
//     const { name, phone, email, password } = form;

//     if (!name || !phone || !email || !password) {
//       Toast.show({ type: 'error', text1: 'Please fill in all fields' });
//       return;
//     }
//     if (password.length < 6) {
//       Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
//       return;
//     }

//     const payload = {
//       full_name: name,
//       email,
//       number: `+91${phone}`,
//       password,
//     };

//     try {
//       setLoading(true);
//       const res = await Signup(payload);

//       Toast.show({ type: 'success', text1: 'Signup successful. Please verify OTP' });

//       navigation.getParent()?.navigate('AuthStack', {
//         screen: 'OtpVerification',
//         params: { flow: 'signup', email: payload.email },
//       });
//     } catch (error: any) {
//       const apiErrorMessage = error?.response?.data?.error || '';
//       Toast.show({
//         type: 'error',
//         text1: apiErrorMessage || 'Signup failed. Please try again.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Screen scroll>
//       <ScreenHeader title="Sign Up" showBack />

//       {/* LOGO */}
//       <View className="items-center mt-6">
//         <Image
//           source={require('@/assets/images/freeky-icon.png')}
//           className="w-64 h-28"
//           resizeMode="contain"
//         />
//       </View>

//       {/* FORM */}
//       <View className="mt-8 space-y-6 px-2">
//         <Input
//           value={form.name}
//           onChangeText={v => onChange('name', v)}
//           placeholder="Enter your name"
//         />

//         <Input
//           value={form.phone}
//           onChangeText={v => onChange('phone', v)}
//           placeholder="Phone number"
//           keyboardType="phone-pad"
//         />

//         <Input
//           value={form.email}
//           onChangeText={v => onChange('email', v)}
//           placeholder="name@example.com"
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <Input
//           value={form.password}
//           onChangeText={v => onChange('password', v)}
//           placeholder="********"
//           secureTextEntry={secure}
//         />
//       </View>

//       {/* SIGN UP BUTTON */}
//       <Button
//         variant="default"
//         size="lg"
//         className="mt-24 mb-4"
//         disabled={loading}
//         onPress={handleSignup}
//       >
//         {loading ? 'Signing up…' : 'Sign Up'}
//       </Button>
//     </Screen>
//   );
// }


import { SignUpForm } from '@/components/sign-up-form';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

export default function SignUpScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Sign Up" showBack />
      <SignUpForm />
    </Screen>
  );
}