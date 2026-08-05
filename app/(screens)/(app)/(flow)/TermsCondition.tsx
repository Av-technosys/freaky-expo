import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type Section = {
  title: string;
  paragraphs: React.ReactNode[];
};

const sections: Section[] = [
  {
    title: '1. Terms of Use',
    paragraphs: [
      <>
        1.1. The websites <Text className="text-[#4b00ff]">www.freakychimp.com</Text>{' '}
        ("Website") and mobile application ("App") are owned and operated by Freaky Chimp
        Private Limited.
      </>,
      '1.2. By accessing or using our services, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to all these terms, do not use the services.',
    ],
  },
  {
    title: '2. Account Registration',
    paragraphs: [
      '2.1. To access certain features, you must register for an account. You represent and warrant that all information you provide is accurate and current.',
      '2.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.',
    ],
  },
  {
    title: '3. Privacy Policy',
    paragraphs: [
      <>
        3.1. Your privacy is important to us. Our{' '}
        <Text className="font-extrabold text-[#4b00ff]">Privacy Policy</Text> explains how we
        collect, use, and share your personal information.
      </>,
      '3.2. By using our Services, you consent to our collection and use of personal data as outlined therein.',
    ],
  },
  {
    title: '4. Intellectual Property',
    paragraphs: [
      '4.1. All content included on the Website and App, such as text, graphics, logos, images, and software, is the property of Freaky Chimp or its content suppliers and protected by international copyright laws.',
      "4.2. The 'Freaky Chimp' name and logo are registered trademarks. You may not use these trademarks without our prior written permission.",
    ],
  },
];

function TermsSection({ section }: { section: Section }) {
  return (
    <View className="mt-8">
      <Text className="text-base font-extrabold leading-6 text-[#1f1f1f]">{section.title}</Text>
      <Separator className="mt-3 bg-[#bfc7c1]" />
      <View className="mt-4 gap-5">
        {section.paragraphs.map((paragraph, index) => (
          <Text key={index} className="text-base font-medium leading-[24px] text-[#46504d]">
            {paragraph}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function TermsConditionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 34,
          paddingBottom: Math.max(insets.bottom, 0) + 36,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/GeneralInformation'))}
            className="-ml-1 h-8 w-8 justify-center"
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>
          <Text className="ml-2 text-base font-extrabold text-[#111111]">Terms & Condition</Text>
        </View>

        <Text className="mt-[29px] text-[22px] font-extrabold leading-7 text-black">
          General Information
        </Text>

        <Text className="mt-7 text-base font-extrabold leading-6 text-[#252525]">
          Freaky Chimp Terms of Use
        </Text>

        <Text className="mt-4 text-sm font-extrabold tracking-[1.2px] text-[#46504d]">
          VERSION 1.0
        </Text>
        <Text className="mt-1 text-xs font-medium text-[#46504d]">
          Last updated: October 2023
        </Text>

        {sections.map((section) => (
          <TermsSection key={section.title} section={section} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
