import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  ChevronLeft,
  Crosshair,
  LocateFixed,
  MapPin,
  MoreVertical,
  Plus,
  X,
} from 'lucide-react-native';

import { deleteAddress, editAddress, getAddresses, setCurrentAddress, userDetails, addAddress } from '@/api/user';
import { toast } from '@/components/common/ToastManager';
import AddressListSkeleton from '@/app/skeleton/home/AddressList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type Address = {
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
  latitude?: string | number;
  longitude?: string | number;
};

type Mode = 'list' | 'search' | 'form';

const SUGGESTIONS = [
  {
    title: 'Manglam Metropolis Tower',
    detail: 'Purani Chungi, Panchsheel Colony, Nirmohi Nagar, Jaipur, Rajasthan, India',
    city: 'Jaipur',
  },
  {
    title: '245, Mangla Marg',
    detail: 'Chhota Akhara, Krishna nagar, Jaipur',
    city: 'Jaipur',
  },
  {
    title: 'Manglam Marg',
    detail: 'Jaipur, Rajasthan, India',
    city: 'Jaipur',
  },
];

const emptyAddress: Address = {
  title: 'Home',
  addressLineOne: '',
  addressLineTwo: '',
  reciverName: '',
  reciverNumber: '',
  city: 'Jaipur',
  state: 'Rajasthan',
  postalCode: '',
  country: 'India',
  phoneNumber: '',
  latitude: '0',
  longitude: '0',
};

function Header({
  title,
  onBack,
  onClose,
}: {
  title: string;
  onBack: () => void;
  onClose?: () => void;
}) {
  return (
    <View className="h-10 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Pressable onPress={onBack} className="-ml-2 h-9 w-9 items-center justify-center">
          <ChevronLeft size={24} color="#111111" strokeWidth={2.2} />
        </Pressable>
        <Text className="ml-2 text-[20px] font-bold text-[#111111]">{title}</Text>
      </View>

      {onClose ? (
        <Pressable onPress={onClose} className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
          <X size={20} color="#9b9b9b" strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </View>
  );
}

function StaticMapPreview() {
  return (
    <View className="h-[226px] overflow-hidden bg-[#dfe7ef]">
      <View className="absolute left-0 right-0 top-0 h-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <View
            key={`h-${index}`}
            className="absolute h-[1px] bg-white/70"
            style={{ top: 24 + index * 26, left: 0, right: 0, transform: [{ rotate: index % 2 ? '8deg' : '-6deg' }] }}
          />
        ))}
        {Array.from({ length: 7 }).map((_, index) => (
          <View
            key={`v-${index}`}
            className="absolute w-[1px] bg-white/75"
            style={{ left: 30 + index * 45, top: 0, bottom: 0, transform: [{ rotate: index % 2 ? '-12deg' : '10deg' }] }}
          />
        ))}
      </View>

      <View className="absolute left-[70px] top-[58px] rounded-sm bg-white/80 px-2 py-1">
        <Text className="text-[10px] text-[#697386]">Manglam Metropolis Tower</Text>
      </View>
      <View className="absolute right-[58px] top-[92px] rounded-sm bg-white/80 px-2 py-1">
        <Text className="text-[10px] text-[#697386]">Birsh Sahakar Marg</Text>
      </View>
      <View className="absolute left-[16px] top-[139px] rounded-sm bg-white/80 px-2 py-1">
        <Text className="text-[10px] text-[#697386]">SHREE SHYAM ENTERPRISES</Text>
      </View>

      <View className="absolute left-1/2 top-[74px] -ml-[65px] rounded bg-[#232323] px-3 py-2">
        <Text className="text-[11px] font-semibold text-white">Place the pin accurately on map</Text>
      </View>

      <View className="absolute left-1/2 top-[116px] -ml-4 h-8 w-8 items-center justify-center rounded-full bg-[#6542f4] shadow">
        <MapPin size={21} color="#ffffff" fill="#ffffff" strokeWidth={2} />
      </View>

      <View className="absolute bottom-3 left-3">
        <Text className="text-[12px] font-bold">
          <Text className="text-[#4285f4]">G</Text>
          <Text className="text-[#db4437]">o</Text>
          <Text className="text-[#f4b400]">o</Text>
          <Text className="text-[#4285f4]">g</Text>
          <Text className="text-[#0f9d58]">l</Text>
          <Text className="text-[#db4437]">e</Text>
        </Text>
      </View>

      <View className="absolute bottom-4 right-4 h-9 w-9 items-center justify-center rounded-full bg-white shadow">
        <LocateFixed size={18} color="#617184" strokeWidth={2} />
      </View>
    </View>
  );
}

