import { VStack } from "@/components/ui/vstack";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Search } from "lucide-react-native";
import { Select } from "@components/Select";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import { useListStocksItems } from "@useCases/useListStockItems";
import { useState } from "react";
import { Loading } from "../components/Loading";
import { FlatList, View } from "react-native";
import { BookCard } from "@components/BookCard";
import { Text } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "../hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

export function Stock() {
  const { data: establishmentsData } = useGetAllEstablishments();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );

  const {
    data,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isFetching,
  } = useListStocksItems(selectedFilter, debouncedSearch);

  const stockItems = data?.items ?? [];

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
      <Header title="Estoque" />
      <VStack className="px-6 flex-1 bg-white">
        <Input
          value={search}
          onChangeText={setSearch}
          leftIcon={Search}
          className="h-12 border-gray-500 rounded-2xl px-3 data-[focus=true]:border-teal-600"
          placeholder="Buscar pelo título do livro"
          rightIcon={
            <Select
              options={establishments}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        <Text className="mt-8 flex items-center text-gray-800 text-lg font-poppins-medium">
          {isFetching ? (
            <Skeleton speed={2} className="w-6 h-4 rounded-sm" />
          ) : (
            <Text>{data?.total}</Text>
          )}{" "}
          Itens
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          className="mt-3 flex-1"
          data={stockItems}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => <BookCard book={item.book} stock={item} />}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={() =>
            isFetching ? (
              <VStack className="flex-1 items-center justify-center">
                <Spinner size="large" />
              </VStack>
            ) : (
              <Text className="text-gray-600 text-2xl font-poppins text-center">
                Nenhum livro encontrado...
              </Text>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? <Spinner size="large" /> : null
          }
        />
      </VStack>
    </VStack>
  );
}
