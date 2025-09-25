import { VStack } from "@/components/ui/vstack";
import { Header } from "@components/Header";
import { useRoute } from "@react-navigation/native";
import { Inventory } from "../shared/types/inventory";
import { FlatList, Text } from "react-native";
import { Select } from "@components/Select";
import { useState } from "react";
import { useGetAllEstablishments } from "../useCases/useGetAllEstablishments";
import { ChevronDown, Search } from "lucide-react-native";
import { SelectInput } from "@/components/ui/select";
import { Input } from "@components/Input";
import { HStack } from "@/components/ui/hstack";
import { BookCard } from "@components/BookCard";
import { SwipeToDelete } from "@components/SwipeToDelete";
import Animated, { LinearTransition } from "react-native-reanimated";

type RouteParams = {
  inventoryId?: string;
  inventory?: Inventory;
};
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export function InventoryActions() {
  const { params } = useRoute() as { params: RouteParams };
  const isCreateAction = !params.inventoryId && !params.inventory;

  const [search, setSearch] = useState("");

  const { data: establishmentsData } = useGetAllEstablishments();

  let initialEstablishment = undefined;

  const establishments = establishmentsData?.reduce((obj, establishment) => {
    obj.push({
      label: establishment.name,
      value: establishment.id,
    });

    if (params.inventory?.establishment_id === establishment.id) {
      initialEstablishment = establishment.id;
    }

    return obj;
  }, [] as { label: string; value: string }[]);

  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    initialEstablishment
  );

  const [books, setBooks] = useState([1, 2, 3, 4, 5]);

  return (
    <VStack className="flex-1 bg-white">
      <Header
        title={isCreateAction ? "Criar Inventário" : "Editar Inventário"}
      />
      <VStack className="px-6 flex-1 mt-7">
        <Select
          options={establishments ?? []}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          Icon={ChevronDown}
          Input={SelectInput}
        />

        <Input
          value={search}
          onChangeText={setSearch}
          leftIcon={Search}
          className="h-12 border-gray-500 rounded-md px-3 data-[focus=true]:border-teal-600"
          placeholder="Buscar pelo título ou identificador"
        />

        <HStack className="mt-8 justify-between items-center">
          <Text className="text-2xl font-poppins-medium">Produtos</Text>
          <Text className="text-xl">Total: 50</Text>
        </HStack>

        <AnimatedFlatList
          layout={LinearTransition.springify()}
          className="mt-6"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item)}
          data={books}
          renderItem={({ item }) => (
            <SwipeToDelete
              onDelete={() => {
                setBooks(books.filter((book) => book !== item));
              }}
            >
              <BookCard
                stock={{
                  quantity: 10,
                  book_id: "dawdawdawdadaw",
                  id: "dawdawdawdadaw",
                  stock_id: "dawdawdawdadaw",
                  book: {
                    id: "dawdawdawdadaw",
                    title: "Pataxó",
                    author: "Alex Pereira",
                    identifier: "CHAMA",
                    price: 100,
                    release_year: 2025,
                    description: "",
                    categories: [],
                  },
                  stock: {
                    establishment_id: "dawdawdawdadaw",
                    id: "dawdawdawdadaw",
                    establishment: {
                      id: "dawdawdawdadaw",
                      name: "Pataxó",
                      cep: "00000-000",
                      city: "Pataxó",
                      cnpj: "00000000000000",
                      district: "Pataxó",
                      state: "Pataxó",
                      description: "",
                    },
                  },
                }}
                book={{
                  id: "dawdawdawdadaw",
                  title: "Pataxó",
                  author: "Alex Pereira",
                  identifier: "CHAMA",
                  price: 100,
                  release_year: 2025,
                  description: "",
                  categories: [],
                }}
              />
            </SwipeToDelete>
          )}
        />
      </VStack>
    </VStack>
  );
}
