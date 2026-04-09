import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function ManageBookingsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Manage Bookings" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your bookings are empty</Text>
      </View>
    </Screen>
  );
}   