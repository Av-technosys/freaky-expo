import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

const safeMarkdown = (value?: string | null) => (typeof value === 'string' ? value : '');

type DetailsProps = {
  title?: string;
  subtitle?: string;
  rating?: number;
  ratingCount?: string;
  price?: number | null;
  description?: string;
  priceSlabs?: any[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

export default function Details({
  title,
  subtitle,
  rating = 0,
  ratingCount = '0',
  price,
  description,
  priceSlabs,
  selectedIndex,
  setSelectedIndex,
}: DetailsProps) {
  const stars = 5;

  const selectedPrice =
    subtitle === 'TIER' && priceSlabs?.length
      ? Number(priceSlabs[selectedIndex]?.salePrice)
      : price;

  return (
    <View className="mt-4 rounded-xl bg-white">
      {/* TITLE */}
      <Markdown
        style={{
          body: {
            fontSize: 22,
            fontWeight: '700',
            color: '#000',
            lineHeight: 28,
          },
          paragraph: { marginBottom: 0 },
        }}>
        {safeMarkdown(title)}
      </Markdown>

      {/* SUBTITLE */}
      {/* {!!subtitle && (
        <Markdown
          style={{
            body: {
              fontSize: 16,
              color: '#6B7280',
              marginTop: 4,
            },
            paragraph: { marginBottom: 0 },
          }}
        >
          {safeMarkdown(subtitle)}
        </Markdown>
      )} */}

      {/* RATING */}
      <View className="mt-3 flex-row items-center">
        {Array.from({ length: stars }).map((_, index) => (
          <AntDesign
            key={index}
            name="star"
            size={16}
            color={index < Math.round(rating) ? '#FACC15' : '#E5E7EB'}
            style={{ marginRight: 2 }}
          />
        ))}

        <Text className="ml-2 text-sm text-gray-500">{ratingCount}</Text>
      </View>

      {/* PRICE */}
      {typeof price === 'number' && (
        <View className="mt-3 flex-row items-center">
          <MaterialIcons name="attach-money" size={24} color="#F97316" />
          <Text className="text-2xl font-bold text-orange-500">{selectedPrice}</Text>
        </View>
      )}

      {subtitle === 'TIER' && priceSlabs?.length ? (
        <View className="mt-4 px-2">
          {/* HEADER */}
          <View className="mb-2 flex-row border-b border-gray-200 pb-2">
            <Text className="flex-1 font-semibold text-gray-700">Lower bound</Text>
            <Text className="flex-1 text-center font-semibold text-gray-700">Upper bound</Text>
            <Text className="flex-1 text-center font-semibold text-gray-700">Price</Text>
            <View style={{ width: 24 }} /> {/* Space for Radio column */}
          </View>

          {priceSlabs.map((item: any, index: number) => {
            if (item.lowerSlab > item.upperSlab) return null;
            const isSelected = selectedIndex === index;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedIndex(index)}
                className="flex-row items-center border-b border-gray-100 py-4">
                {/* COLUMN 1: Lower bound */}
                <Text className="flex-1 font-semibold text-gray-700">{item.lowerSlab}</Text>

                {/* COLUMN 2: Upper bound */}
                <Text className="flex-1 text-center font-semibold text-gray-700">
                  {item.upperSlab ?? '-'}
                </Text>

                {/* COLUMN 3: Price */}
                <Text className="flex-1 text-center font-semibold text-orange-500">
                  $ {Number(item.salePrice)}
                </Text>

                {/* COLUMN 4: RADIO BUTTON */}
                <View style={{ width: 24, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: '#F97316',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {isSelected && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#F97316',
                        }}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {/* DIVIDER */}
      <View className="my-2" />
      {/* DESCRIPTION */}
      {!!description && (
        <>
          <Text className="text-base font-semibold text-black">Description</Text>

          <Markdown
            style={{
              body: {
                color: '#4B5563',
                fontSize: 14,
                lineHeight: 22,
                marginTop: 8,
              },

              paragraph: {
                marginTop: 10,
                marginBottom: 10,
              },

              heading1: {
                fontSize: 22,
                fontWeight: '700',
                marginTop: 16,
                marginBottom: 12,
              },

              heading2: {
                fontSize: 16,
                fontWeight: '700',
                marginTop: 16,
                marginBottom: 10,
              },

              list_item: {
                marginTop: 6,
                marginBottom: 6,
              },
            }}>
            {safeMarkdown(description)}
          </Markdown>
        </>
      )}
    </View>
  );
}
