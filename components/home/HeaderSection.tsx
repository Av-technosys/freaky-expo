// components/home/HeaderSection.tsx

import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronDown, MapPin, Bell, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { userDetails, fetchCurrentAddress } from '@/api/user';
import Toast from 'react-native-toast-message';
import HeaderSkeleton from '@/app/skeleton/home/Header';

export default function HeaderSection({ bottomSheetRef }: any) {
  const navigation = useNavigation<any>();

  const [userData, setUserData] = useState<any>(null);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const res = await userDetails();

      if (res?.data) {
        setUserData(res.data);

        const addressId = res.data.currentAddressId;

        if (addressId) {
          const addressRes = await fetchCurrentAddress(addressId);

          if (addressRes?.data) {
            setCurrentAddress(addressRes.data);
          } else {
            setCurrentAddress(null);
          }
        } else {
          setCurrentAddress(null);
        }
      } else {
        setUserData(null);
        setCurrentAddress(null);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load user details.'
      });
      setUserData(null);
      setCurrentAddress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <HeaderSkeleton/>
    );
  }

  return (
    <View className="px-4 mt-4">

      {/* TOP ROW */}
      <View className="flex-row justify-between items-center">

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
          <Pressable className="w-12 h-12 rounded-full bg-white items-center justify-center shadow">
            <Search size={20} color="#5e5e5e" />
          </Pressable>

          {/* Bell */}
          <Pressable
            onPress={() =>
              navigation.getParent()?.navigate('FlowStack', {
                screen: 'NotificationsScreen',
              })
            }
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow"
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
          onPress={() => bottomSheetRef.current?.expand()}
          className="bg-white rounded-full flex-row items-center justify-between px-4 py-3"
        >
          {/* LEFT */}
          <View className="flex-row items-center flex-1">
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