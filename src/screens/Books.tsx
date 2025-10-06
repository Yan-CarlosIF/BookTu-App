import { BookCard } from "@components/BookCard";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { useNavigation } from "@react-navigation/native";
import { storageGetBooks } from "@storage/StorageBooksAndEstablishments";
import { useListBooks } from "@useCases/Book/useListBooks";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { useDebounce } from "../hooks/useDebounce";
import { useNetInfo } from "../hooks/useNetInfo";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Book } from "../shared/types/book";

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
  const { isConnected } = useNetInfo();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [selectedFilter, setSelectedFilter] = useState<Filters | undefined>(
    undefined,
  );
  const [offlineBooks, setOfflineBooks] = useState<Book[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
    isPending,
  } = useListBooks(selectedFilter, debouncedSearch);

  const onlineBooks = data?.pages.flatMap((page) => page.books) ?? [];

  useEffect(() => {
    if (!isConnected) {
      storageGetBooks().then(setOfflineBooks);
    }
  }, [isConnected]);

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
              isDisabled={!isConnected}
              options={BOOK_FILTERS}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        {isPending && isConnected ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            className="mt-12 flex-1"
            data={isConnected ? onlineBooks : offlineBooks}
            keyExtractor={({ id }) => id}
            renderItem={({ item: book }) => (
              <BookCard
                isBook
                onPress={() => navigate("bookDetails", { bookId: book.id })}
                book={book}
              />
            )}
            onEndReached={() => isConnected && hasNextPage && fetchNextPage()}
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
