import { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Platform, Alert } from 'react-native';

// UI Components
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Components
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/common/AppButton';
import { getAddresses, deleteAddress, setCurrentAddress, userDetails } from '@/api/user';
import AddressListSkeleton from '@/app/skeleton/home/AddressList';
import DeleteAddressModal from '@/components/common/DeleteAddressModal';
import AddressForm from '@/components/common/form/AddressForm';

// Icons
import { Feather, Ionicons } from '@expo/vector-icons';
import { toast } from '@/components/common/ToastManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Suggestion {
  description: string;
  place_id: string;
}

interface Address {
  id?: number;
  title: string;
  addressLineOne: string;
  addressLineTwo: string;
  reciverName: string;
  reciverNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  isDefault?: boolean;
  latitude?: string;
  longitude?: string;
}

export default function AddressManagementScreen() {
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmSetCurrentId, setConfirmSetCurrentId] = useState<number | null>(null);
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const [addressRes, userRes] = await Promise.all([getAddresses(), userDetails()]);

      setAddresses(Array.isArray(addressRes?.data) ? addressRes.data : []);

      setCurrentAddressId(userRes?.data?.currentAddressId || null);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setMode('form');
  };

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteAddress({ id: confirmDeleteId });
      toast.success('Address deleted', 'Address has been removed successfully');
      setConfirmDeleteId(null);
      loadAddresses();
    } catch {
      toast.error('Delete failed', 'Please try again');
    }
  };

  const handleSetCurrent = (id: number) => {
    setConfirmSetCurrentId(id);
  };

  const confirmSetCurrent = async () => {
    if (!confirmSetCurrentId) return;

    try {
      await setCurrentAddress({ id: confirmSetCurrentId });

      setCurrentAddressId(confirmSetCurrentId);

      toast.success('Address updated', 'Default address changed successfully');

      setConfirmSetCurrentId(null);
    } catch {
      toast.error('Update failed', 'Please try again');
    }
  };

  const renderForm = () => (
    <>

          <ScreenHeader title="My Addresses" showBack={true} />

    <AddressForm
      initialData={selectedAddress}
      showHeader={false}
      onSuccess={() => {
        setMode('list');
        setSelectedAddress(null);
        loadAddresses();
      }}
      onCancel={() => {
        setMode('list');
        setSelectedAddress(null);
      }}
    />
    </>
  );

  const filtered = addresses.filter((a) =>
    !searchQuery
      ? true
      : a?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a?.addressLineOne?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderList = () => (
    <Screen scroll={true}>
      <ScreenHeader title="My Addresses" showBack={true} />

      <View className="flex-1">
        {loading ? (
          <AddressListSkeleton />
        ) : filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center py-16">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100">
              <Feather name="map-pin" size={36} color="#F97316" />
            </View>
            <Text className="mb-2 text-xl font-bold text-gray-900">
              {searchQuery ? 'No matches found' : 'No addresses yet'}
            </Text>
            <Text className="mb-6 text-center text-base text-gray-500">
              {searchQuery
                ? `Try searching with different keywords`
                : 'Add your first address to get started'}
            </Text>

            {!searchQuery && (
              <AppButton onPress={() => setMode('form')}>
                <View className="flex-row items-center gap-2">
                  <Feather name="plus" size={18} color="white" />
                  <Text className="font-semibold text-white">Add New Address</Text>
                </View>
              </AppButton>
            )}
          </View>
        ) : (
          <ScrollView
            className="flex-1 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Top Search + Add */}
            <View className="border-b border-gray-100 bg-white py-3">
              <View className="flex-row items-center">
                {/* Search Bar */}
                <View className="mr-3 flex-1">
                  <View className="h-12 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                    <Feather name="search" size={18} color="#9CA3AF" />

                    <Input
                      placeholder="Search addresses"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      className="ml-2 flex-1 border-0 bg-transparent p-0 text-gray-900"
                    />

                    {searchQuery !== '' && (
                      <Pressable onPress={() => setSearchQuery('')}>
                        <Feather name="x-circle" size={18} color="#9CA3AF" />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Add Button */}
                <Pressable
                  onPress={() => setMode('form')}
                  style={{
                    height: 48,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: '#f97316',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Feather name="plus" size={20} color="white" />
                </Pressable>
              </View>
            </View>
            <View className="mt-2 gap-2">
              {filtered.map((item) => {
                const isDefault = currentAddressId === item.id;

                return (
                  <Card
                    key={item.id}
                    onTouchEnd={() => {
                      if (!isDefault) {
                        handleSetCurrent(item.id!);
                      }
                    }}
                    className={`-py-6 mt-3 overflow-hidden rounded-2xl border ${
                      isDefault
                        ? 'border-orange-300 bg-gradient-to-br from-orange-50 via-orange-50/80 to-orange-100/60 shadow-md shadow-orange-200/50'
                        : 'border-gray-200 bg-white shadow-sm hover:shadow-md active:shadow-sm'
                    } `}>
                    <CardContent className="p-0">
                      <View className="p-5">
                        {/* Header with Title and Actions */}
                        <View className="mb-4 flex-row items-start justify-between">
                          <View className="flex-1 flex-row flex-wrap items-center gap-2">
                            <Text
                              className={`text-lg font-bold ${isDefault ? 'text-gray-800' : 'text-gray-900'}`}>
                              {item.title}
                            </Text>
                            {isDefault && (
                              <View className="rounded-full bg-orange-500 px-2.5 py-1 shadow-sm shadow-orange-300/50">
                                <Text className="text-xs font-bold uppercase tracking-wide text-white">
                                  Default
                                </Text>
                              </View>
                            )}
                          </View>

                          <View className="flex-row items-center gap-5">
                            <Pressable
                              hitSlop={10}
                              onPress={() => handleEdit(item)}
                              className="p-1">
                              <Feather name="edit-2" size={18} color="#000" />
                            </Pressable>

                            <Pressable
                              hitSlop={10}
                              onPress={() => handleDelete(item.id!)}
                              className="p-1">
                              <Feather name="trash-2" size={18} color="#000" />
                            </Pressable>
                          </View>
                        </View>

                        {/* Address Details */}
                        <View className="space-y-2">
                          <Text className="text-base leading-6 text-gray-700">
                            {item.addressLineOne}
                          </Text>
                          {item.addressLineTwo && (
                            <Text className="text-base leading-6 text-gray-600">
                              {item.addressLineTwo}
                            </Text>
                          )}
                          <Text className="text-sm text-gray-500">
                            {[item.city, item.state, item.postalCode].filter(Boolean).join(' • ')}
                          </Text>

                          {/* Phone Number with better styling */}
                          {item.phoneNumber && (
                            <View className="mt-3 flex-row items-center gap-2">
                              <View className="h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                <Feather name="phone" size={14} color="#EA580C" />
                              </View>
                              <Text className="text-sm font-medium text-gray-600">
                                {item.phoneNumber}
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Decorative badge for default card */}
                        {isDefault && (
                          <View className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-r from-orange-400 to-orange-500 opacity-20" />
                        )}
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>

      <DeleteAddressModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Set Current Address Confirmation Dialog */}
      {confirmSetCurrentId && (
        <Dialog
          open={!!confirmSetCurrentId}
          onOpenChange={(open) => !open && setConfirmSetCurrentId(null)}>
          <DialogContent className="mx-4 rounded-2xl">
            <DialogHeader>
              <View className="items-center py-4">
                {/* Icon */}
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                </View>

                {/* Title */}
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Set as Default
                </DialogTitle>

                {/* Description */}
                <DialogDescription className="mt-2 text-center text-base text-gray-600">
                  Set this address as your default delivery address?
                </DialogDescription>
              </View>
            </DialogHeader>

            <DialogFooter className="px-6 pb-6">
              <View className="flex-row gap-3">
                {/* Cancel */}
                <View className="flex-1">
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-gray-200 bg-white"
                    onPress={() => setConfirmSetCurrentId(null)}>
                    <Text className="font-semibold text-gray-700">Cancel</Text>
                  </Button>
                </View>

                {/* Confirm */}
                <View className="flex-1">
                  <AppButton
                    variant="default"
                    className="h-11 rounded-xl"
                    onPress={confirmSetCurrent}>
                    <Text className="font-semibold text-white">Confirm</Text>
                  </AppButton>
                </View>
              </View>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Screen>
  );

  return (
    <>
      {mode === 'form' ? renderForm() : renderList()}
    </>
  );
}
