import 'package:aidora/features/aidora_ai/components/chat_bubbles/receiver_chat_bubble.dart';
import 'package:aidora/features/aidora_ai/components/chat_bubbles/sender_chat_bubble.dart';
import 'package:flutter/material.dart';


class ChatBubble extends StatelessWidget {
  final String text;
  final bool isUser;
  final bool isStreaming;

  const ChatBubble({
    super.key,
    required this.text,
    required this.isUser,
    this.isStreaming = false,
  });

  @override
  Widget build(BuildContext context) {
    return isUser
        ? SenderChatBubble(text: text, isStreaming: isStreaming)
        : ReceiverChatBubble(text: text, isStreaming: isStreaming);
  }
}
