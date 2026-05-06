import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// UI Components
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteAddressModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="mx-4 rounded-2xl">
        <DialogHeader>
          <View className="items-center py-4">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100">
              <Feather name="trash-2" size={32} color="#EF4444" />
            </View>
            <DialogTitle className="text-xl font-bold text-gray-900">Delete Address</DialogTitle>
            <DialogDescription className="mt-2 text-center text-gray-600">
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </View>
        </DialogHeader>

        <DialogFooter className="px-6 pb-6">
          <View className="flex-row gap-3">
            <DialogClose asChild>
              <View className="flex-1">
                <Button
                  variant="outline"
                  onPress={onClose}
                  className="h-12 w-full rounded-xl border-gray-200 bg-white">
                  <Text className="font-semibold text-gray-700">Cancel</Text>
                </Button>
              </View>
            </DialogClose>
            
            <View className="flex-1">
              <Button
                variant="destructive"
                className="h-12 w-full overflow-hidden rounded-xl p-0"
                onPress={onConfirm}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 12,
                  }}>
                  <Text className="font-semibold text-white">Delete</Text>
                </LinearGradient>
              </Button>
            </View>
          </View>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
