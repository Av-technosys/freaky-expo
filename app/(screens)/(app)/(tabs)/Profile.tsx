import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {
  Bell,
  Camera,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Headphones,
  Info,
  MapPin,
  Phone,
  Settings,
  UserRound,
} from 'lucide-react-native';

import { setProfilePicture, userDetails } from '@/api/user';
import { toast } from '@/components/common/ToastManager';
import ProfileSkeleton from '@/app/skeleton/Profile';
import NotFound from '@/components/common/NotFound';
import { Text } from '@/components/ui/text';
import { uploadImage } from '@/lib/uploadImage';
import { getMediaUrl } from '@/utils/image';

type IconComponent = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type QuickAction = {
  title: string;
  icon: IconComponent;
  onPress?: () => void;
};

type MenuItem = {
  title: string;
  icon: IconComponent;
  onPress?: () => void;
  boxedIcon?: boolean;
};

function QuickActionCard({ title, icon: Icon, onPress }: QuickAction) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <View style={styles.quickIconBox}>
        <Icon size={20} color="#ff5a2a" strokeWidth={1.9} />
      </View>
      <Text style={styles.quickTitle}>{title}</Text>
      <View style={styles.quickAccent} />
    </Pressable>
  );
}

function MenuRow({ title, icon: Icon, onPress, boxedIcon }: MenuItem) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        {boxedIcon ? (
          <View style={styles.fcIconBox}>
            <Text style={styles.fcIconText}>FC</Text>
          </View>
        ) : (
          <Icon size={21} color="#111111" strokeWidth={1.9} />
        )}
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <ChevronRight size={23} color="#3f3f3f" strokeWidth={2.2} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const loadUser = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await userDetails();
      setUser(res?.data ?? null);
    } catch (error) {
      console.log('Failed to load user', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser(true);
  }, [loadUser]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) void loadUser();
    }, [loadUser, loading]),
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'idToken']);
      toast.success('Logged out successfully');
      router.replace('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleAvatarPress = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.error('Please allow photo library access to upload a profile image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      const image = result.assets?.[0];
      if (result.canceled || !image) return;

      setUploadingAvatar(true);
      const profileImage = await uploadImage(image, 'profile-images');
      await setProfilePicture({ profileImage });
      setUser((current: any) => ({ ...current, profileImage }));
      toast.success('Profile image updated');
    } catch (error) {
      console.warn('Unable to update profile image', error);
      toast.error('Unable to update profile image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const displayName = useMemo(() => {
    const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
    return fullName || user?.fullName || user?.name || 'Your profile';
  }, [user]);

  const phoneNumber = user?.number || user?.phone || 'Add your mobile number';
  const profileImage = getMediaUrl(user?.profileImage || user?.avatar || user?.avatarUrl);
  const isProfileIncomplete = !user?.firstName || !user?.lastName || !(user?.number || user?.phone);

  const quickActions: QuickAction[] = [
    { title: 'Payment\nMethod', icon: CreditCard, onPress: () => router.navigate('/ManagePaymentMethods') },
    { title: 'Contact\nUs', icon: Phone, onPress: () => router.navigate('/ContactUs') },
    { title: 'Help &\nSupport', icon: Headphones, onPress: () => router.navigate('/Help') },
  ];

  const menuItems: MenuItem[] = [
    { title: 'Profile Details', icon: UserRound, onPress: () => router.navigate('/ProfileEditScreen') },
    { title: 'Notifications', icon: Bell, onPress: () => router.navigate('/NotificationsScreen') },
    { title: 'Manage Addresses', icon: MapPin, onPress: () => router.navigate('/AddressManagementScreen') },
    { title: 'General Info', icon: Info, onPress: () => router.navigate('/GeneralInformation') },
    { title: 'About FC', icon: Info, boxedIcon: true, onPress: () => router.navigate('/AboutFC') },
    { title: 'Settings', icon: Settings, onPress: () => router.navigate('/PermissionScreen') },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.loadingWrap}>
          <ProfileSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.loadingWrap}>
          <NotFound title="User not found" description="Unable to load profile." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 0) + 122 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileMetaRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Upload profile image"
              disabled={uploadingAvatar}
              onPress={handleAvatarPress}
              style={styles.avatarButton}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <UserRound size={31} color="#697386" strokeWidth={1.6} />
              )}
              <View style={styles.avatarCameraBadge}>
                <Camera size={11} color="#ffffff" strokeWidth={2.4} />
              </View>
            </Pressable>
            <View style={styles.profileTextBlock}>
              {isProfileIncomplete ? (
                <View style={styles.statusPill}>
                  <CircleAlert size={10} color="#df351f" fill="#df351f" strokeWidth={2} />
                  <Text style={styles.statusText}>Incomplete profile</Text>
                </View>
              ) : null}

              <Text style={styles.nameText} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.phoneText}>{phoneNumber}</Text>
            </View>

            <Pressable
              style={styles.completeButton}
              onPress={() => router.navigate('/ProfileEditScreen')}
            >
              <Text style={styles.completeText}>Complete</Text>
            </Pressable>
          </View>

          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuGroup}>
          {menuItems.map((item) => (
            <MenuRow key={item.title} {...item} />
          ))}
        </View>

        <Pressable onPress={handleLogout} style={styles.logoutPressable}>
          <LinearGradient
            colors={['#ff552f', '#ffa047']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingWrap: {
    flex: 1,
    padding: 16,
  },
  content: {
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 27,
    paddingBottom: 30,
  },
  title: {
    color: '#0b0b0b',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  avatarButton: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderWidth: 1,
    borderColor: '#e0e5eb',
    borderRadius: 31,
    backgroundColor: '#f7f8fa',
    overflow: 'visible',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarCameraBadge: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 11,
    backgroundColor: '#ff5a2a',
  },
  profileTextBlock: {
    flex: 1,
    paddingRight: 16,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 14,
    backgroundColor: '#fff0f0',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  statusText: {
    color: '#df351f',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 13,
  },
  nameText: {
    marginTop: 5,
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 29,
  },
  phoneText: {
    marginTop: 4,
    color: '#697386',
    fontSize: 12,
    lineHeight: 15,
  },
  completeButton: {
    height: 29,
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0b0b0b',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
  },
  completeText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  quickCard: {
    width: '31%',
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 4,
  },
  quickIconBox: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff4ed',
  },
  quickTitle: {
    marginTop: 9,
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 15,
    textAlign: 'center',
  },
  quickAccent: {
    width: 20,
    height: 2,
    marginTop: 8,
    borderRadius: 2,
    backgroundColor: '#ff5a2a',
  },
  divider: {
    height: 5,
    backgroundColor: '#f2f2f2',
  },
  menuGroup: {
    paddingTop: 18,
  },
  menuRow: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    marginLeft: 18,
    color: '#4a4a4a',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 19,
  },
  fcIconBox: {
    width: 19,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.4,
    borderColor: '#111111',
    borderRadius: 2,
  },
  fcIconText: {
    color: '#111111',
    fontSize: 7,
    fontWeight: '800',
    lineHeight: 9,
  },
  logoutPressable: {
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 32,
  },
  logoutButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
