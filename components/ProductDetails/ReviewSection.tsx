import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// UI
import { Text } from '@/components/ui/text';
import ReviewCard from '@/components/common/card/ReviewCard';

type Review = {
  reviewId: number;
  rating: number;
  title: string;
  description: string;
  createdAt: string;
  reviewMedia: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
  }[];
};

type Props = {
  reviews: Review[];
  loading: boolean;
};

export default function CustomerReviewsSection({
  reviews,
  loading,
}: Props) {
  const router = useRouter();

  if (loading || !reviews?.length) return null;

  return (
    <View className="mt-4">

      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-xl font-bold">
            Customer Reviews
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            What our customers say
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/reviews',
              params: { data: JSON.stringify(reviews) },
            })
          }
        >
          <Text className="text-sm text-gray-500">See All</Text>
        </Pressable>
      </View>

      {/* REVIEWS */}
      {reviews.slice(0, 2).map((review) => {
        const images =
          review.reviewMedia
            ?.filter((m) => m.mediaType === 'image')
            ?.map((m) => ({
              uri: m.mediaUrl, // ✅ RAW ONLY
            })) ?? [];

        const videos =
          review.reviewMedia
            ?.filter((m) => m.mediaType === 'video')
            ?.map((m) => m.mediaUrl) ?? []; // ✅ RAW ONLY

        return (
          <ReviewCard
            key={review.reviewId}
            title={review.title}
            rating={review.rating}
            comment={review.description}
            createdAt={review.createdAt}
            images={images}
            videos={videos}
          />
        );
      })}
    </View>
  );
}