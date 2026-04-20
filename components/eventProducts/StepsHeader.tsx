import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Feather, AntDesign } from '@expo/vector-icons';

type Step = {
  id: number;
  key: string;
  label: string;
};

type Props = {
  steps: Step[];
  activeStep: string;
  stepStatus: Record<string, 'initial' | 'green' | 'yellow' | 'red'>;
  enabledSteps: string[];
  tempEnabledSteps: string[];
  onStepPress: (step: string) => void;
  onFilterPress: () => void;
  onPlusPress: () => void;
};

export default function StepsHeader({
  steps,
  activeStep,
  stepStatus,
  onStepPress,
  onFilterPress,
  onPlusPress,
}: Props) {
  const getStepColor = (step: Step) => {
    if (step.key === activeStep) return 'text-yellow-500 underline';
    if (stepStatus[step.key] === 'green') return 'text-green-600';
    if (stepStatus[step.key] === 'red') return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <View className="flex-row items-center justify-between gap-2 mx-3 pt-2">
      <View className="flex-row items-center justify-between bg-white p-2 flex-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}
        >
          {steps.map((step, index) => (
            <Pressable key={step.key} onPress={() => onStepPress(step.key)} className="flex-row items-center">
              <Text className={`text-md font-semibold ${getStepColor(step)}`}>{step.label}</Text>
              {index < steps.length - 1 && <Text className="mx-2 text-gray-700">{'>'}</Text>}
            </Pressable>
          ))}
        </ScrollView>
        <Pressable onPress={onFilterPress} className="ml-3">
          <Feather name="sliders" size={20} color="#00000" />
        </Pressable>
      </View>
      <Pressable onPress={onPlusPress} className="ml-3 w-9 h-9 rounded-full bg-orange-500 items-center justify-center shadow">
        <AntDesign name="plus" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}