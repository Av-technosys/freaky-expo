import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function PermissionScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Permission" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your permission settings are empty</Text>
      </View>
    </Screen>
  );
}