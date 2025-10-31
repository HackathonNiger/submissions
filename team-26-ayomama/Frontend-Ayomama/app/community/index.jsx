import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import CommentInputModal from "../../components/community/CommentInputModal";
import ReplyModal from "../../components/community/ReplyModal";
import ViewCommentsModal from "../../components/community/ViewCommentsModal";
import { useTranslation } from "../../utils/translator";

const isIOS = Platform.OS === "ios";

export default function Community() {
  const router = useRouter();
  const [messageText, setMessageText] = useState("");

  // Translate all text
  const communityText = useTranslation("Community");
  const replySentText = useTranslation("Reply sent! 💬");
  const replyPostedText = useTranslation("Your reply has been posted");
  const commentAddedText = useTranslation("Comment added! 💬");
  const commentPostedText = useTranslation("Your comment has been posted");
  const messageSentText = useTranslation("Message sent! 📨");
  const messagePostedText = useTranslation(
    "Your message has been posted to the community"
  );
  const shareThoughtsText = useTranslation(
    "Share your thoughts with other mothers..."
  );
  const repliesText = useTranslation("Replies");
  const replyText = useTranslation("Reply");
  const commentText = useTranslation("Comment");
  const viewCommentsText = useTranslation("View Comments");

  // Modal states
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [viewCommentsModalVisible, setViewCommentsModalVisible] =
    useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyTextInput, setReplyTextInput] = useState("");
  const [commentTextInput, setCommentTextInput] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});

  // Mock community posts data with replies and comments
  const posts = [
    {
      id: 1,
      author: "Mama Zee",
      avatar: require("../../assets/images/profilepic.png"),
      content:
        "My people 😊 who else no dey sleep well? This pikin don turn DJ for my belle.",
      isLiked: false,
      borderColor: "#00D2B3",
      replies: [],
      comments: [],
      repliesCount: 0,
      commentsCount: 0,
      likesCount: 12,
    },
    {
      id: 2,
      author: "Mama Zee",
      avatar: require("../../assets/images/profilepic.png"),
      content:
        "Na so e dey start o! The baby dey practice legwork for inside womb",
      isLiked: false,
      borderColor: "#FF7F50",
      replies: [],
      comments: [],
      repliesCount: 0,
      commentsCount: 0,
      likesCount: 8,
    },
    {
      id: 3,
      author: "Mama Zee",
      avatar: require("../../assets/images/profilepic.png"),
      content:
        "My people 😊 who else no dey sleep well? This pikin don turn DJ for my belle.",
      isLiked: false,
      borderColor: "#00D2B3",
      replies: [],
      comments: [],
      repliesCount: 0,
      commentsCount: 0,
      likesCount: 15,
    },
    {
      id: 4,
      author: "Mama Zee",
      avatar: require("../../assets/images/profilepic.png"),
      content:
        "My people 😊 who else no dey sleep well? This pikin don turn DJ for my belle.",
      isLiked: false,
      borderColor: "#FF7F50",
      replies: [],
      comments: [],
      repliesCount: 0,
      commentsCount: 0,
      likesCount: 5,
    },
    {
      id: 5,
      author: "Mama Zee",
      avatar: require("../../assets/images/profilepic.png"),
      content:
        "My people 😊 who else no dey sleep well? This pikin don turn DJ for my belle.",
      isLiked: false,
      borderColor: "#00D2B3",
      replies: [],
      comments: [],
      repliesCount: 0,
      commentsCount: 0,
      likesCount: 20,
    },
  ];

  const [postsState, setPostsState] = useState(posts);

  const handleLike = (postId) => {
    setPostsState((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  };

  const handleReply = (post) => {
    setSelectedPost(post);
    setReplyModalVisible(true);
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setViewCommentsModalVisible(true);
  };

  const toggleReplies = (postId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const submitReply = () => {
    if (replyTextInput.trim() && selectedPost) {
      const newReply = {
        id: Date.now(),
        author: "You",
        avatar: require("../../assets/images/profilepic.png"),
        content: replyTextInput,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setPostsState((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                replies: [...post.replies, newReply],
                repliesCount: post.repliesCount + 1,
              }
            : post
        )
      );

      Toast.show({
        type: "success",
        text1: replySentText,
        text2: replyPostedText,
        position: "top",
        visibilityTime: 2000,
      });

      setReplyTextInput("");
      setReplyModalVisible(false);
      setSelectedPost(null);
    }
  };

  const submitComment = () => {
    if (commentTextInput.trim() && selectedPost) {
      const newComment = {
        id: Date.now(),
        author: "You",
        avatar: require("../../assets/images/profilepic.png"),
        content: commentTextInput,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setPostsState((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                comments: [...post.comments, newComment],
                commentsCount: post.commentsCount + 1,
              }
            : post
        )
      );

      Toast.show({
        type: "success",
        text1: commentAddedText,
        text2: commentPostedText,
        position: "top",
        visibilityTime: 2000,
      });

      setCommentTextInput("");
      setCommentModalVisible(false);
      setSelectedPost(null);
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      Toast.show({
        type: "success",
        text1: messageSentText,
        text2: messagePostedText,
        position: "top",
        visibilityTime: 2000,
      });
      setMessageText("");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 bg-[#FCFCFC]">
        <StatusBar barStyle="dark-content" />

        {/* Fixed Header */}
        <View
          className="bg-white"
          style={{
            paddingTop: isIOS ? 50 : StatusBar.currentHeight || 24,
            paddingBottom: 16,
            paddingHorizontal: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute left-0"
            >
              <Ionicons name="arrow-back" size={24} color="#293231" />
            </TouchableOpacity>
            <Text className="text-[#293231] text-xl font-bold">
              {communityText}
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Community Posts */}
          <View className="px-6 pt-4">
            {postsState.map((post) => (
              <View
                key={post.id}
                className="bg-[#E8F5F3] rounded-2xl p-4 mb-4"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: post.borderColor,
                }}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-start flex-1">
                    <Image
                      source={post.avatar}
                      className="w-10 h-10 rounded-full mr-3"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-[#293231] font-bold text-base mb-1">
                        {post.author}
                      </Text>
                      <Text className="text-[#293231] text-sm leading-5">
                        {post.content}
                      </Text>
                    </View>
                  </View>
                  <View className="items-center">
                    <TouchableOpacity onPress={() => handleLike(post.id)}>
                      <Ionicons
                        name={post.isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={post.isLiked ? "#EF476F" : "#EF476F"}
                      />
                    </TouchableOpacity>
                    {post.likesCount > 0 && (
                      <Text className="text-[#EF476F] text-xs font-semibold mt-1">
                        {post.likesCount}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Reply and Comment Buttons */}
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    {post.repliesCount > 0 && (
                      <TouchableOpacity
                        onPress={() => toggleReplies(post.id)}
                        className="flex-row items-center mr-3"
                      >
                        <Text className="text-[#00695C] text-xs font-medium">
                          {post.repliesCount}{" "}
                          {post.repliesCount === 1 ? "reply" : "replies"}
                        </Text>
                        <Ionicons
                          name={
                            expandedReplies[post.id]
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          size={16}
                          color="#00695C"
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    )}
                    {post.commentsCount > 0 && (
                      <TouchableOpacity
                        onPress={() => handleViewComments(post)}
                        className="flex-row items-center"
                      >
                        <Text className="text-[#FF7F50] text-xs font-medium">
                          View {post.commentsCount}{" "}
                          {post.commentsCount === 1 ? "comment" : "comments"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => handleReply(post)}
                      className="flex-row items-center mr-4"
                    >
                      <Ionicons
                        name="arrow-undo-outline"
                        size={16}
                        color="#00695C"
                      />
                      <Text className="text-[#00695C] text-sm ml-1 font-medium">
                        {replyText}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleComment(post)}
                      className="flex-row items-center"
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={16}
                        color="#00695C"
                      />
                      <Text className="text-[#00695C] text-sm ml-1 font-medium">
                        {commentText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Display Replies - Collapsible */}
                {post.replies.length > 0 && expandedReplies[post.id] && (
                  <View className="mt-3 ml-4 pl-4 border-l-2 border-[#00D2B3]">
                    {post.replies.map((reply) => (
                      <View key={reply.id} className="mb-2">
                        <View className="flex-row items-start">
                          <Image
                            source={reply.avatar}
                            className="w-6 h-6 rounded-full mr-2"
                            resizeMode="cover"
                          />
                          <View className="flex-1">
                            <Text className="text-[#293231] font-semibold text-xs">
                              {reply.author}
                            </Text>
                            <Text className="text-[#293231] text-xs mt-1">
                              {reply.content}
                            </Text>
                            <Text className="text-[#9CA3AF] text-xs mt-1">
                              {reply.timestamp}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Message Input - Fixed at Bottom */}
        <View
          className="bg-[#E8F5F3] px-6 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <View className="flex-row items-center">
            <View className="flex-1 bg-white rounded-full px-4 py-3 mr-3">
              <TextInput
                className="text-[#293231]"
                placeholder={shareThoughtsText}
                placeholderTextColor="#9CA3AF"
                value={messageText}
                onChangeText={setMessageText}
                multiline={false}
              />
            </View>
            <TouchableOpacity
              onPress={handleSendMessage}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
            >
              <Ionicons name="send" size={24} color="#293231" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reply Modal */}
        <ReplyModal
          visible={replyModalVisible}
          selectedPost={selectedPost}
          replyText={replyTextInput}
          setReplyText={setReplyTextInput}
          onClose={() => {
            setReplyModalVisible(false);
            setReplyTextInput("");
            setSelectedPost(null);
          }}
          onSubmit={submitReply}
        />

        {/* Comment Input Modal */}
        <CommentInputModal
          visible={commentModalVisible}
          selectedPost={selectedPost}
          commentText={commentTextInput}
          setCommentText={setCommentTextInput}
          onClose={() => {
            setCommentModalVisible(false);
            setCommentTextInput("");
            setSelectedPost(null);
          }}
          onSubmit={submitComment}
        />

        {/* View Comments Modal */}
        <ViewCommentsModal
          visible={viewCommentsModalVisible}
          selectedPost={selectedPost}
          onClose={() => {
            setViewCommentsModalVisible(false);
            setSelectedPost(null);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
