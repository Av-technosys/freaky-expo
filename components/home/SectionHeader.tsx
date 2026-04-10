import { View } from 'react-native';

type SectionHeaderProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerClassName?: string;
};

export default function SectionHeader({
  left,
  right,
  containerClassName = '',
}: SectionHeaderProps) {
  return (
    <View
      className={`flex-row items-center justify-between w-full px-4 mb-2 ${containerClassName}`}
    >
      {/* LEFT */}
      <View className="flex-1">{left}</View>

      {/* RIGHT */}
      <View className="ml-2">{right}</View>
    </View>
  );
}