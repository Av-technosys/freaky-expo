import { View } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch } from '@/store/hooks';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import BookingDetailsForm from '@/components/common/form/BookingDetailsForm';
import { setBookingDetails } from '@/store/slices/eventSlice';

export default function EventDetailsScreen() {
  const dispatch = useAppDispatch();

  const handleSubmit = (data: any) => {
    dispatch(setBookingDetails(data));

    router.push('/eventProducts');
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Events" showBack rightType="menu" />

      <View className=" mt-2">
        <BookingDetailsForm
          onSubmit={handleSubmit}
          submitLabel="Continue"
        />
      </View>
    </Screen>
  );
}