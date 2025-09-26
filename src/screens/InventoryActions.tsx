import { VStack } from "@/components/ui/vstack";
import { Header } from "@components/Header";
import { useRoute } from "@react-navigation/native";
import { Inventory } from "../shared/types/inventory";
import { ActivityIndicator, Alert, FlatList, Text } from "react-native";
import { Select } from "@components/Select";
import { useState } from "react";
import { useGetAllEstablishments } from "../useCases/useGetAllEstablishments";
import {
  BrushCleaning,
  ChevronDown,
  MenuIcon,
  Plus,
} from "lucide-react-native";
import { SelectInput } from "@/components/ui/select";
import { HStack } from "@/components/ui/hstack";
import { BookCard } from "@components/BookCard";
import { SwipeToDelete } from "@components/SwipeToDelete";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";
import { BookSelector } from "../components/BookSelector";
import { Book } from "../shared/types/book";
import { UpdateProductDialog } from "../components/UpdateProductDialog";
import { useCreateInventory } from "../useCases/useCreateInventory";

type RouteParams = {
  inventoryId?: string;
  inventory?: Inventory;
};

export type InventoryItem = Book & {
  quantity: number;
};

export function InventoryActions() {
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const { params } = useRoute() as { params: RouteParams };
  const isCreateAction = !params.inventoryId && !params.inventory;

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

  const [selectedEstablishment, setSelectedEstablishment] = useState<
    string | undefined
  >(initialEstablishment);

  const [books, setBooks] = useState<InventoryItem[]>([] as InventoryItem[]);

  const total = books.reduce((total, book) => {
    return total + book.quantity;
  }, 0);

  function handleClearInventory() {
    Alert.alert(
      "Limpar inventário",
      "Tem certeza que deseja limpar o inventário?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          onPress: () => {
            setBooks([]);
          },
          style: "destructive",
        },
      ]
    );
  }

  const { mutateAsync: createInventory, isPending } = useCreateInventory();

  async function handleCreateInventory() {
    if (isCreateAction) {
      await createInventory({
        establishment_id: selectedEstablishment ?? "",
        total_quantity: total,
        inventoryBooks: books.map((book) => ({
          book_id: book.id,
          quantity: book.quantity,
        })),
      });
    }
  }

  return (
    <VStack className="flex-1 bg-white">
      <Header
        title={isCreateAction ? "Criar Inventário" : "Editar Inventário"}
      />
      <VStack className="px-6 flex-1 mt-7">
        <Select
          options={establishments ?? []}
          selectedFilter={selectedEstablishment}
          setSelectedFilter={setSelectedEstablishment}
          Icon={ChevronDown}
          Input={SelectInput}
        />

        <BookSelector books={books} setBooks={setBooks} />

        <HStack className="mt-8 justify-between items-center">
          <Text className="text-2xl font-poppins-medium">Produtos</Text>
          <Text className="text-xl">Total: {total}</Text>
        </HStack>

        <FlatList
          className="mt-6"
          showsVerticalScrollIndicator={false}
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item: book }) => (
            <>
              <SwipeToDelete
                onDelete={() => {
                  setBooks(books.filter((b) => b !== book));
                }}
              >
                <BookCard
                  onPress={() => setEditingBookId(book.id)}
                  quantity={book.quantity}
                  book={book}
                />
              </SwipeToDelete>
              <UpdateProductDialog
                setBooks={setBooks}
                book={book}
                isOpen={editingBookId === book.id}
                onClose={() => setEditingBookId(null)}
              />
            </>
          )}
        />
        <Fab
          onPress={handleCreateInventory}
          isDisabled={!selectedEstablishment || isPending}
          placement="bottom center"
          className="bg-teal-600 w-32 rounded-md data-[active=true]:bg-teal-500"
        >
          {isPending ? (
            <ActivityIndicator color="#ccc" size="small" />
          ) : (
            <>
              <FabLabel className="font-medium">Adicionar</FabLabel>
              <FabIcon as={Plus} />
            </>
          )}
        </Fab>
        <Menu
          offset={5}
          trigger={({ ...triggerProps }) => (
            <Fab
              {...triggerProps}
              size="lg"
              className="bg-teal-600 data-[active=true]:bg-teal-500"
            >
              <FabIcon as={MenuIcon} />
            </Fab>
          )}
        >
          <MenuItem
            onPress={handleClearInventory}
            key="Limpar"
            textValue="Limpar"
          >
            <Icon as={BrushCleaning} size="sm" className="mr-2 text-teal-600" />
            <MenuItemLabel size="sm" className="text-gray-800">
              Limpar
            </MenuItemLabel>
          </MenuItem>
        </Menu>
      </VStack>
    </VStack>
  );
}
