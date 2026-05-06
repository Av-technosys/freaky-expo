import React, { useState } from 'react';
import { View, Platform, ScrollView, Pressable } from 'react-native';
import dayjs from 'dayjs';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Option } from '@/components/ui/select';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';
import Toast from 'react-native-toast-message';

import { addCartItem } from '@/api/cart';
import { Textarea } from '@/components/ui/textarea';
import DateField from '@/components/common/DateField';
import TimeField from '@/components/common/TimeField';
import { GUEST_OPTIONS } from '@/const/global';
import { useCartStore } from '@/store/cartStore';

type Props = {
  product: {
    ProductId: string; // keep consistent
    title: string;
    vendorName: string;
    price: number;
  };
  onSuccess?: () => void;
};

type Suggestion = {
  place_id: string;
  description: string;
};

export default function AddToCartForm({ product, onSuccess }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [guests, setGuests] = useState<Option | undefined>();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<Date>();
  const [vendorNote, setVendorNote] = useState('');
  const [loading, setLoading] = useState(false);

  const guestValue = guests?.value;
  const isValid =
    fullName.trim().length > 0 &&
    phone.length >= 10 &&
    address.trim().length > 0 &&
    !!date &&
    !!time &&
    !!guests;

  const handleSubmit = async () => {
    if (!date || !time || !guests) return;

    try {
      setLoading(true);

      const eventDate = new Date(date);
      eventDate.setHours(time.getHours(), time.getMinutes());

      const [minGuestCount, maxGuestCount] = guestValue?.split('-').map(Number) ?? [0, 0];

      const payload = {
        productId: Number(product.ProductId), // ✅ FIXED
        quantity: 1,
        name: fullName.trim(),
        contactNumber: phone.trim(),
        date: eventDate.toISOString(),
        minGuestCount,
        maxGuestCount,
        latitude: 0,
        longitude: 0,
        vendorNote: vendorNote.trim(),
      };

      const res = await addCartItem(payload);
      const cartItemId =
        res?.cartItemId ??
        res?.item?.cartItemId ??
        res?.data?.cartItemId ??
        res?.cartItem?.cartItemId ??
        Date.now().toString();
      const bookingDraftId =
        res?.bookingDraftId ?? res?.item?.bookingDraftId ?? res?.data?.bookingDraftId;
      const cartId = res?.cartId ?? res?.item?.cartId ?? res?.data?.cartId;

      addToCart({
        cartItemId: String(cartItemId),
        bookingDraftId: bookingDraftId ? Number(bookingDraftId) : undefined,
        cartId: cartId ? Number(cartId) : undefined,
        productId: product.ProductId ?? '',
        title: product.title ?? '',
        vendorName: product.vendorName ?? '',
        price: Number(product.price ?? 0),
        quantity: 1,
        bookingDetails: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          date: eventDate.toISOString(),
          time: dayjs(time).format('hh:mm A'),
          guests: guestValue ?? null,
          vendorNote: vendorNote.trim(),
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Added to cart successfully!',
      });

      onSuccess?.();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add to cart.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSearch = async (text: string) => {
    setAddress(text);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSelectAddress = async (placeId: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      const data = await res.json();
      const details = data.result;

      setAddress(details.formatted_address || '');

      setSuggestions([]);
    } catch { }
  };
  return (
    <View style={{ flex: 1 }}>
      <View className="gap-4 px-4 py-8">
        {/* Full Name */}
        <View className="gap-2">
          <Label nativeID="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            className="native:px-4"
          />
        </View>

        {/* Phone */}
        <View className="gap-2">
          <Label nativeID="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            className="native:px-4"
          />
          {phone.length > 0 && phone.length < 10 && (
            <Text className="text-sm text-destructive">
              Phone number must be at least 10 digits
            </Text>
          )}
        </View>

        {/* Address */}
        <View className="gap-2">
          <Label nativeID="address">Address</Label>
          <View style={{ position: 'relative' }}>
            <Textarea
              id="address"
              placeholder="Enter your address"
              value={address}
              onChangeText={handleAddressSearch}
              className="native:px-4"
              multiline
              numberOfLines={2}
            />

            {suggestions.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 55,
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  zIndex: 20,
                  maxHeight: 200,
                }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {suggestions.map((item) => (
                    <Pressable
                      key={item.place_id}
                      onPress={() => handleSelectAddress(item.place_id)}
                      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                      <Text>{item.description}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Date Picker */}

        <DateField value={date} onChange={setDate} />
        {/* Time Picker */}

        <TimeField value={time} onChange={setTime} />
        {/* Guests Select */}
        <View className="gap-2">
          <Label nativeID="guests">Number of Guests</Label>
          <Select value={guests} onValueChange={(val) => setGuests(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select guest range" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Guest Count</SelectLabel>

                {GUEST_OPTIONS.map((option) => (
                  <SelectItem key={option.value} label={option.label} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
        {/* Vendor Note */}
        <View className="gap-1.5">
          <Label>Vendor Note</Label>
          <Textarea
            value={vendorNote}
            onChangeText={setVendorNote}
            placeholder="Any special requests?"
            className="min-h-[100px]"
          />
        </View>
        {/* Price Summary Card */}
        <Card className="mt-2">
          <CardContent className="p-4">
            <View className="flex-row justify-between">
              <Text className="font-semibold">Total Price:</Text>
              <Text className="text-lg font-bold text-primary">₹{product.price}</Text>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View className="mt-4 flex-row gap-3">
          <AppButton className="flex-1" onPress={handleSubmit} disabled={!isValid || loading}>
            {loading ? 'Adding...' : 'Add to Cart'}
          </AppButton>
        </View>
      </View>
    </View>
  );
}
