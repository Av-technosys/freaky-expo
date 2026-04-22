/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
//import { Skeleton } from '@/components/ui/skeleton';
import { getMediaUrl } from '@/utils/image';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';

// Components
import ScreenHeader from '@/components/common/ScreenHeader';
import ProductCard from '@/components/common/card/ProductsCard';
import NotFound from '@/components/common/NotFound';
import Screen from '@/app/provider/Screen';
// API
import { getProductsByProductTypeId } from '@/api/product';
import CategoryProductsSkeleton from '@/app/skeleton/category/CategoryProducts';

export default function CategoryProducts() {
  const route = useRoute<any>();
  const { typeId, title } = route.params ?? {};

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      console.log('type', typeId, title);
      try {
        const res = await getProductsByProductTypeId(typeId);
        setProducts(res.data);
      } catch (err) {
        console.log('PRODUCT FETCH ERROR', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [typeId]);

  const truncateWords = (text: string, wordLimit = 6) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  if (!loading && products.length === 0) {
    return (
      <Screen scroll>
        <ScreenHeader title={title ?? 'Products'} showBack rightType="notification" />
        <NotFound
          title="No Products Found"
          description="There are no products available in this category right now."
          ctaLabel="Browse Categories"
          // navigateTo={{ parent: 'MainTabs', screen: 'Categories' }}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title={title ?? 'Products'} rightType="notification" showBack />
      {loading && <CategoryProductsSkeleton />}
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-2"
        renderItem={({ item }) => {
          const price = item.price?.[0]?.salePrice ?? item.price?.[0]?.listPrice ?? 0;

          const imageSource = item.bannerImage
            ? { uri: getMediaUrl(item.bannerImage)! }
            : require('@/assets/images/image_not_found.jpg');

          return (
            <View className="my-6">
              <ProductCard
                id={item.productId}
                title={item.title}
                guests={item.minQuantity ?? 0}
                menu={truncateWords(item.description, 6)}
                rating={item.rating ?? 0}
                reviews={`${item.rating ?? 0}.0`}
                price={price}
                image={imageSource}
              />
            </View>
          );
        }}
      />
    </Screen>
  );
}
