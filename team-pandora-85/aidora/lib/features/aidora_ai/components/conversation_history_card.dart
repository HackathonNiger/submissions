import 'package:aidora/features/aidora_ai/conversations/model/conversation_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:intl/intl.dart';

import '../../../utilities/constants/app_icons.dart';

class ConversationHistoryCard extends StatelessWidget {
  final ConversationModel conversation;
  final VoidCallback onClick;

  const ConversationHistoryCard({
    super.key,
    required this.conversation,
    required this.onClick,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: GestureDetector(
        onTap: (){
          // Navigator.of(context).push(MaterialPageRoute(builder: (context) => AidoraChatScreen(conversationID: conversation.conversationId,)));
        },
        child: Container(
          decoration: BoxDecoration(),
          child: Row(
            children: [
              _buildAvatar(),
              const SizedBox(width: 5),
              _buildConversationInfo(),
              const Spacer(),
              _buildMoreButton(context, onClick),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAvatar() {
    return SizedBox(
      height: 50,
      width: 50,
      child: Stack(
        children: [
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 45,
              width: 45,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                shape: BoxShape.circle,
                border: Border.all(width: 2, color: Colors.grey),
              ),
            ),
          ),
          Center(
            child: Container(
              height: 50,
              width: 50,
              child: Padding(
                padding: const EdgeInsets.all(0.0),
                child: Image.asset(
                  AppIcons.aidoraBot,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConversationInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              conversation.title.length > 30 ? "${conversation.title.substring(0, 30)}..." : conversation.title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        Text(
          "message hint goes here",
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w400,
          ),
        ),
        Text(
          DateFormat('MMM d, y').format(DateTime.parse("${conversation.createdAt}")),
          style: const TextStyle(fontSize: 10, color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildMoreButton(BuildContext context, VoidCallback onClick) {
    return IconButton(
      onPressed: onClick,
      icon: const Icon(
        IconlyLight.delete,
        color: Colors.grey,
        size: 20,
      ),
    );
  }
}