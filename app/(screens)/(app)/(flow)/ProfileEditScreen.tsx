import React, { useEffect, useState } from 'react';
import { View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';

import Screen from '@/app/provider/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';

// UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/common/AppButton';
import { File } from 'expo-file-system';
import { userDetails, updateUserProfile, getBucketUrl } from '@/api/user';
import ProfileEditSkeleton from '@/app/skeleton/ProfileEditSkeleton';

export default function ProfileEditScreen() {
  const router = useRouter();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);

  const [user, setUser] = useState<any>({
    fullName: '',
    email: '',
    number: '',
    profileImage: null,
  });

  const S3_BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL;

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userDetails();
        const data = res.data;

        setUser({
          fullName: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
          email: data.email ?? '',
          number: data.number ?? '',
          profileImage: data.profileImage ?? null,
        });
      } catch {
        Toast.show({ type: 'error', text1: 'Failed to load user' });
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, []);

  // ---------------- IMAGE PICK + UPLOAD ----------------

  const handlePickImage = async () => {
    try {
      // 1️⃣ pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.5, // 🔥 important (avoid crash)
      });

      if (result.canceled) return;

      const image = result.assets[0];
      console.log('📸 picked:', image);

      // 2️⃣ get presigned URL (⚠️ MUST upload immediately after this)
      const res = await getBucketUrl({
        fileName: `profile-${Date.now()}.jpg`,
        fileType: image.mimeType || 'image/jpeg',
        path: 'userProfile',
      });

      const { uploadUrl, filePath } = res;

      console.log('🔗 presigned received', uploadUrl);

      // 🚨 DO NOT DELAY HERE (expiry issue)
      // no UI pause, no waiting, upload immediately

      // 3️⃣ convert to blob safely
const file = new File(image.uri);

const uploadRes = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
'Content-Type': 'image/jpeg'  },
  body: await file.arrayBuffer(),
});
      console.log('📦 upload status:', uploadRes.status);

      // 5️⃣ handle failure safely (no crash feeling)
      if (uploadRes.status !== 200) {
        console.log('❌ S3 ERROR:', uploadRes.body);
        return;
      }

      // ✅ success
      console.log('✅ UPLOADED:', filePath);

      // 👉 save filePath to DB or state here
      // setProfileImage(filePath);
    } catch (err) {
      console.log('❌ UPLOAD ERROR:', err);
    }
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    try {
      setLoading(true);

      await updateUserProfile({
        firstName: user.fullName,
        lastName: '',
        email: user.email,
        number: user.number,
        profileImage: tempProfileImage ?? user.profileImage, // IMPORTANT
      });

      Toast.show({ type: 'success', text1: 'Profile updated' });
      router.back();
    } catch {
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AVATAR ----------------
  const avatarSource = tempProfileImage
    ? { uri: `${S3_BASE_URL}/${tempProfileImage}` }
    : user.profileImage
      ? { uri: `${S3_BASE_URL}/${user.profileImage}` }
      : require('@/assets/images/default-avtar.jpg');

  // ---------------- UI ----------------
  return (
    <Screen scroll>
      <ScreenHeader title="Edit Profile" showBack />

      {initialLoading ? (
        <ProfileEditSkeleton />
      ) : (
        <View className="mt-4 gap-6 px-1 pb-10">
          {/* AVATAR */}
          <View className="items-center">
            <View className="rounded-full border-4 border-orange-400 p-[3px]">
              <Image source={avatarSource} className="h-28 w-28 rounded-full" />
            </View>

            <Pressable
              onPress={handlePickImage}
              className="absolute bottom-1 right-[38%] h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600">
              <Feather name="plus" size={14} color="#fff" />
            </Pressable>
          </View>

          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
            </CardHeader>

            <CardContent className="gap-5">
              {/* NAME */}
              <View className="gap-1.5">
                <Label>Full Name</Label>
                <Input
                  value={user.fullName}
                  onChangeText={(text) => setUser((prev: any) => ({ ...prev, fullName: text }))}
                />
              </View>

              {/* EMAIL */}
              <View className="gap-1.5">
                <Label>Email</Label>
                <Input value={user.email} editable={false} />
              </View>

              {/* PHONE */}
              <View className="gap-1.5">
                <Label>Contact No.</Label>
                <Input
                  value={user.number}
                  onChangeText={(text) => setUser((prev: any) => ({ ...prev, number: text }))}
                />
              </View>
            </CardContent>
          </Card>

          {/* ACTIONS (FIXED VISIBILITY) */}
          <View className="flex flex-wrap gap-4 pb-10">
            <AppButton className="flex-1" onPress={handleSave} disabled={loading}>
              <Text>{loading ? 'Saving...' : 'Save'}</Text>
            </AppButton>

            <AppButton variant="outline" className="flex-1" onPress={() => router.back()}>
              <Text>Cancel</Text>
            </AppButton>
          </View>
        </View>
      )}
    </Screen>
  );
}
