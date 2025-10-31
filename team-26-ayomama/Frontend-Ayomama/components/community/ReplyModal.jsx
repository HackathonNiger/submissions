import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTranslation } from "../../utils/translator";

export default function ReplyModal({
  visible,
  selectedPost,
  replyText,
  setReplyText,
  onClose,
  onSubmit,
}) {
  // Translate all text
  const replyToText = useTranslation("Reply to");
  const writeReplyText = useTranslation("Write your reply...");
  const cancelText = useTranslation("Cancel");
  const sendReplyText = useTranslation("Send Reply");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        >
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-t-3xl"
                style={{
                  paddingBottom: Platform.OS === "ios" ? 40 : 20,
                }}
              >
                {/* Modal Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Text className="text-[#293231] text-lg font-bold">
                    {replyToText} {selectedPost?.author}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                    }}
                  >
                    <Ionicons name="close" size={24} color="#293231" />
                  </TouchableOpacity>
                </View>

                {/* Original Post Preview */}
                {selectedPost && (
                  <View className="px-6 py-3 bg-[#F9FAFB]">
                    <View className="flex-row items-start">
                      <Image
                        source={selectedPost.avatar}
                        className="w-8 h-8 rounded-full mr-2"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-[#293231] font-semibold text-sm">
                          {selectedPost.author}
                        </Text>
                        <Text
                          className="text-[#6B7280] text-xs mt-1"
                          numberOfLines={2}
                        >
                          {selectedPost.content}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Reply Input */}
                <View className="px-6 py-4">
                  <View className="bg-[#F3F4F6] rounded-2xl p-4 min-h-[100px]">
                    <TextInput
                      className="text-[#293231] text-base"
                      placeholder={writeReplyText}
                      placeholderTextColor="#9CA3AF"
                      value={replyText}
                      onChangeText={setReplyText}
                      multiline={true}
                      autoFocus={true}
                      style={{ minHeight: 80 }}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row px-6 gap-2">
                  <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 bg-gray-200 rounded-full py-3"
                  >
                    <Text className="text-[#293231] text-center font-semibold">
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onSubmit}
                    className="flex-1 bg-[#00D2B3] rounded-full py-3"
                    disabled={!replyText.trim()}
                    style={{
                      opacity: replyText.trim() ? 1 : 0.5,
                    }}
                  >
                    <Text className="text-white text-center font-semibold">
                      {sendReplyText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
