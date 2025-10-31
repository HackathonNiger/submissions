import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTranslation } from "../../utils/translator";

export default function ViewCommentsModal({ visible, selectedPost, onClose }) {
  // Translate all text
  const commentsText = useTranslation("Comments");
  const noCommentsYetText = useTranslation("No comments yet");
  const beFirstText = useTranslation("Be the first to share your thoughts!");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-t-3xl"
              style={{
                maxHeight: "85%",
                paddingBottom: Platform.OS === "ios" ? 40 : 20,
              }}
            >
              {/* Modal Header */}
              <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                <Text className="text-[#293231] text-lg font-bold">
                  {commentsText} ({selectedPost?.commentsCount || 0})
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
                <View className="px-6 py-4 bg-[#F9FAFB] border-b border-gray-200">
                  <View className="flex-row items-start">
                    <Image
                      source={selectedPost.avatar}
                      className="w-10 h-10 rounded-full mr-3"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-[#293231] font-bold text-sm">
                        {selectedPost.author}
                      </Text>
                      <Text className="text-[#293231] text-sm mt-1">
                        {selectedPost.content}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Comments List */}
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={true}
                bounces={true}
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  flexGrow: 1,
                }}
              >
                {selectedPost?.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map((comment, index) => (
                    <View
                      key={comment.id}
                      className="mb-4"
                      style={{
                        paddingBottom: 16,
                        borderBottomWidth:
                          index === selectedPost.comments.length - 1 ? 0 : 1,
                        borderBottomColor: "#F3F4F6",
                      }}
                    >
                      <View className="flex-row items-start">
                        <Image
                          source={comment.avatar}
                          className="w-10 h-10 rounded-full mr-3"
                          resizeMode="cover"
                          style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                          }}
                        />
                        <View className="flex-1">
                          <View
                            className="bg-[#F3F4F6] rounded-2xl p-3"
                            style={{
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.05,
                              shadowRadius: 2,
                            }}
                          >
                            <Text className="text-[#293231] font-semibold text-sm mb-1">
                              {comment.author}
                            </Text>
                            <Text className="text-[#293231] text-sm leading-5">
                              {comment.content}
                            </Text>
                          </View>
                          <Text className="text-[#9CA3AF] text-xs mt-2 ml-1">
                            {comment.timestamp}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="flex-1 items-center justify-center py-12">
                    <View
                      className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                      }}
                    >
                      <Ionicons
                        name="chatbubbles-outline"
                        size={40}
                        color="#9CA3AF"
                      />
                    </View>
                    <Text className="text-[#6B7280] text-base font-medium mb-1">
                      {noCommentsYetText}
                    </Text>
                    <Text className="text-[#9CA3AF] text-sm text-center px-8">
                      {beFirstText}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
