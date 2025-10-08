import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  storageGetOfflineInventories,
  storageRemoveOfflineInventory,
} from "@storage/StorageOfflineInventories";
import { useListInventories } from "@useCases/Inventory/useListInventories";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Plus,
  Search,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Dimensions, Text, View } from "react-native";
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

export function Inventories() {
  const toast = useToast();
  const { isConnected } = useNetInfo();

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

  const { data: establishments, isPending: isPendingEstablishments } =
    useGetAllEstablishments();

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

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadOfflineInventories() {
        try {
          setIsOfflineInventoriesPending(true);

          const inventories = await storageGetOfflineInventories();

          if (isActive) {
            setOfflineInventories(inventories);
          }
        } catch (error) {
          console.log(error);
        } finally {
          if (isActive) {
            setIsOfflineInventoriesPending(false);
          }
        }
      }

      loadOfflineInventories();

      // cleanup evita setState após desmontagem
      return () => {
        isActive = false;
      };
    }, []),
  );

  const isLoading = isConnected ? isPending : isOfflineInventoriesPending;

  const filteredOfflineInventories =
    offlineInventories.filter((inventory) =>
      inventory.establishment_id.includes(selectedFilter ?? ""),
    ) ?? [];

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
              options={establishments ?? []}
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
            {selectedFilter && (
              <Text className="mt-6 font-poppins-medium text-base text-gray-800">
                Estabelecimento:{" "}
                {
                  establishments?.find(
                    (establishment) => establishment.value === selectedFilter,
                  )?.label
                }
              </Text>
            )}

            {filteredOfflineInventories.length > 0 && (
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
                    <View
                      style={{
                        maxHeight: Dimensions.get("window").height - 200,
                      }}
                    >
                      <Animated.FlatList
                        className="mt-4"
                        showsVerticalScrollIndicator={false}
                        itemLayoutAnimation={LinearTransition.springify(500)}
                        data={filteredOfflineInventories}
                        keyExtractor={({ temporary_id }) => temporary_id}
                        contentContainerStyle={{ paddingBottom: 75 }}
                        renderItem={({ item: offlineInventory }) => (
                          <OfflineInventoryCard
                            onDelete={handleDeleteOfflineInventory}
                            offlineInventory={offlineInventory}
                          />
                        )}
                      />
                    </View>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <Animated.FlatList
              itemLayoutAnimation={LinearTransition.springify(500)}
              showsVerticalScrollIndicator={false}
              className={offlineInventories.length > 0 ? "mt-4" : "mt-12"}
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
                <Text className="mt-4 text-center font-poppins text-2xl text-gray-600">
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
            ListEmptyComponent={() => (
              <Text className="text-center font-poppins text-xl text-gray-600">
                Nenhum inventário offline encontrado...
              </Text>
            )}
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
