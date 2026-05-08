import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronDown, MapPin, Bell, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useUserDetails, useCurrentAddress } from '@/api/user';

import HeaderSkeleton from '@/app/skeleton/home/Header';

export default function HeaderSection() {
  const { data: userRes, isLoading: userLoading } = useUserDetails();

  const userData = userRes?.data;
  const addressId = userData?.currentAddressId;

  const { data: addressRes, isLoading: addressLoading } =
    useCurrentAddress(addressId);

  const currentAddress = addressRes?.data;

  const loading = userLoading || addressLoading;

  if (loading) {
    return <HeaderSkeleton />;
  }

  return (
    <View>
      {/* TOP ROW */}
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-xl font-semibold">
            Hi, {userData?.firstName ? userData.firstName : 'Guest'} 👋
          </Text>

          <Text className="text-2xl font-semibold">
            Welcome back
          </Text>
        </View>

        <View className="flex-row gap-3">
          {/* Search */}
          <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white shadow">
            <Search size={20} color="#5e5e5e" />
          </Pressable>

          {/* Bell */}
          <Pressable
            onPress={() =>
              router.navigate({ pathname: '/NotificationsScreen' })
            }
            className="h-12 w-12 items-center justify-center rounded-full bg-white shadow"
          >
            <Bell size={20} color="#5e5e5e" />
          </Pressable>
        </View>
      </View>

      {/* ADDRESS */}
      <LinearGradient
        colors={['#FBBF24', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 40,
          padding: 2,
          marginTop: 16,
        }}
      >
        <Pressable
          onPress={() =>
            router.navigate({ pathname: '/AddressManagementScreen' })
          }
          className="flex-row items-center justify-between rounded-full bg-white px-4 py-3"
        >
          {/* LEFT */}
          <View className="flex-1 flex-row items-center">
            <MapPin size={16} color="#999" />

            <Text className="ml-2 text-sm" numberOfLines={1}>
              {currentAddress?.addressLineOne
                ? currentAddress.addressLineOne
                : 'Select delivery address'}
            </Text>
          </View>

          {/* RIGHT */}
          <ChevronDown size={18} color="#F97316" />
        </Pressable>
      </LinearGradient>
    </View>
  );
}