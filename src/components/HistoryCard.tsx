import { TapGesture } from "@components/TapGesture";
import { InventoryHistory } from "@storage/StorageInventoryHistory";
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

import { formatDate } from "../utils/formatDate";

interface HistoryCardProps {
  item: InventoryHistory;
  onPress?: () => void;
}

export function HistoryCard({ item, onPress }: HistoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-teal-100 border-teal-300";
      case "unprocessed":
        return "bg-amber-100 border-amber-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle size={14} color="#2BADA1" />;
      case "unprocessed":
        return <Clock size={14} color="#F59E0B" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processed":
        return "Processado";
      case "unprocessed":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <TapGesture>
      <Pressable
        className="mb-5 rounded-xl border border-gray-500 bg-white p-4 shadow-lg"
        onPress={onPress}
      >
        {/* Header with ID and Status */}
        <HStack className="mb-3 items-start justify-between">
          <HStack className="flex-row items-center">
            <Icon as={Package} size={18} className="mr-2 text-[#2BADA1]" />
            <Text
              className="font-poppins-semibold text-lg text-gray-800"
              numberOfLines={1}
            >
              Inventário - {item.identifier}
            </Text>
          </HStack>

          <HStack
            className={`w-32 items-center justify-center rounded-full border px-2 py-1 ${getStatusColor(
              item.status,
            )}`}
          >
            {getStatusIcon(item.status)}
            <Text
              className={`text-xs font-medium ${
                item.status === "processed" ? "text-teal-700" : "text-amber-600"
              } ml-2`}
            >
              {getStatusText(item.status)}
            </Text>
          </HStack>
        </HStack>

        {/* Establishment Name */}
        <HStack className="mb-3 items-center">
          <Icon as={Building2} size={16} color="#2BADA1" className="mr-2" />
          <Text className="text-gray-800" numberOfLines={1}>
            {item.establishment.name}
          </Text>
        </HStack>

        {/* Date */}
        <HStack className="items-center border-t border-gray-100 pt-3">
          <Icon as={Calendar} size={14} color="#2BADA1" className="mr-2" />
          <Text className="text-sm text-gray-800">
            Acessado em:{" "}
            <Text className="font-medium text-[#2BADA1]">
              {formatDate(item.date)}
            </Text>
          </Text>
        </HStack>
      </Pressable>
    </TapGesture>
  );
}
