import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

// React Native Reusables components
import { Button } from '@/components/ui/button';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';
import Toast from 'react-native-toast-message';

// Redux
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';

// API
import { addCartItem } from '@/api/cart';
import { Textarea } from '@/components/ui/textarea';
import DateField from '@/components/common/DateField';
import TimeField from '@/components/common/TimeField';

type Props = {
  product: {
    ProductId: string; // keep consistent
    title: string;
    vendorName: string;
    price: number;
  };
  onSuccess?: () => void;
};

const GUEST_OPTIONS = [
  { label: '0-100 guests', value: '0-100' },
  { label: '101-200 guests', value: '101-200' },
  { label: '201-350 guests', value: '201-350' },
  { label: '351-500 guests', value: '351-500' },
] as const satisfies Option[];

export default function AddToCartForm({ product, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // FORM STATE
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [guests, setGuests] = useState<Option | undefined>();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<Date>();
  const [vendorNote, setVendorNote] = useState('');
  // UI STATE
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const guestValue = guests?.value; // 👈 extract string
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

      await addCartItem(payload);

      // ✅ FIXED REDUX PAYLOAD
      dispatch(
        addToCart({
          ProductId: product.ProductId ?? '', // must exist
          title: product.title ?? '',
          vendorName: product.vendorName ?? '',
          price: product.price ?? 0,
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
        })
      );

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
          <Input
            id="address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            className="native:px-4"
            multiline
            numberOfLines={2}
          />
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
              <Text className="text-lg font-bold text-primary">${product.price}</Text>
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
