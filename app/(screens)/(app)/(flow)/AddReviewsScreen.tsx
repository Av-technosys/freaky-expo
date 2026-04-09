import ScreenHeader from "@/components/common/ScreenHeader";
import { View , Text } from "react-native";
import Screen from "@/app/provider/Screen";
export default function AddReviewsScreen() {
  return (
    <Screen scroll>
      <ScreenHeader title="Add Reviews" showBack />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium">Your reviews are empty</Text>
      </View>
    </Screen>
  );
}