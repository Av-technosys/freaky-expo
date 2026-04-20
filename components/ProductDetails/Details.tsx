import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

const safeMarkdown = (value?: string | null) =>
  typeof value === 'string' ? value : '';

type DetailsProps = {
  title?: string;
  subtitle?: string;
  rating?: number;
  ratingCount?: string;
  price?: number | null;
  description?: string;
};

export default function Details({
  title,
  subtitle,
  rating = 0,
  ratingCount = '0',
  price,
  description,
}: DetailsProps) {
  const stars = 5;

  return (
    <View className="mt-4 rounded-xl bg-white p-2">

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
        }}
      >
        {safeMarkdown(title)}
      </Markdown>

      {/* SUBTITLE */}
      {!!subtitle && (
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
      )}

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

        <Text className="ml-2 text-gray-500 text-sm">
          {ratingCount}
        </Text>
      </View>

      {/* PRICE */}
      {typeof price === 'number' && (
        <View className="mt-3 flex-row items-center">
          <MaterialIcons
            name="attach-money"
            size={24}
            color="#F97316"
          />
          <Text className="text-2xl font-bold text-orange-500">
            {price}
          </Text>
        </View>
      )}

      {/* CTA */}
      <Text className="mt-1 text-gray-500">
        See all options
      </Text>

      {/* DIVIDER */}
      <View className="my-4 h-px bg-gray-200" />

      {/* DESCRIPTION */}
      {!!description && (
        <>
          <Text className="text-base font-semibold text-black">
            Description
          </Text>

          <Markdown
            style={{
              body: {
                color: '#4B5563',
                fontSize: 14,
                lineHeight: 22,
                marginTop: 8,
              },
              paragraph: { marginBottom: 6 },
              strong: { fontWeight: '700' },
              em: { fontStyle: 'italic' },
            }}
          >
            {safeMarkdown(description)}
          </Markdown>
        </>
      )}
    </View>
  );
}