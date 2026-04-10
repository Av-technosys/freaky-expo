import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRef } from 'react';
import { TextInput } from 'react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';

import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { addAddress, editAddress } from '@/api/user';
import { US_STATES } from '@/const/US_STATE';

type Address = {
  id?: number;
  title: string;
  addressLineOne: string;
  addressLineTwo: string;
  reciverName: string;
  reciverNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AddressForm({
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const [form, setForm] = useState<Address>({
    title: initialData?.title ?? '',
    addressLineOne: initialData?.addressLineOne ?? '',
    addressLineTwo: initialData?.addressLineTwo ?? '',
    reciverName: initialData?.reciverName ?? '',
    reciverNumber: initialData?.reciverNumber ?? '',
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
    postalCode: initialData?.postalCode ?? '',
    country: initialData?.country ?? 'India',
    id: initialData?.id,
  });

  const [showStatePicker, setShowStatePicker] = useState(false);

  const onChange = (key: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (
      !form.title ||
      !form.addressLineOne ||
      !form.reciverName ||
      !form.reciverNumber ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      Toast.show({ type: 'error', text1: 'Fill all required fields' });
      return;
    }

    try {
      if (form.id) {
        await editAddress(form);
        Toast.show({ type: 'success', text1: 'Address updated' });
      } else {
        await addAddress(form);
        Toast.show({ type: 'success', text1: 'Address added' });
      }

      onSuccess();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to save address' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="px-4">

        {/* HEADER */}
        <View className="flex-row items-center gap-2 mb-4">
          <Feather name="map-pin" size={20} />
          <Text className="text-lg font-semibold">Address</Text>
        </View>

        <Card>
          <CardContent className="gap-4">

            <Input
              placeholder="Title"
              value={form.title}
              onChangeText={(v) => onChange('title', v)}
            />

            <Input
              placeholder="Address Line 1"
              value={form.addressLineOne}
              onChangeText={(v) => onChange('addressLineOne', v)}
            />

            <Input
              placeholder="Address Line 2"
              value={form.addressLineTwo}
              onChangeText={(v) => onChange('addressLineTwo', v)}
            />

            <Input
              placeholder="Receiver Name"
              value={form.reciverName}
              onChangeText={(v) => onChange('reciverName', v)}
            />

            <Input
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={form.reciverNumber}
              onChangeText={(v) => onChange('reciverNumber', v)}
            />

            <Input
              placeholder="City"
              value={form.city}
              onChangeText={(v) => onChange('city', v)}
            />

            <Input
              placeholder="Zip Code"
              keyboardType="numeric"
              value={form.postalCode}
              onChangeText={(v) => onChange('postalCode', v)}
            />

            {/* STATE PICKER */}
            <Pressable onPress={() => setShowStatePicker(true)}>
              <Input
                placeholder="Select State"
                value={form.state}
                editable={false}
              />
            </Pressable>

            {/* COUNTRY */}
            <Input value="India" editable={false} />

          </CardContent>
        </Card>

        {/* ACTIONS */}
        <View className="flex-row gap-3 mt-5">
          <AppButton
            variant="outline"
            className="flex-1"
            onPress={onCancel}
          >
            <Text>Cancel</Text>
          </AppButton>

          <AppButton
            className="flex-1"
            onPress={onSubmit}
          >
            <Text>{form.id ? 'Update' : 'Save'}</Text>
          </AppButton>
        </View>

        {/* STATE MODAL */}
        <Modal visible={showStatePicker} transparent animationType="slide">
          <Pressable
            className="flex-1 bg-black/40 justify-end"
            onPress={() => setShowStatePicker(false)}
          >
            <View className="bg-white rounded-t-3xl p-5 max-h-[60%]">

              <Text className="text-lg font-semibold mb-4">
                Select State
              </Text>

              <ScrollView>
                {US_STATES.map((state) => {
                  const selected = form.state === state;

                  return (
                    <Pressable
                      key={state}
                      onPress={() => {
                        onChange('state', state);
                        setShowStatePicker(false);
                      }}
                      className={`py-3 ${
                        selected ? 'bg-orange-50' : ''
                      }`}
                    >
                      <Text
                        className={
                          selected ? 'text-orange-500 font-semibold' : ''
                        }
                      >
                        {state}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

            </View>
          </Pressable>
        </Modal>

      </View>
    </KeyboardAvoidingView>
  );
}