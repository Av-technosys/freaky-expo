import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';

import { userDetails, updateUserProfile } from '@/api/user';
import { toast } from '@/components/common/ToastManager';
import ProfileEditSkeleton from '@/app/skeleton/ProfileEditSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

const flag = require('@/public/flag.png');

type ProfileForm = {
  honorific: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  anniversary: string;
  profileImage?: string | null;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-[13px] font-bold text-[#1f2937]">{children}</Label>;
}

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    honorific: 'Mr.',
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    anniversary: '',
    profileImage: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userDetails();
        const data = res?.data;

        setForm((prev) => ({
          ...prev,
          name: `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim(),
          email: data?.email ?? '',
          phone: data?.number ?? '',
          birthDate: data?.birthDate ?? data?.dateOfBirth ?? '',
          anniversary: data?.anniversary ?? '',
          profileImage: data?.profileImage ?? null,
        }));
      } catch {
        toast.error('Failed to load user');
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, []);

  const displayName = useMemo(() => form.name || 'Michael Chen', [form.name]);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const [firstName = '', ...lastParts] = form.name.trim().split(/\s+/);

    try {
      setSaving(true);
      await updateUserProfile({
        firstName,
        lastName: lastParts.join(' '),
        email: form.email,
        number: form.phone,
        birthDate: form.birthDate,
        anniversary: form.anniversary,
        profileImage: form.profileImage,
      });

      toast.success('Profile updated');
      router.back();
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 px-4 pt-4">
          <ProfileEditSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 17,
          paddingTop: 34,
          paddingBottom: Math.max(insets.bottom, 0) + 42,
        }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
            className="h-8 w-8 justify-center"
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>

          <Text className="mt-[25px] text-[22px] font-extrabold leading-7 text-[#0b0b0b]">
            Profile Details
          </Text>

          <View className="mt-8 gap-5">
            <View className="gap-2">
              <FieldLabel>Name</FieldLabel>
              <View className="h-12 flex-row overflow-hidden rounded-lg border border-[#d0d7e2] bg-white">
                <Pressable className="w-[110px] flex-row items-center justify-center gap-4 border-r border-[#d0d7e2]">
                  <Text className="text-base font-medium text-[#1f2937]">{form.honorific}</Text>
                  <ChevronDown size={18} color="#667085" strokeWidth={2} />
                </Pressable>
                <Input
                  className="h-12 flex-1 border-0 bg-transparent px-4 text-base shadow-none"
                  value={displayName}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onChangeText={(text) => updateField('name', text)}
                />
              </View>
            </View>

            <View className="gap-2">
              <FieldLabel>Email address</FieldLabel>
              <Input
                className="h-12 rounded-lg border-[#d0d7e2] px-4 text-base shadow-none"
                value={form.email}
                placeholder="Enter your email"
                placeholderTextColor="#98a2b3"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                submitBehavior="submit"
                onChangeText={(text) => updateField('email', text)}
              />
            </View>

            <View className="gap-2">
              <FieldLabel>Phone number</FieldLabel>
              <View className="h-12 flex-row overflow-hidden rounded-lg border border-[#d0d7e2] bg-white">
                <Pressable className="w-[114px] flex-row items-center justify-center gap-3 border-r border-[#d0d7e2]">
                  <Image source={flag} className="h-3.5 w-5" resizeMode="cover" />
                  <Text className="text-base font-medium text-[#1f2937]">+91</Text>
                  <ChevronDown size={16} color="#667085" strokeWidth={2} />
                </Pressable>
                <Input
                  className="h-12 flex-1 border-0 bg-transparent px-4 text-base shadow-none"
                  value={form.phone}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onChangeText={(text) => updateField('phone', text)}
                />
              </View>
            </View>

            <View className="gap-2">
              <FieldLabel>Date of birth</FieldLabel>
              <Input
                className="h-12 rounded-lg border-[#d0d7e2] px-4 text-base shadow-none"
                value={form.birthDate}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#98a2b3"
                keyboardType="numbers-and-punctuation"
                returnKeyType="next"
                submitBehavior="submit"
                onChangeText={(text) => updateField('birthDate', text)}
              />
            </View>

            <View className="gap-2">
              <FieldLabel>Anniversary</FieldLabel>
              <Input
                className="h-14 rounded-lg border-[#d0d7e2] px-4 text-base shadow-none"
                value={form.anniversary}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#98a2b3"
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                onChangeText={(text) => updateField('anniversary', text)}
                onSubmitEditing={handleSave}
              />
            </View>
          </View>

          <View className="mt-auto pt-14">
            <Button
              disabled={saving}
              onPress={handleSave}
              className="h-12 w-full rounded-lg bg-[#ff6a2e]"
            >
              <Text className="text-sm font-extrabold text-white">
                {saving ? 'Saving...' : 'Done'}
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
