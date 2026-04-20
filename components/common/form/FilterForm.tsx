/* eslint-disable react/self-closing-comp */
import React, { forwardRef, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, AntDesign } from '@expo/vector-icons';

// Reusable UI
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = {
  label: string;
  value: string;
};
const FilterBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const snapPoints = useMemo(() => ['60%'], []);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState<number | null>(null);
const [selectedAddress, setSelectedAddress] = useState<Option | undefined>();

  const addressOptions: Option[] = [
    { label: 'Akshya Nagar 1st Block Ahmedabad', value: 'akshya' },
    { label: 'Satellite, Ahmedabad', value: 'satellite' },
    { label: 'Vastrapur, Ahmedabad', value: 'vastrapur' },
    { label: 'Prahlad Nagar, Ahmedabad', value: 'prahlad' },
  ];

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setRating(null);
    setSelectedAddress(undefined);
  };

  const handleApply = () => {
    console.log('Apply filters:', {
      minPrice,
      maxPrice,
      rating,
      selectedAddress,
    });
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ borderRadius: 24 }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
              <Feather name="sliders" size={18} color="#F97316" />
            </View>
            <Text className="text-xl font-bold">Filter By</Text>
          </View>

          <Pressable onPress={handleReset} className="px-3 py-2 rounded-lg bg-muted/50">
            <Text className="text-sm text-primary font-medium">Reset All</Text>
          </Pressable>
        </View>

        <Separator className="mb-6" />

        {/* PRICE RANGE */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-semibold">Price Range</Text>
              {(minPrice || maxPrice) && (
                <Pressable onPress={() => { setMinPrice(''); setMaxPrice(''); }}>
                  <Text className="text-xs text-primary">Clear</Text>
                </Pressable>
              )}
            </View>

            <View className="flex-row gap-3">
              
              {/* MIN */}
              <View className="flex-1">
                <View className="flex-row items-center bg-muted/50 rounded-xl px-3">
                  <Feather name="anchor" size={16} color="#9CA3AF" />
                  <Input
                    placeholder="Min Price"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                    className="flex-1 ml-2"
                  />
                </View>
              </View>

              <Text className="self-center text-muted-foreground">-</Text>

              {/* MAX */}
              <View className="flex-1">
                <View className="flex-row items-center bg-muted/50 rounded-xl px-3">
                  <Feather name="anchor" size={16} color="#9CA3AF" />
                  <Input
                    placeholder="Max Price"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                    className="flex-1 ml-2"
                  />
                </View>
              </View>

            </View>
          </CardContent>
        </Card>

        {/* RATING */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-semibold">Rating</Text>
              {rating && (
                <Pressable onPress={() => setRating(null)}>
                  <Text className="text-xs text-primary">Clear</Text>
                </Pressable>
              )}
            </View>

            <View className="flex-row justify-between">
              {[1, 2, 3, 4, 5].map(i => (
                <Pressable
                  key={i}
                  onPress={() => setRating(i)}
                  className="flex-1 items-center py-2 rounded-lg bg-muted/50 mx-1"
                >
                  <View className="flex-row items-center gap-1">
                    <AntDesign
                      name="star"
                      size={20}
                      color={rating && i <= rating ? '#FACC15' : '#D1D5DB'}
                    />
                    <Text className="text-sm">{i}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* LOCATION */}
        <Card className="mb-8">
          <CardContent className="pt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-semibold">Location</Text>
              {selectedAddress && (
                <Pressable onPress={() => setSelectedAddress(undefined)}>
                  <Text className="text-xs text-primary">Clear</Text>
                </Pressable>
              )}
            </View>

        <Select
  value={selectedAddress}
  onValueChange={setSelectedAddress}
>
              <SelectTrigger className="w-full bg-muted/50">
                <View className="flex-row items-center gap-2">
                  <Feather name="map-pin" size={16} color="#9CA3AF" />
                  <SelectValue placeholder="Select location">
                    {selectedAddress?.label}
                  </SelectValue>
                </View>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Saved Addresses</SelectLabel>

                 {addressOptions.map(option => (
  <SelectItem label='' key={option.value} value={option.value}>
    <View className="flex-row items-center gap-2">
      <Feather name="map-pin" size={14} color="#F97316" />
      <Text>{option.label}</Text>
    </View>
  </SelectItem>
))}

                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* APPLY BUTTON */}
        <Button onPress={handleApply} className="overflow-hidden">
          <LinearGradient
            colors={['#F97316', '#FACC15']}
            style={{ position: 'absolute', inset: 0 }}
          />
          <Text className="text-white font-bold text-lg text-center">
            Apply Filters
          </Text>
        </Button>

      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default FilterBottomSheet;