import { BookCard } from "@components/BookCard";
import { BookSelector } from "@components/BookSelector";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Loading } from "@components/Loading";
import { Select } from "@components/Select";
import { SwipeToDelete } from "@components/SwipeToDelete";
import { UpdateProductDialog } from "@components/UpdateProductDialog";
import { useNavigation, useRoute } from "@react-navigation/native";
import { storageGetFilteredEstablishments } from "@storage/StorageBooksAndEstablishments";
import { storageUpdateInventoryHistory } from "@storage/StorageInventoryHistory";
import {
  storageSetOfflineInventories,
  storageUpdateOfflineInventory,
} from "@storage/StorageOfflineInventories";
import { useCreateInventory } from "@useCases/Inventory/useCreateInventory";
import { useEditInventory } from "@useCases/Inventory/useEditInventory";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  CloudAlert,
  CloudOff,
  Plus,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Alert as AlertUI, AlertIcon, AlertText } from "@/components/ui/alert";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { SelectInput } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { useNetInfo } from "../hooks/useNetInfo";
import { useToast } from "../hooks/useToast";
import { api } from "../lib/api";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Book } from "../shared/types/book";
import { Inventory } from "../shared/types/inventory";
import { InventoryBook } from "../shared/types/inventoryBook";
import { OfflineInventory } from "../shared/types/offlineInventory";
import { OfflineInventoryBook } from "../shared/types/offlineInventoryBook";

type RouteParams = {
  inventoryId?: string;
  inventory?: Inventory;
  offlineInventory?: OfflineInventory;
};

type IResponse = Inventory & { books: InventoryBook[] };
type EstablishmentFilterItem = { label: string; value: string };

export type InventoryItem = Book & { quantity: number };

