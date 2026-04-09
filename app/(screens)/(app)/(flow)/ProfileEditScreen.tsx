import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function ProfileEditScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Profile Edit" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your profile edit settings are empty</Text>
      </View>
    </Screen>
  );
}