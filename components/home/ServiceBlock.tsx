import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
// import SkeletonContent from 'react-native-skeleton-content';

import { Text } from '@/components/ui/text';
import SectionHeader from '../home/SectionHeader';
import ServiceCard from '../home/ServiceCard';
import { getAllFeaturedProducts } from '@/api/product';

// function ServiceCardSkeleton() {
//   return (
//     <View className="mt-6 px-4">
//       <SkeletonContent
//         isLoading
//         layout={[
//           {
//             key: 'card',
//             width: 320,
//             height: 140,
//             borderRadius: 16,
//           },
//           {
//             key: 'title',
//             marginTop: 10,
//             width: '80%',
//             height: 16,
//             borderRadius: 6,
//           },
//           {
//             key: 'description',
//             marginTop: 6,
//             width: '60%',
//             height: 14,
//             borderRadius: 6,
//           },
//         ]}
//       />
//     </View>
//   );
// }

export default function ServicesBlock() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      setLoading(true);

      const res = await getAllFeaturedProducts();
      // console.log('API Response:', res);
      // console.log('Response data:', res?.data);
      // console.log('Is array?', Array.isArray(res?.data));

      // Handle different response structures
      let productsData = null;
      if (res?.data && Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res && Array.isArray(res)) {
        productsData = res;
      } else if (res?.success && res?.data && Array.isArray(res.data)) {
        productsData = res.data;
      }

      if (productsData) {
        setSections(productsData);
        console.log('Setting sections with:', productsData);
      } else {
        console.log('No valid data found, setting empty array');
        setSections([]);
      }
    } catch (error) {
      console.log('Failed to fetch featured products', error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING
  if (loading) {
    return (
      <View className="mt-6 px-4">
        <View className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      </View>
    );
  }

  // ✅ NO DATA
  if (!sections || sections.length === 0) {
    return (
      <View className="mt-6 px-4">
        <Text className="text-center text-muted-foreground">
          No services available
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-6 -mx-2">

      {sections.map((section) => {
        const products = section?.products;

        // ✅ Show empty state instead of hiding
        if (!Array.isArray(products) || products.length === 0) {
          return (
            <View key={section.id} className="mb-6">
              <SectionHeader
                left={
                  <Text className="text-lg font-semibold text-foreground">
                    {section?.name || 'Services'}
                  </Text>
                }
              />
              <View className="px-2 py-4">
                <Text className="text-center text-gray-500 text-sm">
                  No services in this category
                </Text>
              </View>
            </View>
          );
        }

        return (
          <View key={section.id} className="mb-6">

            {/* HEADER */}
            <SectionHeader
              left={
                <Text className="text-lg font-semibold text-foreground">
                  {section?.name || 'Services'}
                </Text>
              }
            />

            {/* LIST */}
            <FlatList
              horizontal
              data={products}
              keyExtractor={(item) => item?.productId?.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => {

                // ✅ Show items even without bannerImage
                if (!item?.bannerImage) {
                  return (
                    <View className="mr-3 w-40 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Text className="text-gray-500 text-xs">No Image</Text>
                    </View>
                  );
                }

                return (
                  <View className="mr-3">
                    <ServiceCard item={item} />
                  </View>
                );
              }}
            />

          </View>
        );
      })}

    </View>
  );
}