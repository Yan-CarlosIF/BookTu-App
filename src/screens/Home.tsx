import { VStack } from "@/components/ui/vstack";
import { TouchableOpacity, Text, FlatList } from "react-native";
import { HStack } from "@/components/ui/hstack";
import {
  Book,
  Box,
  ChevronRight,
  ClipboardList,
  LogOut,
  Zap,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function Home() {
  const { logout } = useContext(AuthContext);

  async function handleLogout() {
    await logout();
  }

  return (
    <VStack className="flex-1">
      <HStack className="items-center justify-between px-8 bg-teal-700 h-[68px] w-full">
        <Text className="text-white text-2xl font-poppins-bold">BookTu</Text>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <LogOut color="red" size={28} />
        </TouchableOpacity>
      </HStack>
      <VStack className="px-6">
        <HStack className="mt-16 gap-4">
          <Button className="bg-teal-700 flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600">
            <Book color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">Livros</Text>
          </Button>
          <Button className="bg-teal-700 flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600">
            <ClipboardList color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">
              Inventários
            </Text>
          </Button>
          <Button className="bg-teal-700 flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600">
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
          data={[
            { id: 1, processed: false },
            { id: 2, processed: true },
            { id: 3, processed: false },
          ]}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item: { processed } }) => (
            <Button className="mb-8 border border-teal-400 justify-start flex h-[112px] w-full bg-teal-300/15 p-6 rounded-[10px] data-[active=true]:bg-teal-500/15 data-[active=true]:border-teal-500">
              <VStack className="mr-auto">
                <HStack className="gap-3">
                  <Text className="text-sm text-gray-800 font-poppins-semibold">
                    Armazém central
                  </Text>
                  <Text className="text-sm text-teal-600 font-poppins-semibold">
                    20/09/2025
                  </Text>
                </HStack>
                <Text className="text-2xl font-poppins-bold text-gray-800">
                  Inventário 1 - 1234
                </Text>
                <Zap
                  color={processed ? "teal" : "gray"}
                  fill={processed ? "teal" : "gray"}
                  size={16}
                />
              </VStack>
              <ChevronRight size={24} color="#2E2E2E" className="self-center" />
            </Button>
          )}
        />
      </VStack>
    </VStack>
  );
}
