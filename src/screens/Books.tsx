import { BookCard } from "@components/BookCard";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { useNavigation } from "@react-navigation/native";
import { useListBooks } from "@useCases/Book/useListBooks";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";

import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { useDebounce } from "../hooks/useDebounce";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";

const BOOK_FILTERS = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
  { label: "Menor preço", value: "price-asc" },
  { label: "Maior preço", value: "price-desc" },
  { label: "Mais recentes", value: "latest" },
  { label: "Mais antigos", value: "oldest" },
] as const;

type Filters = (typeof BOOK_FILTERS)[number]["value"];

export function Books() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<Filters | undefined>(
    undefined,
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
    isPending,
  } = useListBooks(selectedFilter, debouncedSearch);

  const books = data?.pages.flatMap((page) => page.books) ?? [];

  return (
    <VStack className="flex-1">
      <Header title="Livros" />
      <VStack className="flex-1 bg-white px-6">
        <Input
          value={search}
          onChangeText={setSearch}
          leftIcon={Search}
          className="h-12 rounded-2xl border-gray-500 px-3 data-[focus=true]:border-teal-600"
          placeholder="Buscar pelo título, autor ou identificador"
          rightIcon={
            <Select
              options={BOOK_FILTERS}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            className="mt-12 flex-1"
            data={books}
            keyExtractor={({ id }) => id}
            renderItem={({ item: book }) => (
              <BookCard
                isBook
                onPress={() => navigate("bookDetails", { bookId: book.id })}
                book={book}
              />
            )}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={() => (
              <Text className="text-center font-poppins text-2xl text-gray-600">
                Nenhum livro encontrado...
              </Text>
            )}
            ListFooterComponent={
              isFetchingNextPage ? <Spinner size="large" /> : null
            }
          />
        )}
      </VStack>
    </VStack>
  );
}
