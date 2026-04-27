// components/common/TimeField.tsx

import { useState } from 'react';
import { View } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react-native';

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
};

export default function TimeField({ value, onChange, label = 'Select Time' }: Props) {
  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);

  const onConfirm = ({ hours, minutes }: any) => {
    setVisible(false);

    const date = value ? new Date(value) : new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    onChange(date);
  };

  return (
    <View className="gap-2">
      <Label>{label}</Label>

      <Button
        variant="outline"
        className="h-12 justify-start rounded-xl border border-input bg-background px-4"
        onPress={() => setVisible(true)}>
        <Clock size={18} color="#999" />

        <Text className="ml-2 text-base font-normal text-foreground">
          {value ? dayjs(value).format('hh:mm A') : 'Pick a time'}
        </Text>
      </Button>

      {/* 🔥 BEAUTIFUL MATERIAL TIME PICKER */}
      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={value ? value.getHours() : 12}
        minutes={value ? value.getMinutes() : 0}
        use24HourClock={false}
      />
    </View>
  );
}
