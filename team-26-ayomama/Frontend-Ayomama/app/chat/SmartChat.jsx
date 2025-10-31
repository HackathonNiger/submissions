import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import StreamedMessage from "../../components/chat/StreamedMessage";
import TypingIndicator from "../../components/chat/TypingIndicator";
import useAiStore from "../../store/useAiStore";
import useAuthStore from "../../store/useAuthStore";
import { useTranslation } from "../../utils/translator";

const ios = Platform.OS === "ios";

export default function SmartChat() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    messages,
    isLoading,
    initializeSession,
    sendMessage,
    clearSession,
    lastMessageId,
    error,
    storageWarning,
  } = useAiStore();
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollIntervalRef = useRef(null);

  // Translate all text
  const smartChatText = useTranslation("Smart Chat");
  const storageAlmostFullText = useTranslation("Storage Almost Full");
  const clearOldMessagesText = useTranslation(
    "Consider clearing old messages to free up space"
  );
  const storageFullText = useTranslation("Storage Full");
  const storageFullMessageText = useTranslation(
    "Your chat history has reached the maximum storage limit. Please clear some messages to continue chatting."
  );
  const cancelText = useTranslation("Cancel");
  const clearChatText = useTranslation("Clear Chat");
  const chatClearedText = useTranslation("Chat Cleared");
  const storageFreedText = useTranslation("Storage space has been freed");
  const noChatHistoryText = useTranslation("No Chat History");
  const noMessagesText = useTranslation("There are no messages to clear");
  const clearChatHistoryText = useTranslation("Clear Chat History");
  const clearConfirmText = useTranslation(
    "Are you sure you want to clear all chat messages? This action cannot be undone."
  );
  const clearText = useTranslation("Clear");
  const chatDeletedText = useTranslation("Your chat history has been deleted");
  const connectionErrorText = useTranslation("Connection Error");
  const failedToSendText = useTranslation(
    "Failed to send message. Please try again."
  );
  const comingSoonText = useTranslation("Coming Soon");
  const attachmentSoonText = useTranslation(
    "Attachment feature will be available soon"
  );
  const voiceSoonText = useTranslation(
    "Voice input feature will be available soon"
  );
  const justNowText = useTranslation("Just now");
  const aiGreetingText = useTranslation("Hi! I'm Favour, your AI assistant");
  const aiDescriptionText = useTranslation(
    "Ask me anything about pregnancy, health tips, or your daily routine"
  );
  const inputPlaceholderText = useTranslation(
    "Ask anything about your pregnancy..."
  );

  useEffect(() => {
    initializeSession();
  }, []);

  // Show storage warning
  useEffect(() => {
    if (storageWarning) {
      Toast.show({
        type: "warning",
        text1: storageAlmostFullText,
        text2: clearOldMessagesText,
        position: "top",
        visibilityTime: 4000,
      });
    }
  }, [storageWarning]);

  // Show storage full error
  useEffect(() => {
    if (error === "storage_full") {
      Alert.alert(storageFullText, storageFullMessageText, [
        { text: cancelText, style: "cancel" },
        {
          text: clearChatText,
          style: "destructive",
          onPress: () => {
            clearSession();
            Toast.show({
              type: "success",
              text1: chatClearedText,
              text2: storageFreedText,
              position: "top",
              visibilityTime: 2000,
            });
          },
        },
      ]);
    }
  }, [error]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Smooth auto-scroll during streaming
  useEffect(() => {
    let animationFrameId;
    let lastScrollTime = 0;
    const scrollInterval = 50; // Minimum time between scrolls

    const smoothScroll = (timestamp) => {
      if (isStreaming && flatListRef.current) {
        if (timestamp - lastScrollTime >= scrollInterval) {
          try {
            flatListRef.current?.scrollToEnd({ animated: true });
            lastScrollTime = timestamp;
          } catch (error) {
            console.log("Scroll error:", error);
          }
        }
        animationFrameId = requestAnimationFrame(smoothScroll);
      }
    };

    if (isStreaming) {
      animationFrameId = requestAnimationFrame(smoothScroll);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isStreaming]);

  // Fade out orb when messages exist
  useEffect(() => {
    if (messages.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [messages.length]);

  const handleBack = () => {
    router.back();
  };

  const handleClearChat = () => {
    if (messages.length === 0) {
      Toast.show({
        type: "info",
        text1: noChatHistoryText,
        text2: noMessagesText,
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    Alert.alert(
      clearChatHistoryText,
      clearConfirmText,
      [
        {
          text: cancelText,
          style: "cancel",
        },
        {
          text: clearText,
          style: "destructive",
          onPress: () => {
            clearSession();
            Toast.show({
              type: "success",
              text1: chatClearedText,
              text2: chatDeletedText,
              position: "top",
              visibilityTime: 2000,
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const messageToSend = inputMessage.trim();
      setInputMessage("");
      Keyboard.dismiss();

      setIsStreaming(true);
      const result = await sendMessage(messageToSend);
      setIsStreaming(false);

      if (!result.success) {
        Toast.show({
          type: "error",
          text1: connectionErrorText,
          text2: result.error || failedToSendText,
          position: "top",
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleAttachment = () => {
    Toast.show({
      type: "info",
      text1: comingSoonText,
      text2: attachmentSoonText,
      position: "top",
      visibilityTime: 2000,
    });
  };

  const handleVoiceInput = () => {
    Toast.show({
      type: "info",
      text1: comingSoonText,
      text2: voiceSoonText,
      position: "top",
      visibilityTime: 2000,
    });
  };

  const handleStreamingChange = (streaming) => {
    setIsStreaming(streaming);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return justNowText;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === "user";
    const isLastMessage = index === messages.length - 1;
    // Only stream if this is the last AI message AND it's the one just added
    const shouldStream = !isUser && isLastMessage && item.id === lastMessageId;

    return (
      <View
        className={`mb-6 ${isUser ? "items-end" : "items-start"}`}
        style={{ opacity: 1 }}
      >
        <View
          className={`flex-row ${
            isUser ? "flex-row-reverse" : "flex-row"
          } items-start max-w-[85%]`}
          pointerEvents="box-none"
        >
          {/* Avatar */}
          {!isUser && (
            <View className="mr-3 mt-1 items-center" pointerEvents="none">
              <View
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#FF6B9D] items-center justify-center"
                style={{
                  shadowColor: "#FF7F50",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              >
                <Image
                  source={require("../../assets/images/smartchat.png")}
                  className="w-9 h-9 rounded-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
          {isUser && (
            <View className="ml-3 mt-1" pointerEvents="none">
              <Image
                source={
                  user?.avatar && typeof user.avatar === "string"
                    ? { uri: user.avatar }
                    : require("../../assets/images/profilepic.png")
                }
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}
              />
            </View>
          )}

          {/* Message Content */}
          <View className="flex-1" pointerEvents="box-none">
            {/* Message Bubble */}
            <View
              className={`px-5 py-4 rounded-2xl ${
                isUser ? "bg-[#006D5B] rounded-br-sm" : "bg-white rounded-bl-sm"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
              }}
              pointerEvents="box-none"
            >
              <StreamedMessage
                content={item.content}
                isUser={isUser}
                shouldStream={shouldStream}
                onStreamingChange={shouldStream ? handleStreamingChange : null}
              />
            </View>

            {/* Timestamp */}
            <Text
              className={`text-xs text-gray-500 mt-1 ${
                isUser ? "text-right mr-2" : "text-left ml-2"
              }`}
            >
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        {/* Gradient Background */}
        <LinearGradient
          colors={["#B5FFFC", "#FFDEE9"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <KeyboardAvoidingView
          className="flex-1"
          behavior={ios ? "padding" : "height"}
          keyboardVerticalOffset={ios ? 0 : 0}
        >
          {/* Header */}
          <View
            className="px-6 flex-row items-center justify-between"
            style={{ paddingTop: ios ? 64 : 76 }}
          >
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#293231" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-[#FF7F50]">
              {smartChatText}
            </Text>

            <TouchableOpacity
              onPress={handleClearChat}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Chat Content Area */}
          <View className="flex-1 pt-2 px-1">
            {messages.length === 0 ? (
              // AI Orb/Avatar - Show only when no messages
              <Animated.View
                style={{ opacity: fadeAnim }}
                className="flex-1 items-center justify-center"
              >
                <Image
                  source={require("../../assets/images/smartchat.png")}
                  className="w-80 h-80 rounded-full mb-8"
                  resizeMode="contain"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  }}
                />
                <Text className="text-[#293231] text-lg font-semibold text-center mb-2">
                  {aiGreetingText}
                </Text>
                <Text className="text-[#6B7280] text-center px-8">
                  {aiDescriptionText}
                </Text>
              </Animated.View>
            ) : (
              // Chat Messages
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                bounces={true}
                alwaysBounceVertical={true}
                overScrollMode="always"
                scrollEventThrottle={16}
                directionalLockEnabled={true}
                removeClippedSubviews={false}
                maintainVisibleContentPosition={null}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={21}
                updateCellsBatchingPeriod={50}
                onScrollToIndexFailed={(info) => {
                  console.log("Scroll failed:", info);
                }}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 30,
                  paddingTop: 8,
                  flexGrow: 1,
                }}
                ListFooterComponent={
                  isLoading ? (
                    <View className="items-start mb-4">
                      <View className="flex-row items-end">
                        <View className="mr-3">
                          <View
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#FF6B9D] items-center justify-center"
                            style={{
                              shadowColor: "#FF7F50",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                            }}
                          >
                            <Image
                              source={require("../../assets/images/smartchat.png")}
                              className="w-9 h-9 rounded-full"
                              resizeMode="cover"
                            />
                          </View>
                        </View>
                        <View
                          className="bg-white px-5 py-3 rounded-2xl rounded-bl-sm"
                          style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                                      }}
                        >
                          <TypingIndicator />
                        </View>
                      </View>
                    </View>
                  ) : null
                }
              />
            )}
          </View>

          {/* Input Area */}
          <View className="px-6 pb-8">
            <View className="flex-row items-center">
              {/* Add Button */}
              <TouchableOpacity
                onPress={handleAttachment}
                className="w-12 h-12 rounded-full bg-white items-center justify-center mr-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <Ionicons name="add" size={28} color="#293231" />
              </TouchableOpacity>

              {/* Text Input */}
              <View
                className="flex-1 bg-white rounded-full px-5 py-3 flex-row items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <TextInput
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder={inputPlaceholderText}
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-[16px] text-[#293231] mr-2"
                  multiline={false}
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                  editable={!isLoading}
                />
                {inputMessage.trim() ? (
                  <TouchableOpacity
                    onPress={handleSendMessage}
                    disabled={isLoading}
                    className="bg-[#006D5B] rounded-full p-2"
                  >
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleVoiceInput}>
                    <Ionicons name="mic" size={24} color="#293231" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
}
