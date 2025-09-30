import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { useNavigation } from "@react-navigation/native";
import { useListInventories } from "@useCases/Inventory/useListInventories";
import { useGetAllEstablishments } from "@useCases/useGetAllEstablishments";
import { Plus, Search } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Fab, FabIcon } from "@/components/ui/fab";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";

import { InventoryCard } from "../components/InventoryCard";
import { useDebounce } from "../hooks/useDebounce";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";

export function Inventories() {
  const { data: establishmentsData, isPending: isPendingEstablishments } =
    useGetAllEstablishments();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined,
  );

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
              isDisabled={isPendingEstablishments}
              options={establishments}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        />

        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        ) : (
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
