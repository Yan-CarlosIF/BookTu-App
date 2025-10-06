import { TapGesture } from "@components/TapGesture";
import { BookOpen, Tag } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

import { Book } from "../shared/types/book";
import { StockItem } from "../shared/types/stockItem";
import { formatPrice } from "../utils/formatPrice";

type BookCardProps = {
  isBook?: boolean;
  quantity?: number;
  book: Book;
  stock?: StockItem;
  onPress?: () => void;
  isOfflineError?: boolean;
};

export function BookCard({
  stock,
  book,
  onPress,
  isBook = false,
  quantity,
  isOfflineError = false,
}: BookCardProps) {
  function renderCategories() {
    const hasCategories = isBook && book.categories.length > 0;

    return hasCategories ? (
      <HStack className="flex-row flex-wrap items-center gap-1">
        {book.categories.slice(0, 2).map((cat) => (
          <View key={cat.id} className="rounded-full bg-teal-100 px-2 py-0.5">
            <Text className="text-xs font-medium text-teal-700">
              {cat.name}
            </Text>
          </View>
        ))}
        {book.categories.length > 2 && (
          <Text className="text-xs text-gray-400">
            +{book.categories.length - 2}
          </Text>
        )}
      </HStack>
    ) : (
      <HStack className="items-center">
        <Tag size={14} color="#9ca3af" />
        <Text className="ml-1 text-xs text-gray-400">Sem categorias</Text>
      </HStack>
    );
  }

  function renderQuantityAndEstablishment() {
    const hasQuantity = !!quantity;

    const quantityValue = hasQuantity ? quantity : stock?.quantity;

    return (
      <VStack className="">
        <Text className="line-clamp-1 text-ellipsis text-lg font-medium text-gray-800">
          {stock?.stock.establishment.name}
        </Text>
        <Text className="font-poppins-semibold text-base text-gray-600">
          {quantityValue} unidade{quantityValue === 1 ? "" : "s"}
        </Text>
      </VStack>
    );
  }

  return (
    <TapGesture>
      <Pressable
        onPress={!isOfflineError ? onPress : () => {}}
        className="mb-6 h-fit"
        style={{
          borderWidth: 1,
          borderColor: isOfflineError ? "red" : "#D9D9D9",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        <View className="mr-4 h-28 w-20 items-center justify-center overflow-hidden rounded-xl bg-teal-50">
          <BookOpen size={28} color="#0d9488" />
        </View>

        <VStack className="flex-1 justify-between bg-transparent">
          <VStack className="bg-transparent">
            <HStack className="mb-1 items-center">
              <Text
                className="text-base font-bold text-gray-800"
                numberOfLines={2}
              >
                {book.title} •
              </Text>

              <Text className="text-sm text-gray-600" numberOfLines={1}>
                {" "}
                {book.author}
              </Text>
            </HStack>

            <Text className="w-fit font-poppins-semibold text-xl text-teal-700">
              {book.identifier}
            </Text>
          </VStack>

          {isBook && (
            <HStack className="mb-2 flex-row items-center">
              <Text className="text-base font-bold text-teal-600">
                {formatPrice(book.price)}
              </Text>
              <Text className="ml-1 text-sm text-gray-600">
                • {book.release_year}
              </Text>
            </HStack>
          )}

          {isBook ? renderCategories() : renderQuantityAndEstablishment()}
        </VStack>
      </Pressable>
    </TapGesture>
  );
}
