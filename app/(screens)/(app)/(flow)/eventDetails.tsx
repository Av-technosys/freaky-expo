import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock3,
  Home,
  Lock,
  MapPin,
  MessageSquareText,
  Minus,
  Plus,
  Sun,
  UserRound,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { Text } from '@/components/ui/text';
import { toast } from '@/components/common/ToastManager';
import { createEvent, fetchEventType } from '@/api/event';
import { type Address, useAddresses } from '@/api/user';
import { createPaymentOrder, verifyPayment } from '@/api/payment';
import { useAppDispatch } from '@/store/hooks';
import { resetEvent, setBookingDetails, setEventId, setEventType } from '@/store/slices/eventSlice';
import { EventDetailsForm } from '@/components/common/form/BookingDetailsForm';
import { getRazorpayCheckout, isExpoGo, RazorpayCheckoutUnavailableError } from '@/lib/razorpayCheckout';

type EventTypeOption = {
  id: number | string;
  name: string;
  image?: string | null;
};

const FALLBACK_EVENT_TYPES: EventTypeOption[] = [
  { id: 1, name: 'Birthday' },
  { id: 2, name: 'Wedding' },
  { id: 3, name: 'Anniversary' },
  { id: 4, name: 'House Party' },
];
const KEYBOARD_ACCESSORY_ID = 'event-details-keyboard-accessory';

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

function formatSavedAddress(address: Address) {
  const lines = [
    address.addressLineOne,
    address.addressLineTwo,
    [address.city, address.state].filter(Boolean).join(', '),
  ].filter(Boolean);

  return lines.join('\n');
}

