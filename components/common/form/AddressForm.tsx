import {
  View,
  Keyboard,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Location from 'expo-location';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';
import StatePickerSheet from '@/components/common/StatePickerSheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

import { addAddress, editAddress } from '@/api/user';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { US_STATES } from '@/const/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Textarea } from '@/components/ui/textarea';

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
  phoneNumber?: string;
  latitude?: number | string;
  longitude?: number | string;
};

type Props = {
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
};

type Suggestion = {
  place_id: string;
  description: string;
};

export default function AddressForm({ initialData, onSuccess, onCancel, title }: Props) {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<any>(null);
  const [formLoading, setFormLoading] = useState(false);
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
    country: initialData?.country ?? 'India',
    phoneNumber: initialData?.phoneNumber ?? '',
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

  const handleSearch = (text: string) => {
    onChange('addressLineOne', text);

    // clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            text
          )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&components=country:in`
        );

        const data = await res.json();

        if (data.status === 'OK') {
          setSuggestions(data.predictions || []);
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission denied' });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      const result = data.results?.[0];
      const address = result?.formatted_address || '';
      const components = result?.address_components || [];

      const get = (type: string) =>
        components.find((c: { types: string | string[] }) => c.types.includes(type))?.long_name || '';

      const city = get('locality') || get('sublocality') || get('administrative_area_level_2');
      const state = get('administrative_area_level_1');
      const postalCode = get('postal_code');

      setForm({
        title: 'Current Location',
        addressLineOne: address,
        addressLineTwo: '',
        reciverName: '',
        reciverNumber: '',
        city,
        state,
        postalCode: postalCode,
        country: 'India',
        phoneNumber: '',
        latitude: lat.toString(),
        longitude: lng.toString(),
      });

      Toast.show({ type: 'success', text1: 'Location detected', text2: 'Address filled automatically' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to get location' });
    }
  };

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
      <Screen scroll>
        <ScreenHeader 
          title={title || (initialData?.id ? 'Edit Address' : 'Add New Address')} 
          showBack={true}
        />
   
            <View className="py-4 px-2  space-y-6">
        

              {/* Form Fields */}
              <View className="space-y-8 mt-6">
                <View>
                  <Text className="mb-2 text-sm font-semibold text-gray-700">Address Title *</Text>
                  <Input
                    placeholder="e.g., Home, Office"
                    value={form.title}
                    onChangeText={(text) => onChange('title', text)}
                    className="h-12 rounded-xl border-gray-200"
                  />
                </View>

                <View className="flex-row mt-1 gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-gray-700">Receiver Name *</Text>
                    <Input
                      placeholder="Full name"
                      value={form.reciverName}
                      onChangeText={(text) => onChange('reciverName', text)}
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-gray-700">Receiver Number *</Text>
                    <Input
                      placeholder="Phone number"
                      value={form.reciverNumber}
                      onChangeText={(text) => onChange('reciverNumber', text)}
                      className="h-12 rounded-xl border-gray-200"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>

                <View className='mt-1' style={{ position: 'relative' }}>
                  <Text className="mb-2 text-sm font-semibold text-gray-700">Address Line 1 *</Text>
                  <Textarea
                    placeholder="Street address"
                    value={form.addressLineOne}
                    onChangeText={handleSearch}
                    className="h-12 rounded-xl border-gray-200"
                    multiline
                  />

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 80,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        borderRadius: 10,
                        zIndex: 999,
                        elevation: 5,

                      }}
                    >
                      {suggestions.map((item) => (
                        <Pressable
                          key={item.place_id}
                          onPress={() => handleSelect(item.place_id)}
                          style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                          }}
                        >
                          <Text>{item.description}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View className='mt-5'>
                  <Text className="mb-2 text-sm font-semibold text-gray-700">Address Line 2</Text>
                  <Input
                    placeholder="Apartment, suite, etc. (optional)"
                    value={form.addressLineTwo}
                    onChangeText={(text) => onChange('addressLineTwo', text)}
                    className="h-12 rounded-xl border-gray-200"
                  />
                </View>

                <View className="flex-row mt-1 gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-gray-700">City *</Text>
                    <Input
                      placeholder="City"
                      value={form.city}
                      onChangeText={(text) => onChange('city', text)}
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-gray-700">State *</Text>
                    <Pressable onPress={() => sheetRef.current?.expand()}>
                      <Input 
                        placeholder="State" 
                        value={form.state} 
                        editable={false}
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </Pressable>
                  </View>
                </View>

                <View className="flex-row mt-1 gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-gray-700">PIN Code *</Text>
                    <Input
                      placeholder="PIN Code"
                      value={form.postalCode}
                      onChangeText={(text) => onChange('postalCode', text)}
                      className="h-12 rounded-xl border-gray-200"
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  </View>

                </View>
              </View>

              {/* Submit Button */}
              <View className=" flex  gap-4 pt-8">
                      {/* Location Button */}
              <AppButton
                variant="outline"
                onPress={handleUseCurrentLocation}
                className="border-orange-200  bg-orange-50">
                <View className="flex-row items-center justify-center gap-2">
                  <Ionicons name="location-outline" size={18} color="#F97316" />
                  <Text className="font-semibold text-orange-600">Use Current Location</Text>
                </View>
              </AppButton>
                <AppButton
                  onPress={onSubmit}
                  disabled={formLoading}>
                  <Text className="font-semibold text-white">
                    {formLoading ? 'Saving...' : (form.id ? 'Update Address' : 'Save Address')}
                  </Text>
                </AppButton>
              </View>
            </View>
      
      </Screen>
      <StatePickerSheet
        sheetRef={sheetRef}
        value={form.state}
        options={options}
        onSelect={(val) => onChange('state', val)}
      />
    </>
  );
}
