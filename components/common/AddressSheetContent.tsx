import { View, Pressable, Platform, BackHandler, KeyboardAvoidingView } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import * as Location from 'expo-location'

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AppButton } from '@/components/common/AppButton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Feather, Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { getAddresses, deleteAddress, setCurrentAddress } from '@/api/user';
import AddressForm from '@/components/common/form/AddressForm';
import AddressListSkeleton from '@/app/skeleton/home/AddressList';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddressSheetContent({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      setAddresses(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleBack = useCallback(() => {
    if (mode === 'form') {
      setMode('list');
      setSelectedAddress(null);
      return true;
    }
    onClose();
    return true;
  }, [mode, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => sub.remove();
  }, [isOpen, handleBack]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteAddress({ id: confirmDeleteId });

      Toast.show({
        type: 'success',
        text1: 'Address deleted',
        text2: 'Address has been removed successfully',
      });

      setConfirmDeleteId(null);
      loadAddresses();
    } catch {
      Toast.show({ type: 'error', text1: 'Delete failed', text2: 'Please try again' });
    }
  };

  const handleSetCurrent = async (id: number) => {
    try {
      await setCurrentAddress({ id });

      Toast.show({
        type: 'success',
        text1: 'Address updated',
        text2: 'Default address changed successfully',
      });

      loadAddresses();
    } catch {
      Toast.show({ type: 'error', text1: 'Update failed', text2: 'Please try again' });
    }
  };

const handleUseCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission denied' })
      return
    }

    const location = await Location.getCurrentPositionAsync({})

    const lat = location.coords.latitude
    const lng = location.coords.longitude

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
    const data = await res.json()
   console.log('Geocoding response', data)

    const result = data.results?.[0]

    const address = result?.formatted_address || ''

    const components = result?.address_components || []

    const get = (type: string) =>
      components.find((c: { types: string | string[]; }) => c.types.includes(type))?.long_name || ''

    const city =
      get('locality') ||
      get('sublocality') ||
      get('administrative_area_level_2')

    const state = get('administrative_area_level_1')

    const postalCode = get('postal_code')

    setSelectedAddress({
      title: 'Current Location',
      addressLineOne: address,
      addressLineTwo: '',
      city,
      state,
      postalCode,
      latitude: lat,
      longitude: lng
    })

    setMode('form')
  } catch (e) {
    Toast.show({ type: 'error', text1: 'Failed to get location' })
  }
}
  if (mode === 'form') {
    return (
      <Animated.View entering={FadeInRight} exiting={FadeOutRight} className="flex-1">
        <AddressForm
          initialData={selectedAddress}
          onSuccess={() => {
            setMode('list');
            loadAddresses();
          }}
          onCancel={() => setMode('list')}
        />
      </Animated.View>
    );
  }

  const filtered = addresses.filter((a) =>
    !searchQuery
      ? true
      : a?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a?.addressLineOne?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
  
      <View className="flex-1 bg-gray-50">
        {/* Modern Header */}
        <View className="bg-white px-6 pt-6 pb-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Delivery Address</Text>
              <Text className="mt-1 text-sm text-gray-500">Choose where to deliver</Text>
            </View>
            <View className="h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <Feather name="map-pin" size={16} color="#F97316" />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => {
                setSelectedAddress(null);
                setMode('form');
              }}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 shadow-lg">
              <Feather name="plus" size={18} color="white" />
              <Text className="font-semibold text-white">Add Address</Text>
            </Pressable>
            
            <Pressable
              onPress={handleUseCurrentLocation}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-200">
              <Ionicons name="location-outline" size={18} color="#F97316" />
              <Text className="font-semibold text-gray-700">Use Current</Text>
            </Pressable>
          </View>
        </View>

        {/* Address List */}
        <View className="flex-1 px-6">
          <BottomSheetScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <AddressListSkeleton />
            ) : filtered.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100">
                  <Feather name="map-pin" size={36} color="#F97316" />
                </View>
                <Text className="mb-2 text-xl font-bold text-gray-900">
                  {searchQuery ? 'No matches found' : 'No addresses yet'}
                </Text>
                <Text className="text-center text-gray-500">
                  {searchQuery
                    ? `Try searching with different keywords`
                    : 'Add your first address to get started'}
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {filtered.map((item, index) => {
                  if (!item?.id) return null;
                  const isDefault = item.isDefault;

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => !isDefault && handleSetCurrent(item.id)}
                      className={`overflow-hidden rounded-2xl shadow-sm transition-all ${
                        isDefault ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200' : 'bg-white'
                      }`}
                    >
                      <View className="p-4">
                        {/* Header */}
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-lg font-bold text-gray-900">
                                {item.title}
                              </Text>
                              {isDefault && (
                                <View className="rounded-full bg-orange-500 px-2 py-1">
                                  <Text className="text-xs font-semibold text-white">DEFAULT</Text>
                                </View>
                              )}
                            </View>
                          </View>
                          
                          {/* Actions */}
                          <View className="flex-row gap-2">
                            <Pressable
                              onPress={() => {
                                setSelectedAddress(item);
                                setMode('form');
                              }}
                              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                              <Feather name="edit-2" size={16} color="#6B7280" />
                            </Pressable>
                            
                            {!isDefault && (
                              <Pressable
                                onPress={() => handleSetCurrent(item.id)}
                                className="h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <Ionicons name="checkmark" size={16} color="#10B981" />
                              </Pressable>
                            )}
                            
                            <Pressable
                              onPress={() => setConfirmDeleteId(item.id)}
                              className="h-8 w-8 items-center justify-center rounded-full bg-red-100">
                              <Feather name="trash-2" size={16} color="#EF4444" />
                            </Pressable>
                          </View>
                        </View>

                        {/* Address Details */}
                        <View className="mt-3 space-y-1">
                          <Text className="text-gray-700">{item.addressLineOne}</Text>
                          {item.addressLineTwo && (
                            <Text className="text-gray-700">{item.addressLineTwo}</Text>
                          )}
                          <Text className="text-gray-600">
                            {[item.city, item.state, item.pincode].filter(Boolean).join(', ')}
                          </Text>
                          {item.phoneNumber && (
                            <View className="mt-2 flex-row items-center gap-2">
                              <Feather name="phone" size={14} color="#9CA3AF" />
                              <Text className="text-sm text-gray-600">{item.phoneNumber}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </BottomSheetScrollView>
        </View>
        {/* Modern Delete Confirmation Dialog */}
        <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
          <DialogContent className="mx-4 rounded-2xl">
            <DialogHeader>
              <View className="items-center py-4">
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100">
                  <Feather name="trash-2" size={32} color="#EF4444" />
                </View>
                <DialogTitle className="text-xl font-bold text-gray-900">Delete Address</DialogTitle>
                <DialogDescription className="mt-2 text-center text-gray-600">
                  Are you sure you want to delete this address? This action cannot be undone.
                </DialogDescription>
              </View>
            </DialogHeader>

            <DialogFooter className="px-6 pb-6">
              <View className="flex-row gap-3">
                <DialogClose asChild>
                  <View className="flex-1">
                    <Button variant="outline" className="h-12 w-full rounded-xl border-gray-200 bg-white">
                      <Text className="font-semibold text-gray-700">Cancel</Text>
                    </Button>
                  </View>
                </DialogClose>
                <View className="flex-1">
                  <Button 
                    variant="destructive" 
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600"
                    onPress={handleDelete}
                  >
                    <Text className="font-semibold text-white">Delete</Text>
                  </Button>
                </View>
              </View>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
  );
}
