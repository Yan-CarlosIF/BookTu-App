import { VStack } from "@/components/ui/vstack";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { useState } from "react";
import { Plus, Search } from "lucide-react-native";
import { useGetAllEstablishments } from "../useCases/useGetAllEstablishments";
import { Loading } from "@components/Loading";
import { useDebounce } from "../hooks/useDebounce";
import { Select } from "@components/Select";
import { Alert, FlatList, Text } from "react-native";
import { InventoryCard } from "../components/InventoryCard";
import { useListInventories } from "../useCases/useListInventories";
import { Spinner } from "@/components/ui/spinner";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { SwipeToDelete } from "../components/SwipeToDelete";
import { useDeleteInventory } from "../useCases/useDeleteInventory";

export function Inventories() {
  const { data: establishmentsData } = useGetAllEstablishments();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
  } = useListInventories(selectedFilter, debouncedSearch);
  const { mutateAsync: deleteInventoryFn } = useDeleteInventory();

  const inventories = data?.pages.flatMap((page) => page.data) ?? [];

  if (!establishmentsData) return <Loading />;

  const establishments = establishmentsData.reduce((obj, establishment) => {
    obj.push({
      label: establishment.name,
      value: establishment.id,
    });
    return obj;
  }, [] as { label: string; value: string }[]);

  function handleDeleteInventory(inventoryId: string, identifier: number) {
    let deleted = false;

    Alert.alert(
      "Deletar inventário",
      `Tem certeza que deseja deletar o inventário ${identifier}?`,
      [
        {
          text: "cancelar",
          style: "cancel",
        },
        {
          text: "deletar",
          style: "destructive",
          onPress: async () => await deleteInventoryFn(inventoryId),
        },
      ]
    );

    return deleted;
  }

  return (
    <VStack className="flex-1">
      <Header onPress={() => navigate("home")} title="Inventários" />
      <VStack className="px-6 bg-white flex-1">
        <Input
          value={search}
          onChangeText={setSearch}
          leftIcon={Search}
          className="h-12 border-gray-500 rounded-2xl px-3 data-[focus=true]:border-teal-600"
          placeholder="Buscar pelo título, autor ou identificador"
          rightIcon={
            <Select
              options={establishments}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          className="mt-12"
          data={inventories}
          keyExtractor={({ id }) => id}
          renderItem={({ item: inventory }) => (
            <SwipeToDelete
              onDelete={() =>
                handleDeleteInventory(inventory.id, inventory.identifier)
              }
            >
              <InventoryCard inventory={inventory} />
            </SwipeToDelete>
          )}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={() => (
            <Text className="text-gray-600 text-2xl font-poppins text-center">
              Nenhum inventário encontrado...
            </Text>
          )}
          ListFooterComponent={
            isFetchingNextPage ? <Spinner size="large" /> : null
          }
        />
      </VStack>
      <Fab
        placement="bottom center"
        size="lg"
        className="bg-teal-600 data-[active=true]:bg-teal-500"
        onPress={() => navigate("inventoryActions", {})}
      >
        <FabIcon as={Plus} size={24} />
      </Fab>
    </VStack>
  );
}
