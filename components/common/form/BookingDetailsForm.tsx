import { View, Pressable, ScrollView } from 'react-native';
import React, { SetStateAction, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from '@/components/common/ToastManager';
import { Feather } from '@expo/vector-icons';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DateField from '@/components/common/DateField';
import TimeField from '@/components/common/TimeField';
import { fetchEventType, createEvent } from '@/api/event';
import { useAppDispatch } from '@/store/hooks';
import { resetEvent, setEventId, setEventType } from '@/store/slices/eventSlice';
import { AppButton } from '../AppButton';
import { GUEST_OPTIONS } from '@/const/global';
import { Textarea } from '@/components/ui/textarea';

type Suggestion = {
  place_id: string;
  description: string;
};

type Props = {
  onSubmit: (data: any) => void;
  submitLabel?: string;
};

export default function BookingDetailsForm({ onSubmit, submitLabel = 'Continue' }: Props) {
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [guests, setGuests] = useState<any>(undefined);
  const guestValue = guests?.value;

  const [minGuestCount, maxGuestCount] = guestValue?.split('-').map(Number) ?? [0, 0];

  useEffect(() => {
    fetchEventType().then((res) => setEventTypes(res.data));
  }, []);

  const isFormValid = fullName && phone.length >= 10 && address && date && time && guests;

  const submitWithEvent = async (eventTypeItem: any) => {
    if (!date || !time) return;

    const start = new Date(date);
    start.setHours(time.getHours(), time.getMinutes());
    const end = new Date(start);
    end.setHours(start.getHours() + 4);

    const payload = {
      eventTypeId: eventTypeItem.id,
      contactName: fullName,
      contactNumber: phone,
      description: address,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      minGuestCount,
      maxGuestCount,
    };

    try {
      dispatch(resetEvent());

      dispatch(
        setEventType({
          id: eventTypeItem.id,
          name: eventTypeItem.name,
          image: eventTypeItem.image ?? null,
        })
      );
      onSubmit(payload);
      console.log('payload we are sending', payload);

      const res = await createEvent(payload);
      dispatch(setEventId(res?.data?.eventId));
      toast.success('Event created successfully');
    } catch {
      toast.error('Failed to create event');
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

  const handleSelectAddress = async (placeId: any) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      const data = await res.json();
      const details = data.result;

      setAddress(details.formatted_address || '');

      setSuggestions([]);
    } catch {}
  };
  return (
    <View className="my-4 gap-4">
      {/* Header */}
      {/* <View className="items-center py-2">
          <Text className="text-lg font-semibold text-gray-900">Event Booking</Text>
          <Text className="text-sm text-gray-500 mt-1">Create your event booking</Text>
        </View> */}

      {/* Main Form Card */}
      <Card className="p-4">
        {/* Contact Information */}
        <View className="">
          <Text className="mb-3 text-sm font-semibold text-gray-700">Contact Information</Text>

          {/* Full Name */}
          <View className="mb-3">
            <View className="mb-1.5 flex-row items-center gap-2">
              <Feather name="user" size={14} color="#6B7280" />
              <Label className="text-sm text-gray-600">Full Name</Label>
            </View>
            <Input
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
              className="h-10 text-sm"
            />
          </View>

          {/* Phone */}
          <View className="mb-3">
            <View className="mb-1.5 flex-row items-center gap-2">
              <Feather name="phone" size={14} color="#6B7280" />
              <Label className="text-sm text-gray-600">Phone Number</Label>
            </View>
            <Input
              placeholder="10-digit mobile"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="h-10 text-sm"
            />
            {phone.length > 0 && phone.length < 10 && (
              <Text className="mt-1 text-xs text-red-500">Must be at least 10 digits</Text>
            )}
          </View>
        </View>

        {/* Event Details */}
        <View className="">
          <Text className="mb-3 text-sm font-semibold text-gray-700">Event Details</Text>

          {/* Address */}
          <View className="mb-3">
            <View className="mb-1.5 flex-row items-center gap-2">
              <Feather name="map-pin" size={14} color="#6B7280" />
              <Label className="text-sm text-gray-600">Event Address</Label>
            </View>
            <View style={{ position: 'relative', flex: 1 }}>
              <Textarea
                placeholder="Event location"
                value={address}
                onChangeText={handleAddressSearch}
                multiline
                numberOfLines={2}
                className="min-h-[60px] text-sm"
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
                    zIndex: 1000,
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
          <View className="mb-3 flex-row gap-3">
            <View className="flex-1">
              <View className="mb-1.5 flex-row items-center gap-2">
                <Feather name="calendar" size={14} color="#6B7280" />
                <Label className="text-sm text-gray-600">Date</Label>
              </View>
              <DateField value={date || undefined} onChange={(d) => setDate(d)} />
            </View>
            <View className="flex-1">
              <View className="mb-1.5 flex-row items-center gap-2">
                <Feather name="clock" size={14} color="#6B7280" />
                <Label className="text-sm text-gray-600">Time</Label>
              </View>
              <TimeField value={time || undefined} onChange={(t) => setTime(t)} />
            </View>
          </View>

          {/* Guests */}
          <View className="mb-1">
            <View className="mb-1.5 flex-row items-center gap-2">
              <Feather name="users" size={14} color="#6B7280" />
              <Label className="text-sm text-gray-600">Number of Guests</Label>
            </View>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Guest Count</SelectLabel>
                  {GUEST_OPTIONS.map((option) => (
                    <SelectItem key={option.value} label={option.label} value={option.value} />
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
        </View>

        {/* Booking Summary */}
        {isFormValid && (
          <View className="mb-4 rounded-lg bg-orange-50 p-3">
            <Text className="mb-2 text-sm font-semibold text-orange-500">Booking Summary</Text>
            <View className="mb-1 flex-row justify-between">
              <Text className="text-xs text-gray-600">Date & Time:</Text>
              <Text className="text-xs font-medium text-gray-800">
                {date && dayjs(date).format('DD MMM')} at {time && dayjs(time).format('hh:mm A')}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600">Guests:</Text>
              <Text className="text-xs font-medium text-gray-800">
                {guests?.label || 'Not selected'}
              </Text>
            </View>
          </View>
        )}
      </Card>

      {/* Submit Button */}
      <AppButton disabled={!isFormValid} onPress={() => setShowEventDialog(true)} className="h-12">
        <View className="flex-row items-center justify-center gap-2">
          <Feather name="calendar" size={18} color="#fff" />
          <Text className="font-semibold text-white">{submitLabel}</Text>
        </View>
      </AppButton>

      {/* Event Type Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="h-[60%] w-full">
          {/* Header */}
          <View className="border-b border-gray-200 px-4 py-3">
            <Text className="text-base font-semibold text-gray-900">Select Event Type</Text>
            <Text className="mt-0.5 text-xs text-gray-500">Choose your event category</Text>
          </View>

          {/* Event List */}
          <ScrollView className="flex-1">
            {eventTypes.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  setShowEventDialog(false);
                  submitWithEvent(item);
                }}
                className="w-full flex-row items-center justify-between border-b border-gray-100 px-4 py-3 active:bg-gray-50">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">{item.name}</Text>
                  {item.image && (
                    <Text className="mt-0.5 text-xs text-gray-500">Event available</Text>
                  )}
                </View>
                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </Pressable>
            ))}
          </ScrollView>
        </DialogContent>
      </Dialog>
    </View>
  );
}
