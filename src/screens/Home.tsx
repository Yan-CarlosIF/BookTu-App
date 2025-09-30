import { VStack } from "@/components/ui/vstack";
import { TouchableOpacity, Text, FlatList } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Book, Box, ClipboardList, LogOut } from "lucide-react-native";
import { Button } from "@components/Button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { useAuth } from "../hooks/useAuth";
import { HistoryCard } from "../components/HistoryCard";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import {
  InventoryHistory,
  storageGetInventoryHistory,
} from "../storage/StorageInventoryHistory";
import { formatDate } from "../utils/formatDate";
import { Inventory } from "../shared/types/inventory";

export function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistory[]>(
    []
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
    <VStack className="flex-1">
      <HStack className="items-center rounded-b-xl justify-between px-8 bg-[#2BADA1] h-[68px] w-full">
        <Text className="text-white text-2xl font-poppins-bold">BookTu</Text>
        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
          <Icon as={LogOut} className="text-red-500" size={28} />
        </TouchableOpacity>
      </HStack>
      <VStack className="px-6">
        <HStack className="mt-16 gap-4">
          <Button
            onPress={() => navigate("books")}
            className="bg-[#2BADA1] flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600"
          >
            <Book color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">Livros</Text>
          </Button>
          <Button
            onPress={() => navigate("inventories")}
            className="bg-[#2BADA1] flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600"
          >
            <ClipboardList color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">
              Inventários
            </Text>
          </Button>
          <Button
            onPress={() => navigate("stock")}
            className="bg-[#2BADA1] flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600"
          >
            <Box color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">
              Estoque
            </Text>
          </Button>
        </HStack>
        <Text className="mt-14 text-xl font-poppins-semibold">
          Inventários Recentes
        </Text>

        <FlatList
          className="mt-8"
          data={inventoryHistory}
          keyExtractor={({ id }) => id}
          renderItem={({ item: inventory }) => (
            <HistoryCard
              onPress={() => handleNavigateToInventory(inventory)}
              processed={inventory.status === "processed"}
              establishmentName={inventory.establishment.name}
              date={formatDate(inventory.date)}
              inventoryName={`Inventário - ${inventory.identifier}`}
            />
          )}
          ListEmptyComponent={() => (
            <VStack className="flex-1 items-center justify-center">
              <Text className="text-gray-600 text-lg">
                Nenhum inventário acessado...
              </Text>
            </VStack>
          )}
        />
      </VStack>
    </VStack>
  );
}
