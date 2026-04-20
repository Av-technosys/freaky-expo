import React from 'react';
import { View, Image, Pressable, FlatList, SectionList } from 'react-native';
import { ArrowLeft, Bell, Calendar, Clock, MoreVertical } from 'lucide-react-native';

// React Native Reusables components
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';


type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  unreadCount?: number;
  type: 'reminder' | 'mention' | 'update' | 'alert';
  read?: boolean;
};

const getIconConfig = (type: Notification['type']) => {
  switch (type) {
    case 'reminder':
      return { icon: Calendar, bg: 'bg-primary/10', color: 'text-primary' };
    case 'mention':
      return { icon: Bell, bg: 'bg-yellow-500/10', color: 'text-yellow-600' };
    case 'update':
      return { icon: Clock, bg: 'bg-blue-500/10', color: 'text-blue-600' };
    case 'alert':
      return { icon: Bell, bg: 'bg-destructive/10', color: 'text-destructive' };
    default:
      return { icon: Bell, bg: 'bg-muted', color: 'text-muted-foreground' };
  }
};

const TODAY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Meeting Reminder',
    description: 'Your team meeting starts in 30 minutes. Join now!',
    time: '9 min ago',
    unreadCount: 2,
    type: 'reminder',
    read: false,
  },
  {
    id: '2',
    title: 'Robert mentioned you',
    description: 'Robert mentioned you in a comment: "Great work on the project!"',
    time: '14 min ago',
    type: 'mention',
    read: false,
  },
  {
    id: '3',
    title: 'Booking Confirmed',
    description: 'Your booking for Sunset Dinner has been confirmed',
    time: '1 hour ago',
    unreadCount: 1,
    type: 'update',
    read: false,
  },
  {
    id: '4',
    title: 'Special Offer!',
    description: 'Get 20% off on your next booking. Limited time offer!',
    time: '2 hours ago',
    type: 'alert',
    read: true,
  },
];

const YESTERDAY_NOTIFICATIONS: Notification[] = [
  {
    id: '5',
    title: 'Payment Successful',
    description: 'Your payment of ₹2,500 has been successfully processed',
    time: 'Yesterday, 6:30 PM',
    type: 'update',
    read: true,
  },
  {
    id: '6',
    title: 'New Message',
    description: 'You have a new message from support team',
    time: 'Yesterday, 2:15 PM',
    unreadCount: 1,
    type: 'alert',
    read: false,
  },
  {
    id: '7',
    title: 'Weekly Digest',
    description: 'Here\'s what you missed this week in events',
    time: 'Yesterday, 9:00 AM',
    type: 'reminder',
    read: true,
  },
];

const SECTION_DATA = [
  { title: 'Today', data: TODAY_NOTIFICATIONS },
  { title: 'Yesterday', data: YESTERDAY_NOTIFICATIONS },
];

interface NotificationItemProps {
  item: Notification;
  onPress?: (item: Notification) => void;
}

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
  const { icon: Icon, bg, color } = getIconConfig(item.type);
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`${!item.read ? '' : ''}`}
    >
      <Card className={`border-border mb-3 ${isPressed ? 'opacity-70' : ''}`}>
        <CardContent className="p-2">
          <View className="flex-row items-start gap-3">
            {/* Icon Avatar */}
            <Avatar alt='its you' className={`h-12 w-12 ${bg} rounded-full`}>
              <AvatarFallback>
                <Icon size={20} className={color} />
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <View className="flex-1 gap-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <Text 
                    className={`text-base font-semibold flex-1 ${!item.read ? 'text-foreground' : 'text-muted-foreground'}`}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {!item.read && (
                    <View className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </View>
                <Text className="text-xs text-muted-foreground ml-2">
                  {item.time}
                </Text>
              </View>

              <Text 
                className={`text-sm ${!item.read ? 'text-foreground' : 'text-muted-foreground'}`}
                numberOfLines={2}
              >
                {item.description}
              </Text>

              {/* Action Buttons */}
              <View className="flex-row gap-2 mt-2">
                {!item.read && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-3"
                  >
                    <Text className="text-xs text-primary">Mark as read</Text>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-3"
                >
                  <Text className="text-xs text-muted-foreground">View details</Text>
                </Button>
              </View>
            </View>

            {/* Unread Badge */}
            {item.unreadCount && item.unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2">
                <Text className="text-white text-xs font-bold">
                  {item.unreadCount}
                </Text>
              </Badge>
            )}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
};

const EmptyState = () => (
  <View className="flex-1 items-center justify-center px-6 py-20">
    <View className="w-32 h-32 rounded-full bg-muted items-center justify-center mb-6">
      <Bell size={48} className="text-muted-foreground" />
    </View>
    <Text className="text-xl font-semibold text-foreground text-center mb-2">
      No notifications yet
    </Text>
    <Text className="text-muted-foreground text-center leading-5">
      We'll notify you when there's something new. Stay tuned for updates!
    </Text>
    <Button 
      variant="outline" 
      className="mt-6 px-6"
      onPress={() => console.log('Browse events')}
    >
      <Text>Browse Events</Text>
    </Button>
  </View>
);


interface NotificationsScreenProps {
  navigation: any;
  hasNotifications?: boolean;
}

export default function NotificationsScreen({ 
  navigation, 
  hasNotifications = true 
}: NotificationsScreenProps) {
  const [notifications, setNotifications] = React.useState(SECTION_DATA);

  const handleNotificationPress = (item: Notification) => {
    console.log('Pressed notification:', item.id);
    // Navigate to respective screen
    // navigation.navigate('NotificationDetails', { id: item.id });
  };

  const markAllAsRead = () => {
    const updatedSections = notifications.map(section => ({
      ...section,
      data: section.data.map(notif => ({ ...notif, read: true, unreadCount: 0 }))
    }));
    setNotifications(updatedSections);
  };

  return (
   <Screen scroll>
    <ScreenHeader title='Notifications' showBack/>
      {/* Notifications List */}
      {!hasNotifications ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={handleNotificationPress} />
          )}
          contentContainerClassName=" mt-8 pb-8"
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </Screen>
  );
}
