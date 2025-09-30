import { Input } from "@components/Input";
import { useGetAllBooks } from "@useCases/Book/useGetAllBooks";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

import { Book } from "../shared/types/book";
import { InventoryBook } from "../shared/types/inventoryBook";

type BookSelectorProps = {
  books: InventoryBook[];
  setBooks: React.Dispatch<React.SetStateAction<InventoryBook[]>>;
};

export function BookSelector({ books, setBooks }: BookSelectorProps) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAllBooks(search);

  function handleSelectBook(book: Book) {
    const inventoryItem = {
      book: book,
      quantity: 1,
      book_id: book.id,
    };

    setBooks((prevBooks) => [...prevBooks, inventoryItem as InventoryBook]);
    setSearch("");
  }

  const selectableBooks = data?.filter(
    (book: Book) =>
      !books.find((inventoryBook) => inventoryBook.book.id === book.id),
  );

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
        (!isLoading && selectableBooks && selectableBooks.length > 0 ? (
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
          isLoading && (
            <View className="elevation-lg absolute left-0 right-0 top-[70px] z-10 h-[50px] items-center justify-center rounded-lg border border-gray-500 bg-white">
              <Spinner />
            </View>
          )
        ))}
    </View>
  );
}
