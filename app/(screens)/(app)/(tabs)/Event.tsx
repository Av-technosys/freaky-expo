import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function EventScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Event" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your event is empty</Text>
      </View>
    </Screen>
  );
}