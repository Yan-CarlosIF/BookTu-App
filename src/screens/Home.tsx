import { Button } from "@components/Button";
import { HistoryCard } from "@components/HistoryCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Book as BookIcon,
  Box,
  ClipboardList,
  LogOut,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { SyncInventoriesDialog } from "../components/SyncInventoriesDialog";
import { useAuth } from "../hooks/useAuth";
import { useNetInfo } from "../hooks/useNetInfo";
import { api } from "../lib/api";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Book } from "../shared/types/book";
import { Establishment } from "../shared/types/establishment";
import { Inventory } from "../shared/types/inventory";
import {
  storageGetRefetchTimestamp,
  storageSetBooks,
  storageSetEstablishments,
  storageSetRefetchTimestamp,
} from "../storage/StorageBooksAndEstablishments";
import {
  InventoryHistory,
  storageGetInventoryHistory,
} from "../storage/StorageInventoryHistory";
import {
  storageGetOfflineInventories,
  storageRemoveOfflineInventory,
  storageUpdateOfflineInventories,
} from "../storage/StorageOfflineInventories";
import {
  SyncInventoryResponse,
  useSyncOfflineInventories,
} from "../useCases/Inventory/useSyncOfflineInventories";

export type SyncInventoryError = SyncInventoryResponse & {
  inventoryId: string;
};

export function Home() {
  const { isConnected } = useNetInfo();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const prevIsConnected = useRef<boolean | null>(null);

  const [isSyncInventoriesDialogOpen, setIsSyncInventoriesDialogOpen] =
    useState(false);
  const {
    mutateAsync: syncInventories,
    isPending,
    isError,
  } = useSyncOfflineInventories();
  const [errors, setErrors] = useState<SyncInventoryError[]>([]);

  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistory[]>(
    [],
  );

  const handleSyncOfflineInventories = useCallback(async () => {
    const inventories = await storageGetOfflineInventories();

    const inventoriesWithoutErrors = inventories.filter(
      (inventory) => inventory.errors.length === 0,
    );

    if (inventoriesWithoutErrors.length === 0) return;

    if (!isConnected) {
      setIsSyncInventoriesDialogOpen(false);
      return;
    }

    setIsSyncInventoriesDialogOpen(true);

    try {
      await Promise.all(
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

            if (result.wasCreated) {
              await storageRemoveOfflineInventory(temporary_id);
            } else {
              setErrors((prev) => [
                ...prev,
                { ...result, inventoryId: temporary_id },
              ]);

              await storageUpdateOfflineInventories(
                {
                  establishment_id,
                  total_quantity,
                  books,
                  errors: result.errors,
                },
                temporary_id,
              );
            }
          },
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }, [isConnected, syncInventories, setErrors]);

  async function saveStorageData() {
    try {
      const refetchInterval = await storageGetRefetchTimestamp();

      if (Date.now() > refetchInterval) {
        console.log("⏳ Refetching data...");

        const { data: booksData } = await api.get<Book[]>("/books/all");
        const { data: establishmentsData } = await api.get<Establishment[]>(
          "/establishments/all",
        );

        await storageSetBooks(booksData);
        await storageSetEstablishments(establishmentsData);

        const dateOneHourLater = Date.now() + 1000 * 60 * 60;
        await storageSetRefetchTimestamp(dateOneHourLater);

        console.log("✅ Dados salvos com sucesso");
      } else {
        console.log("✅ Usando cache, ainda não passou 1h");
      }
    } catch (error) {
      console.log(
        "⚠️ Falha ao buscar novos dados, mantendo cache existente:",
        error,
      );
    }
  }

  const getInventoryHistory = useCallback(async () => {
    const data = await storageGetInventoryHistory();
    setInventoryHistory(data);
  }, []);

  function handleNavigateToInventory(inventory: Inventory) {
    navigate("inventoryDetails", { inventory: inventory, isOffline: false });
  }

  function handleCloseSyncInventoriesDialog() {
    setIsSyncInventoriesDialogOpen(false);
  }

  const { signOut } = useAuth();

  async function handleSignOut() {
    if (!isConnected) {
      Alert.alert(
        "Tem certeza que deseja sair?",
        "Você não está conectado com a internet, sua sessão será perdida",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Sair",
            onPress: async () => {
              await signOut();
            },
            style: "destructive",
          },
        ],
      );
    } else {
      await signOut();
    }
  }

  useFocusEffect(
    useCallback(() => {
      getInventoryHistory();
    }, [getInventoryHistory]),
  );

  useEffect(() => {
    saveStorageData();
  }, []);

  useEffect(() => {
    let isFirstRun = true; // primeira montagem

    if (isFirstRun) {
      handleSyncOfflineInventories();
      isFirstRun = false;
    } else if (prevIsConnected.current === false && isConnected === true) {
      // internet voltou
      handleSyncOfflineInventories();
    }

    prevIsConnected.current = isConnected;
  }, [isConnected, handleSyncOfflineInventories]);

  return (
    <VStack className="flex-1 bg-white">
      <HStack className="h-[68px] w-full items-center justify-between rounded-b-xl bg-[#2BADA1] px-8">
        <Text className="font-poppins-bold text-2xl text-white">BookTu</Text>
        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
          <Icon as={LogOut} className="text-red-500" size={28} />
        </TouchableOpacity>
      </HStack>
      <VStack className="px-6">
        <HStack className="mt-16 gap-4">
          <Button
            onPress={() => navigate("books")}
            className="flex h-[100px] w-[110px] flex-col items-center justify-center rounded-2xl bg-[#2BADA1] data-[active=true]:bg-teal-600"
          >
            <BookIcon color="white" size={24} />
            <Text className="mt-3 font-poppins text-sm text-white">Livros</Text>
          </Button>
          <Button
            onPress={() => navigate("inventories")}
            className="flex h-[100px] w-[110px] flex-col items-center justify-center rounded-2xl bg-[#2BADA1] data-[active=true]:bg-teal-600"
          >
            <ClipboardList color="white" size={24} />
            <Text className="mt-3 font-poppins text-sm text-white">
              Inventários
            </Text>
          </Button>
          <Button
            onPress={() => navigate("stock")}
            className="flex h-[100px] w-[110px] flex-col items-center justify-center rounded-2xl bg-[#2BADA1] data-[active=true]:bg-teal-600"
          >
            <Box color="white" size={24} />
            <Text className="mt-3 font-poppins text-sm text-white">
              Estoque
            </Text>
          </Button>
        </HStack>
        <Text className="mt-14 font-poppins-semibold text-xl">
          Inventários Recentes
        </Text>

        <FlatList
          className="mt-8"
          data={inventoryHistory}
          keyExtractor={({ id }) => id}
          renderItem={({ item: inventory }) => (
            <HistoryCard
              onPress={() => handleNavigateToInventory(inventory)}
              item={inventory}
            />
          )}
          ListEmptyComponent={() => (
            <VStack className="flex-1 items-center justify-center">
              <Text className="text-lg text-gray-600">
                Nenhum inventário acessado...
              </Text>
            </VStack>
          )}
        />
      </VStack>
      <SyncInventoriesDialog
        onClose={handleCloseSyncInventoriesDialog}
        isOpen={isSyncInventoriesDialogOpen}
        isLoading={isPending}
        errors={errors}
        isError={isError}
      />
    </VStack>
  );
}