export default function AddressManagementScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('list');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Address>(emptyAddress);

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

  const suggestions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return SUGGESTIONS;
    return SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.detail.toLowerCase().includes(search)
    );
  }, [query]);

  const openNewAddress = () => {
    setSelectedAddress(null);
    setForm(emptyAddress);
    setQuery('');
    setMode('search');
  };

  const openEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setForm({
      ...emptyAddress,
      ...address,
      title: address.title || 'Home',
      city: address.city || 'Jaipur',
      state: address.state || 'Rajasthan',
    });
    setActiveMenuId(null);
    setMode('form');
  };

  const selectSuggestion = (suggestion: (typeof SUGGESTIONS)[number]) => {
    setForm((prev) => ({
      ...prev,
      addressLineOne: suggestion.title,
      addressLineTwo: suggestion.detail,
      city: suggestion.city,
      state: 'Rajasthan',
      country: 'India',
    }));
    setMode('form');
  };

  const onChange = (key: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (address: Address) => {
    if (!address.id) return;
    try {
      await deleteAddress({ id: address.id });
      toast.success('Address deleted');
      setActiveMenuId(null);
      loadAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetCurrent = async (address: Address) => {
    if (!address.id || currentAddressId === address.id) return;
    try {
      await setCurrentAddress({ id: address.id });
      setCurrentAddressId(address.id);
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update address');
    }
  };

  const handleSubmit = async () => {
    if (!form.addressLineOne || !form.reciverName || !form.reciverNumber) {
      toast.error('Fill required address details');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        title: form.title || 'Home',
        city: form.city || 'Jaipur',
        state: form.state || 'Rajasthan',
        country: form.country || 'India',
        postalCode: form.postalCode || '302020',
        latitude: String(form.latitude ?? ''),
        longitude: String(form.longitude ?? ''),
      };

      if (selectedAddress?.id || form.id) {
        await editAddress(payload);
        toast.success('Address updated');
      } else {
        await addAddress(payload);
        toast.success('Address added');
      }

      setMode('list');
      setSelectedAddress(null);
      loadAddresses();
    } catch {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (mode === 'form') {
      setMode(selectedAddress ? 'list' : 'search');
      return;
    }
    if (mode === 'search') {
      setMode('list');
      return;
    }
    router.canGoBack() ? router.back() : router.replace('/Profile');
  };

  if (mode === 'search') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <StatusBar style="dark" />
        <View className="flex-1" style={{ paddingTop: 34 }}>
          <View className="px-4">
            <View className="h-10 flex-row items-center rounded-md border border-[#d8d8d8] bg-white px-2">
              <Pressable onPress={goBack} className="h-8 w-8 items-center justify-center">
                <ChevronLeft size={22} color="#111111" />
              </Pressable>
              <Input
                value={query}
                onChangeText={setQuery}
                placeholder="Manglam"
                placeholderTextColor="#111111"
                className="h-9 flex-1 border-0 bg-transparent px-1 text-[14px] shadow-none"
              />
            </View>
          </View>

          <Pressable
            onPress={() => selectSuggestion(SUGGESTIONS[0])}
            className="mt-4 flex-row items-center border-b border-[#eeeeee] bg-[#f8f8f8] px-5 py-4"
          >
            <Crosshair size={14} color="#ff5a2a" strokeWidth={2} />
            <Text className="ml-3 text-[16px] font-medium text-[#ff5a2a]">Use current location</Text>
          </Pressable>

          <View className="px-4">
            {suggestions.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => selectSuggestion(item)}
                className="flex-row border-b border-[#ededed] py-4"
              >
                <View className="mt-1 h-5 w-5 items-center justify-center rounded-full border border-[#d8d8d8]">
                  <MapPin size={12} color="#8a8a8a" strokeWidth={2} />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-[18px] font-semibold text-[#323232]">{item.title}</Text>
                  <Text className="mt-1 text-[14px] leading-[20px] text-[#777777]">{item.detail}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === 'form') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 0) + 24 }}
        >
          <View className="absolute left-4 right-4 top-[34px] z-10">
            <Header title="Manage Addresses" onBack={goBack} onClose={() => setMode('list')} />
          </View>

          <StaticMapPreview />

          <View className="-mt-5 rounded-t-[24px] bg-white px-4 pb-6 pt-3">
            <View className="mb-3 h-1 w-10 self-center rounded-full bg-[#d9d9d9]" />

            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-[20px] font-bold text-[#111111]">{form.city || 'Jaipur'}</Text>
              <Button variant="outline" className="h-8 rounded-md border-[#ff5a2a] px-3" onPress={() => setMode('search')}>
                <Text className="text-[12px] font-semibold text-[#ff5a2a]">Change</Text>
              </Button>
            </View>

            <View className="gap-4">
              <Input
                value={form.addressLineOne}
                onChangeText={(text) => onChange('addressLineOne', text)}
                placeholder="238"
                placeholderTextColor="#4f4f4f"
                className="h-12 rounded-md border-[#d8d8d8] px-4 text-[15px] shadow-none"
              />
              <Input
                value={form.addressLineTwo}
                onChangeText={(text) => onChange('addressLineTwo', text)}
                placeholder="Landmark (Optional)"
                placeholderTextColor="#a0a7b2"
                className="h-12 rounded-md border-[#d8d8d8] px-4 text-[15px] shadow-none"
              />
              <Input
                value={form.reciverName}
                onChangeText={(text) => onChange('reciverName', text)}
                placeholder="Receiver name"
                placeholderTextColor="#a0a7b2"
                className="h-12 rounded-md border-[#d8d8d8] px-4 text-[15px] shadow-none"
              />
              <Input
                value={form.reciverNumber}
                onChangeText={(text) => onChange('reciverNumber', text)}
                placeholder="Receiver phone number"
                placeholderTextColor="#a0a7b2"
                keyboardType="phone-pad"
                className="h-12 rounded-md border-[#d8d8d8] px-4 text-[15px] shadow-none"
              />
            </View>

            <Text className="mt-5 text-[14px] font-medium text-[#4d4d4d]">Save as</Text>
            <View className="mt-3 flex-row gap-2">
              {['Home', 'Other'].map((label) => {
                const active = form.title === label;
                return (
                  <Button
                    key={label}
                    variant={active ? 'default' : 'outline'}
                    className={`h-9 rounded-md px-5 ${active ? 'bg-[#ff6a2e]' : 'border-[#ff6a2e] bg-white'}`}
                    onPress={() => onChange('title', label)}
                  >
                    <Text className={`text-[13px] font-semibold ${active ? 'text-white' : 'text-[#ff6a2e]'}`}>
                      {active ? '✓ ' : ''}
                      {label}
                    </Text>
                  </Button>
                );
              })}
            </View>

            <Button disabled={saving} className="mt-8 h-12 rounded-md bg-[#ff6a2e]" onPress={handleSubmit}>
              <Text className="text-[15px] font-bold text-white">
                {saving ? 'Saving...' : selectedAddress ? 'Update address' : 'Save address'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <View className="flex-1" style={{ paddingTop: 34, paddingBottom: Math.max(insets.bottom, 0) + 24 }}>
        <View className="px-4">
          <Header title="Manage Addresses" onBack={goBack} />
          <Pressable onPress={openNewAddress} className="mt-4 flex-row items-center">
            <Plus size={16} color="#ff5a2a" strokeWidth={2} />
            <Text className="ml-2 text-[16px] font-medium text-[#ff5a2a]">Add another address</Text>
          </Pressable>
        </View>

        <Separator className="mt-4 bg-[#eeeeee]" />

        {loading ? (
          <View className="px-4 pt-4">
            <AddressListSkeleton />
          </View>
        ) : addresses.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <MapPin size={34} color="#ff5a2a" />
            <Text className="mt-4 text-center text-base font-bold text-[#111111]">No addresses yet</Text>
            <Text className="mt-2 text-center text-sm text-[#777777]">Add your first address to get started.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
            {addresses.map((item) => (
              <Pressable key={item.id} onPress={() => handleSetCurrent(item)} className="mb-3">
                <Card className="border-[#e5e7eb] bg-white shadow-sm shadow-black/5">
                  <CardContent className="p-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-4">
                        <Text className="text-[20px] font-semibold text-[#111111]">{item.title || 'Home'}</Text>
                        <Text className="mt-2 text-[16px] leading-[23px] text-[#777777]">
                          {[item.addressLineOne, item.addressLineTwo, item.city].filter(Boolean).join(', ')}
                        </Text>
                        <Text className="mt-1 text-[16px] leading-[23px] text-[#777777]">
                          {currentAddressId === item.id ? 'Verified Customer, ' : ''}
                          {item.reciverNumber || item.phoneNumber || ''}
                        </Text>
                      </View>

                      <Pressable onPress={() => setActiveMenuId(activeMenuId === item.id ? null : item.id ?? null)} className="h-9 w-9 items-end">
                        <MoreVertical size={20} color="#555555" />
                      </Pressable>
                    </View>
                  </CardContent>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <Modal
          visible={!!activeMenuId}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveMenuId(null)}
        >
          <Pressable className="flex-1" onPress={() => setActiveMenuId(null)}>
            <View className="absolute right-9 top-[135px] w-[84px] rounded bg-white py-2 shadow">
              <Pressable
                className="px-4 py-2"
                onPress={() => {
                  const address = addresses.find((item) => item.id === activeMenuId);
                  if (address) openEditAddress(address);
                }}
              >
                <Text className="text-[13px] text-[#111111]">Edit</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2"
                onPress={() => {
                  const address = addresses.find((item) => item.id === activeMenuId);
                  if (address) handleDelete(address);
                }}
              >
                <Text className="text-[13px] text-[#111111]">Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
