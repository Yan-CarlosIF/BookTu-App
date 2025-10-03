import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { useNavigation } from "@react-navigation/native";
import { useListInventories } from "@useCases/Inventory/useListInventories";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Plus,
  Search,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { InventoryCard } from "../components/InventoryCard";
import { OfflineInventoryCard } from "../components/OfflineInventoryCard";
import { useDebounce } from "../hooks/useDebounce";
import { useNetInfo } from "../hooks/useNetInfo";
import { useToast } from "../hooks/useToast";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { OfflineInventory } from "../shared/types/offlineInventory";
import {
  storageGetOfflineInventories,
  storageRemoveOfflineInventory,
} from "../storage/StorageOfflineInventories";

export function Inventories() {
  const toast = useToast();
  const { isConnected } = useNetInfo();
  const { data: establishmentsData, isPending: isPendingEstablishments } =
    useGetAllEstablishments();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined,
  );

  const [isOfflineInventoriesPending, setIsOfflineInventoriesPending] =
    useState(false);
  const [offlineInventories, setOfflineInventories] = useState<
    OfflineInventory[]
  >([]);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
    isFetchingNextPage,
    isPending,
  } = useListInventories(selectedFilter, debouncedSearch);

  const inventories = data?.pages.flatMap((page) => page.data) ?? [];

  let establishments: { label: string; value: string }[] = [];

  if (!isPendingEstablishments) {
    establishments =
      establishmentsData?.reduce(
        (obj, establishment) => {
          obj.push({
            label: establishment.name,
            value: establishment.id,
          });
          return obj;
        },
        [] as { label: string; value: string }[],
      ) ?? [];
  }

  async function handleDeleteOfflineInventory(offlineInventoryId: string) {
    try {
      await storageRemoveOfflineInventory(offlineInventoryId);

      setOfflineInventories((inventories) =>
        inventories.filter(
          (inventory) => inventory.temporary_id !== offlineInventoryId,
        ),
      );

      toast.show({
        message: "Inventário excluído com sucesso",
        variant: "success",
        duration: 3000,
      });
    } catch {
      toast.show({
        message: "Não foi possível excluir o inventário offline",
        variant: "error",
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    try {
      setIsOfflineInventoriesPending(true);

      (async () => {
        const inventories = await storageGetOfflineInventories();
        setOfflineInventories(inventories);
      })();
    } catch (error) {
      console.log(error);
    } finally {
      setIsOfflineInventoriesPending(false);
    }
  }, []);

  const isLoading = isConnected ? isPending : isOfflineInventoriesPending;

  return (
    <VStack className="flex-1">
      <Header onPress={() => navigate("home")} title="Inventários" />
      <VStack className="flex-1 bg-white px-6">
        <Input
          value={search}
          onChangeText={setSearch}
          leftIcon={Search}
          className="h-12 rounded-2xl border-gray-500 px-3 data-[focus=true]:border-teal-600"
          placeholder="Buscar pelo título, autor ou identificador"
          rightIcon={
            <Select
              isDisabled={isPendingEstablishments || !isConnected}
              options={establishments}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : isConnected ? (
          <>
            {offlineInventories.length > 0 && (
              <Accordion
                size="md"
                type="single"
                isCollapsible={true}
                isDisabled={false}
                className="mt-4 w-full border-0 bg-transparent shadow-none"
              >
                <AccordionItem
                  value="offline"
                  className="border-0 bg-transparent"
                >
                  <AccordionHeader>
                    <AccordionTrigger className="px-0">
                      {({ isExpanded }: { isExpanded: boolean }) => {
                        return (
                          <>
                            <AccordionTitleText className="font-poppins-medium">
                              Inventários offline
                            </AccordionTitleText>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="ml-3"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="ml-3"
                              />
                            )}
                          </>
                        );
                      }}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent className="border-0 bg-transparent">
                    <Animated.FlatList
                      className="mt-10"
                      showsVerticalScrollIndicator={false}
                      itemLayoutAnimation={LinearTransition.springify(500)}
                      data={offlineInventories}
                      keyExtractor={({ temporary_id }) => temporary_id}
                      contentContainerStyle={{ paddingBottom: 75 }}
                      renderItem={({ item: offlineInventory }) => (
                        <OfflineInventoryCard
                          onDelete={handleDeleteOfflineInventory}
                          offlineInventory={offlineInventory}
                        />
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <Animated.FlatList
              itemLayoutAnimation={LinearTransition.springify(500)}
              showsVerticalScrollIndicator={false}
              className="mt-12"
              data={inventories}
              keyExtractor={({ id }) => id}
              renderItem={({ item: inventory }) => (
                <InventoryCard inventory={inventory} />
              )}
              onEndReached={() => hasNextPage && fetchNextPage()}
              onEndReachedThreshold={0.5}
              refreshing={isRefetching}
              onRefresh={refetch}
              contentContainerStyle={!hasNextPage && { paddingBottom: 75 }}
              ListEmptyComponent={() => (
                <Text className="text-center font-poppins text-2xl text-gray-600">
                  Nenhum inventário encontrado...
                </Text>
              )}
              ListFooterComponent={
                isFetchingNextPage ? <Spinner size="large" /> : null
              }
            />
          </>
        ) : (
          <Animated.FlatList
            className="mt-12"
            showsVerticalScrollIndicator={false}
            itemLayoutAnimation={LinearTransition.springify(500)}
            data={offlineInventories}
            keyExtractor={({ temporary_id }) => temporary_id}
            contentContainerStyle={{ paddingBottom: 75 }}
            renderItem={({ item: offlineInventory }) => (
              <OfflineInventoryCard
                onDelete={handleDeleteOfflineInventory}
                offlineInventory={offlineInventory}
              />
            )}
          />
        )}
      </VStack>
      <Fab
        placement="bottom center"
        size="lg"
        className="bg-teal-600 data-[active=true]:bg-teal-500"
        onPress={() => navigate("inventoryActions", {})}
      >
        <FabIcon as={Plus} size={24} />
      </Fab>
    </VStack>
  );
}
