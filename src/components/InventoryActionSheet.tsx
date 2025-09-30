import { useNavigation } from "@react-navigation/native";
import { useProcessInventory } from "@useCases/Inventory/useProcessInventory";
import { Box, PenLine } from "lucide-react-native";
import { Text, View } from "react-native";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Inventory } from "../shared/types/inventory";
import { storageUpdateInventoryHistory } from "../storage/StorageInventoryHistory";

type InventoryActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory;
};

export function InventoryActionSheet({
  isOpen,
  onClose,
  inventory,
}: InventoryActionSheetProps) {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { mutateAsync: processInventory, isPending: isProcessing } =
    useProcessInventory();

  async function handleProcessInventory() {
    await processInventory(inventory.id);
    await storageUpdateInventoryHistory(inventory);
    onClose();
  }

  function handleNavigateToEditInventory() {
    navigate("inventoryActions", { inventory, inventoryId: inventory.id });
    onClose();
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Text className="mt-4 font-poppins-bold text-lg">
          Oque deseja fazer?
        </Text>
        <Text className="mt-2 text-gray-600">ID: {inventory.identifier}</Text>
        <ActionsheetItem
          isDisabled={isProcessing}
          className="mt-6 h-24 rounded-md border border-teal-300 bg-teal-300/15 data-[active=true]:bg-teal-300/50"
          onPress={handleProcessInventory}
        >
          <HStack className="gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-md bg-teal-400/50">
              <Icon size={24} as={Box} className="text-teal-700" />
            </View>
            {isProcessing ? (
              <Spinner size="large" />
            ) : (
              <VStack>
                <ActionsheetItemText className="font-poppins-semibold text-xl text-gray-800">
                  Processar Inventário
                </ActionsheetItemText>
                <ActionsheetItemText className="text-sm text-gray-800">
                  Transformar o estoque do estabelecimento
                </ActionsheetItemText>
              </VStack>
            )}
          </HStack>
        </ActionsheetItem>
        <ActionsheetItem
          isDisabled={isProcessing}
          className="mt-6 h-24 rounded-md border border-yellow-300 bg-yellow-50 data-[active=true]:bg-yellow-300/50"
          onPress={handleNavigateToEditInventory}
        >
          <HStack className="gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-md bg-yellow-400/50">
              <Icon size={24} as={PenLine} className="text-yellow-700" />
            </View>
            <VStack>
              <ActionsheetItemText className="font-poppins-semibold text-xl text-gray-800">
                Editar Inventário
              </ActionsheetItemText>
              <ActionsheetItemText className="text-sm text-gray-800">
                Editar dados do inventário
              </ActionsheetItemText>
            </VStack>
          </HStack>
        </ActionsheetItem>
        <ActionsheetItem
          isDisabled={isProcessing}
          className="mt-6 justify-center rounded-md bg-gray-300"
          onPress={onClose}
        >
          <ActionsheetItemText className="text-base">
            Cancelar
          </ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
}
