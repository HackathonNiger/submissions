import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../utils/translator";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  // Translate all text
  const slide1Text = useTranslation(
    "Your pregnancy journey guided with care and love"
  );
  const slide2Text = useTranslation(
    "Together with your partner every step of the way"
  );
  const signUpText = useTranslation("Sign Up");
  const logInText = useTranslation("Log In");

  const slides = [
    {
      key: "1",
      title: slide1Text,
      image: require("../assets/images/Pregnantblackwoman.png"),
    },
    {
      key: "2",
      title: slide2Text,
      image: require("../assets/images/Husbandandwife.png"),
    },
  ];

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={{ width }} className="flex-1 items-center justify-center px-5">
      <Image
        source={item.image}
        className="w-[500px] h-[450px] mb-5"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-center w-11/12 mb-4">
        {item.title}
      </Text>
    </View>
  );

  // Automatic slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % slides.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient
        colors={["#B5FFFC", "#FFDEE9"]}
        style={{
          height: "120%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      {/* Logo */}
      <View className="mt-5 ml-5 items-start">
        <Image
          source={require("../assets/images/AyomamaLogo.png")}
          className="w-24 h-24"
          resizeMode="contain"
        />
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />

      {/*Pagination Dots */}
      <View className="flex-row justify-center items-center mt-4">
        {slides.map((_, dotIndex) => (
          <View
            key={dotIndex}
            className={`mx-1 rounded-full ${
              currentIndex === dotIndex
                ? "bg-black w-3 h-3"
                : "bg-gray-300 w-2.5 h-2.5"
            }`}
          />
        ))}
      </View>

      {/* Buttons */}
      <View className="flex-row justify-center gap-4 mb-8 mt-6">
        <TouchableOpacity
          className="bg-black py-3 px-8 rounded-full"
          onPress={() => router.push("/AccountSelection?action=signup")}
        >
          <Text className="text-white text-base font-bold">{signUpText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border-2 border-black py-3 px-8 rounded-full"
          onPress={() => router.push("/AccountSelection?action=login")}
        >
          <Text className="text-black text-base font-bold">{logInText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
