import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Zap, ChevronRight } from "lucide-react-native";
import { Button } from "./Button";
import { Text } from "react-native";

type HistoryCardProps = {
  processed: boolean;
  establishmentName: string;
  date: string;
  inventory: {
    name: string;
    identifier: string;
  };
};

export function HistoryCard({
  date,
  establishmentName,
  inventory,
  processed,
}: HistoryCardProps) {
  return (
    <Button className="mb-8 border border-teal-400 justify-start flex h-[120px] w-full bg-teal-300/15 p-6 rounded-[10px] data-[active=true]:bg-teal-500/15 data-[active=true]:border-teal-500">
      <VStack className="mr-auto">
        <HStack className="gap-3">
          <Text className="text-sm text-gray-800 font-poppins-semibold">
            {establishmentName}
          </Text>
          <Text className="text-sm text-teal-600 font-poppins-semibold">
            {date}
          </Text>
        </HStack>
        <Text className="text-2xl mb-2 font-poppins-bold text-gray-800">
          {inventory.name} - {inventory.identifier}
        </Text>
        <Zap
          color={processed ? "teal" : "gray"}
          fill={processed ? "teal" : "gray"}
          size={18}
        />
      </VStack>
      <ChevronRight size={24} color="#2E2E2E" className="self-center" />
    </Button>
  );
}
