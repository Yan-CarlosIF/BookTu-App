import { HStack } from "@/components/ui/hstack";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const { goBack } = useNavigation<AppNavigatorRoutesProps>();

  return (
    <HStack className="items-center justify-between px-6 bg-teal-700 h-[68px] w-full">
      <Pressable onPress={goBack}>
        <ChevronLeft color="white" size={32} />
      </Pressable>
      <Text className="text-white text-2xl font-poppins-bold">{title}</Text>
      <View className="w-8" />
    </HStack>
  );
}
