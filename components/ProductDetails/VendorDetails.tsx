import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

type VendorDetailsCardProps = {
  name?: string;
  location?: string;
  vendorId?: string;
  serviceId?: string;
  email?: string;
  logo?: any;
};

export default function VendorDetailsCard({
  name = 'Vendor',
  location = '',
  vendorId = '',
  serviceId = '',
  email = '',
  logo,
}: VendorDetailsCardProps) {
  return (
    <View className="mb-4">

      {/* TITLE */}
      <Text className="text-2xl my-3 font-bold text-black">
        Vendor Details
      </Text>

      {/* CARD */}
      <View style={{ borderRadius: 18, overflow: 'hidden' }}>

        <LinearGradient
          colors={['#F97316', '#FDBA74']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >

          {/* LEFT */}
          <View className="flex-1 pr-3">

            <Text className="text-white text-2xl font-bold">
              {name}
            </Text>

            {!!location && (
              <Text className="text-white/90 text-sm mt-1">
                {location}
              </Text>
            )}

            <Text className="text-white/90 text-sm mt-1">
              Vendor ID: {vendorId || '-'} | Service ID: {serviceId || '-'}
            </Text>

            {!!email && (
              <Text className="text-white/90 text-sm mt-1">
                {email}
              </Text>
            )}

            {/* SOCIAL ICONS */}
            <View className="flex-row mt-3 gap-4">
              <Feather name="facebook" size={18} color="#fff" />
              <Feather name="instagram" size={18} color="#fff" />
              <Feather name="twitter" size={18} color="#fff" />
            </View>

          </View>

          {/* RIGHT LOGO */}
          <View className="rounded-xl bg-white/10 p-2">
            <Image
              source={
                logo?.uri
                  ? logo
                  : require('@/assets/images/vendor-logo.png')
              }
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>

        </LinearGradient>

      </View>
    </View>
  );
}