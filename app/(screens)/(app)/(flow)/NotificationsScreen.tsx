import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function NotificationsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Notifications" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your notifications are empty</Text>
      </View>
    </Screen>
  );
}