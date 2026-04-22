/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';

// Components
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppButton } from '@/components/common/AppButton';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { StarRating } from '@/components/review/StarRating';
import { FloatingLabelInput } from '@/components/review/FloatingLabelInput';
import { ServiceCard } from '@/components/review/ServiceCard';
// API
import { getBucketUrl } from '@/api/user';
import { getEventById } from '@/api/event';
import { getProductsByProductId } from '@/api/product';
import { addReview } from '@/api/review';

// Utils
import { getMediaUrl } from '@/utils/image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ServiceSkeleton from '@/app/skeleton/ServiceSkeleton';

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

export default function AddReview() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    eventId: string;
    productIds: string;
  }>();
  
  const eventId = Number(params.eventId);
  const productIds = JSON.parse(params.productIds || '[]');

  const [eventRating, setEventRating] = useState(0);
  const [eventComment, setEventComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (productIds && productIds.length > 0) {
      loadServices();
    } else {
      setServicesLoading(false);
    }
  }, [productIds]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadEvent = async () => {
    try {
      const res = await getEventById(eventId);
      console.log('Event response:', res);
      const eventData = Array.isArray(res?.data) && res.data.length > 0 ? res.data[0] : null;

      setEvent(eventData);
    } catch (err) {
      console.error('Failed to load event', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to load event',
        text2: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      const results = await Promise.all(
        productIds.map((id: number) => getProductsByProductId(id))
      );
      
      const mappedServices: Service[] = results
        .filter(result => result && (result.product || result.data))
        .map(r => {
          const productData = r.product || r.data;
          return {
            productId: productData?.productId ?? 0,
            title: productData?.title ?? 'Unknown Service',
            description: productData?.description ?? '',
            rating: 0,
            comment: '',
            media: [],
            bannerImage: productData?.bannerImage ?? '',
            price: productData?.prices?.[0]?.salePrice ?? null,
          };
        });
      
      setServices(mappedServices);
    } catch (err) {
      console.error('Failed to load services', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to load services',
        text2: 'Please try again',
      });
    } finally {
      setServicesLoading(false);
    }
  };

  const canAddImage = (media: MediaItem[]) => media.length < 4;
  const canAddVideo = (media: MediaItem[]) => media.filter(m => m.mediaType === 'video').length < 1 && media.length < 4;

