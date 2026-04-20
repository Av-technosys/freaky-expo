import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { FloatingLabelInput } from './FloatingLabelInput';

type MediaItem = {
  localUri?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
};

type Service = {
  productId: number;
  title: string;
  description: string;
  rating: number;
  comment: string;
  media: MediaItem[];
  bannerImage: string;
  price: number | null;
};

type ServiceCardProps = {
  service: Service;
  mediaLoading: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onAddMedia: () => void;
  onRemoveMedia: (index: number) => void;
  canAddImage: boolean;
  getImageSource: (bannerImage: string) => any;
  getValidUri: (url: string | null | undefined) => string | undefined;
};

export function ServiceCard({
  service,
  mediaLoading,
  onRatingChange,
  onCommentChange,
  onAddMedia,
  onRemoveMedia,
  canAddImage,
  getImageSource,
  getValidUri,
}: ServiceCardProps) {
  const isExpanded = service.rating > 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <View className="flex-row items-center">
          <Image
            source={getImageSource(service.bannerImage)}
            className="h-14 w-14 rounded-2xl bg-muted"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-foreground">{service.title}</Text>
            {service.price && (
              <Text className="text-sm text-muted-foreground mt-1">${service.price}</Text>
            )}
          </View>
        </View>

        <View className="mt-4">
          <StarRating value={service.rating} onChange={onRatingChange} size={24} showLabels={false} />
        </View>

        {/* This section ONLY shows when rating is > 0 */}
        {isExpanded && (
          <View className="mt-4 pt-4 border-t border-border">
            <Text className="font-medium text-foreground mb-3">
              Add Media ({service.media.length}/4)
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {service.media.map((item: MediaItem, idx: number) => (
                <View key={idx} className="relative">
                  <Image 
                    source={{ uri: item.localUri || getValidUri(item.mediaUrl) }} 
                    className="h-20 w-20 rounded-xl bg-muted" 
                  />
                  <TouchableOpacity 
                    onPress={() => onRemoveMedia(idx)} 
                    className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1"
                  >
                    <AntDesign name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {mediaLoading && (
                <View className="h-20 w-20 rounded-xl bg-muted items-center justify-center">
                  <ActivityIndicator size="small" color="#f97316" />
                </View>
              )}
              
              {canAddImage && (
                <TouchableOpacity 
                  onPress={onAddMedia} 
                  className="h-20 w-20 rounded-xl border-2 border-dashed border-primary/30 items-center justify-center bg-primary/5"
                >
                  <AntDesign name="plus" size={24} color="#f97316" />
                </TouchableOpacity>
              )}
            </ScrollView>
            
            <FloatingLabelInput 
              label={`Comments for ${service.title}`} 
              value={service.comment} 
              onChangeText={onCommentChange} 
              multiline 
            />
          </View>
        )}
      </CardContent>
    </Card>
  );
}