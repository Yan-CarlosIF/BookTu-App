import { Input } from "@components/Input";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useSearchAllBooks } from "@/src/useCases/Book/useSearchAllBooks";

import { useNetInfo } from "../hooks/useNetInfo";
import { Book } from "../shared/types/book";
import { InventoryBook } from "../shared/types/inventoryBook";
import { OfflineInventoryBook } from "../shared/types/offlineInventoryBook";
import { storageGetBooks } from "../storage/StorageBooksAndEstablishments";

type BookSelectorProps = {
  inventoryBooks: InventoryBook[] | OfflineInventoryBook[];
  setBooks: React.Dispatch<
    React.SetStateAction<InventoryBook[] | OfflineInventoryBook[]>
  >;
};

export function BookSelector({ inventoryBooks, setBooks }: BookSelectorProps) {
  const { isConnected } = useNetInfo();

  const [search, setSearch] = useState("");

  const [offlineBooks, setOfflineBooks] = useState<Book[]>([]);

  const { data, isLoading } = useSearchAllBooks(search);

  function handleSelectBook(book: Book) {
    const inventoryItem = {
      book: book,
      quantity: 1,
      book_id: book.id,
    };

    setBooks((prevBooks) => [...prevBooks, inventoryItem as InventoryBook]);
    setSearch("");
  }

  const books = isConnected ? data : offlineBooks;

  const selectableBooks = books?.filter(
    (book: Book) =>
      !inventoryBooks.find(
        (inventoryBook) => inventoryBook.book.id === book.id,
      ),
  );

  useEffect(() => {
    if (isConnected) return;

    (async () => {
      const cachedBooks = await storageGetBooks(search);
      setOfflineBooks(cachedBooks);
    })();
  }, [isConnected, search]);

  const hasBooksToSelect = selectableBooks && selectableBooks.length > 0;

  return (
    <View style={{ position: "relative" }}>
      <Input
        value={search}
        onChangeText={setSearch}
        leftIcon={Search}
        className="h-12 rounded-md border-gray-500 px-3 data-[focus=true]:border-teal-600"
        placeholder="Buscar pelo título ou identificador"
      />

      {/* Dropdown */}
      {!!search &&
        (hasBooksToSelect ? (
          <View className="elevation-lg absolute left-0 right-0 top-[70px] z-10 rounded-lg border border-gray-500 bg-white">
            <ScrollView
              className="max-h-[200px]"
              keyboardShouldPersistTaps="handled"
            >
              {selectableBooks.map((book: Book) => (
                <Pressable
                  key={book.id}
                  onPress={() => handleSelectBook(book)}
                  className="border-b-1 flex-row items-center border-gray-200 p-3"
                >
                  <Badge className="w-18 mr-2 items-center justify-center rounded-sm bg-slate-100">
                    <BadgeText className="font-bold">
                      {book.identifier}
                    </BadgeText>
                  </Badge>
                  <Text>- {book.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : !isLoading && selectableBooks && selectableBooks.length === 0 ? (
          <View className="elevation-lg absolute left-0 right-0 top-[70px] z-10 h-[50px] items-center justify-center rounded-lg border border-gray-500 bg-white">
            <Text className="text-gray-600">Nenhum livro encontrado...</Text>
          </View>
        ) : (
          isConnected &&
          isLoading && (
            <View className="elevation-lg absolute left-0 right-0 top-[70px] z-10 h-[50px] items-center justify-center rounded-lg border border-gray-500 bg-white">
              <Spinner />
            </View>
          )
        ))}
    </View>
  );
}
