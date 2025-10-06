import { Header } from "@components/Header";
import { Loading } from "@components/Loading";
import { useRoute } from "@react-navigation/native";
import { useGetBook } from "@useCases/Book/useGetBook";
import {
  CalendarDays,
  CloudAlert,
  CloudOff,
  DollarSign,
  Fingerprint,
  Tag,
  UserPen,
} from "lucide-react-native";
import { FlatList, ScrollView, Text, View } from "react-native";

import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { useNetInfo } from "../hooks/useNetInfo";
import { formatPrice } from "../utils/formatPrice";

export function BookDetails() {
  const { isConnected } = useNetInfo();

  const { params } = useRoute();

  const { bookId } = params as { bookId: string };

  const { data: book, isPending } = useGetBook(bookId);

  if (!isConnected) {
    return (
      <>
        <Header title="Detalhes do Livro" />
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Icon as={CloudOff} className="text-teal-700" size={52} />
          <Alert
            variant="solid"
            className="mx-6 mt-4 rounded-md bg-teal-300/20"
          >
            <AlertIcon as={CloudAlert} className="text-teal-700" />
            <AlertText className="ml-1 text-sm text-teal-700">
              É necessário conexão com a internet para acessar os detalhes do
              livro
            </AlertText>
          </Alert>
        </View>
      </>
    );
  }

  if (isPending) return <Loading />;

  return (
    <ScrollView>
      <VStack>
        <Header title="Detalhes do Livro" />
        <VStack className="mt-7 px-6">
          <Text className="font-inter text-2xl font-bold">{book?.title}</Text>
          <Grid className="mt-9 gap-6" _extra={{ className: "grid-cols-2" }}>
            <GridItem
              className="h-full max-h-[110px] w-[170px] items-center justify-between rounded-xl bg-teal-300/25 p-6"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <Fingerprint color="#0f766e" />
                <Text className="text-sm font-medium text-gray-800">
                  Identificador
                </Text>
              </HStack>
              <Text className="text-2xl font-bold">{book?.identifier}</Text>
            </GridItem>
            <GridItem
              className="h-full max-h-[110px] w-[170px] items-center justify-between rounded-xl bg-teal-300/25 p-6"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <CalendarDays color="#0f766e" />
                <Text className="text-sm font-medium text-gray-800">
                  Ano de lançamento
                </Text>
              </HStack>
              <Text className="text-2xl font-bold">{book?.release_year}</Text>
            </GridItem>
            <GridItem
              className="h-full max-h-[110px] w-[170px] items-center justify-between rounded-xl bg-teal-300/25 p-6"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <UserPen color="#0f766e" />
                <Text className="text-sm font-medium text-gray-800">Autor</Text>
              </HStack>
              <Text className="text-2xl font-bold">{book?.author}</Text>
            </GridItem>
            <GridItem
              className="h-full max-h-[110px] w-[170px] items-center justify-between rounded-xl bg-teal-300/25 p-6"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <DollarSign color="#0f766e" />
                <Text className="text-sm font-medium text-gray-800">Preço</Text>
              </HStack>
              <Text className="text-2xl font-bold">
                {formatPrice(book?.price!)}
              </Text>
            </GridItem>
          </Grid>
          <HStack className="mt-20 items-center gap-[10px]">
            <Tag color="#0f766e" />
            <Text className="text-xl font-bold text-gray-800">Categorias</Text>
          </HStack>
          <FlatList
            data={book?.categories.map((category) => category.name)}
            horizontal
            keyExtractor={(item) => item}
            className="mt-3"
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: category }) => (
              <View className="mr-4 w-fit items-center justify-center rounded-2xl bg-teal-300/25 px-3 py-2">
                <Text className="text-sm text-teal-700">{category}</Text>
              </View>
            )}
          />
          <Text className="mt-10 text-xl font-bold">Descrição</Text>

          <Text
            className={`font-sm mt-3 ${
              book?.description ? "text-gray-800" : "text-gray-600"
            } mb-7 text-justify`}
          >
            {book?.description ?? "Livro não possui descrição..."}
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
