import { useFocusEffect } from "@react-navigation/native";
import { Loader2, Search, X } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { Input } from "../components/Input";
import { useToast } from "../hooks/useToast";
import { api } from "../lib/api";
import { Book } from "../shared/types/book";
import {
  storageGetBooks,
  storageSetBook,
} from "../storage/StorageBooksAndEstablishments";

type SyncBookSelectorProps = {
  isSyncBooksDialogOpen: boolean;
  onCloseSyncBooksDialog: () => void;
};

export function SyncBookSelector({
  isSyncBooksDialogOpen,
  onCloseSyncBooksDialog,
}: SyncBookSelectorProps) {
  const toast = useToast();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [offlineBooks, setOfflineBooks] = useState<Book[]>([]);

  function handleSelectBook(book: Book) {
    setSelectedBook(book);
    setSearch("");
  }

  const fetchOfflineBooks = useCallback(async () => {
    setIsLoading(true);
    const offlineBooks = await storageGetBooks(search);

    setOfflineBooks(offlineBooks);

    setIsLoading(false);
  }, [search]);

  async function handleSyncBook() {
    if (!selectedBook) return;

    try {
      setIsSyncing(true);

      const { data: book } = await api.get(`/books/${selectedBook?.id}`);

      await storageSetBook(book.id, book);

      toast.show({
        message: "Livro sincronizado com sucesso",
        variant: "success",
        duration: 3000,
      });

      setSelectedBook(undefined);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao sincronizar livro";

      toast.show({
        message: message,
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsSyncing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOfflineBooks();
    }, [fetchOfflineBooks]),
  );

  return (
    <>
      <AlertDialog
        isOpen={isSyncBooksDialogOpen}
        onClose={onCloseSyncBooksDialog}
        size="lg"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent pointerEvents="box-none">
          <AlertDialogHeader>
            <Text className="font-poppins-semibold text-lg text-typography-950">
              Escolha o livro que deseja sincronizar
            </Text>
          </AlertDialogHeader>
          <VStack className="mb-4 mt-3">
            <Text className="text-sm">
              Procure pelo identificador ou título do livro que deseja
              sincronizar
            </Text>

            <View pointerEvents="auto" className="relative">
              <Input
                iconSize={16}
                value={search}
                onChangeText={setSearch}
                leftIcon={Search}
                className="h-10 rounded-md border-gray-500 px-3 data-[focus=true]:border-teal-600"
              />

              {selectedBook && (
                <HStack className="mt-3 w-full items-center self-center rounded-md border border-gray-200 p-3">
                  <Badge className="w-18 mr-2 items-center justify-center rounded-sm bg-slate-100">
                    <BadgeText className="font-bold">
                      {selectedBook?.identifier}
                    </BadgeText>
                  </Badge>
                  <Text>- {selectedBook?.title}</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedBook(undefined)}
                    className="ml-auto"
                  >
                    <Icon as={X} />
                  </TouchableOpacity>
                </HStack>
              )}
              {!!search &&
                (isLoading ? (
                  <View className="absolute left-0 right-0 top-[60px] z-50 h-[50px] items-center justify-center rounded-lg border border-gray-500 bg-white">
                    <Spinner />
                  </View>
                ) : (
                  <View className="absolute left-0 right-0 top-[60px] z-50 rounded-lg border border-gray-500 bg-white">
                    <FlatList
                      data={offlineBooks}
                      renderItem={({ item: book }) => (
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
                      )}
                      keyExtractor={({ id }) => id}
                      keyboardShouldPersistTaps="handled"
                      style={{ maxHeight: 200 }}
                    />
                  </View>
                ))}
            </View>
          </VStack>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={onCloseSyncBooksDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              disabled={!selectedBook}
              size="sm"
              className="w-1/3 bg-teal-600 disabled:opacity-70 data-[active=true]:bg-teal-500"
              onPress={handleSyncBook}
            >
              {isSyncing ? (
                <ButtonIcon
                  as={Loader2}
                  color="white"
                  className="animate-spin"
                  size={14}
                />
              ) : (
                <ButtonText>Sincronizar</ButtonText>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
