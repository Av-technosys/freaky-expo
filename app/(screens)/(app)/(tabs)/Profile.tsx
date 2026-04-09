import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function ProfileScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Profile" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your profile is empty</Text>
      </View>
    </Screen>
  );
}