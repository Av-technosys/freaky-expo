import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type CardProps = React.ComponentProps<typeof View>;

function Card({ className, ...props }: CardProps) {
  return <View className={cn('rounded-lg border border-border bg-card', className)} {...props} />;
}

function CardContent({ className, ...props }: CardProps) {
  return <View className={cn('p-4', className)} {...props} />;
}

function CardHeader({ className, ...props }: CardProps) {
  return <View className={cn('flex-col gap-1.5 p-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-lg font-semibold text-foreground', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
