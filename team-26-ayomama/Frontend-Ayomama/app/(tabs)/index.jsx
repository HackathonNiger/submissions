import {
  Tabs,
  TabsTab,
  TabsTabList,
  TabsTabPanel,
  TabsTabPanels,
  Text,
} from "@gluestack-ui/themed";
import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../store/useAuthStore";
import { useTranslation } from "../../utils/translator";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [isChecked, setChecked] = useState({
    supplement: false,
    water: false,
    walk: false,
    clinic: false,
  });

  // Translate all UI text
  const helloText = useTranslation("Hello");
  const weekText = useTranslation("Week 18");
  const babyDescText = useTranslation(
    "Your baby is now about the size of a bell pepper"
  );
  const babyTipText = useTranslation(
    "This week, consider talking to your baby. They can hear you now!"
  );
  const dailyChecklistText = useTranslation("Daily Checklist");
  const takeIronText = useTranslation("Take iron supplements");
  const drinkWaterText = useTranslation("Drink 8 glasses of water");
  const walkText = useTranslation("30 mins walk");
  const clinicVisitText = useTranslation("Schedule clinic visit");
  const vitalsOverviewText = useTranslation("Vitals Overview");
  const bloodPressureText = useTranslation("Blood Pressure");
  const weightText = useTranslation("Weight");
  const temperatureText = useTranslation("Temperature");
  const bloodLevelText = useTranslation("Blood Level");
  const updateVitalsText = useTranslation("Update Vitals");
  const upcomingVisitText = useTranslation("Upcoming Visit");
  const antenatalCheckupText = useTranslation("Antenatal Check-up");
  const viewDetailsText = useTranslation("View Details");
  const addToCalendarText = useTranslation("Add to Calendar");
  const emergencyContactText = useTranslation("Emergency Contact");
  const needHelpText = useTranslation("Need Help?");
  const callHospitalText = useTranslation("Call Hospital");
  const callFamilyText = useTranslation("Call Family");
  const callFriendText = useTranslation("Call Friend");
  const wellnessActivitiesText = useTranslation("Wellness Activities");
  const prenatalYogaText = useTranslation("Prenatal Yoga");
  const minsSessionText = useTranslation("15 mins session");
  const breathingText = useTranslation("Breathing");
  const minsExerciseText = useTranslation("5 mins exercise");
  const meditationText = useTranslation("Meditation");
  const tenMinsSessionText = useTranslation("10 mins session");
  const sleepStoriesText = useTranslation("Sleep Stories");
  const fifteenMinsSessionText = useTranslation("15 mins session");
  const startText = useTranslation("Start");
  const nutritionTodayText = useTranslation("Nutrition Today");
  const breakfastText = useTranslation("Breakfast");
  const lunchText = useTranslation("Lunch");
  const dinnerText = useTranslation("Dinner");
  const babyDevelopmentText = useTranslation("Baby's Development");
  const weekMilestonesText = useTranslation("Week 18 Milestones");
  const babyCanHearText = useTranslation("Your baby can now hear sounds.🎉");
  const fingerToesText = useTranslation(
    "Your baby's finger and toes are growing.🎉"
  );
  const babyMoveText = useTranslation("Your baby can move actively.🎉");
  const learnMoreWeekText = useTranslation("Learn more about week 18");
  const learnMoreText = useTranslation("Learn more about week 18");
  const milestone1Text = useTranslation("Your babay can now hear sounds.🎉");
  const milestone2Text = useTranslation(
    "Your baby's finger and toes are growing.🎉"
  );
  const milestone3Text = useTranslation("Your baby can move actively.🎉");

  // Handle checklist completion
  const handleChecklistComplete = (item) => {
    setChecked((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));

    // Show success toast when checked
    if (!isChecked[item]) {
      Toast.show({
        type: "success",
        text1: "Task Completed! ✅",
        text2: `Great job completing your ${getTaskName(item)}!`,
        position: "top",
      });
    }
  };

  const getTaskName = (item) => {
    const taskNames = {
      supplement: "iron supplement",
      water: "water intake",
      walk: "walking exercise",
      clinic: "clinic visit reminder",
    };
    return taskNames[item] || "task";
  };

  // Handle wellness activity start
  const handleWellnessStart = (activity) => {
    Toast.show({
      type: "info",
      text1: `${activity} Started `,
      text2: "Enjoy your wellness session!",
      position: "top",
    });

    // Navigate to activity screen or start timer
    // router.push(`/wellness/${activity}`);
  };

  // Handle emergency calls
  const handleEmergencyCall = (contact) => {
    Alert.alert(
      `Call ${contact.name}?`,
      `Are you sure you want to call ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${contact.phone}`).catch(() => {
              Toast.show({
                type: "error",
                text1: callFailedText,
                text2: unableToCallText,
                position: "top",
              });
            });
          },
        },
      ]
    );
  };

  const emergencyContacts = user?.emergencyContact || [];

  const groupedContacts = emergencyContacts.reduce((acc, contact) => {
    const { type } = contact;
    if (!acc[type]) acc[type] = [];
    acc[type].push(contact);
    return acc;
  }, {});

  // Handle view details navigation
  const handleViewDetails = () => {
    router.push("/(tabs)/visit");
  };

  // Handle add to calendar
  const handleAddToCalendar = () => {
    router.push("/visit/visitInput");
  };

  // Handle learn more about baby development
  const handleLearnMore = () => {
    router.push("/babyDevelopment");
    Toast.show({
      type: "info",
      text1: "Baby Development 🍼",
      text2: "Learning about week 18 milestones",
      position: "top",
    });
  };

  // Handle nutrition tab change
  const handleNutritionTabChange = (meal) => {
    Toast.show({
      type: "info",
      text1: `${meal.charAt(0).toUpperCase() + meal.slice(1)} Menu`,
      text2: `Viewing ${meal} nutrition options`,
      position: "top",
    });
  };

  return (
    <View className="flex-1 bg-[#FCFCFC]">
      {/* Fixed Header */}
      <View
        className="bg-white"
        style={{
          paddingTop: ios ? 50 : (StatusBar.currentHeight || 0) + 16,
          paddingBottom: 16,
          paddingHorizontal: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Image
              source={require("../../assets/images/profilepic.png")}
              style={{ width: 40, height: 40 }}
              className="rounded-full"
            />
          </TouchableOpacity>
          <View className="flex-1 items-center mx-4">
            <Text className="text-gray-500 text-sm">{helloText}</Text>
            <Text className="text-[#293231] text-lg font-bold">
              {user?.name || "Guest"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <Icon name="notifications" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.05 }}
      >
        <View
          style={{ paddingHorizontal: width * 0.06, paddingTop: height * 0.03 }}
          className="flex flex-col gap-10"
        >
          {/* Baby Development Info */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/babyDevelopment/development")}
          >
            <LinearGradient
              colors={["#FBE9E2", "#A5DFD7"]}
              style={{
                borderRadius: 28,
                height: 233,
                padding: 15,
              }}
            >
              <View className="border-[0.9px] border-[#FF7F50] h-[203px] rounded-2xl py-[10px] px-[8px]">
                <View className="bg-[#FCFCFC] w-[108px] rounded-2xl flex  px-[13px] py-[10px] mb-3 ">
                  <Text className="text-[#293231] text-[20px] text-center leading-[100%] font-semibold">
                    {weekText}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-[#293231] text-base text-[14px] leading-6">
                      {babyDescText}
                      {"\n"}
                      {"\n"}
                      {babyTipText}
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/infant.png")}
                    style={{ width: 100, height: 134 }}
                    className="ml-4"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Daily Checklist */}
          <LinearGradient
            colors={["#FBE9E2", "#A5DFD7"]}
            style={{
              borderRadius: 20,
              height: 384,
              padding: 20,
            }}
            className="shadow-lg shadow-black/25"
          >
            <Text className="text-xl font-bold text-gray-900 mb-4">
              {dailyChecklistText}
            </Text>

            <View className="flex flex-col gap-6">
              {/* Checklist Item 1 */}
              <TouchableOpacity
                style={{ height: 60, borderRadius: 28 }}
                className="flex-row items-center bg-[#FCFCFC] rounded-2xl shadow-sm border px-[10px] py-[5px] border-[#FCFCFC]"
                onPress={() => handleChecklistComplete("supplement")}
                activeOpacity={0.7}
              >
                <View className="flex flex-row gap-3 items-center">
                  <Image
                    source={require("../../assets/images/ironSupplement.png")}
                    style={{ width: 45, height: 50 }}
                  />
                  <Text className="text-[#293231] text-base flex-1">
                    {takeIronText}
                  </Text>
                </View>
                <Checkbox
                  value={isChecked.supplement}
                  onValueChange={() => handleChecklistComplete("supplement")}
                  style={{ width: 17, height: 17, marginLeft: -20 }}
                />
              </TouchableOpacity>

              {/* Checklist Item 2 */}
              <TouchableOpacity
                style={{ height: 60, borderRadius: 28 }}
                className="flex-row items-center bg-[#FCFCFC] rounded-2xl shadow-sm border px-[10px] py-[5px] border-[#FCFCFC]"
                onPress={() => handleChecklistComplete("water")}
                activeOpacity={0.7}
              >
                <View className="flex flex-row gap-3 items-center">
                  <Image
                    source={require("../../assets/images/water.png")}
                    style={{ width: 45, height: 50 }}
                  />
                  <Text className="text-[#293231] text-base flex-1">
                    {drinkWaterText}
                  </Text>
                </View>
                <Checkbox
                  value={isChecked.water}
                  onValueChange={() => handleChecklistComplete("water")}
                  style={{ width: 17, height: 17, marginLeft: -20 }}
                />
              </TouchableOpacity>

              {/* Checklist Item 3 */}
              <TouchableOpacity
                style={{ height: 60, borderRadius: 28 }}
                className="flex-row items-center bg-[#FCFCFC] rounded-2xl shadow-sm border px-[10px] py-[5px] border-[#FCFCFC]"
                onPress={() => handleChecklistComplete("walk")}
                activeOpacity={0.7}
              >
                <View className="flex flex-row gap-3 items-center">
                  <Image
                    source={require("../../assets/images/shoe.png")}
                    style={{ width: 45, height: 50 }}
                  />
                  <Text className="text-[#293231] text-base flex-1">
                    {walkText}
                  </Text>
                </View>
                <Checkbox
                  value={isChecked.walk}
                  onValueChange={() => handleChecklistComplete("walk")}
                  style={{ width: 17, height: 17, marginLeft: -20 }}
                />
              </TouchableOpacity>

              {/* Checklist Item 4 */}
              <TouchableOpacity
                style={{ height: 60, borderRadius: 28 }}
                className="flex-row items-center bg-[#FCFCFC] rounded-2xl shadow-sm border px-[10px] py-[5px] border-[#FCFCFC]"
                onPress={() => handleChecklistComplete("clinic")}
                activeOpacity={0.7}
              >
                <View className="flex flex-row gap-3 items-center">
                  <Image
                    source={require("../../assets/images/clinic.png")}
                    style={{ width: 45, height: 50 }}
                  />
                  <Text className="text-[#293231] text-base flex-1">
                    {clinicVisitText}
                  </Text>
                </View>
                <Checkbox
                  value={isChecked.clinic}
                  onValueChange={() => handleChecklistComplete("clinic")}
                  style={{ width: 17, height: 17, marginLeft: -20 }}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Your Vitals Overview */}
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-4">
              {vitalsOverviewText}
            </Text>

            {/* Vitals Image */}
            <LinearGradient
              colors={["#FBE9E2", "#A5DFD7"]}
              style={{
                borderRadius: 16,
                height: 200,
                marginBottom: 16,
                overflow: "hidden",
              }}
              className="items-center justify-center"
            >
              <Image
                source={require("../../assets/images/vitals.png")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* Vitals Grid - 2x2 */}
            <View className="flex flex-col gap-4">
              {/* First Row */}
              <View className="flex flex-row gap-4">
                {/* Blood Pressure */}
                <View
                  className="flex-1 bg-[#DCFBF6] rounded-2xl p-4"
                  style={{ height: 100 }}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-[#EF476F] rounded-full items-center justify-center mr-2">
                      <Icon name="favorite" size={14} color="#fff" />
                    </View>
                    <Text className="text-[#293231] text-sm font-semibold">
                      {bloodPressureText}
                    </Text>
                  </View>
                  <Text className="text-[#293231] text-lg font-bold">
                    120/80mmHg
                  </Text>
                </View>

                {/* Weight */}
                <View
                  className="flex-1 bg-[#DCFBF6] rounded-2xl p-4"
                  style={{ height: 100 }}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-[#293231] rounded-full items-center justify-center mr-2">
                      <Icon name="monitor-weight" size={14} color="#fff" />
                    </View>
                    <Text className="text-[#293231] text-sm font-semibold">
                      {weightText}
                    </Text>
                  </View>
                  <Text className="text-[#293231] text-lg font-bold">
                    65KKg
                  </Text>
                </View>
              </View>

              {/* Second Row */}
              <View className="flex flex-row gap-4">
                {/* Temperature */}
                <View
                  className="flex-1 bg-[#DCFBF6] rounded-2xl p-4"
                  style={{ height: 100 }}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-[#293231] rounded-full items-center justify-center mr-2">
                      <Icon name="thermostat" size={14} color="#fff" />
                    </View>
                    <Text className="text-[#293231] text-sm font-semibold">
                      {temperatureText}
                    </Text>
                  </View>
                  <Text className="text-[#293231] text-lg font-bold">
                    36.8°C
                  </Text>
                </View>

                {/* Blood Level */}
                <View
                  className="flex-1 bg-[#DCFBF6] rounded-2xl p-4"
                  style={{ height: 100 }}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-[#EF476F] rounded-full items-center justify-center mr-2">
                      <Icon name="bloodtype" size={14} color="#fff" />
                    </View>
                    <Text className="text-[#293231] text-sm font-semibold">
                      {bloodLevelText}
                    </Text>
                  </View>
                  <Text className="text-[#293231] text-lg font-bold">
                    12.5g/dl
                  </Text>
                </View>
              </View>
            </View>

            {/* Update Visit Button */}
            <TouchableOpacity
              style={{ height: 50, borderRadius: 15 }}
              className="bg-[#006D5B] rounded-2xl justify-center items-center mt-4"
              onPress={() => router.push("/updateVitals/update")}
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold text-base">
                {updateVitalsText}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Clinic Visit Reminder */}
          <View
            style={{ height: 388, borderRadius: 30, borderColor: "#FF7F5080" }}
            className="rounded-2xl px-[25px] py-[28px] border flex flex-col gap-4 border-[#FFD1D1]"
          >
            <View className="flex flex-row items-center gap-3">
              <Icon name="calendar-month" size={24} />
              <Text className="text-[#293231] text-[24px] leading-[100%] font-bold mb-2">
                {upcomingVisitText}
              </Text>
            </View>

            <LinearGradient
              colors={["#FBE9E2", "#A5DFD7"]}
              style={{
                borderRadius: 28,
                height: 221,
                padding: 15,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View className="text-center gap-3">
                <Text className="text-[#293231] text-[19px] leading-[100%] font-semibold">
                  {antenatalCheckupText}
                </Text>
                <Text className="text-center text-[#293231] font-medium text-[16px]">
                  10:30 am July 20th
                </Text>
              </View>
              <Image
                source={require("../../assets/images/clinicVisit.png")}
                style={{ width: 202, height: 142 }}
                className="self-center mt-4"
                resizeMode="contain"
              />
            </LinearGradient>

            <View style={{}} className="flex-row justify-between mt-4 mb-4">
              <TouchableOpacity
                style={{ width: 130, height: 37 }}
                className="bg-[#006D5B] rounded-[10px] justify-center items-center"
                onPress={handleViewDetails}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-base">
                  {viewDetailsText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 130, height: 37 }}
                className="border border-[#026B5E] rounded-[10px] justify-center items-center"
                onPress={handleAddToCalendar}
                activeOpacity={0.7}
              >
                <Text className="text-[#293231] font-semibold text-base">
                  {addToCalendarText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Contact */}
          <View
            style={{ height: 354, borderRadius: 30, borderColor: "#00D2B3" }}
            className="bg-white rounded-2xl px-[15px] py-[28px] border flex flex-col gap-6 "
          >
            <View className="flex flex-row items-center gap-2">
              <View className="bg-black rounded-full">
                <Icon name="phone" size={22} color="#ffff" />
              </View>
              <Text className="text-[#293231] text-[24px] leading-[100%] font-bold">
                {emergencyContactText}
              </Text>
            </View>

            <View className="flex flex-row justify-center">
              <LinearGradient
                colors={["#FBE9E2", "#A5DFD7"]}
                style={{
                  borderRadius: 28,
                  height: 132,
                  width: 208,
                  padding: 15,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View className="text-center gap-3">
                  <Text className="text-[#293231] text-[19px] leading-[100%] font-semibold">
                    {needHelpText}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/images/emergency.png")}
                  style={{ width: 108, height: 74 }}
                  className="self-center mt-4"
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>

            <View className="flex flex-col gap-3 mb-4">
              {Object.entries(groupedContacts).map(([type, contacts]) => (
                <View
                  key={type}
                  className="flex flex-row flex-wrap justify-center gap-3"
                >
                  {contacts.map((contact, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      className="flex flex-row gap-3 items-center text-xl leading-6 h-[42px] w-[180px] bg-[#FCFCFC] shadow-md rounded-[10px] py-[10px] px-[18px]"
                      onPress={() => handleEmergencyCall(contact)}
                    >
                      <Image
                        source={require("../../assets/images/hospital.png")}
                        style={{ height: 26, width: 26 }}
                      />
                      <Text className="font-semibold text-[14px]">
                        Call{" "}
                        {contact.name ||
                          type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              {/* If no emergency contacts */}
              {emergencyContacts.length === 0 && (
                <Text className="text-gray-500 text-center mt-4">
                  No emergency contacts added yet.
                </Text>
              )}
            </View>
          </View>

          {/**Wellness Activities */}
          <View
            style={{ height: 420, borderRadius: 30, borderColor: "#FF7F50" }}
            className="bg-[#FCFCFC] rounded-2xl px-[15px] py-[28px] border flex flex-col gap-6 "
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={require("../../assets/images/wellness.png")}
                className="w-[26px] h-[26px]"
              />
              <Text className="text-[#293231] text-[24px] leading-[100%] font-bold">
                {wellnessActivitiesText}
              </Text>
            </View>

            <View className="flex flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleWellnessStart("Prenatal Yoga")}
              >
                <LinearGradient
                  colors={["#FBE9E2", "#A5DFD7"]}
                  style={{
                    borderRadius: 30,
                    height: 154,
                    width: 137,
                    padding: 15,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/yoga.png")}
                    style={{ width: 50, height: 50 }}
                    className="self-center"
                    resizeMode="contain"
                  />
                  <View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-center  text-[14px] leading-[100%] font-semibold">
                        {prenatalYogaText}
                      </Text>
                    </View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-center text-[12px] leading-[100%]">
                        {minsSessionText}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ width: 107, height: 25 }}
                    className="border-[#FF7F50] border rounded-[5px] bg-[#FCFCFC] justify-center items-center"
                    onPress={() => handleWellnessStart("Prenatal Yoga")}
                  >
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {startText}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleWellnessStart("Breathing Exercises")}
              >
                <LinearGradient
                  colors={["#FBE9E2", "#A5DFD7"]}
                  style={{
                    borderRadius: 30,
                    height: 154,
                    width: 137,
                    padding: 15,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/breathing.png")}
                    style={{ width: 50, height: 50 }}
                    className="self-center"
                    resizeMode="contain"
                  />
                  <View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-center text-[14px] leading-[100%] font-semibold">
                        {breathingText}
                      </Text>
                    </View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-[12px] leading-[100%]">
                        {minsExerciseText}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ width: 107, height: 25 }}
                    className="border-[#FF7F50] border rounded-[5px] bg-[#FCFCFC] justify-center items-center"
                    onPress={() => handleWellnessStart("Breathing Exercises")}
                  >
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {startText}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleWellnessStart("Meditation")}
              >
                <LinearGradient
                  colors={["#FBE9E2", "#A5DFD7"]}
                  style={{
                    borderRadius: 30,
                    height: 154,
                    width: 137,
                    padding: 15,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/meditation.png")}
                    style={{ width: 50, height: 50 }}
                    className="self-center"
                    resizeMode="contain"
                  />
                  <View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-[14px] text-center leading-[100%] font-semibold">
                        {meditationText}
                      </Text>
                    </View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-[12px] text-center leading-[100%]">
                        {tenMinsSessionText}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ width: 107, height: 25 }}
                    className="border-[#FF7F50] border rounded-[5px] bg-[#FCFCFC] justify-center items-center"
                    onPress={() => handleWellnessStart("Meditation")}
                  >
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {startText}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleWellnessStart("Sleep Stories")}
              >
                <LinearGradient
                  colors={["#FBE9E2", "#A5DFD7"]}
                  style={{
                    borderRadius: 30,
                    height: 154,
                    width: 137,
                    padding: 15,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/sleep.png")}
                    style={{ width: 50, height: 50 }}
                    className="self-center"
                    resizeMode="contain"
                  />
                  <View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] text-[14px] text-center leading-[100%] font-semibold">
                        {sleepStoriesText}
                      </Text>
                    </View>
                    <View className="text-center gap-3">
                      <Text className="text-[#293231] tesxt-center text-[12px] leading-[100%]">
                        {fifteenMinsSessionText}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ width: 107, height: 25 }}
                    className="border-[#FF7F50] border rounded-[5px] bg-[#FCFCFC] justify-center items-center"
                    onPress={() => handleWellnessStart("Sleep Stories")}
                  >
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {startText}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/**Nutrition Today */}
          <View
            style={{ height: 739, borderRadius: 30, borderColor: "#00D2B3" }}
            className="bg-[#FCFCFC] rounded-2xl px-[15px] py-[28px] border flex flex-col gap-6"
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={require("../../assets/images/wellness.png")}
                className="w-[26px] h-[26px]"
              />
              <Text className="text-[#293231] text-[24px] leading-[100%] font-bold">
                {nutritionTodayText}
              </Text>
            </View>

            <Tabs
              value="breakfast"
              onChange={(value) => handleNutritionTabChange(value)}
            >
              <TabsTabList className="flex flex-row justify-between mb-6">
                <TabsTab
                  value="breakfast"
                  className="flex-1 mx-1 data-[state=active]:bg-yellow-400"
                >
                  <View className="py-2 items-center">
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {breakfastText}
                    </Text>
                    <Text className="text-[#6B7280] text-[12px]">
                      12am-12pm
                    </Text>
                  </View>
                </TabsTab>
                <TabsTab value="lunch" className="flex-1 mx-1">
                  <View className="py-2 items-center">
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {lunchText}
                    </Text>
                    <Text className="text-[#6B7280] text-[12px]">
                      12pm-05pm
                    </Text>
                  </View>
                </TabsTab>
                <TabsTab value="dinner" className="flex-1 mx-1">
                  <View className="py-2 items-center">
                    <Text className="text-[#293231] font-semibold text-[14px]">
                      {dinnerText}
                    </Text>
                    <Text className="text-[#6B7280] text-[12px]">
                      05pm-09pm
                    </Text>
                  </View>
                </TabsTab>
              </TabsTabList>

              <TabsTabPanels>
                {/* Breakfast Tab */}
                <TabsTabPanel value="breakfast" className="flex flex-col gap-6">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </TabsTabPanel>

                {/* Lunch Tab */}
                <TabsTabPanel value="lunch" className="flex flex-col gap-6">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </TabsTabPanel>

                {/* Dinner Tab */}
                <TabsTabPanel value="dinner" className="flex flex-col gap-6">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Milk, Pap and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => console.log("pressed")}
                  >
                    <View className="bg-white rounded-[30px] h-[121px] p-1 shadow-sm border flex flex-row gap-4 items-center border-[#00D2B3]">
                      <Image
                        source={require("../../assets/images/pap.png")}
                        style={{ width: 56, height: 60 }}
                      />
                      <View className="flex flex-col h-[121px] py-4 justify-between">
                        <Text className="font-semibold text-[18px]">
                          Pap, milk and eggs{" "}
                        </Text>
                        <View className="flex flex-row gap-14">
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/fire.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>294 Kcal</Text>
                          </View>
                          <View className="flex flex-row gap-4 items-center">
                            <Image
                              source={require("../../assets/images/scale.png")}
                              style={{ width: 16, height: 16 }}
                            />
                            <Text>100g</Text>
                          </View>
                        </View>
                        <View className="flex flex-row gap-4 text-[12px]">
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#00D2B3] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Vitamin</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FFF9C4] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Carb</Text>
                          </View>
                          <View className="flex flex-row gap-2 items-center">
                            <View className="h-[30px] w-1 bg-[#FF7F50] rounded-t-md rounded-b-md">
                              <View className="h-[15px] bg-gray-200 w-1 rounded-t-md rounded-b-md"></View>
                            </View>
                            <Text className="text-[12px]">40g Fibre</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </TabsTabPanel>
              </TabsTabPanels>
            </Tabs>
          </View>

          {/**Baby Development */}
          <View
            style={{ height: 443, borderRadius: 30, borderColor: "#00D2B3" }}
            className="bg-[#FCFCFC] rounded-2xl px-[15px] py-[28px] border flex flex-col gap-4"
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={require("../../assets/images/emoji.png")}
                className="w-[26px] h-[26px]"
              />
              <Text className="text-[#293231] text-[24px] leading-[100%] font-bold">
                {babyDevelopmentText}
              </Text>
            </View>

            <View className="flex flex-col gap-4">
              <Text className="text-[#293231] font-semibold text-[20px] ">
                {weekMilestonesText}
              </Text>
              <View className="flex flex-row justify-center">
                <LinearGradient
                  colors={["#FBE9E2", "#A5DFD7"]}
                  style={{
                    borderRadius: 28,
                    height: 154,
                    width: 120,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/infant.png")}
                    style={{ width: 100, height: 134 }}
                  />
                </LinearGradient>
              </View>
              <View
                className="h-[104px] border border-[#00D2B3] p-5 flex flex-col justify-between"
                style={{ borderRadius: 30 }}
              >
                <View className="flex flex-row gap-3">
                  <Text className="text-[14px]">&middot;</Text>
                  <Text className="text-[14px]">{babyCanHearText}</Text>
                </View>
                <View className="flex flex-row gap-3">
                  <Text className="text-[14px]">&middot;</Text>
                  <Text className="text-[14px]">{fingerToesText}</Text>
                </View>
                <View className="flex flex-row gap-3">
                  <Text className="text-[14px]">&middot;</Text>
                  <Text className="text-[14px]">{babyMoveText}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={{ height: 37, borderRadius: 15 }}
              className="bg-[#006D5B] rounded-[10px] justify-center items-center"
              onPress={() => router.push("/babyDevelopment/development")}
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-semibold text-[16px]">
                {learnMoreWeekText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Toast Component */}
      <Toast />
    </View>
  );
}
