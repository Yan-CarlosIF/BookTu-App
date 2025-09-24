import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, Tag } from "lucide-react-native";
import { Book } from "../shared/types/book";
import { formatPrice } from "../utils/formatPrice";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { StockItem } from "../shared/types/stockItem";

type BookCardProps = {
  isBook?: boolean;
  book: Book;
  stock?: StockItem;
  onPress?: () => void;
};

export function BookCard({ stock, book, onPress, isBook = false }: BookCardProps) {
  function renderCategories() {
    const hasCategories = isBook && book.categories.length > 0;

    return hasCategories ? (
      <HStack className="flex-row items-center flex-wrap gap-1">
        {book.categories.slice(0, 2).map((cat) => (
          <View key={cat.id} className="bg-teal-100 px-2 py-0.5 rounded-full">
            <Text className="text-teal-700 text-xs font-medium">
              {cat.name}
            </Text>
          </View>
        ))}
        {book.categories.length > 2 && (
          <Text className="text-gray-400 text-xs">
            +{book.categories.length - 2}
          </Text>
        )}
      </HStack>
    ) : (
      <HStack className="items-center">
        <Tag size={14} color="#9ca3af" />
        <Text className="text-gray-400 text-xs ml-1">Sem categorias</Text>
      </HStack>
    );
  }

  function renderQuantityAndEstablishment() {
    return (
      <VStack className="">
        <Text className="text-gray-800 font-medium text-ellipsis line-clamp-1 text-lg">
          {stock?.stock.establishment.name}
        </Text>
        <Text className="text-gray-600 font-poppins-semibold text-base">
          {stock?.quantity} unidades
        </Text>
      </VStack>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={isBook ? 0.7 : 1}
      disabled={!isBook}
      onPress={onPress}
    >
      <HStack className="bg-white border border-gray-500 rounded-2xl p-4 mb-6 shadow-sm flex-row">
        <View className="bg-teal-50 rounded-xl w-20 h-28 items-center justify-center mr-4 overflow-hidden">
          <BookOpen size={28} color="#0d9488" />
        </View>

        <VStack className="flex-1 justify-between">
          <VStack>
            <HStack className="items-center mb-1">
              <Text
                className="text-base font-bold text-gray-800"
                numberOfLines={2}
              >
                {book.title} •
              </Text>

              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                {" "}
                {book.author}
              </Text>
            </HStack>

            <Text className="text-teal-700 font-poppins-semibold text-xl w-fit">
              {book.identifier}
            </Text>
          </VStack>

          {isBook && (
            <HStack className="flex-row items-center mb-2">
              <Text className="text-teal-600 font-bold text-base">
                {formatPrice(book.price)}
              </Text>
              <Text className="text-gray-600 text-sm ml-1">
                • {book.release_year}
              </Text>
            </HStack>
          )}

          {isBook ? renderCategories() : renderQuantityAndEstablishment()}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
