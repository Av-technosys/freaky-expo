import { View } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Success() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Payment Success",
          headerRight: () => <ThemeToggle />,
        }}
      />

      <View className="flex-1 bg-background items-center justify-center px-5">
        
        <Card className="w-full p-6 items-center gap-5">
          
          {/* Success Emoji */}
          <Text className="text-5xl">🎉</Text>

          {/* Title */}
          <Text className="text-2xl font-bold text-green-500">
            Payment Successful
          </Text>

          {/* Amount */}
          <Text className="text-lg text-muted-foreground">
            ₹{amount || "500"} has been paid successfully
          </Text>

          {/* Description */}
          <Text className="text-center text-muted-foreground">
            Thank you! Your access has been unlocked.
          </Text>

          {/* Button */}
          <Button
            className="w-full mt-4"
            onPress={() => router.replace("/profiles")}
          >
            Go to Profiles
          </Button>
        </Card>

      </View>
    </>
  );
}