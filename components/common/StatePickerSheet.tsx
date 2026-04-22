import React, { useMemo } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Feather } from '@expo/vector-icons';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

type Props = {
  sheetRef: React.RefObject<BottomSheetMethods | null>;
  value?: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
};

export default function StatePickerSheet({ sheetRef, value, options, onSelect }: Props) {
  const snapPoints = useMemo(() => ['60%'], []);

  return (
    <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
      <View className="border-b border-border px-4 py-3">
        <Text className="text-lg font-semibold">Select State</Text>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled">
        {options.map((opt) => {
          const selected = opt.value === value;

          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                onSelect(opt.value);
                sheetRef.current?.close();
              }}
              className={`flex-row items-center justify-between px-2 py-3 ${
                selected ? 'rounded-md bg-primary/10' : ''
              }`}>
              <Text className={selected ? 'font-semibold text-primary' : ''}>{opt.label}</Text>

              {selected && <Feather name="check" size={18} color="#F97316" />}
            </Pressable>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
