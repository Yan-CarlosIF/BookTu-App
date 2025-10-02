import { BookCard } from "@components/BookCard";
import { BookSelector } from "@components/BookSelector";
import { Header } from "@components/Header";
import { Select } from "@components/Select";
import { SwipeToDelete } from "@components/SwipeToDelete";
import { UpdateProductDialog } from "@components/UpdateProductDialog";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCreateInventory } from "@useCases/Inventory/useCreateInventory";
import { useEditInventory } from "@useCases/Inventory/useEditInventory";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import {
  BrushCleaning,
  Check,
  ChevronDown,
  ChevronLeft,
  CloudAlert,
  CloudOff,
  MenuIcon,
  Plus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Alert as AlertUI, AlertIcon, AlertText } from "@/components/ui/alert";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { SelectInput } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { Button } from "../components/Button";
import { useNetInfo } from "../hooks/useNetInfo";
import { api } from "../lib/api";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Book } from "../shared/types/book";
import { Inventory } from "../shared/types/inventory";
import { InventoryBook } from "../shared/types/inventoryBook";
import { storageGetEstablishments } from "../storage/StorageBooksAndEstablishments";
import { storageUpdateInventoryHistory } from "../storage/StorageInventoryHistory";

type RouteParams = {
  inventoryId?: string;
  inventory?: Inventory;
};

type IResponse = Inventory & {
  books: InventoryBook[];
};

export type InventoryItem = Book & {
  quantity: number;
};

type EstablishmentFilterItem = {
  label: string;
  value: string;
};

