import React, { forwardRef, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BaseBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  backgroundStyle?: ViewStyle;
  scrollEnabled?: boolean;
  enableDynamicSizing?: boolean;
  onChange?: (index: number) => void;
}

const BaseBottomSheet = forwardRef<BottomSheet, BaseBottomSheetProps>(
  (
    {
      children,
      snapPoints,
      backgroundStyle,
      scrollEnabled = true,
      enableDynamicSizing = false,
      onChange,
    },
    ref
  ) => {
    const insets = useSafeAreaInsets();

    const defaultSnapPoints = useMemo(
      () => snapPoints || ['60%', '90%'],
      [snapPoints]
    );

    return scrollEnabled ? (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={defaultSnapPoints}
        onChange={onChange}
        enablePanDownToClose
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableDynamicSizing={enableDynamicSizing}
        bottomInset={insets.bottom} // ✅ FIXED
        handleIndicatorStyle={{ backgroundColor: '#ccc', width: 40 }}
        backgroundStyle={[
          {
            borderRadius: 20,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 20,
          },
          backgroundStyle,
        ]}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    ) : (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={defaultSnapPoints}
        onChange={onChange}
        enablePanDownToClose
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableDynamicSizing={enableDynamicSizing}
        bottomInset={insets.bottom}
        handleIndicatorStyle={{ backgroundColor: '#ccc', width: 40 }}
        backgroundStyle={[
          {
            borderRadius: 20,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 20,
          },
          backgroundStyle,
        ]}
      >
        {children}
      </BottomSheet>
    );
  }
);

export default BaseBottomSheet;