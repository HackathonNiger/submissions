import 'package:aidora/features/aidora_ai/history/components/conversation_history_card_one.dart';
import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:flutter/material.dart';

class ChatHistorySection extends StatefulWidget {
  const ChatHistorySection({super.key});

  @override
  State<ChatHistorySection> createState() => _ChatHistorySectionState();
}

class _ChatHistorySectionState extends State<ChatHistorySection> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Recent Chats",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500
                    ),
                  ),
                  Text(
                    "Below is your recent chat history",
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey
                    ),
                  ),
                ],
              ),
              Text("View All", style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: Color(AppColors.primaryColor)
              ),)
            ],
          ),
          const SizedBox(height: 5,),
          for (int i = 0; i < 8; i++)
            ConversationHistoryCardOne()
        ],
      ),
    );
  }
}
