import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function CategoryProductsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Category Products" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your category products are empty</Text>
      </View>
    </Screen>
  );
}