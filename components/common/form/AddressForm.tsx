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
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type Suggestion = {
  place_id: string;
  description: string;
};

export default function AddressForm({ initialData, onSuccess, onCancel }: Props) {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
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
      await AsyncStorage.setItem('addressRefetch', 'true')

      onSuccess();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to save address' });
    }
  };

  const handleSearch = async (text: string | any[]) => {
    const searchText = Array.isArray(text) ? text.join(' ') : text;

    onChange('addressLineOne', searchText)

    if (searchText.length < 3) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchText)}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )

      const data = await res.json()

      setSuggestions(data.predictions || [])
    } catch (e) {
      setSuggestions([])
    }
  }

  const handleSelect = async (placeId: any) => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )

    const data = await res.json()

    const details = data.result

    const address = details.formatted_address || ''
    const lat = details.geometry?.location?.lat
    const lng = details.geometry?.location?.lng

    const components = details.address_components || []

    const get = (type: string) =>
      components.find((c: { types: string | string[]; }) => c.types.includes(type))?.long_name || ''

    const city =
      get('locality') ||
      get('sublocality') ||
      get('administrative_area_level_2')

    const state = get('administrative_area_level_1')

    const postalCode = get('postal_code')

    setForm(prev => ({
      ...prev,
      addressLineOne: address,
      city,
      state,
      postalCode,
      latitude: lat,
      longitude: lng
    }))

    setSuggestions([])
    Keyboard.dismiss()
  } catch (e) {}
}
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

    
     <View>
  <Input
    placeholder="Street Address Line 1"
    value={form.addressLineOne}
    onChangeText={handleSearch}
  />

  {suggestions.length > 0 && (
    <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 4 }}>
      {suggestions.map((item) => (
        <Pressable
          key={item.place_id}
          onPress={() => handleSelect(item.place_id)}
          style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}
        >
          <Text>{item.description}</Text>
        </Pressable>
      ))}
    </View>
  )}
</View>
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
