import { View, Text, FlatList } from "react-native";
import {
  Package,
  MapPin,
  Building2,
  Tag,
  CheckCircle,
  AlertCircle,
  Fingerprint,
} from "lucide-react-native";
import { Inventory } from "../shared/types/inventory";
import { useRoute } from "@react-navigation/native";
import { VStack } from "@/components/ui/vstack";
import { Header } from "@components/Header";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { useListInventoryBooks } from "@useCases/Inventory/useListInventoryBooks";
import { BookCard } from "../components/BookCard";
import { Spinner } from "@/components/ui/spinner";
import { useProcessInventory } from "../useCases/Inventory/useProcessInventory";
import { Button } from "@components/Button";
import { useEffect, useState } from "react";
import { storageUpdateInventoryHistory } from "../storage/StorageInventoryHistory";

export default function InventoryDetailScreen() {
  const { params } = useRoute();
  const { inventory } = params as { inventory: Inventory };
  const [isProcessed, setIsProcessed] = useState(inventory.status);

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
    setIsProcessed("processed");
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
        status: isProcessed,
      }))();
  }, []);

  return (
    <VStack className="flex-1 bg-white">
      <Header title="Detalhes do Inventário" />

      <VStack className="flex-1 px-4">
        <VStack className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-500 mt-6">
          <HStack className="justify-between items-start mb-4">
            <View className="flex-1">
              <HStack className="flex-row gap-1 items-center">
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
              className={`px-3 py-1 rounded-full border ${getStatusColor(
                isProcessed
              )}`}
            >
              <View className="flex-row items-center">
                {getStatusIcon(isProcessed)}
                <Text
                  className={`text-xs font-medium ${
                    isProcessed === "unprocessed"
                      ? "text-amber-600"
                      : "text-teal-700"
                  } ml-1`}
                >
                  {getStatusText(isProcessed)}
                </Text>
              </View>
            </View>
          </HStack>

          {/* Quantity */}
          <View className="mb-4">
            <Text className="text-base text-gray-800 font-medium">
              Quantidade Total:
            </Text>
            <Text className="text-2xl font-bold text-teal-600">
              {inventory.total_quantity}
            </Text>
          </View>

          {/* Establishment Info */}
          <VStack className="border-t gap-2 border-gray-500 pt-3">
            <HStack className="gap-2 items-center">
              <Building2 size={18} color="#0d9488" className="mr-2" />
              <Text className="font-semibold text-base text-gray-800">
                {inventory.establishment.name}
              </Text>
            </HStack>

            <HStack className="gap-2 items-center">
              <MapPin size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-medium text-gray-800">
                {inventory.establishment.city}, {inventory.establishment.state}
              </Text>
            </HStack>

            <HStack className="gap-2 items-center">
              <Fingerprint size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-medium text-gray-800">
                CNPJ: {inventory.establishment.cnpj}
              </Text>
            </HStack>

            <HStack className="gap-2 items-center">
              <Tag size={18} color="#0d9488" className="mr-2" />
              <Text className="text-base font-medium text-gray-800">
                CEP: {inventory.establishment.cep}
              </Text>
            </HStack>
          </VStack>
        </VStack>

        {/* Books Section */}
        <HStack className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Livros no Inventário
          </Text>
          <Text className="text-teal-600 font-medium">{totalItems} itens</Text>
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
              <Text className="text-gray-600 text-2xl font-poppins text-center">
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

        {(isProcessed === "unprocessed" || isProcessing) && (
          <Button
            disabled={isProcessing}
            isLoading={isProcessing}
            onPress={handleProcessInventory}
            className="bg-[#2BADA1] mb-6 h-14 rounded-xl items-center justify-center data-[active=true]:bg-teal-400"
          >
            <Text className="text-white text-lg font-bold">
              Processar Inventário
            </Text>
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
