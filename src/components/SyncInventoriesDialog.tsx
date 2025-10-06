import { useNavigation } from "@react-navigation/native";
import {
  AlertTriangle,
  CheckCircle,
  CircleQuestionMark,
} from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { useNetInfo } from "../hooks/useNetInfo";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { SyncInventoryError } from "../screens/Home";
import {
  storageGetOfflineInventories,
  storageRemoveOfflineInventory,
  storageUpdateOfflineInventory,
} from "../storage/StorageOfflineInventories";
import { useSyncOfflineInventories } from "../useCases/Inventory/useSyncOfflineInventories";

type SyncInventoriesDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SyncInventoriesDialog({
  isOpen,
  setIsOpen,
}: SyncInventoriesDialogProps) {
  const { isConnected } = useNetInfo();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    mutateAsync: syncInventories,
    isError,
    isSuccess,
  } = useSyncOfflineInventories();

  const [syncErrors, setSyncErrors] = useState<SyncInventoryError[]>([]);

  async function handleSyncOfflineInventories() {
    const inventories = await storageGetOfflineInventories();

    const inventoriesWithoutErrors = inventories.filter(
      (inventory) => inventory.errors.length === 0,
    );

    if (!inventoriesWithoutErrors.length || !isConnected) {
      setIsOpen(false);
      return;
    }

    setIsSyncing(true);

    try {
      const results = await Promise.allSettled(
        inventoriesWithoutErrors.map(
          async ({ establishment_id, total_quantity, books, temporary_id }) => {
            const result = await syncInventories({
              establishment_id,
              total_quantity,
              inventoryBooks: books.map(({ book_id, quantity }) => ({
                book_id,
                quantity,
              })),
            });

            return {
              result,
              temporary_id,
              inventory: { establishment_id, total_quantity, books },
            };
          },
        ),
      );

      const newErrors: SyncInventoryError[] = [];

      for (const res of results) {
        if (res.status === "fulfilled") {
          const { result, temporary_id, inventory } = res.value;

          if (result.wasCreated) {
            await storageRemoveOfflineInventory(temporary_id);
          } else {
            newErrors.push({ ...result, inventoryId: temporary_id });
            await storageUpdateOfflineInventory(
              { ...inventory, errors: result.errors },
              temporary_id,
            );
          }
        } else {
          console.error(res.reason);
        }
      }

      if (newErrors.length) setSyncErrors(newErrors);
    } finally {
      setIsSyncing(false);
    }
  }

  const handleCloseDialog = () => setIsOpen(false);

  function handleNavigateToInventories() {
    handleCloseDialog();
    navigate("inventories");
  }

  const hasErrors = syncErrors.length > 0;

  function getHeaderTitle() {
    if (isSyncing) return "Sincronizando inventários...";
    if (hasErrors || isError)
      return "Alguns inventários não foram sincronizados";
    if (isSuccess) return "Inventários sincronizados com sucesso!";

    return "Sincronizar inventários";
  }

  function getHeaderColor() {
    if (isSyncing) return "text-teal-700";
    if (hasErrors || isError) return "text-red-600";
    if (isSuccess) return "text-emerald-600";
    return "text-gray-800";
  }

  function renderIcon() {
    if (isSyncing) return <Spinner size={56} />;
    if (hasErrors || isError)
      return (
        <Icon
          as={AlertTriangle}
          size={64}
          color="#ef4444"
          className="mx-auto"
        />
      );
    if (isSuccess)
      return (
        <Icon as={CheckCircle} color="#10b981" size={64} className="mx-auto" />
      );

    return (
      <Icon
        as={CircleQuestionMark}
        color="#0d9488"
        size={64}
        className="mx-auto"
      />
    );
  }

  return (
    <AlertDialog isOpen={isOpen} size="lg">
      <AlertDialogBackdrop />
      <AlertDialogContent className="rounded-2xl bg-white p-6">
        <AlertDialogHeader className="mb-4">
          <Text
            className={`text-center text-xl font-semibold ${getHeaderColor()}`}
          >
            {getHeaderTitle()}
          </Text>
        </AlertDialogHeader>

        <AlertDialogBody>
          {renderIcon()}

          {isSyncing ? (
            <Text className="mt-4 text-center text-gray-600">
              Aguarde enquanto os inventários são sincronizados...
            </Text>
          ) : isSuccess ? (
            <Text className="mt-4 text-center text-gray-600">
              Todos os inventários foram sincronizados corretamente
            </Text>
          ) : (
            <Text className="text-md mt-4 text-center text-gray-600">
              Você possui inventários offline que podem ser sincronizados com o
              servidor, deseja sincroniza-los?
            </Text>
          )}

          {!isSyncing && hasErrors && (
            <View className="mt-6 max-h-72">
              <Text className="mb-2 text-center text-base font-medium text-gray-800">
                Detalhes dos erros:
              </Text>

              <FlatList
                data={syncErrors}
                keyExtractor={({ inventoryId }) => inventoryId}
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <VStack className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <Text className="font-semibold text-red-600">
                      Inventário {item.inventoryId}
                    </Text>
                    <Text className="mt-1 text-sm text-red-500">
                      {item.message}
                    </Text>

                    {item.errors && item.errors.length > 0 && (
                      <FlatList
                        data={item.errors}
                        keyExtractor={({ id }) => id}
                        nestedScrollEnabled
                        renderItem={({ item: { id, type } }) => (
                          <Text className="ml-2 mt-1 text-sm text-gray-700">
                            • Erro no{" "}
                            {type === "book" ? "livro" : "estabelecimento"} de
                            ID: {id}
                          </Text>
                        )}
                      />
                    )}
                  </VStack>
                )}
              />
            </View>
          )}

          {isError && (
            <Text className="mt-4 text-center text-gray-600">
              Ocorreu um erro ao sincronizar os inventários
            </Text>
          )}
        </AlertDialogBody>
        <AlertDialogFooter className="mt-6">
          <HStack className="w-full justify-end gap-3">
            {!isSyncing && (hasErrors || isSuccess) ? (
              <>
                <Button
                  onPress={handleCloseDialog}
                  variant="outline"
                  className="border-teal-600 data-[active=true]:border-teal-500"
                >
                  <ButtonText className="text-teal-700 data-[active=true]:text-teal-500">
                    Fechar
                  </ButtonText>
                </Button>

                <Button
                  onPress={handleNavigateToInventories}
                  className="bg-teal-600 data-[active=true]:bg-teal-500"
                >
                  <ButtonText>
                    {hasErrors ? "Corrigir erros" : "Ver inventários"}
                  </ButtonText>
                </Button>
              </>
            ) : (
              !isSyncing && (
                <>
                  <Button
                    onPress={handleCloseDialog}
                    variant="outline"
                    className="border-teal-600 data-[active=true]:border-teal-500"
                  >
                    <ButtonText className="text-teal-700 data-[active=true]:text-teal-500">
                      Não
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={handleSyncOfflineInventories}
                    className="bg-teal-600 data-[active=true]:bg-teal-500"
                  >
                    <ButtonText>Sincronizar</ButtonText>
                  </Button>
                </>
              )
            )}
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
