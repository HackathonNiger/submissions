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

export default function CommentInputModal({
  visible,
  selectedPost,
  commentText,
  setCommentText,
  onClose,
  onSubmit,
}) {
  // Translate all text
  const addCommentText = useTranslation("Add Comment");
  const shareThoughtsText = useTranslation("Share your thoughts...");
  const cancelText = useTranslation("Cancel");
  const postCommentText = useTranslation("Post Comment");

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
                    {addCommentText}
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

                {/* Comment Input */}
                <View className="px-6 py-4">
                  <View className="bg-[#F3F4F6] rounded-2xl p-4 min-h-[120px]">
                    <TextInput
                      className="text-[#293231] text-base"
                      placeholder={shareThoughtsText}
                      placeholderTextColor="#9CA3AF"
                      value={commentText}
                      onChangeText={setCommentText}
                      multiline={true}
                      autoFocus={true}
                      style={{ minHeight: 100 }}
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
                    disabled={!commentText.trim()}
                    style={{
                      opacity: commentText.trim() ? 1 : 0.5,
                    }}
                  >
                    <Text className="text-white text-center font-semibold">
                      {postCommentText}
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
