import { VStack } from "@/components/ui/vstack";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Search } from "lucide-react-native";
import { FlatList, Text } from "react-native";
import { useState } from "react";
import { Select } from "@components/Select";
import { BookCard } from "../components/BookCard";
import { useNavigation } from "@react-navigation/native";
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

  const [selectedFilter, setSelectedFilter] = useState<Filters | undefined>(
    undefined
  );

  return (
    <VStack className="flex-1">
      <Header title="Livros" />
      <VStack className="px-7 flex-1">
        <Input
          leftIcon={Search}
          className="h-12 px-3 data-[focus=true]:border-teal-700"
          placeholder="Buscar pelo título, autor ou identificador"
          rightIcon={
            <Select
              options={BOOK_FILTERS}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          className="mt-16 flex-1"
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => String(item)}
          renderItem={({ index }) => (
            <BookCard
              onPress={() => {
                navigate("bookDetails", { bookId: index.toString() });
              }}
              key={index}
              categories={[
                { id: "1", name: "categoria 1" },
                { id: "2", name: "categoria 2" },
                { id: "3", name: "categoria 3" },
              ]}
              identifier="1234"
              price={39.9}
              title="Diário de Anne Frank"
              release_year={1992}
            />
          )}
          ListEmptyComponent={() => (
            <Text className="text-gray-600 text-2xl font-poppins text-center">
              Nenhum livro encontrado...
            </Text>
          )}
        />
      </VStack>
    </VStack>
  );
}
