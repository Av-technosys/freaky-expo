import { Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronRight, FileText, Shield } from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';

import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type InfoItem = {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  onPress?: () => void;
};

function InfoRow({ title, icon: Icon, onPress }: InfoItem) {
  return (
    <Pressable onPress={onPress} className="h-[63px] flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Icon size={22} color="#111111" strokeWidth={1.9} />
        <Text className="ml-5 text-[14px] font-extrabold text-[#4a4a4a]">{title}</Text>
      </View>
      <ChevronRight size={24} color="#3f3f3f" strokeWidth={2.2} />
    </Pressable>
  );
}

export default function GeneralInformationScreen() {
  const insets = useSafeAreaInsets();

  const items: InfoItem[] = [
    {
      title: 'Terms & Condition',
      icon: FileText,
      onPress: () => router.navigate('/TermsCondition'),
    },
    {
      title: 'Privacy Policy',
      icon: Shield,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <View
        className="flex-1 px-4"
        style={{ paddingTop: 34, paddingBottom: Math.max(insets.bottom, 0) + 24 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
            className="-ml-1 h-8 w-8 justify-center"
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>
          <Text className="ml-2 text-base font-extrabold text-[#111111]">Settings</Text>
        </View>

        <Text className="mt-[29px] text-[22px] font-extrabold leading-7 text-black">
          General Information
        </Text>

        <View className="mt-[31px]">
          {items.map((item, index) => (
            <View key={item.title}>
              <InfoRow {...item} />
              {index !== items.length - 1 ? <Separator className="bg-[#d8d8d8]" /> : null}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
