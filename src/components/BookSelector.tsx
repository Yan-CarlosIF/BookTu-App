import { Input } from "./Input";
import { useState } from "react";
import { Search } from "lucide-react-native";
import { useGetAllBooks } from "@useCases/Book/useGetAllBooks";
import { Book } from "../shared/types/book";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { Badge, BadgeText } from "@/components/ui/badge";
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
      !books.find((inventoryBook) => inventoryBook.book.id === book.id)
  );

  return (
    <View style={{ position: "relative" }}>
      <Input
        value={search}
        onChangeText={setSearch}
        leftIcon={Search}
        className="h-12 border-gray-500 rounded-md px-3 data-[focus=true]:border-teal-600"
        placeholder="Buscar pelo título ou identificador"
      />

      {/* Dropdown */}
      {!!search &&
        (!isLoading && selectableBooks && selectableBooks.length > 0 ? (
          <View className="absolute top-[70px] left-0 right-0 bg-white border border-gray-500 rounded-lg z-10 elevation-lg">
            <ScrollView
              className="max-h-[200px]"
              keyboardShouldPersistTaps="handled"
            >
              {selectableBooks.map((book: Book) => (
                <Pressable
                  key={book.id}
                  onPress={() => handleSelectBook(book)}
                  className="p-3 border-b-1 border-gray-200 flex-row items-center"
                >
                  <Badge className="bg-slate-100 items-center justify-center rounded-sm w-18 mr-2">
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
          <View className="absolute top-[70px] left-0 right-0 bg-white border border-gray-500 rounded-lg z-10 elevation-lg h-[50px] items-center justify-center">
            <Text className="text-gray-600">Nenhum livro encontrado...</Text>
          </View>
        ) : (
          isLoading && (
            <View className="absolute top-[70px] left-0 right-0 bg-white border border-gray-500 rounded-lg z-10 elevation-lg h-[50px] items-center justify-center">
              <Spinner />
            </View>
          )
        ))}
    </View>
  );
}
