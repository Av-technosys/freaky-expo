import { View } from "react-native";
import { Stack, router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Failed() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Payment Failed",
          headerRight: () => <ThemeToggle />,
        }}
      />

      <View className="flex-1 bg-background items-center justify-center px-5">
        
        <Card className="w-full p-6 items-center gap-5">
          
          {/* Icon */}
          <Text className="text-5xl">❌</Text>

          {/* Title */}
          <Text className="text-2xl font-bold text-red-500">
            Payment Failed
          </Text>

          {/* Description */}
          <Text className="text-center text-muted-foreground">
            Something went wrong while processing your payment.
          </Text>

          <Text className="text-center text-muted-foreground text-sm">
            If your money was deducted, it will be refunded within 2–3 working days.
          </Text>

          {/* Actions */}
          <View className="w-full gap-3 mt-4">
            
            {/* Retry */}
            <Button
              onPress={() => router.replace("/profiles")}
              className="w-full"
            >
              Try Again
            </Button>

            {/* Go Back */}
            <Button
              variant="outline"
              onPress={() => router.replace("/")}
              className="w-full"
            >
              Go Back
            </Button>

          </View>
        </Card>

      </View>
    </>
  );
}