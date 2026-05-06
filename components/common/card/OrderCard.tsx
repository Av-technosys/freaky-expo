import { Pressable, View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

export default function OrderCard({
  vendorName,
  vendorLogo,
  contactName,
  contactNumber,
  description,
  bookingStatus,
  startTime,
  endTime,
  totalAmount,
  minGuestCount,
  maxGuestCount,
  source,
  onPress,
}: any) {

  const getStatusColor = () => {
    switch (bookingStatus?.toLowerCase()) {
      case 'confirmed':
        return '#10B981'; // green
      case 'completed':
        return '#3B82F6'; // blue
      case 'pending':
        return '#F59E0B'; // yellow
      case 'cancelled':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const getGuestCount = () => {
    if (minGuestCount && maxGuestCount && minGuestCount !== maxGuestCount) {
      return `${minGuestCount} - ${maxGuestCount} guests`;
    }
    if (maxGuestCount) {
      return `${maxGuestCount} guests`;
    }
    if (minGuestCount) {
      return `${minGuestCount} guest${minGuestCount > 1 ? 's' : ''}`;
    }
    return null;
  };

  const statusColor = getStatusColor();
  const guestCount = getGuestCount();
  const hasDateTime = startTime || endTime;

  return (
    <Pressable onPress={onPress}>
      <Card className=" -py-6 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
        <View className="flex-row">
       
                <View className="w-16 items-center justify-center bg-orange-400">
            <Feather name="gift" size={28} color="#fff" />
          </View>

          <View className="flex-1 px-4 py-3">
            {/* Header Row */}
            <View className="flex-row items-start justify-between gap-3 mb-3">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  {vendorLogo ? (
                    <Image 
                      source={{ uri: vendorLogo }}
                      className="h-6 w-6 rounded-md"
                      resizeMode="cover"
                    />
                  ) : (
                    <Feather name="briefcase" size={16} color="#F97316" />
                  )}
                  <Text className="text-base font-semibold text-black" numberOfLines={1}>
                    {vendorName || 'Vendor'}
                  </Text>
                </View>
                
                {/* Status Badge */}
                <View className="flex-row items-center gap-2 mt-1.5">
                  <View 
                    className="flex-row items-center gap-1.5 px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${statusColor}15`,
                      borderWidth: 0.5,
                      borderColor: `${statusColor}30`
                    }}
                  >
                    <Feather 
                      name={bookingStatus?.toLowerCase() === 'confirmed' ? 'check-circle' : 
                            bookingStatus?.toLowerCase() === 'completed' ? 'check' :
                            bookingStatus?.toLowerCase() === 'pending' ? 'clock' :
                            bookingStatus?.toLowerCase() === 'cancelled' ? 'x-circle' : 'info'}
                      size={12} 
                      color={statusColor} 
                    />
                    <Text 
                      className="text-xs font-semibold capitalize"
                      style={{ color: statusColor }}
                    >
                      {bookingStatus}
                    </Text>
                  </View>
                  {source && (
                    <>
                      <View className="w-1 h-1 rounded-full bg-gray-300" />
                      <Text className="text-xs text-gray-400">
                        {source === 'EVENT' ? 'Event' : 'Regular'}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              {/* Price */}
              {totalAmount && (
                <View className="items-end">
                  <Text className="font-bold ">₹ {parseFloat(totalAmount).toFixed(2)}</Text>
                </View>
              )}
            </View>

            {/* Details Grid */}
            <View className="gap-2">
              {/* Contact Row */}
              {(contactName || contactNumber) && (
                <View className="flex-row items-center gap-3">
                  {contactName && (
                    <View className="flex-row items-center gap-1.5">
                      <Feather name="user" size={13} color="#9CA3AF" />
                      <Text className="text-xs text-gray-600">{contactName}</Text>
                    </View>
                  )}
                  {contactNumber && (
                    <View className="flex-row items-center gap-1.5">
                      <Feather name="phone" size={13} color="#9CA3AF" />
                      <Text className="text-xs text-gray-600">{contactNumber}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Date & Time Row */}
              {hasDateTime && (
                <View className="flex-row items-center gap-3">
                  {startTime && (
                    <View className="flex-row items-center gap-1.5">
                      <Feather name="calendar" size={13} color="#9CA3AF" />
                      <Text className="text-xs text-gray-600">{formatDate(startTime)}</Text>
                    </View>
                  )}
                  {endTime && (
                    <View className="flex-row items-center gap-1.5">
                      <Feather name="clock" size={13} color="#9CA3AF" />
                      <Text className="text-xs text-gray-600">{formatTime(startTime || endTime)}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Guest Count */}
              {guestCount && (
                <View className="flex-row items-center gap-1.5">
                  <Feather name="users" size={13} color="#9CA3AF" />
                  <Text className="text-xs text-gray-600">{guestCount}</Text>
                </View>
              )}

              {/* Description */}
              {description && (
                <View className="flex-row items-start gap-1.5">
                  <Feather name="file-text" size={13} color="#9CA3AF" style={{ marginTop: 1 }} />
                  <Text className="flex-1 text-xs text-gray-600" numberOfLines={2}>
                    {description}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}