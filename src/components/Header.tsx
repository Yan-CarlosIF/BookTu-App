import { HStack } from "@/components/ui/hstack";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "react-native";

export function Header() {
  return (
    <HStack className="items-center  bg-teal-700 h-[68px] w-full">
      <ChevronLeft color="white" />
      <Text className="text-white">Chama</Text>
    </HStack>
  );
}
