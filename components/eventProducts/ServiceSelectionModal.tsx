import React from 'react';
import { View, Pressable, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { AppButton } from '../common/AppButton';

type Step = {
  id: number;
  key: string;
  label: string;
};

type Props = {
  visible: boolean;
  steps: Step[];
  tempEnabledSteps: string[];
  onClose: () => void;
  onStepToggle: (stepKey: string) => void;
  onConfirm: () => void;
};

export default function ServiceSelectionModal({
  visible,
  steps,
  tempEnabledSteps,
  onClose,
  onStepToggle,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40">
        <Card className="w-[90%] rounded-2xl">
          <CardContent className="p-5">
            <View className="items-end">
              <Pressable onPress={onClose}>
                <Text className="text-2xl">✕</Text>
              </Pressable>
            </View>

            <View className="relative items-center mb-4">
              <View className="absolute left-0 right-0 top-1/2 h-[1px] bg-orange-400" />
              <Text className="px-4 text-lg font-semibold text-orange-500 bg-white">Choose Your Services</Text>
            </View>

            <View className="mt-2">
              {steps.map(step => {
                const checked = tempEnabledSteps.includes(step.key);
                return (
                  <Pressable
                    key={step.id}
                    onPress={() => onStepToggle(step.key)}
                    className="flex-row items-center justify-between px-3 py-2 rounded-xl mb-2"
                  >
                    <Text className={`text-lg font-medium ${checked ? 'text-orange-600' : 'text-orange-500'}`}>
                      {step.label}
                    </Text>
                    <View className={`w-6 h-6 rounded-md border items-center justify-center ${checked ? 'bg-orange-500 border-orange-500' : 'border-gray-400'}`}>
                      {checked && <Feather name="check" size={16} color="#fff" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
           <AppButton>
            Confirm
           </AppButton>
            
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
}