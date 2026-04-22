
import { View, Keyboard, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Screen({
  children,
  scroll = false,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {scroll ? (
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 10,
            paddingBottom: 40, 
          }}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 50 : 100} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>{children}</View>
        </KeyboardAwareScrollView>
      ) : (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 10 }}>{children}</View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