export function InventoryActions() {
  const { isConnected } = useNetInfo();
  const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();

  const [loading, setLoading] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [offlineEstablishments, setOfflineEstablishments] = useState<
    EstablishmentFilterItem[]
  >([]);

  const {
    params: { inventoryId, inventory },
  } = useRoute() as { params: RouteParams };
  const isCreateAction = !inventoryId && !inventory;

  const { data: establishmentsData } = useGetAllEstablishments();

  let initialEstablishment = inventory?.establishment_id ?? undefined;

  const establishments = establishmentsData?.reduce((obj, establishment) => {
    obj.push({
      label: establishment.name,
      value: establishment.id,
    });

    if (inventory?.establishment_id === establishment.id) {
      initialEstablishment = establishment.id;
    }

    return obj;
  }, [] as EstablishmentFilterItem[]);

  const [selectedEstablishment, setSelectedEstablishment] = useState<
    string | undefined
  >(initialEstablishment);

  const [inventoryBooks, setInventoryBooks] = useState<InventoryBook[]>([]);

  const total = inventoryBooks.reduce((total, book) => {
    return total + book.quantity;
  }, 0);

  const { mutateAsync: createInventory, isPending: isCreatePending } =
    useCreateInventory();
  const { mutateAsync: editInventory, isPending: isEditPending } =
    useEditInventory();

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
            setInventoryBooks([]);
          },
          style: "destructive",
        },
      ],
    );
  }

  async function handleCreateInventory() {
    if (isCreateAction) {
      await createInventory({
        establishment_id: selectedEstablishment ?? "",
        total_quantity: total,
        inventoryBooks: inventoryBooks.map((inventoryBook) => ({
          book_id: inventoryBook.book_id,
          quantity: inventoryBook.quantity,
        })),
      });
    }
  }

  async function handleEditInventory() {
    if (inventory) {
      await editInventory({
        id: inventory.id,
        establishment_id: selectedEstablishment ?? "",
        inventoryBooks: inventoryBooks.map((inventoryBook) => ({
          book_id: inventoryBook.book_id,
          quantity: inventoryBook.quantity,
        })),
      });

      await storageUpdateInventoryHistory(inventory);
      navigate("inventories");
    }
  }

  function handleNavigate() {
    if (selectedEstablishment || inventoryBooks.length > 0) {
      return Alert.alert(
        "Voltar sem salvar",
        "Tem certeza que deseja voltar sem salvar o inventário?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Voltar",
            onPress: () => {
              navigate("inventories");
            },
            style: "destructive",
          },
        ],
      );
    }

    goBack();
  }

  function handleDeleteBook(bookId: string) {
    setInventoryBooks((prev) =>
      prev.filter((inventoryBook) => inventoryBook.book.id !== bookId),
    );
  }

  useEffect(() => {
    if (!inventoryId) return;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get<IResponse>(`inventories/${inventoryId}`);

        setInventoryBooks(data.books);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [inventoryId]);

  useEffect(() => {
    if (isConnected) return;

    (async () => {
      try {
        setLoading(true);
        const establishments = await storageGetEstablishments(
          initialEstablishment,
          inventory?.establishment_id,
        );

        setOfflineEstablishments(establishments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isConnected, initialEstablishment, inventory?.establishment_id]);

  if (!isConnected && offlineEstablishments.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Icon as={CloudOff} className="text-teal-700" size={52} />
        <AlertUI
          variant="solid"
          className="mx-6 mt-4 rounded-md bg-teal-300/20"
        >
          <AlertIcon as={CloudAlert} className="text-teal-700" />
          <AlertText className="ml-1 text-sm text-teal-700">
            Você não tem dados salvos no dispositivo para criar um inventário,
            conecte-se a internet.
          </AlertText>
        </AlertUI>
        <Button
          onPress={goBack}
          className="mt-4 bg-teal-700 data-[active=true]:bg-teal-600"
        >
          <Icon as={ChevronLeft} className="text-white" />
          <Text className="text-white">Voltar</Text>
        </Button>
      </View>
    );
  }

  return (
    <VStack className="flex-1 bg-white">
      <Header
        onPress={handleNavigate}
        title={
          isCreateAction
            ? "Criar Inventário"
            : `Editar Inventário ${inventory?.identifier}`
        }
      />
      <VStack className="mt-7 flex-1 px-6">
        <Select
          options={isConnected ? (establishments ?? []) : offlineEstablishments}
          selectedFilter={selectedEstablishment}
          setSelectedFilter={setSelectedEstablishment}
          Icon={ChevronDown}
          Input={SelectInput}
        />

        <BookSelector
          inventoryBooks={inventoryBooks}
          setBooks={setInventoryBooks}
        />

        <HStack className="mt-8 items-center justify-between">
          <Text className="font-poppins-medium text-2xl">Produtos</Text>
          <Text className="text-xl">Total: {total}</Text>
        </HStack>

        {!isCreateAction && loading && inventoryBooks.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : (
          <Animated.FlatList
            itemLayoutAnimation={LinearTransition.springify(500)}
            className="mt-6"
            showsVerticalScrollIndicator={false}
            data={inventoryBooks}
            keyExtractor={(item) => item.book.id}
            contentContainerStyle={{ paddingBottom: 75 }}
            renderItem={({ item: inventoryBook }) => (
              <>
                <SwipeToDelete
                  onDelete={() => handleDeleteBook(inventoryBook.book.id)}
                >
                  <BookCard
                    onPress={() => setEditingBookId(inventoryBook.id)}
                    quantity={inventoryBook.quantity}
                    book={inventoryBook.book}
                  />
                </SwipeToDelete>
                <UpdateProductDialog
                  setBooks={setInventoryBooks}
                  book={inventoryBook}
                  isOpen={editingBookId === inventoryBook.id}
                  onClose={() => setEditingBookId(null)}
                />
              </>
            )}
          />
        )}
        <Fab
          onPress={isCreateAction ? handleCreateInventory : handleEditInventory}
          isDisabled={
            !selectedEstablishment || isCreatePending || isEditPending
          }
          placement="bottom center"
          className="w-32 rounded-md bg-teal-600 data-[active=true]:bg-teal-500"
        >
          {isCreatePending || isEditPending ? (
            <Spinner size="small" />
          ) : (
            <>
              <FabLabel className="font-medium">
                {isCreateAction ? "Adicionar" : "Salvar"}
              </FabLabel>
              <FabIcon as={isCreateAction ? Plus : Check} />
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
