import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function ProductDetailsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Product Details" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your product details are empty</Text>
      </View>
    </Screen>
  );
}