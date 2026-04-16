// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Pressable,
//   Modal,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { TimePickerModal } from 'react-native-paper-dates';
// import dayjs from 'dayjs';
// import { useNavigation } from '@react-navigation/native';

// // Redux
// import { useAppDispatch } from '@/store/hooks';
// import { addToCart } from '@/store/slices/cartSlice';

// // API
// import { addCartItem } from '@/api/cart';

// // UI
// import FloatingInput from '@/components/common/FloatingInput';
// import Button from '@/components/common/Button';
// import { showAndroidToast } from '@/components/toast/androidToast';

// type Props = {
//   product: {
//     productId: number;
//     title: string;
//     vendorName?: string;
//     price: number;
//   };
// };

// export default function AddToCartForm({ product }: Props) {
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation();

//   const keyboardOffset = Platform.OS === 'ios' ? 40 : 20;

//   // FORM STATE
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');

//   const [guests, setGuests] = useState<string | null>(null);
//   const [date, setDate] = useState<Date | null>(null);
//   const [time, setTime] = useState<Date | null>(null);

//   // UI STATE
//   const [loading, setLoading] = useState(false);
//   const [showGuestPicker, setShowGuestPicker] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   const isValid =
//     fullName && phone.length >= 10 && address && date && time && guests;

//   const parseGuests = (value: string | null) => {
//     if (!value) return { min: 0, max: 0 };
//     const [min, max] = value.split('–').map(Number);
//     return { min, max };
//   };

//   const handleSubmit = async () => {
//     if (!date || !time || !guests) return;

//     try {
//       setLoading(true);

//       const eventDate = new Date(date);
//       eventDate.setHours(time.getHours(), time.getMinutes());

//       const { min, max } = parseGuests(guests);

//       // API PAYLOAD
//       const payload = {
//         productId: product.productId,
//         quantity: 1,
//         name: fullName.trim(),
//         contactNumber: phone.trim(),
//         date: eventDate.toISOString(),
//         minGuestCount: min,
//         maxGuestCount: max,
//         latitude: 0,
//         longitude: 0,
//       };

//       await addCartItem(payload);

//       // Redux
//       dispatch(
//         addToCart({
//           productId: product.productId,
//           title: product.title,
//           vendorName: product.vendorName,
//           price: product.price,
//           quantity: 1,
//         })
//       );

//       showAndroidToast('Added to cart');

//       setLoading(false);

//       // go to cart (clean navigation)
//       navigation.navigate('Cart' as never);
//     } catch (err) {
//       setLoading(false);
//       showAndroidToast('Failed to add to cart');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior="position"
//       keyboardVerticalOffset={keyboardOffset}
//     >
//       <View>
//         <Text className="text-2xl font-bold mb-6">
//           Booking Details
//         </Text>

//         {/* INPUTS */}
//         <FloatingInput label="Full Name" value={fullName} onChangeText={setFullName} />
//         <FloatingInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
//         <FloatingInput label="Address" value={address} onChangeText={setAddress} />

//         {/* DATE */}
//         <Pressable onPress={() => setShowDatePicker(true)}>
//           <FloatingInput
//             label="Date"
//             value={date ? dayjs(date).format('DD MMM YYYY') : ''}
//             editable={false}
//           />
//         </Pressable>

//         {/* TIME */}
//         <Pressable onPress={() => setShowTimePicker(true)}>
//           <FloatingInput
//             label="Time"
//             value={time ? dayjs(time).format('hh:mm A') : ''}
//             editable={false}
//           />
//         </Pressable>

//         {/* GUESTS */}
//         <Pressable onPress={() => setShowGuestPicker(true)}>
//           <FloatingInput
//             label="Guests"
//             value={guests ?? ''}
//             editable={false}
//           />
//         </Pressable>

//         {/* BUTTON */}
//         <Button
//           label={loading ? 'Adding...' : 'Add to Cart'}
//           disabled={!isValid || loading}
//           onPress={handleSubmit}
//         />
//       </View>

//       {/* TIME PICKER */}
//       <TimePickerModal
//         visible={showTimePicker}
//         onDismiss={() => setShowTimePicker(false)}
//         onConfirm={({ hours, minutes }) => {
//           const base = dayjs(date ?? new Date());
//           setTime(base.hour(hours).minute(minutes).toDate());
//           setShowTimePicker(false);
//         }}
//       />

//       {/* DATE PICKER */}
//       <Modal visible={showDatePicker} transparent>
//         <Pressable
//           className="flex-1 bg-black/40 justify-center"
//           onPress={() => setShowDatePicker(false)}
//         >
//           <View className="bg-white m-4 rounded-2xl">
//             <Calendar
//               minDate={dayjs().format('YYYY-MM-DD')}
//               onDayPress={(day) => {
//                 setDate(dayjs(day.dateString).toDate());
//                 setShowDatePicker(false);
//               }}
//             />
//           </View>
//         </Pressable>
//       </Modal>

//       {/* GUESTS */}
//       <Modal visible={showGuestPicker} transparent>
//         <Pressable
//           className="flex-1 bg-black/40 justify-end"
//           onPress={() => setShowGuestPicker(false)}
//         >
//           <View className="bg-white p-4 rounded-t-2xl">
//             {['0–100', '101–200', '201–350', '351–500'].map((g) => (
//               <Pressable
//                 key={g}
//                 onPress={() => {
//                   setGuests(g);
//                   setShowGuestPicker(false);
//                 }}
//               >
//                 <Text className="p-3">{g}</Text>
//               </Pressable>
//             ))}
//           </View>
//         </Pressable>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }