import { Text, View } from "react-native";

import { Spinner } from "@/components/ui/spinner";

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-poppins-bold text-6xl">BookTu</Text>
      <Spinner className="mt-14" />
    </View>
  );
}
