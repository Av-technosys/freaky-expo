/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Image, Pressable, ImageSourcePropType } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Star, Users, MapPin } from 'lucide-react-native';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}: ProductCardProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Pressable
     onPress={() =>
        router.push({
          pathname: '/ProductDetails',
          params: {
            productId: id,
          },
        })
      }>
      <Card className="overflow-hidden border border-border bg-card">
        <CardContent className="p-0">
          <View className="flex-row">
            {/* Left Content */}
            <View className="flex-1 p-4">
              {/* Title */}
              <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
                {title}
              </Text>

              {/* Description */}
              <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={2}>
                {menu}
              </Text>

              {/* Rating and Guests */}
              <View className="mt-2 flex-row items-center gap-3">
                <View className="flex-row items-center">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <Text className="ml-1 text-sm text-foreground">{rating.toFixed(1)}</Text>
                </View>

                <View className="h-3 w-px bg-border" />

                <View className="flex-row items-center">
                  <Users size={14} className="text-muted-foreground" />
                  <Text className="ml-1 text-sm text-muted-foreground">{guests} guests</Text>
                </View>
              </View>

              {/* Price */}
              {price > 0 && (
                <View className="mt-3">
                  <Badge variant="secondary" className="self-start">
                    <Text className="font-bold text-primary">₹{price}</Text>
                  </Badge>
                </View>
              )}
            </View>

            {/* Right Image */}
            <View className="m-2 h-28 w-28 overflow-hidden rounded-lg bg-muted">
              <Image source={image} className="h-full w-full" resizeMode="cover" />
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
