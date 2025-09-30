import { Pressable, Text } from "react-native";
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  Building2,
} from "lucide-react-native";
import { formatDate } from "../utils/formatDate";
import { InventoryHistory } from "../storage/StorageInventoryHistory";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { TapGesture } from "./TapGesture";

interface HistoryCardProps {
  item: InventoryHistory;
  onPress?: () => void;
}

export default function HistoryCard({ item, onPress }: HistoryCardProps) {
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
        className="bg-white rounded-xl shadow-lg p-4 mb-5 border border-gray-500"
        onPress={onPress}
      >
        {/* Header with ID and Status */}
        <HStack className=" justify-between items-start mb-3">
          <HStack className="flex-row items-center">
            <Icon as={Package} size={18} className="mr-2 text-[#2BADA1]" />
            <Text
              className="text-lg font-poppins-semibold text-gray-800"
              numberOfLines={1}
            >
              Inventário - {item.identifier}
            </Text>
          </HStack>

          <HStack
            className={`px-2 py-1 w-32 rounded-full border justify-center items-center ${getStatusColor(
              item.status
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
        <HStack className=" items-center mb-3">
          <Icon as={Building2} size={16} color="#2BADA1" className="mr-2" />
          <Text className="text-gray-800" numberOfLines={1}>
            {item.establishment.name}
          </Text>
        </HStack>

        {/* Date */}
        <HStack className="border-t border-gray-100 pt-3 items-center">
          <Icon as={Calendar} size={14} color="#2BADA1" className="mr-2" />
          <Text className="text-sm text-gray-800">
            Acessado em:{" "}
            <Text className="text-[#2BADA1] font-medium">
              {formatDate(item.date)}
            </Text>
          </Text>
        </HStack>
      </Pressable>
    </TapGesture>
  );
}
