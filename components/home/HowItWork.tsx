import { View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '../home/SectionHeader';

type Step = {
  id: number;
  text: string;
};

type Props = {
  steps?: Step[];
};

const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    text: 'Choose a tasker by price, skills, and reviews.',
  },
  {
    id: 2,
    text: 'Schedule a Tasker as early as today.',
  },
  {
    id: 3,
    text: 'Chat, pay, tip, and review all in one place.',
  },
];

export default function HowItWorksCard({ steps }: Props) {
  const data = steps && steps.length > 0 ? steps : DEFAULT_STEPS;

  // ✅ fallback safety
  if (!data || data.length === 0) return null;

  return (
    <View className="mb-16">

      {/* HEADER */}
      <SectionHeader
        left={
          <Text className="text-lg font-semibold text-foreground">
            How It Works
          </Text>
        }
      />

      {/* CARD */}
      <View className="px-4 mt-2">
        <Card className="rounded-2xl">
          <CardContent className="p-5">

            {data.map((step, index) => (
              <View
                key={step.id}
                className={`flex-row items-start ${
                  index !== data.length - 1 ? 'mb-5' : ''
                }`}
              >
                {/* GRADIENT NUMBER */}
                <MaskedView
                  style={{ width: 36, height: 40 }}
                  maskElement={
                    <Text className="text-4xl font-extrabold text-center">
                      {step.id}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#FFC107', '#FF5722']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                  />
                </MaskedView>

                {/* TEXT */}
                <Text className="ml-4 pt-1 flex-1 text-sm font-medium text-muted-foreground leading-5">
                  {step.text}
                </Text>
              </View>
            ))}

          </CardContent>
        </Card>
      </View>
    </View>
  );
}