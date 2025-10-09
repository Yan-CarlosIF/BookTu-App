import { LucideIcon } from "lucide-react-native";
import { Pressable, PressableProps, Text } from "react-native";

import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { TapGesture } from "./TapGesture";

type SyncOptionCardProps = PressableProps & {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function SyncOptionCard({
  description,
  icon,
  title,
  disabled,
  ...rest
}: SyncOptionCardProps) {
  return (
    <TapGesture disabled={disabled}>
      <Pressable
        {...rest}
        disabled={disabled}
        className="flex-row items-center gap-4 rounded-xl border border-teal-700 px-4 py-5 disabled:opacity-70"
      >
        <Icon as={icon} size={24} className="text-teal-600" />
        <VStack>
          <Text className="text-md font-poppins-semibold">{title}</Text>
          <Text className="text-sm font-medium text-gray-600">
            {description}
          </Text>
        </VStack>
      </Pressable>
    </TapGesture>
  );
}
