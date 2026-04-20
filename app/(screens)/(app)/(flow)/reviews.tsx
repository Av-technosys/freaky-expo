import { ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';

// Components
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import ReviewCard from '@/components/common/card/ReviewCard';
import NotFound from '@/components/common/NotFound';

// API
import { getAllReviews, deleteReview } from '@/api/review';
import { getProductsByProductId } from '@/api/product';

// Toast
import Toast from 'react-native-toast-message';

type ReviewUIModel = {
  id: number;
  productTitle: string;
  daysAgo: string;
  rating: number;
  comment: string;
  media: {
    url: string;
    type: 'image' | 'video';
  }[];
};

// Loading Skeleton Component
const ReviewSkeleton = () => (
  <View className="mb-4 p-4 bg-card rounded-xl">
    <View className="flex-row items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <View className="flex-row gap-2">
          <Skeleton className="h-24 w-24 rounded-lg" />
          <Skeleton className="h-24 w-24 rounded-lg" />
        </View>
      </View>
    </View>
  </View>
);

export default function Reviews() {
  const route = useRoute<any>();
  const [reviews, setReviews] = useState<ReviewUIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const passedReviews = route.params?.reviews;

  useEffect(() => {
    if (passedReviews?.length) {
      setReviews(mapPassedReviews(passedReviews));
      setLoading(false);
    } else {
      loadReviews();
    }
  }, []);

  const mapPassedReviews = (data: any[]): ReviewUIModel[] =>
    data.map((review) => ({
      id: review.reviewId,
      productTitle: 'Event Review',
      rating: review.rating,
      comment: review.description,
      daysAgo: formatDate(review.createdAt),
      media:
        review.reviewMedia?.map((m: any) => ({
          url: m.mediaUrl,
          type: m.mediaType,
        })) ?? [],
    }));

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      Toast.show({
        type: 'success',
        text1: 'Review deleted',
        text2: 'Your review has been removed successfully',
      });
    } catch (error) {
      console.error('Delete failed', error);
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: 'Please try again later',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await getAllReviews();

      const mapped = await Promise.all(
        res.data.map(async (review: any) => {
          let productTitle = 'Event Review';

          if (review.productId) {
            try {
              const p = await getProductsByProductId(review.productId);
              productTitle = p.product?.title ?? productTitle;
            } catch (error) {
              console.log('Failed to fetch product:', error);
            }
          }

          return {
            id: review.reviewId,
            productTitle,
            rating: review.rating,
            comment: review.description,
            daysAgo: formatDate(review.createdAt),
            media:
              review.review_media?.[0]?.map((m: any) => ({
                url: m.mediaUrl,
                type: m.mediaType,
              })) ?? [],
          };
        })
      );

      setReviews(mapped);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load reviews',
        text2: 'Please pull down to refresh',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Reviews" showBack rightType="notification" />

      <View className="flex-1 mt-4">
        {loading ? (
          // Loading skeletons
          <View className="gap-3">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </View>
        ) : reviews.length === 0 ? (
          // Empty state
          <View className="flex-1 justify-center" style={{ minHeight: 400 }}>
            <NotFound
              title="No reviews yet"
              description="Be the first to share your experience about events you've attended."
              ctaLabel="Explore Events"
            />
          </View>
        ) : (
          // Reviews list
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-6"
          >
            <View className="gap-4">
              {reviews.map((item) => {
                const images = item.media
                  .filter((m) => m.type === 'image')
                  .map((m) => ({ uri: m.url }));

                const videos = item.media
                  .filter((m) => m.type === 'video')
                  .map((m) => m.url);

                return (
                  <ReviewCard
                    key={item.id}
                    title={item.productTitle}
                    rating={item.rating}
                    comment={item.comment}
                    createdAt={item.daysAgo}
                    images={images}
                    videos={videos}
                    onDelete={() => handleDeleteReview(item.id)}
                    
                  />
                );
              })}
            </View>

            {/* Footer note */}
            {reviews.length > 0 && (
              <View className="mt-6 pt-4 border-t border-border">
                <Text className="text-center text-sm text-muted-foreground">
                  Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}