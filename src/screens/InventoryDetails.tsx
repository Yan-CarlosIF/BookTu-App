import { BookCard } from "@components/BookCard";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useListInventoryBooks } from "@useCases/Inventory/useListInventoryBooks";
import { useProcessInventory } from "@useCases/Inventory/useProcessInventory";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  CloudDownload,
  CloudOff,
  CloudUpload,
  Fingerprint,
  MapPin,
  Package,
  Tag,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { useNetInfo } from "../hooks/useNetInfo";
import { useToast } from "../hooks/useToast";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Inventory } from "../shared/types/inventory";
import { OfflineInventory } from "../shared/types/offlineInventory";
import { storageUpdateInventoryHistory } from "../storage/StorageInventoryHistory";
import {
  storageRemoveOfflineInventory,
  storageUpdateOfflineInventory,
} from "../storage/StorageOfflineInventories";
import { useSyncOfflineInventories } from "../useCases/Inventory/useSyncOfflineInventories";

export function InventoryDetailScreen() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();
  const { isConnected } = useNetInfo();
  const { params } = useRoute();
  const { inventory, isOffline } = params as {
    inventory: Inventory | OfflineInventory;
    isOffline: boolean;
  };

  const offlineInventory = inventory as OfflineInventory;
  const actualInventory = inventory as Inventory;

  const [processedStatus, setProcessedStatus] = useState(
    actualInventory?.status,
  );

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
    isPending,
  } = useListInventoryBooks(actualInventory?.id);

  const { mutateAsync: processInventory, isPending: isProcessing } =
    useProcessInventory();

  const { mutateAsync: syncOfflineInventory, isPending: isSyncing } =
    useSyncOfflineInventories();

  const books = data?.items ?? offlineInventory?.books ?? [];
  const totalItems = data?.total ?? offlineInventory?.books?.length ?? 0;

  const handleProcessInventory = async () => {
    if (isOffline) return;

    await processInventory(actualInventory.id);
    setProcessedStatus("processed");
    await storageUpdateInventoryHistory({
      ...actualInventory,
      status: "processed",
    });
  };

  const handleSyncInventory = async () => {
    if (!isOffline) return;

    const response = await syncOfflineInventory({
      establishment_id: offlineInventory.establishment_id,
      inventoryBooks: offlineInventory.books.map((book) => ({
        book_id: book.book_id,
        quantity: book.quantity,
      })),
      total_quantity: offlineInventory.total_quantity,
    });

    if (!response.wasCreated) {
      await storageUpdateOfflineInventory(
        {
          ...offlineInventory,
          errors: response.errors,
        },
        offlineInventory.temporary_id,
      );

      toast.show({
        message: "Erro ao sincronizar inventário offline",
        variant: "error",
      });
    } else {
      toast.show({
        message: "Inventário sincronizado com sucesso",
        variant: "success",
      });

      await storageRemoveOfflineInventory(offlineInventory.temporary_id);
      navigate("inventories");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unprocessed":
        return "bg-amber-100 border-amber-300";
      case "processed":
        return "bg-teal-100 border-teal-300";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unprocessed":
        return <Icon as={AlertCircle} size={16} className="text-amber-600" />;
      case "processed":
        return <Icon as={CheckCircle} size={16} className="text-teal-700" />;
    }
  };

  useEffect(() => {
    if (isOffline) return;

    (async () =>
      await storageUpdateInventoryHistory({
        ...actualInventory,
        status: processedStatus,
      }))();
  }, [inventory, processedStatus, isOffline, actualInventory]);

  return (
    <VStack className="flex-1 bg-white">
      <Header title="Detalhes do Inventário" />

      <VStack className="flex-1 px-4">
        <VStack className="mb-6 mt-6 rounded-2xl border border-gray-500 bg-white p-5 shadow-sm">
          <HStack className="mb-4 items-start justify-between">
            <View className="flex-1">
              <HStack className="flex-row items-center gap-1">
                <Package size={20} color="#2BADA1" className="mr-2" />
                <Text
                  className="text-xl font-bold text-gray-800"
                  numberOfLines={1}
                >
                  {isOffline
                    ? offlineInventory.temporary_id
                    : actualInventory.identifier}
                </Text>
              </HStack>
            </View>

            <View
              className={`rounded-full border px-3 py-1 ${getStatusColor(
                processedStatus,
              )}`}
            >
              <View className="flex-row items-center">
                {getStatusIcon(processedStatus)}
                <Text
                  className={`text-xs font-medium ${
                    processedStatus === "unprocessed"
                      ? "text-amber-600"
                      : "text-teal-700"
                  } ml-1`}
                >
                  {getStatusText(processedStatus)}
                </Text>
              </View>
            </View>
          </HStack>

          {/* Quantity */}
          <HStack>
            <VStack className="mb-4">
              <Text className="text-base font-medium text-gray-800">
                Quantidade Total:
              </Text>
              <Text className="text-2xl font-bold text-teal-600">
                {inventory.total_quantity}
              </Text>
            </VStack>
            {isOffline && (
              <Icon
                as={
                  offlineInventory.errors.length > 0
                    ? CloudDownload
                    : CloudUpload
                }
                size={24}
                className={`ml-auto ${offlineInventory.errors.length > 0 ? "text-red-500" : "text-teal-500"}`}
              />
            )}
          </HStack>

          {/* Establishment Info */}
          <VStack className="gap-2 border-t border-gray-500 pt-3">
            <HStack className="items-center gap-2">
              <Building2 size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-semibold text-gray-800">
                {inventory.establishment.name}
              </Text>
            </HStack>

            <HStack className="items-center gap-2">
              <MapPin size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-medium text-gray-800">
                {inventory.establishment.city}, {inventory.establishment.state}
              </Text>
            </HStack>

            <HStack className="items-center gap-2">
              <Fingerprint size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-medium text-gray-800">
                CNPJ: {inventory.establishment.cnpj}
              </Text>
            </HStack>

            <HStack className="items-center gap-2">
              <Tag size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-medium text-gray-800">
                CEP: {inventory.establishment.cep}
              </Text>
            </HStack>
          </VStack>
        </VStack>

        {/* Books Section */}
        <HStack className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-800">
            Livros no Inventário
          </Text>
          <Text className="font-medium text-teal-600">{totalItems} itens</Text>
        </HStack>

        {isOffline ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            data={offlineInventory.books}
            keyExtractor={(item) => item.book_id}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Text className="mt-4 text-center font-poppins text-2xl text-gray-600">
                Inventário vazio...
              </Text>
            )}
            renderItem={({ item: inventoryBook }) => (
              <BookCard
                quantity={inventoryBook.quantity}
                book={inventoryBook.book}
              />
            )}
          />
        ) : isConnected && isPending ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : !isConnected ? (
          <View className="flex-1 items-center justify-center">
            <Icon as={CloudOff} className="text-teal-700" size={48} />
            <Text className="mt-2 text-lg text-gray-800">
              Sem conexão com a internet
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            data={books}
            keyExtractor={(item) => item.book_id}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Text className="mt-4 text-center font-poppins text-2xl text-gray-600">
                Inventário vazio...
              </Text>
            )}
            ListFooterComponent={
              isFetchingNextPage ? <Spinner size="large" /> : null
            }
            renderItem={({ item: inventoryBook }) => (
              <BookCard
                quantity={inventoryBook.quantity}
                book={inventoryBook.book}
              />
            )}
          />
        )}

        {(processedStatus === "unprocessed" || isProcessing || isSyncing) &&
          isConnected && (
            <Button
              disabled={isProcessing || isSyncing}
              isLoading={isProcessing || isSyncing}
              onPress={isOffline ? handleSyncInventory : handleProcessInventory}
              className="mb-6 h-14 items-center justify-center rounded-xl bg-[#2BADA1] data-[active=true]:bg-teal-400"
            >
              <Text className="text-lg font-bold text-white">
                {isOffline ? "Sincronizar" : "Processar"} Inventário
              </Text>
            </Button>
          )}
      </VStack>
    </VStack>
  );
}
