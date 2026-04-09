import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function FAQScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="FAQ" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your FAQ entries are empty</Text>
      </View>
    </Screen>
  );
}