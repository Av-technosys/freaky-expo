import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';

import { userDetails, updateUserProfile } from '@/api/user';
import { toast } from '@/components/common/ToastManager';
import ProfileEditSkeleton from '@/app/skeleton/ProfileEditSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

const flag = require('@/public/flag.png');

type ProfileForm = {
  honorific: string;
  countryDialCode: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  anniversary: string;
  profileImage?: string | null;
};

const HONORIFICS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
const COUNTRY_OPTIONS = [
  { name: 'India', dialCode: '+91' },
  { name: 'United Arab Emirates', dialCode: '+971' },
  { name: 'United States', dialCode: '+1' },
  { name: 'United Kingdom', dialCode: '+44' },
];

function formatDateInput(value: string) {
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const digits = (isoDate ? `${isoDate[3]}${isoDate[2]}${isoDate[1]}` : value).replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function formatDateForApi(value: string) {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}

function splitPhoneNumber(value: string) {
  const raw = value.trim();
  const country = COUNTRY_OPTIONS.find((option) => raw.startsWith(option.dialCode));
  return {
    countryDialCode: country?.dialCode ?? '+91',
    phone: country ? raw.slice(country.dialCode.length).replace(/\D/g, '') : raw.replace(/\D/g, ''),
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-[13px] font-bold text-[#1f2937]">{children}</Label>;
}

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [honorificOpen, setHonorificOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    honorific: 'Mr.',
    countryDialCode: '+91',
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    anniversary: '',
    profileImage: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userDetails();
        const data = res?.data;
        const phone = splitPhoneNumber(data?.number ?? data?.phone ?? '');

        setForm((prev) => ({
          ...prev,
          honorific: data?.honorific ?? data?.title ?? prev.honorific,
          countryDialCode: phone.countryDialCode,
          name: `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim(),
          email: data?.email ?? '',
          phone: phone.phone,
          birthDate: formatDateInput(data?.birthDate ?? data?.dateOfBirth ?? ''),
          anniversary: formatDateInput(data?.anniversary ?? ''),
          profileImage: data?.profileImage ?? null,
        }));
      } catch {
        toast.error('Failed to load user');
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedCountry = COUNTRY_OPTIONS.find((country) => country.dialCode === form.countryDialCode) ?? COUNTRY_OPTIONS[0];

  const handleSave = async () => {
    const [firstName = '', ...lastParts] = form.name.trim().split(/\s+/);

    try {
      setSaving(true);
      await updateUserProfile({
        firstName,
        lastName: lastParts.join(' '),
        email: form.email,
        number: form.phone ? `${form.countryDialCode}${form.phone.replace(/\D/g, '')}` : '',
        birthDate: formatDateForApi(form.birthDate),
        anniversary: formatDateForApi(form.anniversary),
        profileImage: form.profileImage,
      });

      toast.success('Profile updated');
      router.back();
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 px-4 pt-4">
          <ProfileEditSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 0) + 42 }]}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/Profile'))}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#111111" />
          </Pressable>

          <Text style={styles.title}>
            Profile Details
          </Text>

          <View style={styles.formStack}>
            <View style={styles.field}>
              <FieldLabel>Name</FieldLabel>
              <View style={styles.compoundInput}>
                <Pressable onPress={() => setHonorificOpen(true)} style={[styles.prefixButton, styles.namePrefix]}>
                  <Text style={styles.prefixLabel}>{form.honorific}</Text>
                  <ChevronDown size={18} color="#667085" strokeWidth={2} />
                </Pressable>
                <Input
                  style={styles.compoundTextInput}
                  value={form.name}
                  placeholder="Enter your name"
                  placeholderTextColor="#98a2b3"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onChangeText={(text) => updateField('name', text)}
                />
              </View>
            </View>

            <View style={styles.field}>
              <FieldLabel>Email address</FieldLabel>
              <Input
                style={styles.textInput}
                value={form.email}
                placeholder="Enter your email"
                placeholderTextColor="#98a2b3"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                submitBehavior="submit"
                onChangeText={(text) => updateField('email', text)}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel>Phone number</FieldLabel>
              <View style={styles.compoundInput}>
                <Pressable onPress={() => setCountryOpen(true)} style={[styles.prefixButton, styles.countryPrefix]}>
                  {form.countryDialCode === '+91' ? (
                    <Image source={flag} style={styles.flag} resizeMode="cover" />
                  ) : (
                    <View style={styles.countryInitials}><Text style={styles.countryInitialsText}>{selectedCountry.name.slice(0, 2).toUpperCase()}</Text></View>
                  )}
                  <Text style={styles.prefixLabel}>{form.countryDialCode}</Text>
                  <ChevronDown size={16} color="#667085" strokeWidth={2} />
                </Pressable>
                <Input
                  style={styles.compoundTextInput}
                  value={form.phone}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onChangeText={(text) => updateField('phone', text)}
                />
              </View>
            </View>

            <View style={styles.field}>
              <FieldLabel>Date of birth</FieldLabel>
              <Input
                style={styles.textInput}
                value={form.birthDate}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#98a2b3"
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="next"
                submitBehavior="submit"
                onChangeText={(text) => updateField('birthDate', formatDateInput(text))}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel>Anniversary</FieldLabel>
              <Input
                style={styles.textInput}
                value={form.anniversary}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#98a2b3"
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="done"
                onChangeText={(text) => updateField('anniversary', formatDateInput(text))}
                onSubmitEditing={handleSave}
              />
            </View>
          </View>

          <View style={styles.saveWrap}>
            <Button
              disabled={saving}
              onPress={handleSave}
              style={styles.saveButton}
            >
              <Text className="text-sm font-extrabold text-white">
                {saving ? 'Saving...' : 'Done'}
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {honorificOpen && (
        <Modal transparent visible={honorificOpen} animationType="fade" onRequestClose={() => setHonorificOpen(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setHonorificOpen(false)}>
            <View style={styles.selectSheet}>
              <Text style={styles.selectTitle}>Select title</Text>
              {HONORIFICS.map((honorific) => (
                <Pressable key={honorific} style={styles.selectRow} onPress={() => { updateField('honorific', honorific); setHonorificOpen(false); }}>
                  <Text style={styles.selectLabel}>{honorific}</Text>
                  {form.honorific === honorific ? <Feather name="check" size={19} color="#ff5a2a" /> : null}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}

      {countryOpen && (
        <Modal transparent visible={countryOpen} animationType="fade" onRequestClose={() => setCountryOpen(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setCountryOpen(false)}>
            <View style={styles.selectSheet}>
              <Text style={styles.selectTitle}>Select country code</Text>
              {COUNTRY_OPTIONS.map((country) => (
                <Pressable key={country.dialCode} style={styles.selectRow} onPress={() => { updateField('countryDialCode', country.dialCode); setCountryOpen(false); }}>
                  <Text style={styles.selectLabel}>{country.name}</Text>
                  <Text style={styles.countryCode}>{country.dialCode}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 24 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -7 },
  title: { marginTop: 18, color: '#0b0b0b', fontSize: 23, lineHeight: 29, fontWeight: '800' },
  formStack: { marginTop: 29, gap: 19 },
  field: { gap: 8 },
  compoundInput: { height: 50, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#d0d7e2', borderRadius: 9, backgroundColor: '#ffffff' },
  prefixButton: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRightWidth: 1, borderRightColor: '#d0d7e2' },
  namePrefix: { width: 106 },
  countryPrefix: { width: 118 },
  flag: { width: 20, height: 14, borderRadius: 2 },
  countryInitials: { width: 20, height: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 2, backgroundColor: '#edf0f4' },
  countryInitialsText: { color: '#475467', fontSize: 8, lineHeight: 10, fontWeight: '800' },
  prefixLabel: { color: '#1f2937', fontSize: 16, lineHeight: 20, fontWeight: '500' },
  compoundTextInput: { flex: 1, height: 50, borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 14, color: '#1f2937', fontSize: 16, shadowOpacity: 0 },
  textInput: { height: 50, borderColor: '#d0d7e2', borderRadius: 9, paddingHorizontal: 14, color: '#1f2937', fontSize: 16, shadowOpacity: 0 },
  saveWrap: { marginTop: 42 },
  saveButton: { height: 50, width: '100%', borderRadius: 9, backgroundColor: '#ff6a2e' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 23, 42, 0.38)' },
  selectSheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30 },
  selectTitle: { color: '#111827', fontSize: 18, lineHeight: 23, fontWeight: '800', marginBottom: 8 },
  selectRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eef0f3' },
  selectLabel: { color: '#344054', fontSize: 16, lineHeight: 20, fontWeight: '600' },
  countryCode: { color: '#697386', fontSize: 16, lineHeight: 20, fontWeight: '600' },
});
