import { Spinner } from "@/components/ui/spinner";
import { Text, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-poppins-bold text-6xl">BookTu</Text>
      <Spinner className="mt-14" />
    </View>
  );
}
