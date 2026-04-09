import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function EventDetailsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Event Details" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your event details are empty</Text>
      </View>
    </Screen>
  );
}