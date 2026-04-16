import { useState } from 'react';
import { ScrollView, TextInput, View, Text } from 'react-native';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Feather from '@expo/vector-icons/Feather';

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: 'How do I reset my password?',
    answer:
      'Go to Login → Forgot Password → enter email → verify OTP → set new password.',
  },
  {
    id: 2,
    question: 'How do I contact support?',
    answer: 'Use Help section or email support@example.com.',
  },
  {
    id: 3,
    question: 'What payment methods are supported?',
    answer: 'UPI, Cards, Net Banking.',
  },
  {
    id: 4,
    question: 'How do I see order history?',
    answer: 'Profile → Orders section.',
  },
];

export default function FAQScreen() {
  const [search, setSearch] = useState('');

  const filtered = FAQ_DATA.filter(item => {
    if (!search.trim()) return true;

    const q = search.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
    );
  });

  return (
    <Screen scroll>
      <ScreenHeader title="FAQs" rightType="notification" showBack />

      {/* SEARCH */}
      <View className="px-2 mt-8">
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-12">
          <Feather name="search" size={18} color="#000" />
          <TextInput
            placeholder="Search your question"
            placeholderTextColor="#999"
            className="ml-3 flex-1 text-black"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <Text className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </Text>

        <View className="gap-3">
          {filtered.map(item => (
            <Collapsible key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden">

              {/* HEADER */}
              <View className="flex-row items-center justify-between px-4 py-3">
                <Text className="flex-1 pr-3 font-medium text-black">
                  {item.id}. {item.question}
                </Text>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Feather name="chevron-down" size={18} color="#000" />
                  </Button>
                </CollapsibleTrigger>
              </View>

              {/* ANSWER */}
              <CollapsibleContent className="px-4 pb-4">
                <Text className="text-gray-600 leading-5">
                  {item.answer}
                </Text>
              </CollapsibleContent>

            </Collapsible>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}