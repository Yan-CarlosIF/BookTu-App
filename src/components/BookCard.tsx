import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Info } from "lucide-react-native";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { Book } from "../shared/types/book";
import { formatPrice } from "../utils/formatPrice";

type BookCardProps = TouchableOpacityProps & {
  book: Book;
};

export function BookCard({
  book: { title, release_year, price, identifier, categories },
  onPress,
}: BookCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className="bg-teal-700 flex-col py-2 px-4 rounded-xl justify-start max-h-[130px] mb-12">
        <HStack className="w-full">
          <Text className="font-inter mr-auto text-xl text-white font-medium">
            {title}
          </Text>
          <Info color="white" size={24} />
        </HStack>
        <Text className="font-inter text-white text-[32px]">{identifier}</Text>
        <Text className="text-white">{release_year}</Text>
        <HStack className="w-full justify-between">
          <Text className="text-ellipsis text-white line-clamp-1 max-w-[70%]">
            {categories?.map((category) => category.name).join(", ")}
          </Text>
          <Text className="text-white">{formatPrice(price!)}</Text>
        </HStack>
      </Card>
    </TouchableOpacity>
  );
}
