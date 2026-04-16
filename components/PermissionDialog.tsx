import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { AppButton } from './common/AppButton';

type Props = {
  visible: boolean;
  title: string;
  description: string;
  isGranted: boolean;
  onAllow: () => void;
  onClose: () => void;
};

export function PermissionDialog({
  visible,
  title,
  description,
  isGranted,
  onAllow,
  onClose,
}: Props) {
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">

        <DialogHeader>
          <DialogTitle>
            <Text className="text-lg font-semibold">{title}</Text>
          </DialogTitle>
        </DialogHeader>

        <View className="gap-3 py-2">

          <Text className="text-sm text-gray-600">
            {description}
          </Text>

          <View className="flex-row items-center gap-2">
            <Text className="font-medium">Status:</Text>
            <Text className={isGranted ? 'text-green-600' : 'text-red-500'}>
              {isGranted ? 'Allowed' : 'Not Allowed'}
            </Text>
          </View>

        </View>

        <DialogFooter>

          <DialogClose asChild>
            <AppButton variant="outline">
              <Text>Cancel</Text>
            </AppButton>
          </DialogClose>

          {!isGranted && (
            <AppButton onPress={onAllow}>
              <Text>Allow</Text>
            </AppButton>
          )}

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}