const uploadToS3 = async (uploadUrl: string, fileUri: string, mimeType: string) => {
  try {
    console.log('🚀 START UPLOAD');
    console.log('📂 FILE URI:', fileUri);
    console.log('📦 MIME TYPE:', mimeType);
    console.log('🔗 UPLOAD URL:', uploadUrl);

    // 🔍 Extract time from URL (CRITICAL DEBUG)
    const url = new URL(uploadUrl);
    console.log('⏱ X-Amz-Date:', url.searchParams.get('X-Amz-Date'));
    console.log('⏱ ExpiresIn:', url.searchParams.get('X-Amz-Expires'));

    const response = await fetch(fileUri);
    const blob = await response.blob();

    console.log('📏 BLOB SIZE:', blob.size);

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      body: blob,
    });

    console.log('📡 S3 STATUS:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.log('❌ S3 ERROR BODY:', text);
      throw new Error('S3 upload failed');
    }

    console.log('✅ UPLOAD SUCCESS');

    return res;
  } catch (err) {
    console.log('🔥 UPLOAD ERROR:', err);
    throw err;
  }
};
  const handlePickMedia = async (productId: number) => {
    const service = services.find(s => s.productId === productId);
    if (!service) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      const isVideo = file.type === 'video';

      if (isVideo && !canAddVideo(service.media)) {
        Toast.show({
          type: 'error',
          text1: 'Upload limit reached',
          text2: 'You can upload only 1 video and max 4 media items.',
        });
        return;
      }
      if (!isVideo && !canAddImage(service.media)) {
        Toast.show({
          type: 'error',
          text1: 'Upload limit reached',
          text2: 'You can upload only 4 images.',
        });
        return;
      }

      setMediaLoading(true);
try {
  console.log('📸 PICKED FILE:', file);

  const res = await getBucketUrl({
    fileName: file.fileName ?? `review-${Date.now()}`,
    fileType: file.mimeType ?? 'image/jpeg',
    path: 'reviews',
  });

  console.log('🧾 PRESIGNED RESPONSE:', res);

  // 🔥 Validate response
  if (!res.uploadUrl || !res.filePath) {
    console.log('❌ INVALID PRESIGNED RESPONSE');
    throw new Error('Invalid presigned URL');
  }

  // 🔥 Upload immediately
  await uploadToS3(res.uploadUrl, file.uri, file.mimeType!);

  console.log('📁 FILE PATH SAVED:', res.filePath);

  setServices(prev =>
    prev.map(s =>
      s.productId === productId
        ? {
            ...s,
            media: [
              ...s.media,
              {
                localUri: file.uri,
                mediaUrl: res.filePath,
                mediaType: isVideo ? 'video' : 'image',
              },
            ],
          }
        : s
    )
  );

  Toast.show({
    type: 'success',
    text1: 'Media uploaded',
  });

} catch (error) {
  console.error('❌ Upload failed FULL:', error);
  Toast.show({
    type: 'error',
    text1: 'Upload failed',
  });
} finally {
  setMediaLoading(false);
}
    }
  };

  // ✅ FIXED: Proper handleRemoveMedia implementation
  const handleRemoveMedia = (productId: number, mediaIndex: number) => {
    setServices(prev => {
      const serviceIndex = prev.findIndex(s => s.productId === productId);
      if (serviceIndex === -1) return prev;
      
      const updated = [...prev];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        media: updated[serviceIndex].media.filter((_, idx) => idx !== mediaIndex)
      };
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (eventRating === 0) {
      Toast.show({
        type: 'error',
        text1: 'Rating required',
        text2: 'Please rate the event',
      });
      return;
    }

    const payload = {
      eventId: Number(eventId),
      eventRating,
      description: eventComment,
      products: services
        .filter(s => s.rating > 0)
        .map(s => ({
          productId: s.productId,
          rating: s.rating,
          description: s.comment,
          media: s.media.map(m => ({
            mediaUrl: m.mediaUrl,
            mediaType: m.mediaType,
          })),
        })),
    };

    try {
      await addReview(payload);
      Toast.show({
        type: 'success',
        text1: 'Review submitted',
        text2: 'Thank you for your feedback!',
      });
      router.back();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: 'Please try again',
      });
    }
  };

  const getImageSource = (bannerImage: string) => {
    if (bannerImage) {
      return { uri: getMediaUrl(bannerImage)! };
    }
    return require('@/assets/images/image_not_found.jpg');
  };

  const getValidUri = (url: string | null | undefined): string | undefined => {
    const mediaUrl = getMediaUrl(url);
    return mediaUrl || undefined;
  };

  const ReviewSkeleton = () => (
    <View className="px-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <View className="flex-row">
            <View className="h-20 w-20 rounded-2xl bg-gray-200" />
            <View className="ml-4 flex-1 gap-2">
              <View className="h-5 w-3/4 rounded-md bg-gray-200" />
              <View className="h-4 w-1/2 rounded-md bg-gray-200" />
              <View className="h-4 w-2/3 rounded-md bg-gray-200" />
            </View>
          </View>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <View className="h-6 w-1/2 rounded-md bg-gray-200 mb-4" />
          <View className="flex-row justify-between">
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} className="h-8 w-8 rounded-full bg-gray-200" />
            ))}
          </View>
        </CardContent>
      </Card>
      <ServiceSkeleton />
      <ServiceSkeleton />
    </View>
  );

  if (loading) {
    return (
      <Screen scroll>
        <ScreenHeader title="Write a Review" showBack rightType="menu" />
        <ReviewSkeleton />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Write a Review" showBack rightType="menu" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="p-4 pb-8"
          >
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              {/* Event Card */}
              <Card className="mb-6">
                <CardContent className="p-5">
                  <View className="flex-row items-start">
                    <View className="h-20 w-20 items-center justify-center rounded-2xl bg-orange-400 shadow-md">
                      <Feather name="gift" size={32} color="white" />
                    </View>
                    <View className="ml-4 flex-1">
                      <View className="flex-row flex-wrap justify-between items-start gap-2">
                        <Text className="flex-1 text-2xl font-bold text-foreground" numberOfLines={2}>
                          {event?.contactName || 'Event'}
                        </Text>
                        <Badge variant="secondary">
                          <Text className="text-primary">Event</Text>
                        </Badge>
                      </View>
                      <Text className="mt-2 text-sm text-muted-foreground">
                        Event #{event?.eventId}
                      </Text>
                      {event?.startTime && (
                        <View className="mt-4 gap-2">
                          <View className="flex-row items-center">
                            <Feather name="calendar" size={14} color="#6b7280" />
                            <Text className="ml-2 text-sm text-foreground">
                              {dayjs(event.startTime).format('dddd, D MMMM YYYY')}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Feather name="clock" size={14} color="#6b7280" />
                            <Text className="ml-2 text-sm text-foreground">
                              {dayjs(event.startTime).format('hh:mm A')} - {dayjs(event.endTime).format('hh:mm A')}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>

              {/* Event Rating Section */}
              <Card className="mb-8">
                <CardContent className="p-5">
                  <View className="flex-row items-center mb-4 gap-2">
                    <View className="h-6 w-1 rounded-full bg-primary" />
                    <Text className="text-xl font-bold text-foreground">Rate this Event</Text>
                  </View>
                  <StarRating value={eventRating} onChange={setEventRating} />
                  {eventRating > 0 && (
                    <View className="mt-4 pt-4 border-t border-border">
                      <FloatingLabelInput
                        label="Share your overall experience"
                        value={eventComment}
                        onChangeText={setEventComment}
                        multiline
                      />
                    </View>
                  )}
                </CardContent>
              </Card>

              {/* Services Section - Shows/Hides based on rating */}
            {/* {services.length > 0 && (
  <View className="mb-8">
    <View className="flex-row items-center mb-4 gap-2">
      <View className="h-6 w-1 rounded-full bg-primary" />
      <Text className="text-xl font-bold text-foreground">
        Rate Specific Services
      </Text>
    </View>

    {servicesLoading ? (
      <>
        <ServiceSkeleton />
        <ServiceSkeleton />
      </>
    ) : (
      services.map((service) => (
        <ServiceCard
          key={service.productId}
          service={service}
          mediaLoading={mediaLoading}
          onRatingChange={(rating: number) => {
            setServices(prev => {
              const index = prev.findIndex(s => s.productId === service.productId);
              if (index === -1) return prev;
              const updated = [...prev];
              updated[index] = { ...updated[index], rating };
              return updated;
            });
          }}
          onCommentChange={(comment: string) => {
            setServices(prev => {
              const index = prev.findIndex(s => s.productId === service.productId);
              if (index === -1) return prev;
              const updated = [...prev];
              updated[index] = { ...updated[index], comment };
              return updated;
            });
          }}
          onAddMedia={() => handlePickMedia(service.productId)}
          onRemoveMedia={(mediaIndex: number) =>
            handleRemoveMedia(service.productId, mediaIndex)
          }
          canAddImage={canAddImage(service.media)}
          getImageSource={getImageSource}
          getValidUri={getValidUri}
        />
      ))
    )}
  </View>
)} */}

              {/* Submit Button */}
              <AppButton onPress={handleSubmit}>
                Submit Review
              </AppButton>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}