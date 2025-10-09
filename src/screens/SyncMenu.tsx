import { useFocusEffect } from "@react-navigation/native";
import {
  BookOpen,
  Clock,
  LibraryBig,
  RefreshCcw,
  Store,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { Header } from "../components/Header";
import { SyncBookSelector } from "../components/SyncBookSelector";
import { SyncOptionCard } from "../components/SyncOptionCard";
import { useToast } from "../hooks/useToast";
import { api } from "../lib/api";
import {
  storageGetRefetchTimestamp,
  storageSetBooks,
  storageSetEstablishments,
} from "../storage/StorageBooksAndEstablishments";

export function SyncMenu() {
  const toast = useToast();

  const [isLoadingRefetchTimestamp, setIsLoadingRefetchTimestamp] =
    useState(false);
  const [refetchSyncTimestamp, setRefetchSyncTimestamp] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncBooksDialogOpen, setIsSyncBooksDialogOpen] = useState(false);

  const handleOpenSyncBooksDialog = () => setIsSyncBooksDialogOpen(true);
  const handleCloseSyncBooksDialog = () => setIsSyncBooksDialogOpen(false);

  async function handleSyncAllBooks() {
    try {
      setIsLoading(true);

      const { data } = await api.get("/books/all");

      await storageSetBooks(data);

      toast.show({
        message: "Livros sincronizados com sucesso",
        variant: "success",
        duration: 3000,
      });
    } catch (err) {
      console.log(err);

      toast.show({
        message: "Erro ao sincronizar livros",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSyncEstablishments() {
    try {
      setIsLoading(true);

      const { data } = await api.get("/establishments/all");

      await storageSetEstablishments(data);

      toast.show({
        message: "Estabelecimentos sincronizados com sucesso",
        variant: "success",
        duration: 3000,
      });
    } catch {
      toast.show({
        message: "Erro ao sincronizar estabelecimentos",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSyncStorage() {
    try {
      setIsLoading(true);

      const { data: books } = await api.get("/books/all");
      const { data: establishments } = await api.get("/establishments/all");

      await storageSetBooks(books);
      await storageSetEstablishments(establishments);

      toast.show({
        message: "Dados sincronizados com sucesso",
        variant: "success",
        duration: 3000,
      });
    } catch {
      toast.show({
        message: "Erro ao sincronizar dados",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchRefetchTimestamp() {
    try {
      const raw = await storageGetRefetchTimestamp();
      let ts = Number(raw) || 0;

      // se parece um timestamp em segundos (ex: < 1e12), converte para ms
      if (ts && ts < 1e12) ts = ts * 1000;

      setRefetchSyncTimestamp(ts);
      return ts;
    } catch (err) {
      console.error("Erro ao obter refetch timestamp:", err);
      setRefetchSyncTimestamp(0);
      return 0;
    }
  }

  // contador MM:SS — atualiza imediatamente e depois a cada 1s
  const [formattedTime, setFormattedTime] = useState("00:00");
  useEffect(() => {
    const update = () => {
      const time = Math.max(refetchSyncTimestamp - Date.now(), 0);
      const minutes = Math.floor(time / (1000 * 60));
      const seconds = Math.floor((time % (1000 * 60)) / 1000);
      setFormattedTime(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    };

    update(); // atualiza já na montagem / quando refetchSyncTimestamp muda
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [refetchSyncTimestamp]);

  // useFocusEffect — executa async corretamente e mantém loading enquanto espera
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        try {
          setIsLoadingRefetchTimestamp(true);
          await fetchRefetchTimestamp();
        } finally {
          // só atualiza o estado se a tela ainda estiver ativa
          if (isActive) setIsLoadingRefetchTimestamp(false);
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <VStack className="flex-1">
      <Header title="Menu de sincronização" />
      <VStack className="flex-1 px-6">
        <Text className="mt-8 font-poppins-semibold text-xl">
          Opções de Sincronização
        </Text>

        <VStack className="mt-6 gap-6">
          <SyncOptionCard
            disabled={isLoading}
            onPress={handleSyncAllBooks}
            title="Sincronizar todos os livros"
            description="Atualiza os dados locais dos livros"
            icon={LibraryBig}
          />
          <SyncOptionCard
            disabled={isLoading}
            onPress={handleSyncEstablishments}
            title="Sincronizar Estabelecimentos"
            description="Atualiza os dados locais dos estabelecimentos"
            icon={Store}
          />
          <SyncOptionCard
            disabled={isLoading}
            onPress={handleOpenSyncBooksDialog}
            title="Sincronizar livro individual"
            description="Atualiza os dados locais de um livro específico"
            icon={BookOpen}
          />
          <SyncBookSelector
            isSyncBooksDialogOpen={isSyncBooksDialogOpen}
            onCloseSyncBooksDialog={handleCloseSyncBooksDialog}
          />
        </VStack>

        <Button
          isDisabled={isLoading}
          onPress={handleSyncStorage}
          className="mt-10 h-16 items-center justify-center rounded-2xl bg-teal-600 data-[active=true]:bg-teal-500"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <ButtonIcon as={RefreshCcw} size={20} className="text-white" />
              <ButtonText className="font-poppins-semibold text-white">
                Sincronizar Tudo
              </ButtonText>
            </>
          )}
        </Button>

        <VStack className="mt-8 rounded-xl border border-gray-500 px-5 py-4">
          <HStack className="items-center justify-between">
            <Text className="font-poppins-semibold text-lg text-gray-800">
              Proxima sincronização
            </Text>
            <Icon as={Clock} className="text-teal-600" size={20} />
          </HStack>
          <VStack className="mx-auto mt-6">
            {isLoadingRefetchTimestamp ? (
              <Spinner />
            ) : (
              <Text className="font-poppins-semibold text-3xl text-teal-700">
                {formattedTime}
              </Text>
            )}
            <Text className="text-center text-sm font-medium text-gray-600">
              Minutos
            </Text>
          </VStack>

          <Text className="mt-5 text-center text-sm font-medium text-gray-600">
            A sincronização automática ocorre a cada 1 hora
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
}
