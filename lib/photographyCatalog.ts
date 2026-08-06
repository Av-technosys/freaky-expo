import { Image, type ImageSourcePropType } from 'react-native';

import type { EventCartService } from '@/store/cartStore';

export type PhotographyPackage = {
  id: string;
  title: string;
  price: number;
  time: string;
  image: ImageSourcePropType;
};

export const photographyHeroImages: ImageSourcePropType[] = [
  require('@/public/cameraman.png'),
  require('@/public/cameraman.png'),
  require('@/public/cameraman.png'),
  require('@/public/cameraman.png'),
  require('@/public/cameraman.png'),
  require('@/public/cameraman.png'),
];

export const photographyGallery = [
  { label: 'Premium Photography', image: require('@/public/camera.png') },
  { label: 'Wedding Photography', image: require('@/public/camera.png') },
  { label: 'Studio Photoshoot', image: require('@/public/camera.png') },
  { label: 'Pre Wedding Photoshoot', image: require('@/public/camera.png') },
  { label: 'Premium Photography', image: require('@/public/camera.png') },
  { label: 'Wedding Photography', image: require('@/public/camera.png') },
  { label: 'Studio Photoshoot', image: require('@/public/camera.png') },
  { label: 'Pre Wedding Photoshoot', image: require('@/public/camera.png') },
] as const;

export const photographyPackages: PhotographyPackage[] = [
  { id: 'prime', title: 'Prime Photography', price: 4999, time: '2-3 hrs', image: require('@/public/camera.png') },
  { id: 'premium', title: 'Prime Photography', price: 4999, time: '2-3 hrs', image: require('@/public/camera.png') },
  { id: 'elite', title: 'Prime Photography', price: 7499, time: '2-3 hrs', image: require('@/public/camera.png') },
];

export const photographySampleImages: ImageSourcePropType[] = [
  require('@/assets/images/home/image 1740.png'),
  require('@/assets/images/home/image 1734.png'),
  require('@/assets/images/home/image 1532.png'),
];

export const formatPhotographyPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

export function photographyCartServiceFromPackage(item: PhotographyPackage): EventCartService {
  return {
    id: `photography-${item.id}`,
    title: 'Photography',
    packageName: item.title,
    price: item.price,
    imageUri: Image.resolveAssetSource(item.image).uri,
    features: [
      { icon: 'person', label: '1 Professional Photographer' },
      { icon: 'clock', label: item.time === '2-3 hrs' ? '2-3 Hours' : 'Full event coverage' },
      { icon: 'camera', label: '500+ Edited Photos' },
    ],
  };
}
