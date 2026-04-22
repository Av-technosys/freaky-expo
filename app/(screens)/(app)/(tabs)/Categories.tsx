import { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import NotFound from '@/components/common/NotFound';

import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import { getProductTypes } from '@/api/product';
import { getMediaUrl } from '@/utils/image';

import CategoriesSkeleton from '@/app/skeleton/category/CategoriesGrid';

type ProductType = {
  id: number;
  name: string;
  mediaURL: string;
};

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

  if (loading) {
    return (
      <Screen>
        <ScreenHeader title="Categories" rightType="notification" />
        <CategoriesSkeleton />
      </Screen>
    );
  }

  if (!categories.length) {
    return (
      <Screen>
        <ScreenHeader title="Categories" rightType="notification" />
        <NotFound
          title="No Category Found"
          description="There are no categories available right now."
          ctaLabel="Explore Services"
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
       <ScreenHeader title="Categories" rightType="notification" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}

         renderItem={({ item }) => {
          const url = getMediaUrl(item.mediaURL);

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/CategoryProducts',
                  params: {
                    typeId: item.id,
                    title: item.name,
                  },
                })
              }
              className="mb-4  w-[48%]"
            >
              <Card className="rounded-3xl border border-orange-400 overflow-hidden">

                <View className="items-center justify-center pt-4">
                  <AspectRatio ratio={1} className="w-20">
                    <Image
                      source={
                        url
                          ? { uri: url }
                          : require('@/assets/images/service2.png')
                      }
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </AspectRatio>
                </View>

                <CardContent className="items-center justify-center pb-4 pt-2">
                  <Text
                    className="text-sm font-semibold text-center px-2 text-gray-800"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </CardContent>

              </Card>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}