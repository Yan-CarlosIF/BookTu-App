import { BookCard } from "@components/BookCard";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { useRoute } from "@react-navigation/native";
import { useListInventoryBooks } from "@useCases/Inventory/useListInventoryBooks";
import { useProcessInventory } from "@useCases/Inventory/useProcessInventory";
import {
  AlertCircle,
  Building2,
  CheckCircle,
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

import { Inventory } from "../shared/types/inventory";
import { storageUpdateInventoryHistory } from "../storage/StorageInventoryHistory";

export function InventoryDetailScreen() {
  const { params } = useRoute();
  const { inventory } = params as { inventory: Inventory };
  const [processedStatus, setProcessedStatus] = useState(inventory.status);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
    isPending,
  } = useListInventoryBooks(inventory.id);

  const { mutateAsync: processInventory, isPending: isProcessing } =
    useProcessInventory();

  const books = data?.items ?? [];
  const totalItems = data?.total;

  const handleProcessInventory = async () => {
    await processInventory(inventory.id);
    setProcessedStatus("processed");
    await storageUpdateInventoryHistory({
      ...inventory,
      status: "processed",
    });
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
    (async () =>
      await storageUpdateInventoryHistory({
        ...inventory,
        status: processedStatus,
      }))();
  }, [inventory, processedStatus]);

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
                  {inventory.identifier}
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
          <View className="mb-4">
            <Text className="text-base font-medium text-gray-800">
              Quantidade Total:
            </Text>
            <Text className="text-2xl font-bold text-teal-600">
              {inventory.total_quantity}
            </Text>
          </View>

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

        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            data={books}
            keyExtractor={(item) => item.id}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Text className="text-center font-poppins text-2xl text-gray-600">
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

        {(processedStatus === "unprocessed" || isProcessing) && (
          <Button
            disabled={isProcessing}
            isLoading={isProcessing}
            onPress={handleProcessInventory}
            className="mb-6 h-14 items-center justify-center rounded-xl bg-[#2BADA1] data-[active=true]:bg-teal-400"
          >
            <Text className="text-lg font-bold text-white">
              Processar Inventário
            </Text>
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
