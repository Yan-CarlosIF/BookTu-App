import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function TapGesture({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap().onStart(() => {
    "worklet";
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View collapsable={false} style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
