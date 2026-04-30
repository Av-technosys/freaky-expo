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
  facebook?: string;
  instagram?: string;
  youtube?: string;
};

export default function VendorDetailsCard({
  name = 'Vendor',
  location = '',
  vendorId = '',
  serviceId = '',
  email = '',
  logo,
  facebook,
  instagram,
  youtube,
}: VendorDetailsCardProps) {
  return (
    <View className="mb-4">
      {/* TITLE */}
      <Text className="my-3 text-2xl font-bold text-black">Vendor Details</Text>

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
          }}>
          {/* LEFT */}
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-bold text-white">{name}</Text>

            {!!location && <Text className="mt-1 text-sm text-white/90">{location}</Text>}

            <Text className="mt-1 text-sm text-white/90">
              Vendor ID: {vendorId || '-'} | Service ID: {serviceId || '-'}
            </Text>

            {!!email && <Text className="mt-1 text-sm text-white/90">{email}</Text>}

            {/* SOCIAL ICONS */}
            <View className="mt-3 flex-row gap-4">
              {!!facebook && <Feather name="facebook" size={18} color="#fff" />}
              {!!instagram && <Feather name="instagram" size={18} color="#fff" />}
              {!!youtube && <Feather name="youtube" size={18} color="#fff" />}
            </View>
          </View>

          {/* RIGHT LOGO */}
          <View className="rounded-xl bg-white/10 p-2">
            <Image
              source={logo?.uri ? logo : require('@/assets/images/vendor-logo.png')}
              className="h-28 w-28"
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
