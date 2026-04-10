import {
  View,
  Pressable,
  Modal,
  Platform,
  BackHandler,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AppButton } from '@/components/common/AppButton';

import { Feather, Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { getAddresses, deleteAddress, setCurrentAddress } from '@/api/user';
import AddressForm from '@/components/common/form/AddressForm';
import AddressListSkeleton from '@/app/skeleton/home/AddressListSkeleton';

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

  // ================= FETCH =================
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

  // ================= BACK HANDLER =================
  const handleBack = useCallback(() => {
    if (mode === 'form') {
      setMode('list');
      setSelectedAddress(null);
      return true;
    }
    onClose();
    return true;
  }, [mode]);

  useEffect(() => {
    if (!isOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => sub.remove();
  }, [isOpen, handleBack]);

  // ================= ACTIONS =================
  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteAddress({ id: confirmDeleteId });

      Toast.show({ type: 'success', text1: 'Address deleted' });

      setConfirmDeleteId(null);
      loadAddresses();
    } catch {
      Toast.show({ type: 'error', text1: 'Delete failed' });
    }
  };

  const handleSetCurrent = async (id: number) => {
    try {
      await setCurrentAddress({ id });

      Toast.show({ type: 'success', text1: 'Updated address' });

      loadAddresses();
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update' });
    }
  };

  // ================= FORM MODE =================
  if (mode === 'form') {
    return (
      <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
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

  // ================= FILTER =================
  const filtered = addresses.filter((a) =>
    !searchQuery
      ? true
      : a?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= UI =================
  return (
    <View className="flex-1">

      {/* HEADER */}
      <View className="flex-row items-center gap-2 mb-4">
        <Feather name="map-pin" size={20} />
        <Text className="text-lg font-semibold">Address</Text>
      </View>

      {/* SEARCH */}
      <Input
        placeholder="Search address..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* ADD BUTTON */}
      <AppButton
        className="mt-3"
        onPress={() => {
          setSelectedAddress(null);
          setMode('form');
        }}
      >
        <Text>Add New Address</Text>
      </AppButton>

      {/* LIST */}
      <View className="mt-4 gap-3">

        {loading ? (
  <AddressListSkeleton />
        ) : filtered.length === 0 ? (
          <Text className="text-muted-foreground">
            No saved addresses
          </Text>
        ) : (
          filtered.map((item) => {
            if (!item?.id) return null;

            return (
              <Card key={item.id}>
                <CardContent className="flex-row justify-between items-center">

                  {/* LEFT */}
                  <View className="flex-1">
                    <Text className="font-semibold">{item.title}</Text>
                    <Text className="text-muted-foreground text-sm">
                      {item.addressLineOne}
                    </Text>
                  </View>

                  {/* RIGHT */}
                  <View className="flex-row gap-3">

                    <Pressable
                      onPress={() => {
                        setSelectedAddress(item);
                        setMode('form');
                      }}
                    >
                      <Feather name="edit" size={18} color="#f97316" />
                    </Pressable>

                    <Pressable onPress={() => handleSetCurrent(item.id)}>
                      <Ionicons name="checkmark" size={20} />
                    </Pressable>

                    <Pressable onPress={() => setConfirmDeleteId(item.id)}>
                      <Feather name="trash" size={18} color="red" />
                    </Pressable>

                  </View>

                </CardContent>
              </Card>
            );
          })
        )}

      </View>

      {/* DELETE MODAL */}
      <Modal visible={!!confirmDeleteId} transparent>
        <View className="flex-1 justify-center items-center bg-black/40">
          <Card className="w-[85%]">
            <CardContent>

              <Text className="text-lg font-semibold mb-2">
                Delete Address
              </Text>

              <Text className="text-muted-foreground mb-4">
                Are you sure?
              </Text>

              <View className="flex-row gap-3">
                <AppButton
                  variant="outline"
                  onPress={() => setConfirmDeleteId(null)}
                >
                  <Text>Cancel</Text>
                </AppButton>

                <AppButton
                  onPress={handleDelete}
                >
                  <Text>Delete</Text>
                </AppButton>
              </View>

            </CardContent>
          </Card>
        </View>
      </Modal>

    </View>
  );
}