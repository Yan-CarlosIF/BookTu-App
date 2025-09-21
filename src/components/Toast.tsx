import { HStack } from "@/components/ui/hstack";
import { Portal } from "@/components/ui/portal";
import { CheckCircle, CircleAlert, X } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";
import Reanimated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

type ToastProps = {
  visible: boolean;
  onClose: () => void;
  variant: "success" | "error";
  message: string;
  closeButton: boolean;
};

const SUCCESS_COLOR = "bg-[#16a34a]";
const ERROR_COLOR = "bg-[#dc2626]";

export function Toast({
  message,
  visible,
  onClose,
  variant,
  closeButton,
}: ToastProps) {
  const bgColor = variant === "success" ? SUCCESS_COLOR : ERROR_COLOR;

  return (
    <Portal isOpen={visible}>
      <Reanimated.View
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={{ alignItems: "center", marginTop: 20 }}
      >
        <HStack
          className={
            "w-2/3 py-5 px-5 gap-4 rounded-lg flex-row items-center" +
            ` ${bgColor}`
          }
        >
          {closeButton && (
            <TouchableOpacity
              className="h-6 px-1 border-0 absolute top-2 right-2"
              onPress={onClose}
            >
              <X color="white" size={16} />
            </TouchableOpacity>
          )}
          {variant === "success" ? (
            <CheckCircle color="white" size={18} />
          ) : (
            <CircleAlert color="white" size={18} />
          )}
          <Text className="text-white text-base">{message}</Text>
        </HStack>
      </Reanimated.View>
    </Portal>
  );
}
