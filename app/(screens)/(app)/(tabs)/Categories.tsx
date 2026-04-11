// app/(tabs)/categories.tsx

import { useEffect, useState } from 'react';
import { View, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getProductTypes } from '@/api/product';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import NotFound from '@/components/common/NotFound';

// UI
import { Text } from '@/components/ui/text';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

// import SkeletonContent from 'react-native-skeleton-content';

type ProductType = {
  id: number;
  name: string;
  mediaURL: string;
};

const S3_BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL;

export default function CategoriesScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProductTypes();
        setCategories(res.data);
      } catch (e) {
        console.log('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <Screen>
      <ScreenHeader title="Categories" rightType="notification" />

      {/* 🔄 LOADING */}
      {/* {loading && (
        <View className="px-4 mt-4">
          <SkeletonContent
            isLoading
            containerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
            layout={Array.from({ length: 8 }).map((_, i) => ({
              key: `item-${i}`,
              width: '48%',
              height: 176,
              borderRadius: 24,
              marginBottom: 16,
            }))}
          />
        </View>
      )} */}

      {/* ❌ EMPTY */}
      {!loading && categories.length === 0 && (
        <NotFound
          title="No Category Found"
          description="There are no categories available right now."
          ctaLabel="Explore Services"
        />
      )}

      {/* ✅ DATA */}
      {!loading && categories.length > 0 && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                // router.push({
                //   // pathname: '/category-products',
                //   params: {
                //     typeId: item.id,
                //     title: item.name,
                //   },
                // })
                console.log('Category pressed:', item.name)
              }
              className="mb-4 w-[48%]"
            >
              <Card className="h-44 rounded-3xl border border-orange-400">
                <CardContent className="flex-1 items-center justify-center">
                  
                  {/* IMAGE */}
                  <View className="w-16 h-16 mb-3 items-center justify-center">
                    <Image
                      source={{ uri: `${S3_BASE_URL}/${item.mediaURL}` }}
                      className="w-12 h-12"
                      resizeMode="contain"
                    />
                  </View>

                  {/* TITLE */}
                  <Text
                    className="text-base font-semibold text-center px-2"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                </CardContent>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}