import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Check, ChevronRight, CreditCard, X } from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

export default function ManagePaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const closeSheet = () => setSheetOpen(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      <View className="flex-1" style={{ paddingTop: 34 }}>
        <View className="px-4">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
              className="-ml-1 h-8 w-8 justify-center"
            >
              <Feather name="arrow-left" size={24} color="#111111" />
            </Pressable>
            <Text className="ml-2 text-base font-extrabold text-[#111111]">
              Manage Payment Methods
            </Text>
          </View>
        </View>

        <View className="mt-[19px] h-[7px] bg-[#f4f4f4]" />

        <View className="px-[18px] pt-[27px]">
          <Text className="text-[14px] font-medium leading-[19px] text-[#666666]">
            We will debit ₹1 to verify a new payment method. This will be refunded after
            verification
          </Text>

          <Text className="mt-[29px] text-[22px] font-extrabold leading-7 text-black">
            Cards
          </Text>

          <Pressable
            onPress={() => setSheetOpen(true)}
            className="mt-[22px] h-[49px] flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <CreditCard size={20} color="#111111" strokeWidth={1.8} />
              <Text className="ml-6 text-base font-extrabold text-[#4a4a4a]">Add a card</Text>
            </View>
            <ChevronRight size={24} color="#3f3f3f" strokeWidth={2.2} />
          </Pressable>

          <Separator className="bg-[#d8d8d8]" />
        </View>
      </View>

      <Modal visible={sheetOpen} transparent animationType="fade" onRequestClose={closeSheet}>
        <View className="flex-1 justify-end bg-black/45">
          <Pressable
            onPress={closeSheet}
            className="absolute right-4 h-9 w-9 items-center justify-center rounded-full bg-white"
            style={{ bottom: 366 + Math.max(insets.bottom, 0) }}
          >
            <X size={24} color="#8a8a8a" strokeWidth={3} />
          </Pressable>

          <View
            className="rounded-t-xl bg-white px-4 pt-6"
            style={{ paddingBottom: Math.max(insets.bottom, 0) + 46 }}
          >
            <Text className="text-[22px] font-extrabold leading-7 text-black">Add new card</Text>

            <View className="mt-6 h-12 flex-row items-center rounded-md border border-[#d0d7e2] px-3">
              <CreditCard size={18} color="#111111" strokeWidth={1.8} />
              <Input
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="Card Number"
                placeholderTextColor="#c8cdd6"
                keyboardType="number-pad"
                className="h-[46px] flex-1 border-0 bg-transparent px-4 text-base shadow-none"
              />
            </View>

            <View className="mt-3 flex-row gap-[14px]">
              <Input
                value={expiry}
                onChangeText={setExpiry}
                placeholder="MM/YY"
                placeholderTextColor="#c8cdd6"
                keyboardType="numbers-and-punctuation"
                className="h-12 flex-1 rounded-md border-[#d0d7e2] px-4 text-base shadow-none"
              />
              <Input
                value={cvv}
                onChangeText={setCvv}
                placeholder="CVV"
                placeholderTextColor="#c8cdd6"
                keyboardType="number-pad"
                secureTextEntry
                className="h-12 flex-1 rounded-md border-[#d0d7e2] px-4 text-base shadow-none"
              />
            </View>

            <View className="mt-7 flex-row items-start">
              <Pressable
                onPress={() => setSaveCard((value) => !value)}
                className={`h-[22px] w-[22px] items-center justify-center rounded-[3px] ${
                  saveCard ? 'bg-black' : 'border border-[#d0d7e2] bg-white'
                }`}
              >
                {saveCard ? <Check size={16} color="#ffffff" strokeWidth={3} /> : null}
              </Pressable>
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-medium leading-[19px] text-[#707070]">
                  Save the card details (except CVV) securely.
                </Text>
                <Text className="mt-1 text-[13px] font-medium text-[#ff5a2a]">Know More</Text>
              </View>
            </View>

            <Button className="mt-6 h-[43px] rounded-lg bg-[#ff6a2e]">
              <Text className="text-[14px] font-extrabold text-white">Save & proceed</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
