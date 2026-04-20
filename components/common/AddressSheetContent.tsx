import { View, Pressable, Platform, BackHandler, KeyboardAvoidingView } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

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
    <>
      <View className="flex-1 bg-background px-2 py-4">
        {/* Header Section */}
        <View className="border-b border-border px-4 pb-3 pt-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-bold text-foreground">My Addresses</Text>
            </View>
            <Badge variant="secondary" className="bg-muted">
              <Text className="text-xs">{addresses.length} saved</Text>
            </Badge>
          </View>
          <Text className="mt-1 text-sm text-muted-foreground">Manage your delivery addresses</Text>
        </View>

        {/* Search Section */}
        <View className="px-4 pt-4">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Feather name="search" size={18} color="#9CA3AF" />
            </View>
            <Input
              placeholder="Search by address name or location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-10 pr-10"
            />
            {searchQuery !== '' && (
              <Pressable onPress={() => setSearchQuery('')} className="absolute right-3 top-3 z-10">
                <Feather name="x" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Add Button */}
        <View className="px-4 pt-3">
          <AppButton
            onPress={() => {
              setSelectedAddress(null);
              setMode('form');
            }}>
            <View className="flex-row items-center gap-2">
              <Feather name="plus" size={18} color="white" />
              <Text className="font-semibold text-white">Add New Address</Text>
            </View>
          </AppButton>
        </View>

        <Separator className="my-4" />

        {/* Address List */}
        <View>
          {loading ? (
            <AddressListSkeleton />
          ) : filtered.length === 0 ? (
            <View className="items-center justify-center py-12">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Feather name="map-pin" size={32} color="#9CA3AF" />
              </View>
              <Text className="mb-2 text-lg font-semibold text-foreground">
                {searchQuery ? 'No matching addresses' : 'No saved addresses'}
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                {searchQuery
                  ? `No addresses found for "${searchQuery}"`
                  : 'Add your first address to get started'}
              </Text>
            </View>
          ) : (
            filtered.map((item, index) => {
              if (!item?.id) return null;

              const isDefault = item.isDefault;

              return (
                <Card key={item.id} className="mb-3 overflow-hidden">
                  <CardContent className="p-0">
                    <View className="p-4">
                      {/* Header with Title and Badges */}
                      <View className="mb-2 flex-row items-start justify-between">
                        <View className="flex-1 flex-row items-center gap-2">
                          <Text className="text-base font-semibold text-foreground">
                            {item.title}
                          </Text>
                          {isDefault && (
                            <Badge variant="default" className="bg-primary/10">
                              <Text className="text-xs text-primary">Default</Text>
                            </Badge>
                          )}
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-4">
                          <Pressable
                            onPress={() => {
                              setSelectedAddress(item);
                              setMode('form');
                            }}
                            className="p-1">
                            <Feather name="edit" size={18} color="#F97316" />
                          </Pressable>

                          {!isDefault && (
                            <Pressable onPress={() => handleSetCurrent(item.id)} className="p-1">
                              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                            </Pressable>
                          )}

                          <Pressable onPress={() => setConfirmDeleteId(item.id)} className="p-1">
                            <Feather name="trash" size={18} color="#EF4444" />
                          </Pressable>
                        </View>
                      </View>

                      {/* Address Details */}
                      <View className="mt-2">
                        <Text className="text-sm text-muted-foreground">{item.addressLineOne}</Text>
                        {item.addressLineTwo && (
                          <Text className="mt-0.5 text-sm text-muted-foreground">
                            {item.addressLineTwo}
                          </Text>
                        )}
                        <Text className="mt-0.5 text-sm text-muted-foreground">
                          {[item.city, item.state, item.pincode].filter(Boolean).join(', ')}
                        </Text>
                      </View>

                      {/* Phone Number if available */}
                      {item.phoneNumber && (
                        <View className="mt-3 flex-row items-center gap-2 border-t border-border pt-2">
                          <Feather name="phone" size={14} color="#9CA3AF" />
                          <Text className="text-xs text-muted-foreground">{item.phoneNumber}</Text>
                        </View>
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
          <DialogContent className="">
            <DialogHeader>
              <View className="mb-2 items-center">
                <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <Feather name="trash-2" size={28} color="#EF4444" />
                </View>
                <DialogTitle>Delete Address</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this address? This action cannot be undone.
                </DialogDescription>
              </View>
            </DialogHeader>

            <DialogFooter className="mt-4 flex flex-wrap gap-3">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">
                  <Text>Cancel</Text>
                </Button>
              </DialogClose>
              <Button variant="destructive" className="flex-1" onPress={handleDelete}>
                <Text>Delete</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
    </>
  );
}
