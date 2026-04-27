import { useState } from 'react';
import { View } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react-native';

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
};

export default function DateField({ value, onChange, label = 'Select Date' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View className="gap-2">
      <Label>{label}</Label>

      <Button
        variant="outline"
        className="h-12 justify-start rounded-xl border border-input bg-background px-4"
        onPress={() => setOpen(true)}>
        <Calendar size={18} color="#999" />

        <Text className="ml-2 text-base font-normal text-foreground">
          {value ? dayjs(value).format('DD MMM YYYY') : 'Pick a date'}
        </Text>
      </Button>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={value}
        onConfirm={(params) => {
          setOpen(false);
          if (params.date) onChange(params.date);
        }}
        validRange={{
          startDate: new Date(), // 🔥 no past dates
        }}
      />
    </View>
  );
}
