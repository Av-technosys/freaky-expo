import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type ViewMode = 'topics' | 'account' | 'article';

type Topic = {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  onPress?: () => void;
};

const accountQuestions = [
  'I want to change my phone number',
  'Where can I check my saved addresses?',
  'I want to change my email address',
  'Where can I see my saved payment details?',
];

function HelpHeader({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-row items-center">
      <Pressable onPress={onBack} className="-ml-1 h-8 w-8 justify-center">
        <Feather name="arrow-left" size={24} color="#111111" />
      </Pressable>
      <Text className="ml-2 text-base font-extrabold text-[#111111]">Help</Text>
    </View>
  );
}

function Row({
  title,
  icon: Icon,
  onPress,
}: {
  title: string;
  icon?: Topic['icon'];
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="h-[63px] flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center">
        {Icon ? <Icon size={22} color="#5f6b7a" strokeWidth={1.8} /> : null}
        <Text className={`${Icon ? 'ml-5' : ''} text-base font-extrabold text-[#555555]`}>
          {title}
        </Text>
      </View>
      <ChevronRight size={24} color="#3f3f3f" strokeWidth={2.2} />
    </Pressable>
  );
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<ViewMode>('topics');

  const topics: Topic[] = [
    { title: 'Account', icon: UserRound, onPress: () => setMode('account') },
    { title: 'Getting started with FC', icon: Building2 },
    { title: 'Payment  Methods', icon: FileText },
  ];

  const handleBack = () => {
    if (mode === 'article') {
      setMode('account');
      return;
    }
    if (mode === 'account') {
      setMode('topics');
      return;
    }
    router.canGoBack() ? router.back() : router.replace('/Profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <View
        className="flex-1 px-4"
        style={{ paddingTop: 34, paddingBottom: Math.max(insets.bottom, 0) + 21 }}
      >
        <HelpHeader onBack={handleBack} />

        {mode === 'topics' ? (
          <>
            <Text className="mt-[29px] text-[22px] font-extrabold leading-7 text-black">
              All topics
            </Text>

            <View className="mt-[31px]">
              {topics.map((topic, index) => (
                <View key={topic.title}>
                  <Row {...topic} />
                  {index !== topics.length - 1 ? <Separator className="bg-[#d8d8d8]" /> : null}
                </View>
              ))}
            </View>
          </>
        ) : null}

        {mode === 'account' ? (
          <>
            <Text className="mt-[29px] text-[22px] font-extrabold leading-7 text-black">
              Account
            </Text>

            <View className="mt-[31px]">
              {accountQuestions.map((question, index) => (
                <View key={question}>
                  <Row title={question} onPress={() => setMode('article')} />
                  {index !== accountQuestions.length - 1 ? (
                    <Separator className="bg-[#d8d8d8]" />
                  ) : null}
                </View>
              ))}
            </View>
          </>
        ) : null}

        {mode === 'article' ? (
          <View className="flex-1">
            <Text className="mt-[29px] text-[22px] font-extrabold leading-[29px] text-black">
              Where can I check my saved{'\n'}addresses?
            </Text>

            <Text className="mt-[30px] text-base font-medium leading-[23px] text-[#555555]">
              You can check your saved addresses using the following ways:
            </Text>

            <View className="mt-[28px] gap-[27px]">
              <Text className="text-base font-medium leading-[23px] text-[#555555]">
                1. While selecting the location on the app{'\n'}    homescreen
              </Text>
              <Text className="text-base font-medium leading-[23px] text-[#555555]">
                2. Check address on the checkout screen{'\n'}    before making payment
              </Text>
            </View>

            <Text className="mt-[28px] text-base font-medium leading-[23px] text-[#555555]">
              Alternatively, you can also click on the below link to check all saved addresses:
            </Text>

            <Button
              className="mt-[29px] h-12 w-40 rounded-lg bg-[#ff6a2e]"
              onPress={() => router.navigate('/AddressManagementScreen')}
            >
              <Text className="text-base font-extrabold text-white">My addresses</Text>
            </Button>

            <View className="mt-auto h-[68px] flex-row items-center justify-between rounded-md bg-[#f1f5f9] px-6">
              <Text className="text-[13px] font-extrabold text-[#697386]">
                Was this article helpful?
              </Text>
              <View className="flex-row items-center gap-7">
                <ThumbsDown size={22} color="#98a2b3" strokeWidth={1.9} />
                <ThumbsUp size={22} color="#98a2b3" strokeWidth={1.9} />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
