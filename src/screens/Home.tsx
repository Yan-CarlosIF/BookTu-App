import { Button } from "@components/Button";
import { HistoryCard } from "@components/HistoryCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Book, Box, ClipboardList, LogOut } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "../hooks/useAuth";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { Inventory } from "../shared/types/inventory";
import {
  InventoryHistory,
  storageGetInventoryHistory,
} from "../storage/StorageInventoryHistory";

export function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistory[]>(
    [],
  );

  async function getInventoryHistory() {
    const data = await storageGetInventoryHistory();
    setInventoryHistory(data);
  }

  function handleNavigateToInventory(inventory: Inventory) {
    navigate("inventoryDetails", { inventory: inventory });
  }

  const { signOut } = useAuth();

  const handleSignOut = async () => await signOut();

  useFocusEffect(() => {
    getInventoryHistory();
  });

  return (
    <VStack className="flex-1 bg-white">
      <HStack className="h-[68px] w-full items-center justify-between rounded-b-xl bg-[#2BADA1] px-8">
        <Text className="font-poppins-bold text-2xl text-white">BookTu</Text>
        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
          <Icon as={LogOut} className="text-red-500" size={28} />
        </TouchableOpacity>
      </HStack>
      <VStack className="px-6">
        <HStack className="mt-16 gap-4">
          <Button
            onPress={() => navigate("books")}
            className="flex h-[100px] w-[110px] flex-col items-center justify-center rounded-2xl bg-[#2BADA1] data-[active=true]:bg-teal-600"
          >
            <Book color="white" size={24} />
            <Text className="mt-3 font-poppins text-sm text-white">Livros</Text>
          </Button>
          <Button
            onPress={() => navigate("inventories")}
            className="flex h-[100px] w-[110px] flex-col items-center justify-center rounded-2xl bg-[#2BADA1] data-[active=true]:bg-teal-600"
          >
            <ClipboardList color="white" size={24} />
            <Text className="mt-3 font-poppins text-sm text-white">
              Inventários
            </Text>
          </Button>
          <Button
            onPress={() => navigate("stock")}
            className="flex h-[100px] w-[110px] flex-col items-center justify-center rounded-2xl bg-[#2BADA1] data-[active=true]:bg-teal-600"
          >
            <Box color="white" size={24} />
            <Text className="mt-3 font-poppins text-sm text-white">
              Estoque
            </Text>
          </Button>
        </HStack>
        <Text className="mt-14 font-poppins-semibold text-xl">
          Inventários Recentes
        </Text>

        <FlatList
          className="mt-8"
          data={inventoryHistory}
          keyExtractor={({ id }) => id}
          renderItem={({ item: inventory }) => (
            <HistoryCard
              onPress={() => handleNavigateToInventory(inventory)}
              item={inventory}
            />
          )}
          ListEmptyComponent={() => (
            <VStack className="flex-1 items-center justify-center">
              <Text className="text-lg text-gray-600">
                Nenhum inventário acessado...
              </Text>
            </VStack>
          )}
        />
      </VStack>
    </VStack>
  );
}
