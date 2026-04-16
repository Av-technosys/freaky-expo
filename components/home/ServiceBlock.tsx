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
      if (res?.data && Array.isArray(res.data)) {
        setSections(res.data);
      } else {
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
  // if (loading) {
  //   return <ServiceCardSkeleton />;
  // }

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
    <View className="mt-6">

      {sections.map((section) => {
        const products = section?.products;

        // ✅ skip empty sections (clean UI)
        if (!Array.isArray(products) || products.length === 0) {
          return null;
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

                // ✅ strict rule (no fake fallback)
                if (!item?.bannerImage) return null;

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