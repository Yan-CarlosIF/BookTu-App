import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Box, PenLine } from "lucide-react-native";
import { Text, View } from "react-native";
import { Inventory } from "../shared/types/inventory";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { useProcessInventory } from "../useCases/Inventory/useProcessInventory";
import { Spinner } from "@/components/ui/spinner";

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
        <Text className="mt-4 text-lg font-poppins-bold">
          Oque deseja fazer?
        </Text>
        <Text className="mt-2 text-gray-600">ID: {inventory.identifier}</Text>
        <ActionsheetItem
          isDisabled={isProcessing}
          className="bg-teal-300/15 mt-6 border border-teal-300 rounded-md h-24 data-[active=true]:bg-teal-300/50"
          onPress={handleProcessInventory}
        >
          <HStack className="gap-4">
            <View className="items-center h-12 w-12 rounded-md justify-center bg-teal-400/50">
              <Icon size={24} as={Box} className="text-teal-700" />
            </View>
            {isProcessing ? (
              <Spinner size="large" />
            ) : (
              <VStack>
                <ActionsheetItemText className="text-xl font-poppins-semibold text-gray-800">
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
          className="bg-yellow-50 mt-6 border border-yellow-300 rounded-md h-24 data-[active=true]:bg-yellow-300/50"
          onPress={handleNavigateToEditInventory}
        >
          <HStack className="gap-4">
            <View className="items-center h-12 w-12 rounded-md justify-center bg-yellow-400/50">
              <Icon size={24} as={PenLine} className="text-yellow-700" />
            </View>
            <VStack>
              <ActionsheetItemText className="text-xl font-poppins-semibold text-gray-800">
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
          className="mt-6 bg-gray-300 rounded-md justify-center"
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
