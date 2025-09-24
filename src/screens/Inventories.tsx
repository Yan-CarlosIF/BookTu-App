import { VStack } from "@/components/ui/vstack";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { useState } from "react";
import { Plus, Search } from "lucide-react-native";
import { useGetAllEstablishments } from "../useCases/useGetAllEstablishments";
import { Loading } from "@components/Loading";
import { useDebounce } from "../hooks/useDebounce";
import { Select } from "@components/Select";
import { FlatList, Text } from "react-native";
import { InventoryCard } from "../components/InventoryCard";
import { useListInventories } from "../useCases/useListInventories";
import { Spinner } from "@/components/ui/spinner";
import { Fab, FabIcon } from "@/components/ui/fab";

export function Inventories() {
  const { data: establishmentsData } = useGetAllEstablishments();

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

  const inventories = data?.pages.flatMap((page) => page.data) ?? [];

  if (!establishmentsData) return <Loading />;

  const establishments = establishmentsData.reduce((obj, establishment) => {
    obj.push({
      label: establishment.name,
      value: establishment.id,
    });
    return obj;
  }, [] as { label: string; value: string }[]);

  return (
    <VStack className="flex-1">
      <Header title="Inventários" />
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
            <InventoryCard inventory={inventory} />
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
      >
        <FabIcon as={Plus} size={24} />
      </Fab>
    </VStack>
  );
}
