import { HStack } from "@/components/ui/hstack";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { VStack } from "@/components/ui/vstack";

type HeaderProps = {
  title: string;
  onPress?: () => void;
};

export function Header({ title, onPress }: HeaderProps) {
  const { goBack } = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack className="bg-[#2BADA1] pt-8 pb-6 px-4 rounded-b-3xl">
      <HStack className="flex-row items-center justify-between">
        <Pressable onPress={onPress ? onPress : goBack} className="p-2">
          <ChevronLeft color="white" size={28} />
        </Pressable>
        <Text className="text-white text-xl font-poppins-bold">{title}</Text>
        <View className="w-10" />
      </HStack>
    </VStack>
  );
}
