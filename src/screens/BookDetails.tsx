import { VStack } from "@/components/ui/vstack";
import { Header } from "../components/Header";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import {
  Book,
  CalendarDays,
  DollarSign,
  Fingerprint,
  Tag,
  UserPen,
} from "lucide-react-native";
import { formatPrice } from "../utils/formatPrice";

export function BookDetails() {
  return (
    <ScrollView>
      <VStack>
        <Header title="Detalhes do Livro" />
        <VStack className="px-6 mt-7">
          <Text className="text-2xl font-bold font-inter">
            Diário de Anne Frank
          </Text>
          <Grid className="gap-6 mt-9" _extra={{ className: "grid-cols-2" }}>
            <GridItem
              className="w-[170px] items-center justify-between h-full max-h-[110px] p-6 bg-teal-300/25 rounded-xl"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <Fingerprint color="#0f766e" />
                <Text className="text-sm text-gray-800 font-medium">
                  Identificador
                </Text>
              </HStack>
              <Text className="text-2xl font-bold ">1234</Text>
            </GridItem>
            <GridItem
              className="w-[170px] items-center justify-between h-full max-h-[110px] p-6 bg-teal-300/25 rounded-xl"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <CalendarDays color="#0f766e" />
                <Text className="text-sm text-gray-800 font-medium">
                  Ano de lançamento
                </Text>
              </HStack>
              <Text className="text-2xl font-bold ">1992</Text>
            </GridItem>
            <GridItem
              className="w-[170px] items-center justify-between h-full max-h-[110px] p-6 bg-teal-300/25 rounded-xl"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <UserPen color="#0f766e" />
                <Text className="text-sm text-gray-800 font-medium">Autor</Text>
              </HStack>
              <Text className="text-2xl font-bold ">Anne Frank</Text>
            </GridItem>
            <GridItem
              className="w-[170px] items-center justify-between h-full max-h-[110px] p-6 bg-teal-300/25 rounded-xl"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <DollarSign color="#0f766e" />
                <Text className="text-sm text-gray-800 font-medium">Preço</Text>
              </HStack>
              <Text className="text-2xl font-bold ">{formatPrice(39.9)}</Text>
            </GridItem>
          </Grid>
          <HStack className="mt-20 gap-[10px] items-center">
            <Tag color="#0f766e" />
            <Text className="text-xl font-bold text-gray-800">Categorias</Text>
          </HStack>
          <FlatList
            data={["Suspense", "Mistério", "Ficção", "Terror", "Aventura"]}
            horizontal
            keyExtractor={(item) => item}
            className="mt-3"
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: category }) => (
              <View className="bg-teal-300/25 mr-4 items-center justify-center px-3 py-2 w-[100px] rounded-2xl">
                <Text className="text-sm text-teal-700">{category}</Text>
              </View>
            )}
          />
          <Text className="mt-10 text-xl font-bold">Descrição</Text>

          <Text className="font-sm mt-3 text-gray-600 mb-7 text-justify">
            Uma história envolvente que mistura suspense e mistério...
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
