import {
  View,
  Keyboard,
  Pressable

} from 'react-native';
import { useState } from 'react';
import { useRef } from 'react';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';
import StatePickerSheet from '@/components/common/StatePickerSheet';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { addAddress, editAddress } from '@/api/user';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { US_STATES } from '@/const/global';

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
  latitude?: number | string;
  longitude?: number | string;
};

type Props = {
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AddressForm({ initialData, onSuccess, onCancel }: Props) {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const options = US_STATES.map((s) => ({
    label: s,
    value: s,
  }));
  const [form, setForm] = useState<Address>({
    title: initialData?.title ?? '',
    addressLineOne: initialData?.addressLineOne ?? '',
    addressLineTwo: initialData?.addressLineTwo ?? '',
    reciverName: initialData?.reciverName ?? '',
    reciverNumber: initialData?.reciverNumber ?? '',
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
    postalCode: initialData?.postalCode ?? '',
    country: initialData?.country ?? 'USA',
    id: initialData?.id,
    latitude: initialData?.latitude || '0',
    longitude: initialData?.longitude || '0',
  });

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
        await editAddress({
          ...form,
          latitude: String(form.latitude ?? ''),
          longitude: String(form.longitude ?? ''),
        });
        Toast.show({ type: 'success', text1: 'Address updated' });
      } else {
        await addAddress({
          ...form,
          latitude: String(form.latitude ?? ''),
          longitude: String(form.longitude ?? ''),
        });
        Toast.show({ type: 'success', text1: 'Address added' });
      }

      onSuccess();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to save address' });
    }
  };

  return (
    <>
      <View className="p-2">
        {/* HEADER */}
        <View className="mb-4 flex-row items-center gap-2">
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
              placeholder="Street Address Line 1"
              value={form.addressLineOne}
              onChangeText={(v) => onChange('addressLineOne', v)}
            />

            <Input
              placeholder="Street Address Line 2"
              value={form.addressLineTwo}
              onChangeText={(v) => onChange('addressLineTwo', v)}
            />

            <Input
              placeholder="Receiver Name"
              value={form.reciverName}
              onChangeText={(v) => onChange('reciverName', v)}
            />

            <Input
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={form.reciverNumber}
              onChangeText={(v) => onChange('reciverNumber', v)}
            />

            <Input placeholder="City" value={form.city} onChangeText={(v) => onChange('city', v)} />

            <Input
              placeholder="Zip Code"
              keyboardType="numeric"
              value={form.postalCode}
              onChangeText={(v) => onChange('postalCode', v)}
            />

            {/* STATE PICKER */}
            <Pressable onPress={() => sheetRef.current?.expand()}>
              <Input placeholder="Select State" value={form.state} editable={false} />
            </Pressable>
            {/* COUNTRY */}
            <Input value="United States of America" editable={false} />
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <View className="mt-5 flex-col gap-3">
          <AppButton variant="outline" className="flex-1" onPress={onCancel}>
            <Text>Cancel</Text>
          </AppButton>

          <AppButton className="flex-1" onPress={onSubmit}>
            <Text>{form.id ? 'Update' : 'Save'}</Text>
          </AppButton>
        </View>
      </View>
      <StatePickerSheet
        sheetRef={sheetRef}
        value={form.state}
        options={options}
        onSelect={(val) => onChange('state', val)}
      />
    </>
  );
}
