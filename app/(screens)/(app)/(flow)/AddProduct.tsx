import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import AddToCartForm from '@/components/common/form/AddToCartForm';

export default function AddProduct() {
  const { productId, title, vendorName, price } = useLocalSearchParams();

  return (
    <Screen scroll>
      <ScreenHeader title="Booking Details" showBack />
      
      <AddToCartForm 
        product={{
          ProductId: String(productId),
          title: String(title),
          vendorName: String(vendorName),
          price: Number(price),
        }}
        onSuccess={() => router.push('/cart')}
      />
      
    </Screen>
  );
}
