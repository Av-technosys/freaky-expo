import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';

type RightType = 'notification' | 'menu' | 'none';

type ScreenHeaderProps = {
  title: string;
  rightType?: RightType;
  showBack?: boolean;
};

export default function ScreenHeader({
  title,
  rightType = 'none',
  showBack = true,
}: ScreenHeaderProps) {
  const navigation = useNavigation<any>();
  const index = useNavigationState((state) => state.index);

  const renderRight = () => {
    switch (rightType) {
      case 'notification':
        return (
          <Pressable
            onPress={() => {
              navigation.getParent()?.navigate('FlowStack', {
                screen: 'NotificationsScreen',
              });
            }}
            className="relative">
            <Feather name="bell" size={22} color="#000" />
            <View className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
          </Pressable>
        );

      case 'menu':
        return (
          <Pressable>
            <MaterialIcons name="more-vert" size={22} color="#000" />
          </Pressable>
        );

      default:
        return <View className="w-6" />;
    }
  };

return (
  <View className=" justify-center bg-background ">
    
    {/* TITLE (perfect center) */}
    <Text className="absolute self-center text-2xl font-semibold text-foreground">
      {title}
    </Text>

    {/* LEFT + RIGHT */}
    <View className="flex-row items-center justify-between">
      
      {/* LEFT */}
      {showBack ? (
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </Pressable>
      ) : (
        <View className="w-6" />
      )}

      {/* RIGHT */}
      {renderRight()}
    </View>
  </View>
);
}



