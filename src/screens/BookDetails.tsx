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
import { useRoute } from "@react-navigation/native";
import { useGetBook } from "../useCases/useGetBook";
import { Loading } from "../components/Loading";

export function BookDetails() {
  const { params } = useRoute();

  const { bookId } = params as { bookId: string };

  const { data: book, isFetching } = useGetBook(bookId);

  if (isFetching) return <Loading />;

  return (
    <ScrollView>
      <VStack>
        <Header title="Detalhes do Livro" />
        <VStack className="px-6 mt-7">
          <Text className="text-2xl font-bold font-inter">{book?.title}</Text>
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
              <Text className="text-2xl font-bold ">{book?.identifier}</Text>
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
              <Text className="text-2xl font-bold ">{book?.release_year}</Text>
            </GridItem>
            <GridItem
              className="w-[170px] items-center justify-between h-full max-h-[110px] p-6 bg-teal-300/25 rounded-xl"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <UserPen color="#0f766e" />
                <Text className="text-sm text-gray-800 font-medium">Autor</Text>
              </HStack>
              <Text className="text-2xl font-bold ">{book?.author}</Text>
            </GridItem>
            <GridItem
              className="w-[170px] items-center justify-between h-full max-h-[110px] p-6 bg-teal-300/25 rounded-xl"
              _extra={{ className: "col-span-1" }}
            >
              <HStack className="items-center gap-2">
                <DollarSign color="#0f766e" />
                <Text className="text-sm text-gray-800 font-medium">Preço</Text>
              </HStack>
              <Text className="text-2xl font-bold ">
                {formatPrice(book?.price!)}
              </Text>
            </GridItem>
          </Grid>
          <HStack className="mt-20 gap-[10px] items-center">
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
              <View className="bg-teal-300/25 mr-4 items-center justify-center px-3 py-2 w-[100px] rounded-2xl">
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