export function InventoryActions() {
  const toast = useToast();
  const { isConnected } = useNetInfo();
  const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();

  const {
    params: { inventoryId, inventory, offlineInventory },
  } = useRoute() as { params: RouteParams };

  const [loading, setLoading] = useState(false);
  const [isOfflineActionPending, setIsOfflineActionPending] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [offlineEstablishments, setOfflineEstablishments] = useState<
    EstablishmentFilterItem[]
  >([]);

  const isCreateAction = !inventoryId && !inventory;
  const isOfflineEditAction = !!offlineInventory?.temporary_id;

  const offlineInventoryBooksErrorsIds = useMemo(
    () =>
      offlineInventory?.errors
        ?.filter((e) => e.type === "book")
        .map((e) => e.id) ?? [],
    [offlineInventory],
  );

  const { data: establishments } = useGetAllEstablishments();

  let initialEstablishment = useMemo(() => {
    if (offlineInventory) {
      return offlineInventory.errors.some((e) => e.type === "establishment")
        ? undefined
        : offlineInventory.establishment_id;
    }
    return inventory?.establishment_id ?? undefined;
  }, [inventory, offlineInventory]);

  const [selectedEstablishment, setSelectedEstablishment] = useState<
    string | undefined
  >(initialEstablishment);

  const [inventoryBooks, setInventoryBooks] = useState<
    InventoryBook[] | OfflineInventoryBook[]
  >(offlineInventory?.books ?? []);

  const total = useMemo(
    () => inventoryBooks.reduce((sum, b) => sum + b.quantity, 0),
    [inventoryBooks],
  );

  const { mutateAsync: createInventory, isPending: isCreatePending } =
    useCreateInventory();
  const { mutateAsync: editInventory, isPending: isEditPending } =
    useEditInventory();

  const handleCreateOfflineInventory = useCallback(async () => {
    setIsOfflineActionPending(true);
    try {
      await storageSetOfflineInventories({
        establishment_id: selectedEstablishment ?? "",
        total_quantity: total,
        books: inventoryBooks.map(({ book_id, book, quantity }) => ({
          book_id,
          book,
          quantity,
        })),
      });
      toast.show({
        message: "Inventário salvo offline com sucesso",
        variant: "success",
      });
    } catch {
      toast.show({
        message: "Erro ao salvar inventário offline",
        variant: "error",
      });
    } finally {
      setIsOfflineActionPending(false);
    }
  }, [inventoryBooks, selectedEstablishment, toast, total]);

  const handleCreateInventory = useCallback(async () => {
    if (!isCreateAction) return;
    if (isConnected) {
      await createInventory({
        establishment_id: selectedEstablishment ?? "",
        total_quantity: total,
        inventoryBooks: inventoryBooks.map(({ book_id, quantity }) => ({
          book_id,
          quantity,
        })),
      });
    } else {
      await handleCreateOfflineInventory();
    }
    navigate("inventories");
  }, [
    isCreateAction,
    isConnected,
    createInventory,
    handleCreateOfflineInventory,
    navigate,
    inventoryBooks,
    selectedEstablishment,
    total,
  ]);

  const handleEditOfflineInventory = useCallback(async () => {
    setIsOfflineActionPending(true);
    try {
      await storageUpdateOfflineInventory(
        {
          establishment_id: selectedEstablishment ?? "",
          total_quantity: total,
          books: inventoryBooks.map(({ book_id, book, quantity }) => ({
            book_id,
            book,
            quantity,
          })),
          errors: [],
        },
        offlineInventory?.temporary_id ?? "",
      );
      toast.show({
        message: "Inventário offline editado com sucesso",
        variant: "success",
      });
    } catch {
      toast.show({
        message: "Erro ao editar inventário offline",
        variant: "error",
      });
    } finally {
      setIsOfflineActionPending(false);
    }
  }, [
    inventoryBooks,
    offlineInventory?.temporary_id,
    selectedEstablishment,
    toast,
    total,
  ]);

  const handleEditInventory = useCallback(async () => {
    if (isConnected) {
      if (offlineInventory) {
        await handleEditOfflineInventory();
        navigate("inventories");
        return;
      }
      if (!inventory) return;

      await editInventory({
        id: inventory.id,
        establishment_id: selectedEstablishment ?? "",
        inventoryBooks: inventoryBooks.map(({ book_id, quantity }) => ({
          book_id,
          quantity,
        })),
      });
      await storageUpdateInventoryHistory(inventory);
    } else {
      await handleEditOfflineInventory();
    }
    navigate("inventories");
  }, [
    offlineInventory,
    editInventory,
    handleEditOfflineInventory,
    inventory,
    inventoryBooks,
    isConnected,
    navigate,
    selectedEstablishment,
  ]);

  const handleDeleteBook = useCallback(
    (bookId: string) => {
      setInventoryBooks((prev) =>
        prev.filter((item) => item.book.id !== bookId),
      );

      if (offlineInventoryBooksErrorsIds.includes(bookId)) {
        offlineInventoryBooksErrorsIds.splice(
          offlineInventoryBooksErrorsIds.indexOf(bookId),
        );
      }
    },
    [offlineInventoryBooksErrorsIds],
  );

  const handleNavigate = useCallback(() => {
    if (selectedEstablishment || inventoryBooks.length > 0) {
      Alert.alert(
        "Voltar sem salvar",
        "Tem certeza que deseja voltar sem salvar o inventário?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Voltar",
            style: "destructive",
            onPress: () => navigate("inventories"),
          },
        ],
      );
    } else {
      goBack();
    }
  }, [selectedEstablishment, inventoryBooks, navigate, goBack]);

  useEffect(() => {
    if (!inventoryId || !isConnected) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get<IResponse>(`inventories/${inventoryId}`);
        setInventoryBooks(data.books);
      } finally {
        setLoading(false);
      }
    })();
  }, [inventoryId, isConnected]);

  // Buscar estabelecimentos offline
  useEffect(() => {
    if (isConnected) return;
    (async () => {
      try {
        setLoading(true);
        const establishments = await storageGetFilteredEstablishments(
          initialEstablishment,
          inventory?.establishment_id,
        );
        setOfflineEstablishments(establishments);
      } finally {
        setLoading(false);
      }
    })();
  }, [isConnected, initialEstablishment, inventory?.establishment_id]);

  const selectOptions = useMemo(
    () => (isConnected ? (establishments ?? []) : offlineEstablishments),
    [isConnected, establishments, offlineEstablishments],
  );

  if (loading) return <Loading />;

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
            Você não tem dados salvos no dispositivo para criar um inventário.
            Conecte-se à internet.
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

  const isPending = isCreatePending || isEditPending || isOfflineActionPending;

  return (
    <VStack className="flex-1 bg-white">
      <Header
        onPress={handleNavigate}
        title={
          isCreateAction && !isOfflineEditAction
            ? "Criar Inventário"
            : `Editar Inventário ${inventory?.identifier ?? "offline"}`
        }
      />

      <VStack className="mt-7 flex-1 px-6">
        <Select
          options={selectOptions}
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

        {loading && inventoryBooks.length === 0 ? (
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
            renderItem={({ item }) => (
              <>
                <SwipeToDelete onDelete={() => handleDeleteBook(item.book.id)}>
                  <BookCard
                    onPress={() => setEditingBookId(item.book.id)}
                    quantity={item.quantity}
                    book={item.book}
                    isOfflineError={offlineInventoryBooksErrorsIds.includes(
                      item.book.id,
                    )}
                  />
                </SwipeToDelete>

                <UpdateProductDialog
                  setBooks={setInventoryBooks}
                  book={item}
                  isOpen={editingBookId === item.book_id}
                  onClose={() => setEditingBookId(null)}
                />
              </>
            )}
          />
        )}

        <Fab
          onPress={
            isCreateAction && !isOfflineEditAction
              ? handleCreateInventory
              : handleEditInventory
          }
          isDisabled={
            !selectedEstablishment ||
            isPending ||
            offlineInventoryBooksErrorsIds.length > 0
          }
          placement="bottom center"
          className="w-32 rounded-md bg-teal-600 data-[active=true]:bg-teal-500"
        >
          {isPending ? (
            <Spinner size="small" />
          ) : (
            <>
              <FabLabel className="font-medium">
                {isCreateAction && !isOfflineEditAction
                  ? "Adicionar"
                  : "Salvar"}
              </FabLabel>
              <FabIcon as={isCreateAction ? Plus : Check} />
            </>
          )}
        </Fab>
      </VStack>
    </VStack>
  );
}
