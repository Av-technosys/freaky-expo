import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';

import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

const faqs = [
  {
    question: 'How do I book an event or services?',
    answer: 'Choose an event or service from the app, select your preferred options, and continue to checkout to place your booking.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'You can pay securely using the payment methods available during checkout, including saved cards where supported.',
  },
  {
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Cancellation and rescheduling options depend on your booking. Open the booking details page to view the available actions.',
  },
  {
    question: 'How do I track my booking?',
    answer: 'Open the Manage tab and select your booking to see its latest status and updates.',
  },
  {
    question: 'How do I get a refund?',
    answer: 'For eligible cancellations, your refund is processed using the original payment method. Contact support for help with a specific booking.',
  },
];

function ContactCard({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}) {
  return (
    <Pressable className="h-[112px] flex-1 items-center justify-center rounded-[10px] border border-[#eeeeee] bg-white shadow">
      <View className="h-[39px] w-[39px] items-center justify-center rounded-lg bg-[#fff4ed]">
        <Icon size={20} color="#ff5a2a" strokeWidth={1.9} />
      </View>
      <Text className="mt-2 text-center text-[14px] font-extrabold leading-4 text-[#1f2937]">
        {title}
      </Text>
      <Text className="text-center text-[13px] font-medium leading-4 text-[#98a2b3]">
        {subtitle}
      </Text>
      <View className="mt-2 h-[2px] w-5 rounded-full bg-[#ff5a2a]" />
    </Pressable>
  );
}

function SocialButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Pressable className="items-center">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#fff4ed]">
        {icon}
      </View>
      <Text className="mt-3 text-[13px] font-medium text-black">{label}</Text>
    </Pressable>
  );
}

export default function ContactUsScreen() {
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 34,
          paddingBottom: Math.max(insets.bottom, 0) + 30,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
            className="-ml-1 h-8 w-8 justify-center"
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>
          <Text className="ml-2 text-base font-extrabold text-[#111111]">Contact Us</Text>
        </View>

        <Text className="mt-[35px] text-[22px] font-extrabold leading-7 text-black">
          Need Help?
        </Text>
        <Text className="mt-1 text-sm font-medium text-[#777777]">We are here for you</Text>

        <View className="mt-[30px] flex-row gap-[14px]">
          <ContactCard title="Call Us" subtitle="+91 9859874758" icon={Phone} />
          <ContactCard title="Email Us" subtitle="support@fc.com" icon={Mail} />
          <ContactCard title="WhatsApp" subtitle="Chat Now" icon={MessageCircle} />
        </View>

        <View className="mt-[30px] h-[89px] flex-row items-center overflow-hidden bg-[#fff0e9] px-4">
          <View className="h-16 w-16 items-center justify-center">
            <Headphones size={52} color="#111111" strokeWidth={1.6} />
            <View className="absolute right-0 top-7 rounded-md bg-[#ff9d3d] px-1 py-0.5">
              <Text className="text-[9px] font-bold text-white">•••</Text>
            </View>
          </View>
          <View className="ml-5 flex-1">
            <Text className="text-base font-extrabold text-black">Still have questions?</Text>
            <Text className="mt-1 text-[15px] font-medium leading-[18px] text-[#777777]">
              Our team is here to help{'\n'}you <Text className="text-[#ff5a2a]">within 24 hours.</Text>
            </Text>
          </View>
          <View className="h-16 w-16 items-center justify-center rounded-md bg-[#ffe0ce]">
            <Mail size={37} color="#ff6a2e" strokeWidth={1.7} />
            <Send className="absolute -right-1 top-0" size={18} color="#ff7b2f" />
          </View>
        </View>

        <Text className="mt-[33px] text-[18px] font-extrabold text-black">FAQs</Text>

        <View className="mt-[21px]">
          {faqs.map((faq, index) => {
            const expanded = expandedFaq === index;

            return (
            <View key={faq.question}>
              <Pressable
                onPress={() => setExpandedFaq(expanded ? null : index)}
                className="min-h-[58px] flex-row items-center justify-between py-4"
              >
                <Text className="flex-1 pr-3 text-[14px] font-extrabold leading-5 text-[#4a4a4a]">
                  {index + 1}. {faq.question}
                </Text>
                {expanded ? (
                  <ChevronUp size={21} color="#444444" strokeWidth={2.4} />
                ) : (
                  <ChevronDown size={21} color="#444444" strokeWidth={2.4} />
                )}
              </Pressable>
              {expanded ? <Text className="pb-4 text-[14px] leading-5 text-[#777777]">{faq.answer}</Text> : null}
              {index !== faqs.length - 1 ? <Separator className="bg-[#d8d8d8]" /> : null}
            </View>
            );
          })}
        </View>

        <Text className="mt-[39px] text-base font-extrabold text-black">Follow Us On</Text>

        <View className="mt-[25px] flex-row items-start justify-center gap-[30px]">
          <SocialButton label="Instagram" icon={<Instagram size={24} color="#ff5a2a" strokeWidth={2} />} />
          <View className="mt-4 h-11 w-[1px] bg-[#d8d8d8]" />
          <SocialButton label="Facebook" icon={<Text className="text-[28px] font-extrabold text-[#ff5a2a]">f</Text>} />
          <View className="mt-4 h-11 w-[1px] bg-[#d8d8d8]" />
          <SocialButton label="Linkedin" icon={<Linkedin size={24} color="#ff5a2a" strokeWidth={2} />} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
