import { Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone } from 'lucide-react-native';

import { Text } from '@/components/ui/text';

const HELP_AGENT = require('@/assets/images/needhelp.png');

export function NeedHelpBanner() {
  return (
    <LinearGradient colors={['#ff6548', '#ffbd72', '#ffe486']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
      <View style={styles.copy}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.body}>Our support team is{'\n'}here for you.</Text>
        <Pressable accessibilityRole="button" style={styles.contactButton}>
          <Phone size={15} color="#ff674d" strokeWidth={2} />
          <Text style={styles.contactLabel}>Contact Us</Text>
        </Pressable>
      </View>
      <Image source={HELP_AGENT} resizeMode="contain" style={styles.agent} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: { height: 180, flexDirection: 'row', marginTop: 31, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  copy: { width: 208, paddingLeft: 24, paddingTop: 30 },
  title: { color: '#ffffff', fontSize: 20, lineHeight: 25, fontWeight: '800' },
  body: { color: '#fff7f3', fontSize: 15, lineHeight: 20, fontWeight: '500', marginTop: 8 },
  contactButton: { width: 129, height: 37, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 17, borderRadius: 7, backgroundColor: '#ffffff' },
  contactLabel: { color: '#ff674d', fontSize: 14, lineHeight: 18, fontWeight: '800' },
  agent: { position: 'absolute', right: -65, bottom: -1, width: 250, height: 167 },
});