export default function EventDetailsScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { data: addressesResponse, refetch: refetchAddresses } = useAddresses();
  const [eventTypes, setEventTypes] = useState<EventTypeOption[]>(FALLBACK_EVENT_TYPES);
  const [selectedEventType, setSelectedEventType] = useState<EventTypeOption>(FALLBACK_EVENT_TYPES[0]);
  const [eventTypePickerOpen, setEventTypePickerOpen] = useState(false);
  const [birthdayPerson, setBirthdayPerson] = useState('');
  const [date, setDate] = useState(new Date(2025, 4, 25));
  const [time, setTime] = useState(() => {
    const initialTime = new Date();
    initialTime.setHours(18, 0, 0, 0);
    return initialTime;
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [venueType, setVenueType] = useState<'Indoor' | 'Outdoor'>('Indoor');
  const [venueAddress, setVenueAddress] = useState('Grand Celebration Hall,\nMI Road, Jaipur, Rajasthan');
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [guests, setGuests] = useState(50);
  const [guestInput, setGuestInput] = useState('50');
  const [editingGuests, setEditingGuests] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paying, setPaying] = useState(false);
  const savedAddresses = Array.isArray(addressesResponse?.data) ? addressesResponse.data as Address[] : [];

  useEffect(() => {
    let isActive = true;

    fetchEventType()
      .then((response) => {
        if (!isActive || !response?.data?.length) return;
        setEventTypes(response.data);
        const birthday = response.data.find((item: EventTypeOption) => item.name?.toLowerCase() === 'birthday');
        if (birthday) setSelectedEventType(birthday);
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!birthdayPerson.trim() || !venueAddress.trim()) {
      toast.error('Please complete the event details');
      return;
    }

    const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY?.trim();
    if (!razorpayKey) {
      toast.error('Razorpay Key ID is missing. Please restart the app after adding it.');
      return;
    }

    let RazorpayCheckout: ReturnType<typeof getRazorpayCheckout>;
    try {
      RazorpayCheckout = getRazorpayCheckout();
    } catch (error) {
      toast.error(
        error instanceof RazorpayCheckoutUnavailableError
          ? error.message
          : 'Unable to initialise payment checkout',
      );
      return;
    }

    const startTime = new Date(date);
    startTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 4);

    const eventTypeId = Number(selectedEventType.id) || 1;
    const description =
      venueType +
      ' venue: ' +
      venueAddress.trim() +
      (specialRequests.trim() ? '\nRequest: ' + specialRequests.trim() : '');
    const payload = {
      eventTypeId,
      contactName: birthdayPerson.trim(),
      contactNumber: '',
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      minGuestCount: guests,
      maxGuestCount: guests,
      latitude: 0,
      longitude: 0,
    };

    try {
      setPaying(true);
      dispatch(resetEvent());
      dispatch(
        setEventType({
          id: eventTypeId,
          name: selectedEventType.name,
          image: selectedEventType.image ?? null,
        }),
      );
      dispatch(setBookingDetails(payload));

      const response = await createEvent(payload);
      const eventId = Number(response?.data?.eventId);

      if (!eventId) {
        throw new Error('Unable to create the event');
      }

      dispatch(setEventId(eventId));

      const order = await createPaymentOrder({
        source: 'EVENT',
        sourceId: eventId,
      });
      const paymentOrder = order?.data ?? order;

      if (!paymentOrder?.id || !paymentOrder?.amount || !paymentOrder?.currency) {
        throw new Error('Unable to create the payment order');
      }

      const paymentData = await RazorpayCheckout.open({
        key: razorpayKey,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        order_id: paymentOrder.id,
        name: 'Freaky Chimp',
        description: selectedEventType.name + ' booking',
        prefill: {
          name: birthdayPerson.trim(),
        },
        theme: { color: '#ff593e' },
      });
      const verification = await verifyPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        amount: paymentOrder.amount,
        source: 'EVENT',
        sourceId: eventId,
        bookingDetails: payload,
      });

      if (verification?.success === false || verification?.data?.success === false) {
        throw new Error('Payment verification failed');
      }

      const bookingId =
        verification?.data?.bookingId ||
        verification?.bookingId ||
        'FCB' + String(eventId).padStart(10, '0');
      router.replace({
        pathname: '/bookingConfirmation' as never,
        params: { bookingId: String(bookingId) },
      });
    } catch (error) {
      toast.error('Payment failed or was cancelled');
    } finally {
      setPaying(false);
    }
  };

  const updateGuests = (nextValue: number) => {
    const nextGuests = Math.min(1000, Math.max(1, nextValue));
    setGuests(nextGuests);
    setGuestInput(String(nextGuests));
  };

  const commitGuestInput = () => {
    const parsedGuests = Number.parseInt(guestInput, 10);
    updateGuests(Number.isFinite(parsedGuests) ? parsedGuests : guests);
    setEditingGuests(false);
  };

  const previewBookingConfirmation = () => {
    router.push({
      pathname: '/bookingConfirmation' as never,
      params: { bookingId: 'FCB250525001', preview: 'true' },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <EventDetailsForm>
        <StatusBar style="dark" backgroundColor="#ffffff" hidden={false} translucent={false} />

        <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={21} color="#172033" strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.title}>Event Details</Text>
        </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
      >
        <View style={styles.fieldGroup}>
          <FieldLabel>Event Type</FieldLabel>
          <Pressable style={styles.selectControl} onPress={() => setEventTypePickerOpen(true)}>
            <CalendarDays size={20} color="#4d5563" strokeWidth={1.9} />
            <Text style={styles.controlText}>{selectedEventType.name}</Text>
            <ChevronDown size={19} color="#536176" strokeWidth={2} style={styles.controlEndIcon} />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <FieldLabel>Birthday Person</FieldLabel>
          <View style={styles.textControl}>
            <UserRound size={19} color="#4d5563" strokeWidth={1.9} />
            <TextInput
              value={birthdayPerson}
              onChangeText={setBirthdayPerson}
              placeholder="Enter name"
              placeholderTextColor="#8a909a"
              inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_ACCESSORY_ID : undefined}
              style={styles.textInput}
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          <View style={styles.halfField}>
            <FieldLabel>Date</FieldLabel>
            <Pressable style={styles.textControl} onPress={() => setDatePickerOpen(true)}>
              <CalendarDays size={19} color="#4d5563" strokeWidth={1.9} />
              <Text style={styles.dateTimeText}>{dayjs(date).format('DD MMM YYYY')}</Text>
            </Pressable>
          </View>
          <View style={styles.halfField}>
            <FieldLabel>Time</FieldLabel>
            <Pressable style={styles.textControl} onPress={() => setTimePickerOpen(true)}>
              <Clock3 size={19} color="#4d5563" strokeWidth={1.9} />
              <Text style={styles.dateTimeText}>{dayjs(time).format('hh:mm A')}</Text>
              <ChevronDown size={18} color="#536176" strokeWidth={2} style={styles.controlEndIcon} />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <FieldLabel>Venue Type</FieldLabel>
          <View style={styles.venueRow}>
            <Pressable
              onPress={() => setVenueType('Indoor')}
              style={[styles.venueChoice, venueType === 'Indoor' && styles.venueChoiceActive]}
            >
              <Home size={20} color={venueType === 'Indoor' ? '#ff593e' : '#4d5563'} fill={venueType === 'Indoor' ? '#ff593e' : 'none'} strokeWidth={1.9} />
              <Text style={[styles.venueText, venueType === 'Indoor' && styles.venueTextActive]}>Indoor</Text>
            </Pressable>
            <Pressable
              onPress={() => setVenueType('Outdoor')}
              style={[styles.venueChoice, venueType === 'Outdoor' && styles.venueChoiceActive]}
            >
              <Sun size={20} color={venueType === 'Outdoor' ? '#ff593e' : '#4d5563'} strokeWidth={1.9} />
              <Text style={[styles.venueText, venueType === 'Outdoor' && styles.venueTextActive]}>Outdoor</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <FieldLabel>Venue Address</FieldLabel>
          <View style={[styles.textControl, styles.addressControl]}>
            <MapPin size={20} color="#4d5563" strokeWidth={1.9} style={styles.addressIcon} />
            <TextInput
              value={venueAddress}
              onChangeText={setVenueAddress}
              multiline
              textAlignVertical="center"
              placeholder="Enter venue address"
              placeholderTextColor="#8a909a"
              inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_ACCESSORY_ID : undefined}
              style={[styles.textInput, styles.addressInput]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choose saved address"
              hitSlop={8}
              onPress={() => {
                refetchAddresses();
                setAddressPickerOpen(true);
              }}
              style={styles.addressMenuButton}
            >
              <ChevronDown size={20} color="#536176" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <FieldLabel>Number of Guests</FieldLabel>
          <View style={styles.guestControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrease guests"
              hitSlop={8}
              onPress={() => updateGuests(guests - 1)}
              style={styles.guestAction}
            >
              <Minus size={21} color="#3d4654" strokeWidth={2} />
            </Pressable>
            {editingGuests ? (
              <TextInput
                autoFocus
                selectTextOnFocus
                value={guestInput}
                onChangeText={setGuestInput}
                onBlur={commitGuestInput}
                onSubmitEditing={commitGuestInput}
                keyboardType="number-pad"
                returnKeyType="done"
                inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_ACCESSORY_ID : undefined}
                style={styles.guestInput}
              />
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit guest count"
                onPress={() => {
                  setGuestInput(String(guests));
                  setEditingGuests(true);
                }}
                style={styles.guestCountButton}
              >
                <Text style={styles.guestCount}>{guests}</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increase guests"
              hitSlop={8}
              onPress={() => updateGuests(guests + 1)}
              style={styles.guestAction}
            >
              <Plus size={21} color="#3d4654" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <FieldLabel>Any Special Requests?</FieldLabel>
          <View style={[styles.textControl, styles.requestControl]}>
            <MessageSquareText size={20} color="#4d5563" strokeWidth={1.9} style={styles.requestIcon} />
            <TextInput
              value={specialRequests}
              onChangeText={setSpecialRequests}
              multiline
              textAlignVertical="top"
              placeholder="Write your requirements..."
              placeholderTextColor="#8a909a"
              inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_ACCESSORY_ID : undefined}
              style={[styles.textInput, styles.requestInput]}
            />
          </View>
        </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {__DEV__ && isExpoGo ? (
          <Pressable
            accessibilityRole="button"
            onPress={previewBookingConfirmation}
            style={styles.previewButton}
          >
            <Text style={styles.previewButtonLabel}>Preview payment success screen</Text>
          </Pressable>
        ) : null}
        <Pressable disabled={paying} style={[styles.submitButton, paying && styles.submitButtonDisabled]} onPress={handleSubmit}>
          <LinearGradient
            colors={['#ff593c', '#ffad4d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {paying ? <ActivityIndicator color="#ffffff" size="small" /> : <Lock size={17} color="#ffffff" strokeWidth={2} />}
            <Text style={styles.submitLabel}>{paying ? 'Opening Secure Payment...' : 'Proceed to Payment'}</Text>
          </LinearGradient>
        </Pressable>
        </View>

        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
            <View style={styles.keyboardAccessory}>
              <Pressable accessibilityRole="button" onPress={Keyboard.dismiss} style={styles.keyboardDoneButton}>
                <Text style={styles.keyboardDoneLabel}>Done</Text>
              </Pressable>
            </View>
          </InputAccessoryView>
        ) : null}

        <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerOpen}
        date={date}
        onDismiss={() => setDatePickerOpen(false)}
        onConfirm={({ date: nextDate }) => {
          setDatePickerOpen(false);
          if (nextDate) setDate(nextDate);
        }}
        />
        <TimePickerModal
        visible={timePickerOpen}
        hours={time.getHours()}
        minutes={time.getMinutes()}
        use24HourClock={false}
        onDismiss={() => setTimePickerOpen(false)}
        onConfirm={({ hours, minutes }) => {
          const nextTime = new Date(time);
          nextTime.setHours(hours, minutes, 0, 0);
          setTime(nextTime);
          setTimePickerOpen(false);
        }}
        />

        <Modal transparent visible={eventTypePickerOpen} animationType="fade" onRequestClose={() => setEventTypePickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setEventTypePickerOpen(false)}>
          <View style={styles.eventTypeSheet}>
            <Text style={styles.sheetTitle}>Select Event Type</Text>
            {eventTypes.map((eventType) => (
              <Pressable
                key={String(eventType.id)}
                onPress={() => {
                  setSelectedEventType(eventType);
                  setEventTypePickerOpen(false);
                }}
                style={styles.eventTypeOption}
              >
                <Text style={styles.eventTypeOptionText}>{eventType.name}</Text>
                {selectedEventType.id === eventType.id ? <Text style={styles.selectedMark}>Selected</Text> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
        </Modal>

        <Modal transparent visible={addressPickerOpen} animationType="fade" onRequestClose={() => setAddressPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAddressPickerOpen(false)}>
          <View style={styles.addressSheet}>
            <View style={styles.addressSheetHeader}>
              <View>
                <Text style={styles.addressSheetTitle}>Saved Addresses</Text>
                <Text style={styles.sheetSubtitle}>Choose the venue location</Text>
              </View>
              <Pressable
                onPress={() => {
                  setAddressPickerOpen(false);
                  router.push('/AddressManagementScreen');
                }}
                style={styles.addAddressButton}
              >
                <Plus size={18} color="#ff593e" strokeWidth={2.2} />
                <Text style={styles.addAddressLabel}>Add New</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.addressList}>
              {savedAddresses.length > 0 ? savedAddresses.map((address) => (
                <Pressable
                  key={String(address.id)}
                  onPress={() => {
                    setVenueAddress(formatSavedAddress(address));
                    setAddressPickerOpen(false);
                  }}
                  style={styles.savedAddressItem}
                >
                  <View style={styles.savedAddressIcon}>
                    <MapPin size={18} color="#ff593e" strokeWidth={2} />
                  </View>
                  <View style={styles.savedAddressCopy}>
                    <Text style={styles.savedAddressTitle}>{address.title || 'Saved Address'}</Text>
                    <Text style={styles.savedAddressText} numberOfLines={2}>{formatSavedAddress(address)}</Text>
                  </View>
                </Pressable>
              )) : (
                <View style={styles.emptyAddressState}>
                  <Text style={styles.emptyAddressTitle}>No saved addresses yet</Text>
                  <Text style={styles.emptyAddressCopy}>Add an address to use it as your venue.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Pressable>
        </Modal>
      </EventDetailsForm>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { height: 60, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  backButton: { position: 'absolute', left: 12, width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#141b2a', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 12, paddingTop: 14 },
  fieldGroup: { marginBottom: 21 },
  fieldLabel: { color: '#465064', fontSize: 14, lineHeight: 18, fontWeight: '700', marginBottom: 9 },
  selectControl: { height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, borderWidth: 1, borderColor: '#e9edf2', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  controlText: { color: '#283345', fontSize: 15, lineHeight: 19, marginLeft: 12 },
  controlEndIcon: { marginLeft: 'auto' },
  textControl: { minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, borderWidth: 1, borderColor: '#e9edf2', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  textInput: { flex: 1, minWidth: 0, color: '#293446', fontSize: 15, lineHeight: 19, marginLeft: 12, paddingVertical: 0 },
  dateTimeRow: { flexDirection: 'row', gap: 12, marginBottom: 21 },
  halfField: { flex: 1 },
  dateTimeText: { color: '#293446', fontSize: 14, lineHeight: 18, marginLeft: 10 },
  venueRow: { flexDirection: 'row', gap: 12 },
  venueChoice: { height: 47, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#e9edf2', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  venueChoiceActive: { borderColor: '#ff593e', backgroundColor: '#fffdfc' },
  venueText: { color: '#4d5563', fontSize: 15, lineHeight: 19, fontWeight: '600' },
  venueTextActive: { color: '#ff593e' },
  addressControl: { minHeight: 62, alignItems: 'stretch', paddingVertical: 8 },
  addressIcon: { marginTop: 7 },
  addressInput: { minHeight: 43, paddingTop: 0, paddingBottom: 0 },
  addressMenuButton: { width: 32, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  guestControl: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 9, borderWidth: 1, borderColor: '#e9edf2', borderRadius: 8, backgroundColor: '#ffffff', shadowColor: '#1c2738', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  guestAction: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center' },
  guestCountButton: { minWidth: 76, height: 40, alignItems: 'center', justifyContent: 'center' },
  guestCount: { color: '#ff593e', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  guestInput: { minWidth: 76, height: 40, color: '#ff593e', fontSize: 15, lineHeight: 19, fontWeight: '700', textAlign: 'center', paddingVertical: 0 },
  requestControl: { minHeight: 92, alignItems: 'stretch', paddingVertical: 11 },
  requestIcon: { marginTop: 1 },
  requestInput: { minHeight: 67, paddingTop: 0, paddingBottom: 0 },
  footer: { paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eff1f4', backgroundColor: '#ffffff' },
  previewButton: { height: 38, alignItems: 'center', justifyContent: 'center', marginBottom: 9, borderWidth: 1, borderColor: '#ff9e8b', borderRadius: 8, backgroundColor: '#fff8f6' },
  previewButtonLabel: { color: '#e94b33', fontSize: 13, lineHeight: 17, fontWeight: '700' },
  submitButton: { height: 48, overflow: 'hidden', borderRadius: 8 },
  submitButtonDisabled: { opacity: 0.74 },
  keyboardAccessory: { height: 42, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#d9dde4', backgroundColor: '#f5f6f8' },
  keyboardDoneButton: { height: 34, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  keyboardDoneLabel: { color: '#ff593e', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  submitGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitLabel: { color: '#ffffff', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.34)' },
  eventTypeSheet: { paddingTop: 20, paddingBottom: 28, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#ffffff' },
  addressSheet: { maxHeight: '70%', paddingTop: 20, paddingBottom: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#ffffff' },
  addressSheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#edf0f3' },
  sheetTitle: { color: '#1f2937', fontSize: 18, lineHeight: 23, fontWeight: '700', paddingHorizontal: 20, marginBottom: 9 },
  addressSheetTitle: { color: '#1f2937', fontSize: 18, lineHeight: 23, fontWeight: '700' },
  sheetSubtitle: { color: '#778397', fontSize: 13, lineHeight: 17, marginTop: 2 },
  addAddressButton: { height: 36, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ff9e8b', borderRadius: 7 },
  addAddressLabel: { color: '#ff593e', fontSize: 13, lineHeight: 17, fontWeight: '700' },
  addressList: { paddingHorizontal: 20 },
  savedAddressItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#edf0f3' },
  savedAddressIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#fff0ec' },
  savedAddressCopy: { flex: 1, marginLeft: 10 },
  savedAddressTitle: { color: '#273247', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  savedAddressText: { color: '#6d7b90', fontSize: 13, lineHeight: 17, marginTop: 2 },
  emptyAddressState: { alignItems: 'center', paddingVertical: 38 },
  emptyAddressTitle: { color: '#344054', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  emptyAddressCopy: { color: '#778397', fontSize: 13, lineHeight: 17, textAlign: 'center', marginTop: 4 },
  eventTypeOption: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  eventTypeOptionText: { color: '#344054', fontSize: 15, lineHeight: 19, fontWeight: '600' },
  selectedMark: { color: '#ff593e', fontSize: 13, lineHeight: 17, fontWeight: '700' },
});
