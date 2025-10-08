import { BookCard } from "@components/BookCard";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import { useListStocksItems } from "@useCases/useListStockItems";
import { CloudAlert, CloudOff, Search } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text } from "react-native";

import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { useDebounce } from "../hooks/useDebounce";
import { useNetInfo } from "../hooks/useNetInfo";

export function Stock() {
  const { isConnected } = useNetInfo();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined,
  );

  const { data: establishments, isPending: isPendingEstablishments } =
    useGetAllEstablishments();

  const {
    data,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isPending,
  } = useListStocksItems(selectedFilter, debouncedSearch);

  const stockItems = data?.items ?? [];
  const totalItems = data?.total ?? 0;

  return (
    <VStack className="flex-1">
      <Header title="Estoque" />
      <VStack className="flex-1 bg-white px-6">
        {!isConnected ? (
          <VStack className="flex-1 items-center justify-center">
            <Icon as={CloudOff} className="text-teal-600" size={56} />
            <Alert
              variant="solid"
              className="mx-6 mt-4 rounded-md bg-teal-300/20"
            >
              <AlertIcon as={CloudAlert} className="text-teal-700" />
              <AlertText className="ml-1 text-sm text-teal-700">
                Para visualizar os dados do estoque, conecte-se a internet.
              </AlertText>
            </Alert>
          </VStack>
        ) : (
          <>
            <Input
              value={search}
              onChangeText={setSearch}
              leftIcon={Search}
              className="h-12 rounded-2xl border-gray-500 px-3 data-[focus=true]:border-teal-600"
              placeholder="Buscar pelo título do livro"
              rightIcon={
                <Select
                  isDisabled={isPendingEstablishments || !isConnected}
                  options={establishments ?? []}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                />
              }
            />

            <HStack className="mt-8 flex items-center justify-between">
              <Text className="font-poppins-medium text-lg text-gray-800">
                {isPending && isConnected ? (
                  <Skeleton speed={2} className="h-4 w-6 rounded-sm" />
                ) : (
                  <Text>{totalItems}</Text>
                )}{" "}
                Itens
              </Text>
              {selectedFilter && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="max-w-[250px] font-poppins-medium text-lg text-gray-800"
                >
                  {
                    establishments?.find((e) => e.value === selectedFilter)
                      ?.label
                  }
                </Text>
              )}
            </HStack>

            {isPending && isConnected ? (
              <VStack className="flex-1 items-center justify-center">
                <Spinner size="large" />
              </VStack>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                className="mt-3 flex-1"
                data={stockItems}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) => (
                  <BookCard book={item.book} stock={item} />
                )}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.5}
                refreshing={isRefetching}
                onRefresh={refetch}
                ListEmptyComponent={() => (
                  <Text className="mt-4 text-center font-poppins text-2xl text-gray-600">
                    Nenhum livro encontrado...
                  </Text>
                )}
                ListFooterComponent={
                  isFetchingNextPage ? <Spinner size="large" /> : null
                }
              />
            )}
          </>
        )}
      </VStack>
    </VStack>
  );
}
