import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TapGestureProps = {
  children: React.ReactNode;
  disabled?: boolean | null;
};

export function TapGesture({ children, disabled = false }: TapGestureProps) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onStart(() => {
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
