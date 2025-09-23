import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { BookOpen, Tag } from "lucide-react-native";
import { Book } from "../shared/types/book";
import { formatPrice } from "../utils/formatPrice";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge, BadgeText } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

export function BookCard({ book, onPress }: BookCardProps) {
  const hasCategories = book.categories.length > 0;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <HStack className="bg-white border border-gray-500 rounded-2xl p-4 mb-6 shadow-sm flex-row">
        <View className="bg-teal-50 rounded-xl w-20 h-28 items-center justify-center mr-4 overflow-hidden">
          <BookOpen size={28} color="#0d9488" />
        </View>

        <VStack className="flex-1 justify-between">
          <VStack>
            <HStack className="gap-1 items-center">
              <Text
                className="text-base font-bold text-gray-900 mb-0.5"
                numberOfLines={2}
              >
                {book.title} •
              </Text>
              <Badge className="bg-teal-300/20 rounded-md">
                <BadgeText className="text-teal-700 font-medium">
                  {book.identifier}
                </BadgeText>
              </Badge>
            </HStack>

            <Text className="text-gray-600 text-sm mb-2" numberOfLines={1}>
              {book.author}
            </Text>
          </VStack>

          <HStack className="flex-row items-center mb-2">
            <Text className="text-teal-600 font-bold text-base">
              {formatPrice(book.price)}
            </Text>
            <Text className="text-gray-600 text-sm ml-1">
              • {book.release_year}
            </Text>
          </HStack>

          {hasCategories ? (
            <HStack className="flex-row items-center flex-wrap gap-1">
              {book.categories.slice(0, 2).map((cat) => (
                <View
                  key={cat.id}
                  className="bg-teal-100 px-2 py-0.5 rounded-full"
                >
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
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
