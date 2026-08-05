import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: 'How can i connect vendor ?',
    answer:
      'Here are the step-by-step instructions you can give for that line:\n\n1. Go to the Login Page.\n2. Click on “Forgot Password” below the login form.\n3. Enter your registered email address or phone number.\n4. Check your inbox (or SMS) for a password reset link/code.\n5. Click the link or enter the code on the reset page.\n6. Create a new password and confirm it.\n7. Click “Submit” to save your new password.\n8. Now, log in using your new password.',
  },
  {
    id: 2,
    question: 'How do i contact customer support ?',
    answer: 'You can contact customer support from Profile > Help & Support or Contact Us.',
  },
  {
    id: 3,
    question: 'What payment method do you use ?',
    answer: 'Freaky Chimp supports online payments through the available checkout methods.',
  },
  {
    id: 4,
    question: 'How do i see order history',
    answer: 'Open Profile, then go to your bookings or orders section to see order history.',
  },
  {
    id: 5,
    question: 'How do i update my profile ?',
    answer: 'Open Profile Details, edit the required fields, and tap Done.',
  },
  {
    id: 6,
    question: 'How can i connect vendor ?',
    answer: 'Use the vendor connection flow from your event or service booking journey.',
  },
];

function FAQRow({
  item,
  open,
  onOpenChange,
}: {
  item: FAQItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <View className="py-[22px]">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-[14px] font-extrabold leading-5 text-[#4a4a4a]">
            {item.id}. {item.question}
          </Text>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-9 w-9">
              {open ? (
                <ChevronUp size={20} color="#444444" strokeWidth={2.4} />
              ) : (
                <ChevronDown size={20} color="#444444" strokeWidth={2.4} />
              )}
            </Button>
          </CollapsibleTrigger>
        </View>

        <CollapsibleContent>
          <Text className="mt-4 text-[14px] font-semibold leading-[19px] text-[#6b6b6b]">
            {item.answer}
          </Text>
        </CollapsibleContent>
      </View>
      <Separator className="bg-[#d7d7d7]" />
    </Collapsible>
  );
}

export default function FAQScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<number | null>(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return FAQ_DATA;
    return FAQ_DATA.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 34,
          paddingBottom: Math.max(insets.bottom, 0) + 42,
        }}
      >
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
          className="h-8 w-8 justify-center"
        >
          <Feather name="arrow-left" size={24} color="#111111" />
        </Pressable>

        <View className="mt-[27px] h-[43px] flex-row items-center rounded-md border border-[#d0d7e2] bg-white px-4">
          <Search size={19} color="#4b5563" strokeWidth={2} />
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search your question"
            placeholderTextColor="#6f6f6f"
            className="h-[41px] flex-1 border-0 bg-transparent px-2 text-[14px] shadow-none"
          />
        </View>

        <Text className="mt-[33px] text-[22px] font-extrabold leading-7 text-black">
          Frequently Asked Questions
        </Text>

        <View className="mt-[26px]">
          {filtered.map((item) => (
            <FAQRow
              key={item.id}
              item={item}
              open={openId === item.id}
              onOpenChange={(isOpen) => setOpenId(isOpen ? item.id : null)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
