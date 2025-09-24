import { View, Text, Pressable } from "react-native";
import { Package, MapPin, Building2, Tag } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Inventory } from "../shared/types/inventory";

type InventoryCardProps = {
  inventory: Inventory;
};

export function InventoryCard({ inventory }: InventoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "unprocessed":
        return "bg-gray-100 border-gray-500";
      case "processed":
        return "bg-teal-100 border-teal-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "unprocessed":
        return "Pendente";
      case "processed":
        return "Processado";
      default:
        return status;
    }
  };

  return (
    <Pressable className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-500">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <HStack className="gap-2 items-center">
            <Package size={18} color="#2BADA1" className="mr-2" />
            <Text
              className="text-2xl font-bold text-gray-800"
              numberOfLines={1}
            >
              {inventory.identifier}
            </Text>
          </HStack>
        </View>

        <View
          className={`px-3 py-1 rounded-full border ${getStatusColor(
            inventory.status
          )}`}
        >
          <Text
            className={`text-xs font-medium ${
              inventory.status === "processed"
                ? "text-teal-700"
                : "text-gray-600"
            }`}
          >
            {getStatusText(inventory.status)}
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-800">
          Quantidade Total:
        </Text>
        <Text className="text-lg text-gray-800">
          <Text className="text-teal-600 text-xl font-bold">
            {inventory.total_quantity}
          </Text>{" "}
          Produtos
        </Text>
      </View>

      <VStack className="border-t border-gray-500 pt-3">
        <HStack className="gap-2 items-center mb-2">
          <Building2 size={16} color="#0d9488" className="mr-2" />
          <Text className="font-semibold text-sm text-gray-800">
            {inventory.establishment.name}
          </Text>
        </HStack>

        <HStack className="gap-2 items-center mb-1">
          <MapPin size={16} color="#0d9488" className="mr-2" />
          <Text className="text-sm font-medium text-gray-800">
            {inventory.establishment.city}, {inventory.establishment.state}
          </Text>
        </HStack>

        <HStack className="gap-2 items-center">
          <Tag size={16} color="#0d9488" className="mr-2" />
          <Text className="text-sm font-medium text-gray-800">
            CNPJ: {inventory.establishment.cnpj}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
}
