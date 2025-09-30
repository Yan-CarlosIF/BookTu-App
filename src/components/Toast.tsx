import { CheckCircle, CircleAlert } from "lucide-react-native";
import { useEffect } from "react";
import { Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { HStack } from "@/components/ui/hstack";
import { Portal } from "@/components/ui/portal";

type ToastProps = {
  visible: boolean;
  onClose: () => void;
  variant: "success" | "error";
  message: string;
};

const SUCCESS_COLOR = "bg-[#16a34a]";
const ERROR_COLOR = "bg-[#dc2626]";

export function Toast({ message, visible, onClose, variant }: ToastProps) {
  const bgColor = variant === "success" ? SUCCESS_COLOR : ERROR_COLOR;
  const translateY = useSharedValue(0);

  function handleSwipeUp() {
    onClose();
  }

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value < -20) {
        // Se arrastou mais de 20px para cima → fecha
        runOnJS(handleSwipeUp)();
      } else {
        // Volta para posição original
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Reset translateY quando o toast ficar visível
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
    }
  }, [visible, translateY]);

  if (!visible) return null;

  return (
    <Portal isOpen={visible}>
      <GestureDetector gesture={pan}>
        <Reanimated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={{
            alignItems: "center",
            marginTop: 20,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <Reanimated.View style={animatedStyle}>
            <HStack
              className={`w-fit py-5 px-5 gap-3 rounded-lg flex-row items-center ${bgColor}`}
            >
              {variant === "success" ? (
                <CheckCircle color="white" size={18} />
              ) : (
                <CircleAlert color="white" size={18} />
              )}
              <Text className="text-white text-base">{message}</Text>
            </HStack>
          </Reanimated.View>
        </Reanimated.View>
      </GestureDetector>
    </Portal>
  );
}
