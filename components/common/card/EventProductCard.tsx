/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Image, Pressable, ImageSourcePropType } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Star, Users, Plus, Trash2 } from 'lucide-react-native';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

type RootStackParamList = {
  CategoryProducts: undefined;
  ProductDetails: any;
};

type ProductCardProps = {
  id: number;
  title: string;
  guests: string;
  menu: string;
  rating: number;
  reviews?: string;
  price: number;
  image: ImageSourcePropType;
  added?: boolean;
  disabled?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
};

export default function ProductCard({
  id,
  title,
  guests,
  menu,
  rating,
  price,
  image,
  added = false,
  disabled = false,
  onAdd,
  onRemove,
}: ProductCardProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleImagePress = () => {
    router.push({
      pathname: '/ProductDetails',
      params: { productId: id },
    });
  };

  return (
    <Card className={`overflow-hidden border border-border ${disabled ? 'opacity-60' : ''}`}>
      <CardContent className="p-0">
        <View className="flex-row">
          {/* Left Content */}
          <View className="flex-1 p-4">
            {/* Title */}
            <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
              {title}
            </Text>

            {/* Guests and Menu Type */}
            <Text className="mt-1 text-sm text-muted-foreground">
              {guests} • {menu}
            </Text>

            {/* Rating */}
            <View className="mt-2 flex-row items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={i <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
                />
              ))}
            </View>

            {/* Price */}
            <View className="mt-2 h-6 justify-center">
              {price != null && price !== 0 ? (
                <Text className="text-lg font-semibold text-foreground">₹{price}</Text>
              ) : (
                <Text className="text-lg font-semibold text-transparent"> </Text>
              )}
            </View>

            {/* Action Button - Add/Remove */}
            {!added ? (
              <Button
                disabled={disabled}
                onPress={onAdd}
                size="sm"
                className={`mt-3 w-24 ${disabled ? 'bg-muted' : 'bg-yellow-500'}`}
              >
                <View className="flex-row items-center gap-1">
                  <Plus size={14} color="white" />
                  <Text className="font-bold text-white">Add</Text>
                </View>
              </Button>
            ) : (
              <Pressable
                disabled={disabled}
                onPress={onRemove}
                className={`mt-3 self-start rounded-md border px-4 py-1.5 ${
                  disabled ? 'border-muted' : 'border-yellow-500'
                }`}
              >
                <View className="flex-row items-center gap-1">
                  <Trash2 size={14} color={disabled ? '#9CA3AF' : '#F59E0B'} />
                  <Text
                    className={`font-semibold ${
                      disabled ? 'text-muted-foreground' : 'text-yellow-500'
                    }`}
                  >
                    Remove
                  </Text>
                </View>
              </Pressable>
            )}
          </View>

          {/* Right Image - Pressable to navigate */}
          <Pressable onPress={handleImagePress} className="p-2">
            <View className="h-40 w-44 overflow-hidden rounded-xl bg-muted">
              <Image source={image} className="h-full w-full" resizeMode="cover" />
            </View>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}