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
    <View className="mb-6 rounded-3xl bg-card border border-border/40 overflow-hidden shadow-sm">
      <View className="p-2">
        <View className="flex-row items-center">
          <Image
            source={getImageSource(service.bannerImage)}
            className="h-16 w-16 rounded-2xl bg-muted border border-border/50"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-foreground">{service.title}</Text>
            {service.price && (
              <Text className="text-sm font-semibold text-primary mt-1">${service.price}</Text>
            )}
          </View>
        </View>

        <View className="mt-2 bg-muted/30 p-4 rounded-2xl">
          <Text className="text-sm font-medium text-muted-foreground mb-3 text-center">Rate this service</Text>
          <StarRating value={service.rating} onChange={onRatingChange} size={28} showLabels={false} />
        </View>

        {/* Expanded section */}
        {isExpanded && (
          <View className="mt-5 pt-5 border-t border-border/50">
            <Text className="text-sm font-bold text-foreground mb-4">
              Add Photos/Videos ({service.media.length}/4)
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 mb-5">
              {service.media.map((item: MediaItem, idx: number) => (
                <View key={idx} className="relative">
                  <Image 
                    source={{ uri: item.localUri || getValidUri(item.mediaUrl) }} 
                    className="h-24 w-24 rounded-2xl bg-muted border border-border/50" 
                  />
                  <TouchableOpacity 
                    onPress={() => onRemoveMedia(idx)} 
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-sm z-10"
                  >
                    <AntDesign name="close" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {mediaLoading && (
                <View className="h-24 w-24 rounded-2xl bg-muted items-center justify-center border border-border/50">
                  <ActivityIndicator size="small" color="#f97316" />
                </View>
              )}
              
              {canAddImage && (
                <TouchableOpacity 
                  onPress={onAddMedia} 
                  activeOpacity={0.7}
                  className="h-24 w-24 rounded-2xl border-2 border-dashed border-primary/40 items-center justify-center bg-primary/5"
                >
                  <View className="bg-primary/10 p-2 rounded-full mb-1">
                    <AntDesign name="camera" size={20} color="#f97316" />
                  </View>
                  <Text className="text-[10px] text-primary font-medium">Add Media</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            
            <FloatingLabelInput 
              label="Share more details about this service" 
              value={service.comment} 
              onChangeText={onCommentChange} 
              multiline 
            />
          </View>
        )}
      </View>
    </View>
  );
}