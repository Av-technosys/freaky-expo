import React from 'react';
import { View, Pressable, Modal, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
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
      <View className="flex-1 items-center justify-center bg-black/60 px-4">
        <View className="w-full max-w-sm rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <View className="relative border-b border-gray-100 px-6 pb-4 pt-6">
            <View className="absolute right-4 top-4">
              <Pressable
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Feather name="x" size={18} color="#6B7280" />
              </Pressable>
            </View>
            <View className="items-center">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50">
                <Feather name="check-square" size={24} color="#F97316" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Choose Your Services</Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Select the services you want to include
              </Text>
            </View>
          </View>

          {/* Service List */}
          {/* Service List */}
          <ScrollView
            className="max-h-[40vh] px-6 py-4"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}>
            <View className="space-y-3">
              {steps.map((step) => {
                const checked = tempEnabledSteps.includes(step.key);

                return (
                  <Pressable
                    key={step.id}
                    onPress={() => onStepToggle(step.key)}
                    className={`mt-2 rounded-2xl border p-2 ${
                      checked ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'
                    }`}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-3">
                          <View
                            className={`h-6 w-6 items-center justify-center rounded-lg border-2 ${
                              checked
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300 bg-white'
                            }`}>
                            {checked && <Feather name="check" size={14} color="#FFFFFF" />}
                          </View>

                          <Text
                            className={`text-base font-semibold ${
                              checked ? 'text-orange-700' : 'text-gray-700'
                            }`}>
                            {step.label}
                          </Text>
                        </View>

                        {checked && (
                          <Text className="mt-1 text-xs text-orange-600">Service included</Text>
                        )}
                      </View>

                      {checked && (
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                          <Feather name="check-circle" size={16} color="#F97316" />
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="border-t border-gray-100 px-6 py-4">
            <AppButton
              onPress={onConfirm}
              className="h-12 rounded-2xl"
              disabled={tempEnabledSteps.length === 0}>
              <View className="flex-row items-center justify-center gap-2">
                <Feather name="check" size={18} color="white" />
                <Text className="font-semibold text-white">
                  Confirm {tempEnabledSteps.length > 0 && `(${tempEnabledSteps.length})`}
                </Text>
              </View>
            </AppButton>

            {tempEnabledSteps.length === 0 && (
              <Text className="mt-2 text-center text-xs text-gray-500">
                Please select at least one service
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
