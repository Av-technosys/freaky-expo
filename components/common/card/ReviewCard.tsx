import { View, Image, FlatList, Pressable, Modal } from 'react-native';
import { useMemo, useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getMediaUrl } from '@/utils/image';

type Props = {
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
  images: { uri: string }[];
  videos: string[];
  onDelete?: () => void;
  isDeleting?: boolean;
};

export default function ReviewCard({
  title,
  rating,
  comment,
  createdAt,
  images = [],
  videos = [],
  onDelete,
  isDeleting = false,
}: Props) {
  const WORD_LIMIT = 12;
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const words = useMemo(() => comment?.trim().split(/\s+/) ?? [], [comment]);
  const shouldTruncate = words.length > WORD_LIMIT;
  const previewText = shouldTruncate ? words.slice(0, WORD_LIMIT).join(' ') : comment;

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete?.();
  };

  const openImageModal = (imageUri: string, index: number) => {
    setSelectedImage(imageUri);
    setSelectedImageIndex(index);
  };

  const nextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      setSelectedImageIndex(nextIndex);
      setSelectedImage(getMediaUrl(images[nextIndex].uri) || null);
    }
  };

  const previousImage = () => {
    if (selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
      setSelectedImage(getMediaUrl(images[prevIndex].uri) || null);
    }
  };

  return (
    <>
      <View className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        {/* HEADER */}
        <View className="mb-3 flex-row justify-between items-start">
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-2 flex-wrap">
              <Text className="text-base font-semibold text-foreground">{title}</Text>

              <View className="flex-row">
                {[...Array(5)].map((_, i) => (
                  <AntDesign
                    key={i}
                    name="star"
                    size={14}
                    color={i < rating ? '#FACC15' : '#E5E7EB'}
                  />
                ))}
              </View>
            </View>

            <Text className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {onDelete && (
            <Pressable 
              onPress={() => setShowConfirm(true)}
              disabled={isDeleting}
              className="p-2"
            >
              <AntDesign name="delete" size={18} color="#EF4444" />
            </Pressable>
          )}
        </View>

        {/* COMMENT */}
        <Text className="text-sm text-foreground leading-5">
          {expanded || !shouldTruncate ? comment : previewText + '...'}
        </Text>

        {shouldTruncate && (
          <Pressable onPress={() => setExpanded(!expanded)} className="mt-1">
            <Text className="text-sm text-primary font-medium">
              {expanded ? 'Read less' : 'Read more'}
            </Text>
          </Pressable>
        )}

        {/* MEDIA - Images & Videos */}
        {(images.length > 0 || videos.length > 0) && (
          <View className="mt-3">
            {/* IMAGES */}
            {images.length > 0 && (
              <FlatList
                data={images}
                horizontal
                keyExtractor={(_, i) => `img-${i}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item, index }) => (
                  <Pressable onPress={() => openImageModal(item.uri, index)}>
                    <View className="w-24">
                      <AspectRatio ratio={1}>
                        <Image
                          source={
                            getMediaUrl(item.uri)
                              ? { uri: getMediaUrl(item.uri)! }
                              : require('@/assets/images/image_not_found.jpg')
                          }
                          className="h-full w-full rounded-lg"
                          resizeMode="cover"
                        />
                      </AspectRatio>
                    </View>
                  </Pressable>
                )}
              />
            )}

            {/* VIDEOS */}
            {videos.length > 0 && (
              <FlatList
                data={videos}
                horizontal
                keyExtractor={(_, i) => `vid-${i}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, marginTop: images.length > 0 ? 8 : 0 }}
                renderItem={({ item }) => (
                  <View className="w-24">
                    <AspectRatio ratio={1}>
                      <View className="flex-1 overflow-hidden rounded-lg bg-black">
                        {getMediaUrl(item) ? (
                          <Video
                            source={{ uri: getMediaUrl(item)! }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={ResizeMode.COVER}
                            isMuted
                            shouldPlay
                            isLooping
                          />
                        ) : (
                          <View className="flex-1 items-center justify-center bg-muted">
                            <Feather name="video-off" size={16} color="#6b7280" />
                          </View>
                        )}

                        <View className="absolute right-1 top-1 rounded-full bg-black/50 p-1">
                          <Feather name="play" size={12} color="#fff" />
                        </View>
                      </View>
                    </AspectRatio>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* IMAGE MODAL - Full Screen Image Viewer */}
      <Modal 
        visible={!!selectedImage} 
        transparent 
        animationType="fade"
        statusBarTranslucent
      >
        <View className="flex-1 bg-black/95">
          {/* Close Button */}
          <Pressable
            onPress={() => setSelectedImage(null)}
            className="absolute top-12 right-4 z-10 bg-black/50 rounded-full p-2"
          >
            <AntDesign name="close" size={24} color="white" />
          </Pressable>

          {/* Image Counter */}
          {images.length > 1 && (
            <View className="absolute top-12 left-4 z-10 bg-black/50 rounded-full px-3 py-1">
              <Text className="text-white text-sm font-medium">
                {selectedImageIndex + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* Main Image */}
          <View className="flex-1 justify-center items-center px-4">
            {selectedImage && (
              <Image
                source={{ uri: getMediaUrl(selectedImage) || selectedImage }}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}
          </View>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              {selectedImageIndex > 0 && (
                <Pressable
                  onPress={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3"
                >
                  <AntDesign name="left" size={24} color="white" />
                </Pressable>
              )}

              {selectedImageIndex < images.length - 1 && (
                <Pressable
                  onPress={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3"
                >
                  <AntDesign name="right" size={24} color="white" />
                </Pressable>
              )}
            </>
          )}

          {/* Download/Save Button (Optional) */}
          <Pressable
            onPress={() => {
              // Implement download/save functionality if needed
              console.log('Save image:', selectedImage);
            }}
            className="absolute bottom-12 right-4 bg-black/50 rounded-full p-2"
          >
            <Feather name="download" size={20} color="white" />
          </Pressable>
        </View>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal visible={showConfirm} transparent animationType="fade" statusBarTranslucent>
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          <View className="w-full max-w-sm rounded-2xl bg-card p-6">
            <View className="items-center mb-4">
              <View className="w-14 h-14 rounded-full bg-destructive/10 items-center justify-center mb-3">
                <AntDesign name="delete" size={28} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-foreground text-center">
                Delete Review?
              </Text>
              <Text className="text-sm text-muted-foreground text-center mt-2">
                This action cannot be undone
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setShowConfirm(false)}
              >
                <Text>Cancel</Text>
              </Button>

              <Button
                variant="destructive"
                className="flex-1"
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <Text>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}