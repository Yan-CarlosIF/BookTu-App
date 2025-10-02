import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, CloudOff } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { useNetInfo } from "../hooks/useNetInfo";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";

type HeaderProps = {
  title: string;
  onPress?: () => void;
};

export function Header({ title, onPress }: HeaderProps) {
  const { isConnected } = useNetInfo();
  const { goBack } = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack className="rounded-b-3xl bg-[#2BADA1] px-4 pb-6 pt-8">
      <HStack className="flex-row items-center justify-between">
        <Pressable onPress={onPress ? onPress : goBack} className="p-2">
          <ChevronLeft color="white" size={28} />
        </Pressable>
        <Text className="font-poppins-bold text-xl text-white">{title}</Text>
        <View className="w-10">
          {!isConnected && (
            <Icon as={CloudOff} size={20} className="text-red-500" />
          )}
        </View>
      </HStack>
    </VStack>
  );
}
