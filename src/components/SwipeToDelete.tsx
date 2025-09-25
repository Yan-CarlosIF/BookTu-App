import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ReactNode } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Trash } from "lucide-react-native";
import { runOnJS } from "react-native-worklets";

const END_POSITION = 120;
const SCREEN_WIDTH = Dimensions.get("window").width;

type SwipeToDeleteProps = {
  children: ReactNode;
  onDelete: () => void;
};

export function SwipeToDelete({ children, onDelete }: SwipeToDeleteProps) {
  const position = useSharedValue(0);
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      const newX = offset.value + e.translationX;
      position.value = Math.min(0, Math.max(newX, -END_POSITION));
    })
    .onEnd(() => {
      if (position.value < -END_POSITION / 2) {
        position.value = withTiming(-END_POSITION, { duration: 250 });
        offset.value = -END_POSITION;
      } else {
        position.value = withTiming(0, { duration: 250 });
        offset.value = 0;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: -position.value / END_POSITION,
  }));

  const handleDelete = () => {
    // anima o item para fora da tela
    position.value = withTiming(
      SCREEN_WIDTH,
      { duration: 500, easing: Easing.out(Easing.exp) },
      () => {
        // só aqui remove do estado
        runOnJS(onDelete)();
      }
    );
  };

  return (
    <View className="relative">
      {/* BARRA VERMELHA ATRÁS */}
      <Animated.View
        className="absolute right-0 top-0 bottom-0 mb-6 w-[160px] bg-red-500 items-end justify-center rounded-r-2xl"
        style={[backgroundStyle]}
      >
        <TouchableOpacity className="mr-12" onPress={handleDelete}>
          <Trash color="white" size={28} />
        </TouchableOpacity>
      </Animated.View>

      {/* CARD */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle, { borderRadius: 16 }]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
