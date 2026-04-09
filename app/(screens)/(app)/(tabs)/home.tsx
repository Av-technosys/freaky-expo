import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function HomeScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Home" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Welcome to the Home Screen</Text>
      </View>
    </Screen>
  );
}