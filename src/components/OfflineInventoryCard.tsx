import { useNavigation } from "@react-navigation/native";
import {
  Building2,
  CircleAlert,
  CloudOff,
  MapPin,
  Package,
  Tag,
  Trash,
} from "lucide-react-native";
import {
  Alert,
  Dimensions,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { OfflineInventory } from "../shared/types/offlineInventory";

const END_POSITION = 120;
const SCREEN_WIDTH = Dimensions.get("window").width;

type OfflineInventoryCardProps = {
  onDelete: (offlineInventoryId: string) => Promise<void>;
  offlineInventory: OfflineInventory;
};

export function OfflineInventoryCard({
  onDelete,
  offlineInventory,
}: OfflineInventoryCardProps) {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const position = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleNavigate = () => {
    navigate("inventoryActions", { offlineInventory });
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      "worklet";
      scale.value = withTiming(0.95, { duration: 100 });
      runOnJS(handleNavigate)();
    })
    .onEnd(() => {
      "worklet";
      scale.value = withTiming(1, { duration: 100 });
    });

  const tapGesture = Gesture.Tap().onStart(() => {
    "worklet";
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
  });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      const newX = e.translationX;
      position.value = Math.min(0, Math.max(newX, -END_POSITION));
    })
    .onEnd(() => {
      position.value =
        position.value < -END_POSITION / 2
          ? withTiming(-END_POSITION, { duration: 250 })
          : withTiming(0, { duration: 250 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }, { scale: scale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: -position.value / END_POSITION,
  }));

  const handleDelete = () => {
    Alert.alert(
      "Deletar inventário",
      `Deseja deletar o inventário ${offlineInventory.temporary_id}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            await onDelete(offlineInventory.temporary_id);
            position.value = withTiming(SCREEN_WIDTH, {
              duration: 400,
              easing: Easing.out(Easing.exp),
            });
          },
        },
      ],
    );
  };

  return (
    <View className="relative">
      <Animated.View
        className="absolute bottom-0 right-0 top-0 mb-6 w-[160px] items-end justify-center rounded-r-2xl bg-red-500"
        style={backgroundStyle}
      >
        <TouchableOpacity onPress={handleDelete} className="mr-12">
          <Trash color="white" size={28} />
        </TouchableOpacity>
      </Animated.View>

      <GestureDetector
        gesture={Gesture.Simultaneous(panGesture, longPressGesture, tapGesture)}
      >
        <Animated.View style={[animatedStyle, { borderRadius: 16 }]}>
          <Pressable
            // onPress={() => navigate("inventoryDetails", { inventory })}
            className="mb-6 rounded-xl border border-gray-500 bg-white p-4 shadow-md"
          >
            <View className="mb-3 flex-row items-start justify-between">
              <View className="flex-1">
                <HStack className="items-center gap-2">
                  <Package size={18} color="#2BADA1" className="mr-2" />
                  <Text
                    className="text-2xl font-bold text-gray-800"
                    numberOfLines={1}
                  >
                    {offlineInventory.temporary_id}
                  </Text>
                </HStack>
              </View>

              <HStack className="items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-4 py-1">
                <Icon className="text-amber-600" as={CircleAlert} size={12} />
                <Text className="text-xs font-medium text-amber-600">
                  Pendente
                </Text>
              </HStack>
            </View>

            <HStack className="mb-3 justify-between">
              <VStack>
                <Text className="text-sm font-medium text-gray-800">
                  Quantidade Total:
                </Text>
                <Text className="text-lg text-gray-800">
                  <Text className="text-xl font-bold text-teal-600">
                    {offlineInventory.total_quantity}
                  </Text>{" "}
                  Produtos
                </Text>
              </VStack>
              <Icon as={CloudOff} size={20} className="text-teal-600" />
            </HStack>

            <VStack className="gap-1 border-t border-gray-500 pt-3">
              <HStack className="items-center gap-2">
                <Building2 size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-semibold text-gray-800">
                  {offlineInventory.establishment.name}
                </Text>
              </HStack>

              <HStack className="items-center gap-2">
                <MapPin size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-medium text-gray-800">
                  {offlineInventory?.establishment?.city},{" "}
                  {offlineInventory.establishment.state}
                </Text>
              </HStack>

              <HStack className="items-center gap-2">
                <Tag size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-medium text-gray-800">
                  CNPJ: {offlineInventory.establishment.cnpj}
                </Text>
              </HStack>
            </VStack>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
