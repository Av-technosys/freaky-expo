import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import dayjs from 'dayjs';
import { Feather } from '@expo/vector-icons';

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
import { Card } from '@/components/ui/card';
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
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="my-4 gap-4">
        {/* Header */}
        {/* <View className="items-center py-2">
          <Text className="text-lg font-semibold text-gray-900">Booking Details</Text>
          <Text className="text-sm text-gray-500 mt-1">Fill in your event information</Text>
        </View> */}

        {/* Main Form Card */}
        <Card className="p-4">
          {/* Contact Info Section */}
          <View className="">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Contact Information</Text>
            
            {/* Full Name */}
            <View className="mb-3">
              <View className="flex-row items-center gap-2 mb-1.5">
                <Feather name="user" size={14} color="#6B7280" />
                <Label nativeID="fullName" className="text-sm text-gray-600">Full Name</Label>
              </View>
              <Input
                id="fullName"
                placeholder="Enter your name"
                value={fullName}
                onChangeText={setFullName}
                className="h-10 text-sm"
              />
            </View>

            {/* Phone */}
            <View className="mb-3">
              <View className="flex-row items-center gap-2 mb-1.5">
                <Feather name="phone" size={14} color="#6B7280" />
                <Label nativeID="phone" className="text-sm text-gray-600">Phone Number</Label>
              </View>
              <Input
                id="phone"
                placeholder="10-digit mobile"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="h-10 text-sm "
              />
              {phone.length > 0 && phone.length < 10 && (
                <Text className="text-xs text-red-500 mt-1">Must be at least 10 digits</Text>
              )}
            </View>
          </View>

          {/* Event Details Section */}
          <View className="">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Event Details</Text>
            
            {/* Address */}
            <View className="mb-3">
              <View className="flex-row items-center gap-2 mb-1.5">
                <Feather name="map-pin" size={14} color="#6B7280" />
                <Label nativeID="address" className="text-sm text-gray-600">Address</Label>
              </View>
              <View style={{ position: 'relative' }}>
                <Textarea
                  id="address"
                  placeholder="Event location"
                  value={address}
                  onChangeText={handleAddressSearch}
                  className="min-h-[60px] text-sm"
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
                      maxHeight: 150,
                    }}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                      {suggestions.map((item) => (
                        <Pressable
                          key={item.place_id}
                          onPress={() => handleSelectAddress(item.place_id)}
                          style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
                          <Text className="text-sm">{item.description}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Date & Time Row */}
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1.5">
                  <Feather name="calendar" size={14} color="#6B7280" />
                  <Label className="text-sm text-gray-600">Date</Label>
                </View>
                <DateField value={date} onChange={setDate} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1.5">
                  <Feather name="clock" size={14} color="#6B7280" />
                  <Label className="text-sm text-gray-600">Time</Label>
                </View>
                <TimeField value={time} onChange={setTime} />
              </View>
            </View>

            {/* Guests */}
            <View className="mb-1">
              <View className="flex-row items-center gap-2 mb-1.5">
                <Feather name="users" size={14} color="#6B7280" />
                <Label nativeID="guests" className="text-sm text-gray-600">Number of Guests</Label>
              </View>
              <Select value={guests} onValueChange={(val) => setGuests(val)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select guests" />
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
          </View>

          {/* Special Requests */}
          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <Feather name="edit-3" size={14} color="#6B7280" />
              <Label className="text-sm text-gray-600">Vendor Note</Label>
            </View>
            <Textarea
              value={vendorNote}
              onChangeText={setVendorNote}
              placeholder="Any special requirements?"
              className="min-h-[60px] text-sm"
              numberOfLines={2}
            />
          </View>

          {/* Price Summary */}
          <View className="bg-orange-50 rounded-lg p-3 mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm font-medium text-gray-600">Total Amount</Text>
                <Text className="text-xs text-gray-500">For {guests?.label || 'selected guests'}</Text>
              </View>
              <Text className="text-lg font-bold text-orange-600">₹{product.price}</Text>
            </View>
          </View>
        </Card>

        {/* Submit Button */}
        <AppButton 
          onPress={handleSubmit} 
          disabled={!isValid || loading}
          className="h-12"
        >
          <View className="flex-row items-center justify-center gap-2">
            <Feather name="shopping-cart" size={18} color="#fff" />
            <Text className="text-white font-semibold">
              {loading ? 'Adding...' : 'Add to Cart'}
            </Text>
          </View>
        </AppButton>
      </View>
    </ScrollView>
  );
}
