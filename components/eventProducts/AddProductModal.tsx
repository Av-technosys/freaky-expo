import React from 'react';
import { View, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
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
import TimeField from '@/components/common/TimeField';
import { Minus, Plus } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

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
  product: any;
  selectedSlabIndex: number | null;
  setSelectedSlabIndex: (index: number | null) => void;
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
  product,
  selectedSlabIndex,
  setSelectedSlabIndex,
}: Props) {

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90%] rounded-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Product Details</DialogTitle>
          <DialogDescription>Set the time and quantity for this product</DialogDescription>
        </DialogHeader>

        <Separator />

        <TimeField label="Start Time" value={startTime || undefined} onChange={onStartTimeChange} />

        <TimeField label="End Time" value={endTime || undefined} onChange={onEndTimeChange} />

        <Separator />

        {/* Quantity */}
        <View className="gap-2">
          <Label className="text-sm font-medium">Quantity</Label>
          <View className="flex-row items-center justify-center gap-6 py-2">
            <Pressable
              onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="h-10 w-10 items-center justify-center rounded-full bg-muted active:bg-muted/80">
              <Minus size={20} className="text-foreground" />
            </Pressable>

            <Text className="min-w-[50px] text-center text-2xl font-semibold text-foreground">
              {quantity}
            </Text>

            <Pressable
              onPress={() => onQuantityChange(quantity + 1)}
              className="h-10 w-10 items-center justify-center rounded-full bg-muted active:bg-muted/80">
              <Plus size={20} className="text-foreground" />
            </Pressable>
          </View>
        </View>

        {product?.pricingType === 'TIER' && product?.priceSlabs?.length ? (
          <View className="mt-4 px-2">
            <View className="mb-2 flex-row border-b border-gray-200 pb-2">
              <Text className="flex-1 font-semibold text-gray-700">Lower</Text>
              <Text className="flex-1 text-center font-semibold text-gray-700">Upper</Text>
              <Text className="flex-1 text-center font-semibold text-gray-700">Price</Text>
              <View style={{ width: 24 }} />
            </View>

            {product.priceSlabs.map((item: any, index: number) => {
              const isSelected = selectedSlabIndex === index;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSlabIndex(index)}
                  className="flex-row items-center border-b py-4">
                  <Text className="flex-1">{item.lowerSlab}</Text>
                  <Text className="flex-1 text-center">{item.upperSlab ?? '-'}</Text>
                  <Text className="flex-1 text-center text-orange-500">
                    ${Number(item.salePrice)}
                  </Text>

                  <View style={{ width: 24, alignItems: 'center' }}>
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: '#F97316',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {isSelected && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#F97316',
                          }}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        <DialogFooter className="mt-4 flex-row gap-3">
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
            <Text className="font-semibold text-white">Add Product</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
