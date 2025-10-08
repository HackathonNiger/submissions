import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HealthInfoStep from "./HealthInfoStep";

const { width } = Dimensions.get("window");

const steps = [
  { key: "healthinfo", component: HealthInfoStep },
  // Add more steps here if needed in the future
];

export default function HealthInfoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const goToStep = (index) => {
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      goToStep(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      goToStep(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient
        colors={["#B5FFFC", "#FFDEE9"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      {/* Pagination dots at the top inside the bg */}
      <View className="flex-row justify-center items-center pt-8 pb-4 z-10">
        {steps.map((_, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor:
                currentIndex === idx
                  ? "rgba(252, 252, 252, 1)"
                  : "rgba(143, 141, 141, 1)",
              width: currentIndex === idx ? 12 : 10,
              height: currentIndex === idx ? 12 : 10,
            }}
            className="mx-1 rounded-full"
          />
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={steps}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          const StepComponent = item.component;
          return (
            <View style={{ width }} className="flex-1">
              <StepComponent
                onNext={handleNext}
                onBack={handleBack}
                currentIndex={currentIndex}
                steps={steps}
              />
            </View>
          );
        }}
        extraData={currentIndex}
        style={{ zIndex: 1 }}
      />
    </SafeAreaView>
  );
}
