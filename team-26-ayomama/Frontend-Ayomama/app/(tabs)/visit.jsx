import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../store/useAuthStore";
import useVisitStore from "../../store/useVisitStore";
import { useTranslation } from "../../utils/translator";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";

const images = {
  infant: require("../../assets/images/infant.png"),
  ironSupplement: require("../../assets/images/ironSupplement.png"),
  water: require("../../assets/images/water.png"),
};

export default function Visit() {
  const { user } = useAuthStore();
  const { visits, fetchVisits, loading } = useVisitStore();
  const [isChecked, setChecked] = useState({
    antenatal: false,
    supplement: false,
    water: false,
  });

  // Translate all text
  const helloText = useTranslation("Hello,");
  const nextAppointmentText = useTranslation("Next Appointment");
  const antenatalCheckupText = useTranslation("Antenatal Checkup");
  const setReminderText = useTranslation("Set Reminder");
  const seeDirectionsText = useTranslation("See Directions");
  const prepChecklistText = useTranslation("✔️ Preparation Checklist");
  const bringAntenatalText = useTranslation("Bring antenatal card");
  const takeIronText = useTranslation("Take iron supplement");
  const drinkWaterText = useTranslation("Drink enough water");
  const upcomingApptText = useTranslation("Upcoming Appointments");
  const editText = useTranslation("New");
  const noUpcomingText = useTranslation("No upcoming appointments scheduled.");

  // Fetch visits on mount
  useEffect(() => {
    fetchVisits();
  }, []);

  const sortedVisits = visits
    ?.slice()
    .sort(
      (a, b) =>
        new Date(a.reminderDateTime).getTime() -
        new Date(b.reminderDateTime).getTime()
    );

  const nextVisit = sortedVisits?.[0];

  const showToast = (type, text1, text2 = "") => {
    Toast.show({
      type,
      text1,
      text2,
      visibilityTime: 1800,
    });
  };

  const handleChecklist = (key) => {
    const updated = !isChecked[key];
    setChecked({ ...isChecked, [key]: updated });

    if (updated) {
      showToast("success", "Checklist Updated", `You completed "${key}"`);
    } else {
      showToast("info", "Checklist Updated", `You unchecked "${key}"`);
    }
  };

  const handleSetReminder = (visit) => {
    showToast(
      "success",
      "Reminder Set!",
      `You'll be notified before your visit with ${visit.doctorName}.`
    );
  };

  const handleSeeDirections = (hospitalName) => {
    showToast("info", "Opening Directions...", `Navigating to ${hospitalName}`);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "Date not set";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return "Time not set";
    const date = new Date(isoDate);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDayNumber = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.getDate().toString();
  };

  const getMonth = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", { month: "short" });
  };

  const isToday = (isoDate) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isUpcoming = (isoDate) => {
    if (!isoDate) return false;
    const date = new Date(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const upcomingVisits = sortedVisits?.filter((visit) =>
    isUpcoming(visit.reminderDateTime)
  );

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <View className="flex-1">
      {/* Header */}
      <View
        className={`flex flex-row justify-between items-center px-4 ${topMargin} bg-[#FBE9E2] pt-16 pb-4`}
      >
        <TouchableOpacity
          className="w-[50px] h-[50px] bg-white flex flex-row items-center justify-center rounded-full"
          onPress={() => router.push("/(tabs)")}
        >
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>
        <View className="flex flex-col items-center">
          <Text className="text-[#8F8D8D] text-[16px]">{helloText}</Text>
          <Text className="text-[#293231] text-[20px] font-bold">
            {user.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Icon name="notifications" size={25} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#FBE9E2", "#A5DFD7"]}
          style={{
            borderBottomEndRadius: 50,
            borderBottomStartRadius: 50,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
          className="shadow-lg shadow-black/25"
        >
          {/* Calendar Section */}
          <View>
            <Text className="text-[#293231] text-[20px] font-bold mb-4">
              {nextAppointmentText}
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#00D2B3" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                <View className="flex-row space-x-4 gap-3">
                  {calendarDays.map((date, i) => {
                    const dayNum = date.getDate().toString();
                    const month = date.toLocaleString("en-US", {
                      month: "short",
                    });
                    const isTodayDate = i === 0;
                    const isHighlighted =
                      nextVisit &&
                      getDayNumber(nextVisit.reminderDateTime) === dayNum;

                    return (
                      <View
                        key={i}
                        className={`items-center w-14 h-[86px] ${
                          isHighlighted
                            ? "bg-[#00D2B3]"
                            : isTodayDate
                            ? "bg-[#FF7F50]"
                            : "bg-[#FCFCFC]"
                        } rounded-full justify-center`}
                      >
                        <Text
                          className={`${
                            isHighlighted || isTodayDate
                              ? "text-white"
                              : "text-[#293231]"
                          } text-[16px] font-bold`}
                        >
                          {dayNum}
                        </Text>
                        <Text
                          className={`${
                            isHighlighted || isTodayDate
                              ? "text-[#FCFCFC]"
                              : "text-[#8F8D8D]"
                          } text-[12px] mt-1`}
                        >
                          {month}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Upcoming Appointment Card */}
          {nextVisit && (
            <View className="flex flex-col gap-2">
              <Text className="text-[#293231] text-[22px] font-bold leading-wide">
                {antenatalCheckupText}
              </Text>
              <View className="rounded-2xl p-5 shadow-lg items-center shadow-black/25 flex flex-col h-[140px] justify-between border border-[#FF7F50]">
                <View className="flex flex-row items-center gap-3">
                  <Text className="text-[#293231] text-center text-[20px] font-medium">
                    {formatDate(nextVisit.reminderDateTime)}
                  </Text>
                  <Text className="text-[#D78722] text-center text-[18px] font-semibold">
                    -
                  </Text>
                  <Text className="text-[#D78722] text-center text-[18px] font-semibold">
                    {formatTime(nextVisit.reminderDateTime)}
                  </Text>
                </View>
                <Text className="text-[#8F8D8D] text-[16px] text-center">
                  {nextVisit.hospitalName}
                </Text>

                <View className="flex-row space-x-3 justify-center mt-2 gap-3">
                  <TouchableOpacity
                    className="flex bg-[#FCFCFC] h-[37px] rounded-xl py-3 w-[120px] items-center"
                    onPress={() => handleSetReminder(nextVisit)}
                  >
                    <Text className="text-[#293231] text-[14px] font-semibold">
                      {setReminderText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex bg-[#FCFCFC] h-[37px] w-[120px] rounded-xl py-3 items-center"
                    onPress={() => handleSeeDirections(nextVisit.hospitalName)}
                  >
                    <Text className="text-[#293231] text-[14px] font-semibold">
                      {seeDirectionsText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Checklist */}
          <View className="flex flex-col gap-2">
            <Text className="text-[#293231] text-[22px] font-bold">
              {prepChecklistText}
            </Text>
            {[
              {
                key: "antenatal",
                labelKey: "antenatal",
                img: "infant",
              },
              {
                key: "supplement",
                labelKey: "supplement",
                img: "ironSupplement",
              },
              { key: "water", labelKey: "water", img: "water" },
            ].map((item) => {
              const label =
                item.labelKey === "antenatal"
                  ? bringAntenatalText
                  : item.labelKey === "supplement"
                  ? takeIronText
                  : drinkWaterText;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={{ height: 60, borderRadius: 28 }}
                  className="flex-row items-center bg-[#FCFCFC] rounded-2xl shadow-sm border px-4 py-2 border-[#FCFCFC]"
                  onPress={() => handleChecklist(item.key)}
                  activeOpacity={0.7}
                >
                  <View className="flex flex-row gap-3 items-center">
                    <Image
                      source={images[item.img]}
                      style={{ width: 45, height: 50 }}
                    />
                    <Text className="text-[#293231] text-base flex-1">
                      {label}
                    </Text>
                  </View>
                  <Checkbox
                    value={isChecked[item.key]}
                    onValueChange={() => handleChecklist(item.key)}
                    style={{ width: 17, height: 17, marginLeft: -20 }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>

        {/* Appointment List */}
        <View className="flex flex-col p-[20px]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[#293231] text-[22px] font-bold">
              {upcomingApptText}
            </Text>
            <TouchableOpacity
              className="flex-row gap-2 border rounded-full px-3 py-2 border-[#006D5B80] items-center space-x-1"
              onPress={() => router.push("/visit/visitInput")}
            >
              <Text className="text-[14px] text-[#333]">{editText}</Text>
              <Icon name="edit" size={14} color="#333" />
            </TouchableOpacity>
          </View>

          <View className="px-4">
            {loading ? (
              <ActivityIndicator size="large" color="#00D2B3" />
            ) : !upcomingVisits || upcomingVisits.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-[#666] text-center text-[16px] mb-2">
                  No upcoming appointments
                </Text>
                <Text className="text-[#999] text-center text-[14px]">
                  Schedule your next visit to see it here
                </Text>
              </View>
            ) : (
              upcomingVisits.map((item, i) => (
                <View
                  key={item._id || i}
                  className="border border-[#FF7E5F] rounded-[20px] h-[130px] justify-between p-4 mb-4 bg-white shadow-sm"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <View className="flex flex-row gap-2">
                        <Text className="text-[18px] text-[#666] mb-1 font-bold">
                          {formatDate(item.reminderDateTime)}
                        </Text>
                        <Text className="text-[#FF7E5F] text-[18px] font-bold mb-1">
                          {formatTime(item.reminderDateTime)}
                        </Text>
                      </View>
                      <Text className="text-[18px] text-[#666]">
                        {item.hospitalName}
                      </Text>
                      {/* <Text className="text-[12px] text-[#999]">
                        Duration: {item.duration} mins
                      </Text> */}
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 border border-[#00D2B3] rounded-[10px] py-2 items-center"
                      onPress={() => handleSetReminder(item)}
                    >
                      <Text className="text-[#00D2B3] text-[14px] font-medium">
                        Set Reminder
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 border border-[#00D2B3] rounded-[10px] py-2 items-center"
                      onPress={() => handleSeeDirections(item.hospitalName)}
                    >
                      <Text className="text-[#00D2B3] text-[14px] font-medium">
                        See Directions
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
}
