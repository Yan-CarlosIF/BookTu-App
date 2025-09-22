import { VStack } from "@/components/ui/vstack";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Info, Search } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Select } from "@components/Select";

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
          renderItem={() => (
            <TouchableOpacity activeOpacity={0.9}>
              <Card className="bg-teal-700 flex-col py-2 px-4 rounded-xl justify-start max-h-[130px] mb-12">
                <HStack className="w-full">
                  <Text className="font-inter mr-auto text-xl text-white font-medium">
                    Diário de Anne Frank
                  </Text>
                  <Info color="white" size={24} />
                </HStack>
                <Text className="font-inter text-white text-[32px]">1234</Text>
                <Text className="text-white">1992</Text>
                <HStack className="w-full justify-between">
                  <Text className="text-ellipsis text-white line-clamp-1 max-w-[70%]">
                    categoria 1, categoria 2, categoria 3
                  </Text>
                  <Text className="text-white">R$ 39,90</Text>
                </HStack>
              </Card>
            </TouchableOpacity>
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
