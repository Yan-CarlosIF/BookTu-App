import { VStack } from "@/components/ui/vstack";
import { TouchableOpacity, Text, FlatList } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Book, Box, ClipboardList, LogOut } from "lucide-react-native";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";
import { useAuth } from "../hooks/useAuth";
import { HistoryCard } from "../components/HistoryCard";

export function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const { signOut } = useAuth();

  const handleSignOut = async () => await signOut();

  return (
    <VStack className="flex-1">
      <HStack className="items-center justify-between px-8 bg-teal-700 h-[68px] w-full">
        <Text className="text-white text-2xl font-poppins-bold">BookTu</Text>
        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
          <LogOut color="red" size={28} />
        </TouchableOpacity>
      </HStack>
      <VStack className="px-6">
        <HStack className="mt-16 gap-4">
          <Button
            onPress={() => navigate("books")}
            className="bg-teal-700 flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600"
          >
            <Book color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">Livros</Text>
          </Button>
          <Button
            isDisabled
            className="bg-teal-700 flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600"
          >
            <ClipboardList color="white" size={24} />
            <Text className="text-sm font-poppins mt-3 text-white">
              Inventários
            </Text>
          </Button>
          <Button
            isDisabled
            className="bg-teal-700 flex flex-col rounded-2xl w-[110px] h-[100px] items-center justify-center data-[active=true]:bg-teal-600"
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
          data={[
            { id: 1, processed: false },
            { id: 2, processed: true },
            { id: 3, processed: false },
          ]}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item: { processed } }) => (
            <HistoryCard
              processed={processed}
              establishmentName="Armazém central"
              date="20/09/2025"
              inventory={{ name: "Inventário 1", identifier: "1234" }}
            />
          )}
        />
      </VStack>
    </VStack>
  );
}
