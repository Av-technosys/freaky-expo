import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function CartProductDetailScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Cart Product Detail" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your cart product detail is empty</Text>
      </View>
    </Screen>
  );
}