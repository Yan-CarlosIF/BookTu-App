import { InventoryActionSheet } from "@components/InventoryActionSheet";
import { useNavigation } from "@react-navigation/native";
import { storageRemoveInventoryHistory } from "@storage/StorageInventoryHistory";
import { useDeleteInventory } from "@useCases/Inventory/useDeleteInventory";
import {
  Building2,
  CircleAlert,
  CircleCheck,
  MapPin,
  Package,
  Tag,
  Trash,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Inventory } from "../shared/types/inventory";

const END_POSITION = 120;
const SCREEN_WIDTH = Dimensions.get("window").width;

type InventoryCardProps = {
  inventory: Inventory;
};

export function InventoryCard({ inventory }: InventoryCardProps) {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const { mutateAsync: deleteInventoryFn } = useDeleteInventory();

  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleCloseActionSheet = () => setShowActionSheet(false);

  const position = useSharedValue(0); // swipe
  const scale = useSharedValue(1); // quicada do toque/long press

  // Long press gesture para manter o card menor
  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      "worklet";
      scale.value = withTiming(0.95, { duration: 100 });
      runOnJS(setShowActionSheet)(true);
    })
    .onEnd(() => {
      "worklet";
      scale.value = withTiming(1, { duration: 100 });
    });

  // Tap gesture para toque
  const tapGesture = Gesture.Tap().onStart(() => {
    "worklet";
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
  });

  // Swipe gesture
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

  // Estilo animado do card (translateX + scale)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }, { scale: scale.value }],
  }));

  // Barra vermelha de fundo
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: -position.value / END_POSITION,
  }));

  // Função de deletar com animação
  const handleDelete = () => {
    Alert.alert(
      "Deletar inventário",
      `Deseja deletar o inventário ${inventory.identifier}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            await deleteInventoryFn(inventory.id);
            await storageRemoveInventoryHistory(inventory.id);
            position.value = withTiming(SCREEN_WIDTH, {
              duration: 400,
              easing: Easing.out(Easing.exp),
            });
          },
        },
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unprocessed":
        return "bg-amber-100 border-amber-300";
      case "processed":
        return "bg-teal-100 border-teal-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "unprocessed":
        return "Pendente";
      case "processed":
        return "Processado";
      default:
        return status;
    }
  };

  return (
    <View className="relative">
      {/* Barra vermelha */}
      <Animated.View
        className="absolute bottom-0 right-0 top-0 mb-6 w-[160px] items-end justify-center rounded-r-2xl bg-red-500"
        style={backgroundStyle}
      >
        <TouchableOpacity onPress={handleDelete} className="mr-12">
          <Trash color="white" size={28} />
        </TouchableOpacity>
      </Animated.View>

      {/* Card com gestures */}
      <GestureDetector
        gesture={Gesture.Simultaneous(panGesture, longPressGesture, tapGesture)}
      >
        <Animated.View style={[animatedStyle, { borderRadius: 16 }]}>
          <Pressable
            onPress={() =>
              navigate("inventoryDetails", { inventory, isOffline: false })
            }
            collapsable={false}
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
                    {inventory.identifier}
                  </Text>
                </HStack>
              </View>

              <HStack
                className={`items-center gap-1 rounded-full border px-4 py-1 ${getStatusColor(
                  inventory.status,
                )}`}
              >
                <Icon
                  className={
                    inventory.status === "processed"
                      ? "text-teal-700"
                      : "text-amber-600"
                  }
                  as={
                    inventory.status === "unprocessed"
                      ? CircleAlert
                      : CircleCheck
                  }
                  size={12}
                />
                <Text
                  className={`text-xs font-medium ${
                    inventory.status === "processed"
                      ? "text-teal-700"
                      : "text-amber-600"
                  }`}
                >
                  {getStatusText(inventory.status)}
                </Text>
              </HStack>
            </View>

            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-800">
                Quantidade Total:
              </Text>
              <Text className="text-lg text-gray-800">
                <Text className="text-xl font-bold text-teal-600">
                  {inventory.total_quantity}
                </Text>{" "}
                Produtos
              </Text>
            </View>

            <VStack className="gap-1 border-t border-gray-500 pt-3">
              <HStack className="items-center gap-2">
                <Building2 size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-semibold text-gray-800">
                  {inventory.establishment.name}
                </Text>
              </HStack>

              <HStack className="items-center gap-2">
                <MapPin size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-medium text-gray-800">
                  {inventory.establishment.city},{" "}
                  {inventory.establishment.state}
                </Text>
              </HStack>

              <HStack className="items-center gap-2">
                <Tag size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-medium text-gray-800">
                  CNPJ: {inventory.establishment.cnpj}
                </Text>
              </HStack>
            </VStack>
          </Pressable>
        </Animated.View>
      </GestureDetector>
      {inventory.status === "unprocessed" && (
        <InventoryActionSheet
          inventory={inventory}
          isOpen={showActionSheet}
          onClose={handleCloseActionSheet}
        />
      )}
    </View>
  );
}
