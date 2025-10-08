import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = animate(dot1, 0);
    const animation2 = animate(dot2, 200);
    const animation3 = animate(dot3, 400);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [dot1, dot2, dot3]);

  const translateY1 = dot1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const translateY2 = dot2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const translateY3 = dot3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View className="flex-row items-center justify-center space-x-1 py-2">
      <Animated.View
        style={{
          transform: [{ translateY: translateY1 }],
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#006D5B",
          marginHorizontal: 2,
        }}
      />
      <Animated.View
        style={{
          transform: [{ translateY: translateY2 }],
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#006D5B",
          marginHorizontal: 2,
        }}
      />
      <Animated.View
        style={{
          transform: [{ translateY: translateY3 }],
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#006D5B",
          marginHorizontal: 2,
        }}
      />
    </View>
  );
}
