import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function CartScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Cart" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your cart is empty</Text>
      </View>
    </Screen>
  );
}