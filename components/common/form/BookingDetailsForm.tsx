import { View, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import DateField from '@/components/common/DateField';
import TimeField from '@/components/common/TimeField';
// Icons
import {
  User,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react-native';

import { fetchEventType, createEvent } from '@/api/event';
import { useAppDispatch } from '@/store/hooks';
import { setEventId, setEventType } from '@/store/slices/eventSlice';
import { AppButton } from '../AppButton';
import { GUEST_OPTIONS } from '@/const/global';

type Props = {
  onSubmit: (data: any) => void;
  submitLabel?: string;
};



const getEventIcon = (eventName: string) => {
  const name = eventName.toLowerCase();
  if (name.includes('wedding')) return '🎉';
  if (name.includes('party') || name.includes('birthday')) return '🎈';
  if (name.includes('concert') || name.includes('music')) return '🎵';
  if (name.includes('dinner') || name.includes('food')) return '🍽️';
  return '📸';
};

export default function BookingDetailsForm({ onSubmit, submitLabel = 'Continue' }: Props) {
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [guests, setGuests] = useState<any>('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);

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
    };

    try {
      dispatch(
        setEventType({
          id: eventTypeItem.id,
          name: eventTypeItem.name,
          image: eventTypeItem.image ?? null,
        })
      );
      onSubmit(payload);
      const res = await createEvent(payload);
      dispatch(setEventId(res?.data?.eventId));
      Toast.show({ type: 'success', text1: 'Event created successfully' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to create event' });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="mt-4">
        {/* Single Card */}
        <Card className="h-auto">
          <CardContent className="mb-12 h-auto gap-6 pt-6">
            {/* Full Name */}
            <View className="gap-2">
              <Label>Full Name</Label>
              <View className="flex-row items-center gap-2">
                <User size={18} className="text-muted-foreground" />
                <Input
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  className="flex-1"
                />
              </View>
            </View>

            {/* Phone */}
            <View className="gap-2">
              <Label>Phone Number</Label>
              <View className="flex-row items-center gap-2">
                <Phone size={18} className="text-muted-foreground" />
                <Input
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  className="flex-1"
                />
              </View>
            </View>

            {/* Address */}
            <View className="gap-2">
              <Label>Address</Label>
              <View className="flex-row items-center gap-2">
                <MapPin size={18} className="text-muted-foreground" />
                <Input
                  placeholder="Your full address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                  className="flex-1"
                />
              </View>
            </View>

            <Separator />

            <DateField value={date || undefined} onChange={(d) => setDate(d)} />

            <TimeField value={time || undefined} onChange={(t) => setTime(t)} />
            {/* Guests - Fixed Select */}
            <View className="gap-2">
              <Label>Number of Guests</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="w-full">
                  <View className="flex-row items-center gap-2">
                    <Users size={24} className="text-muted-foreground" />
                    <SelectValue className="px-2 text-base" placeholder="Select guest range" />
                  </View>
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

            {/* Summary Section */}
            {isFormValid && (
              <>
                <Separator />
                <View className="gap-2 rounded-lg bg-primary/5 p-3">
                  <Text className="font-semibold text-primary">Booking Summary</Text>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Date & Time:</Text>
                    <Text className="text-sm font-medium">
                      {date && dayjs(date).format('DD MMM')} at{' '}
                      {time && dayjs(time).format('hh:mm A')}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Guests:</Text>
                    <Text className="text-sm font-medium">{guests.value}</Text>
                  </View>
                </View>
              </>
            )}
          </CardContent>
          <CardFooter>
            {/* Submit Button */}
            <AppButton disabled={!isFormValid} onPress={() => setShowEventDialog(true)}>
              <Text className="font-semibold text-white">{submitLabel}</Text>
            </AppButton>
          </CardFooter>
        </Card>

        {/* Event Type Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="h-[70%] w-full">
            {/* HEADER */}
            <View className="border-b border-border px-4 py-4">
              <Text className="text-lg font-semibold">Select Event Type</Text>
              <Text className="mt-1 text-sm text-muted-foreground">Choose your event</Text>
            </View>

            {/* LIST */}
            <ScrollView className="flex-1">
              {eventTypes.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setShowEventDialog(false);
                    submitWithEvent(item);
                  }}
                  className="w-full flex-row items-center justify-between border-b border-border px-4 py-4">
                  <Text className="text-base font-medium">{item.name}</Text>

                  <ChevronRight size={16} className="text-muted-foreground" />
                </Pressable>
              ))}
            </ScrollView>
          </DialogContent>
        </Dialog>
      </View>
    </ScrollView>
  );
}
