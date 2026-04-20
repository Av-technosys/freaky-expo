import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LinearGradient } from 'expo-linear-gradient';
import { TimePickerModal } from 'react-native-paper-dates';
import { Clock, Minus, Plus, X } from 'lucide-react-native';
import dayjs from 'dayjs';

type Props = {
  visible: boolean;
  onClose: () => void;
  startTime: any;
  endTime: any;
  quantity: number;
  showStartPicker: boolean;
  showEndPicker: boolean;
  onStartTimeChange: (time: any) => void;
  onEndTimeChange: (time: any) => void;
  onQuantityChange: (qty: number) => void;
  onShowStartPickerChange: (show: boolean) => void;
  onShowEndPickerChange: (show: boolean) => void;
  onConfirm: () => void;
};

export default function AddProductModal({
  visible,
  onClose,
  startTime,
  endTime,
  quantity,
  showStartPicker,
  showEndPicker,
  onStartTimeChange,
  onEndTimeChange,
  onQuantityChange,
  onShowStartPickerChange,
  onShowEndPickerChange,
  onConfirm,
}: Props) {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] w-[90%] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Product Details</DialogTitle>
          <DialogDescription>
            Set the time and quantity for this product
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Start Time */}
        <View className="gap-2">
          <Label className="text-sm font-medium">Start Time</Label>
          <Pressable
            onPress={() => onShowStartPickerChange(true)}
            className="flex-row items-center gap-2 rounded-lg border border-input bg-background p-3"
          >
            <Clock size={18} className="text-muted-foreground" />
            <Text className={startTime ? "flex-1 text-foreground" : "flex-1 text-muted-foreground"}>
              {startTime ? dayjs(startTime).format('hh:mm A') : 'Select start time'}
            </Text>
          </Pressable>
        </View>

        {/* End Time */}
        <View className="gap-2">
          <Label className="text-sm font-medium">End Time</Label>
          <Pressable
            onPress={() => onShowEndPickerChange(true)}
            className="flex-row items-center gap-2 rounded-lg border border-input bg-background p-3"
          >
            <Clock size={18} className="text-muted-foreground" />
            <Text className={endTime ? "flex-1 text-foreground" : "flex-1 text-muted-foreground"}>
              {endTime ? dayjs(endTime).format('hh:mm A') : 'Select end time'}
            </Text>
          </Pressable>
        </View>

        <Separator />

        {/* Quantity */}
        <View className="gap-2">
          <Label className="text-sm font-medium">Quantity</Label>
          <View className="flex-row items-center justify-center gap-6 py-2">
            <Pressable
              onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="h-10 w-10 rounded-full bg-muted items-center justify-center active:bg-muted/80"
            >
              <Minus size={20} className="text-foreground" />
            </Pressable>

            <Text className="text-2xl font-semibold text-foreground min-w-[50px] text-center">
              {quantity}
            </Text>

            <Pressable
              onPress={() => onQuantityChange(quantity + 1)}
              className="h-10 w-10 rounded-full bg-muted items-center justify-center active:bg-muted/80"
            >
              <Plus size={20} className="text-foreground" />
            </Pressable>
          </View>
        </View>

        <DialogFooter className="flex-row gap-3 mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          
          <Button onPress={onConfirm} className="flex-1 overflow-hidden">
            <LinearGradient
              colors={['#F97316', '#FACC15']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <Text className="text-white font-semibold">Add Product</Text>
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Time Pickers */}
      <TimePickerModal
        visible={showStartPicker}
        use24HourClock={false}
        onDismiss={() => onShowStartPickerChange(false)}
        onConfirm={({ hours, minutes }) => {
          const base = dayjs();
          onStartTimeChange(base.hour(hours).minute(minutes).second(0).toDate());
          onShowStartPickerChange(false);
        }}
        label="Select start time"
        cancelLabel="Cancel"
        confirmLabel="OK"
      />

      <TimePickerModal
        visible={showEndPicker}
        use24HourClock={false}
        onDismiss={() => onShowEndPickerChange(false)}
        onConfirm={({ hours, minutes }) => {
          const base = dayjs();
          onEndTimeChange(base.hour(hours).minute(minutes).second(0).toDate());
          onShowEndPickerChange(false);
        }}
        label="Select end time"
        cancelLabel="Cancel"
        confirmLabel="OK"
      />
    </Dialog>
  );
}