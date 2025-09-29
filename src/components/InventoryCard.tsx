import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import {
  Package,
  MapPin,
  Building2,
  Tag,
  Trash,
  CircleAlert,
  CircleCheck,
} from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Inventory } from "../shared/types/inventory";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useDeleteInventory } from "@useCases/Inventory/useDeleteInventory";
import { useState } from "react";

import { runOnJS } from "react-native-worklets";
import { InventoryActionSheet } from "./InventoryActionSheet";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Icon } from "@/components/ui/icon";

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
            position.value = withTiming(SCREEN_WIDTH, {
              duration: 400,
              easing: Easing.out(Easing.exp),
            });
          },
        },
      ]
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
        className="absolute right-0 top-0 bottom-0 mb-6 w-[160px] bg-red-500 items-end justify-center rounded-r-2xl"
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
            onPress={() => navigate("inventoryDetails", { inventory })}
            collapsable={false}
            className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-500"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <HStack className="gap-2 items-center">
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
                className={`px-4 py-1 gap-1 items-center rounded-full border ${getStatusColor(
                  inventory.status
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
                <Text className="text-teal-600 text-xl font-bold">
                  {inventory.total_quantity}
                </Text>{" "}
                Produtos
              </Text>
            </View>

            <VStack className="border-t gap-1 border-gray-500 pt-3">
              <HStack className="gap-2 items-center">
                <Building2 size={16} color="#0d9488" className="mr-2" />
                <Text className="font-semibold text-sm text-gray-800">
                  {inventory.establishment.name}
                </Text>
              </HStack>

              <HStack className="gap-2 items-center">
                <MapPin size={16} color="#0d9488" className="mr-2" />
                <Text className="text-sm font-medium text-gray-800">
                  {inventory.establishment.city},{" "}
                  {inventory.establishment.state}
                </Text>
              </HStack>

              <HStack className="gap-2 items-center">
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
