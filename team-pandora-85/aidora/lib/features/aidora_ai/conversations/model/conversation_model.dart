import 'package:aidora/features/aidora_ai/messages/model/messages_model.dart';

class ConversationModel {
  final String conversationID;
  final String title;
  final String userID;
  final List<MessagesModel> messages;
  final DateTime createdAt;
  final DateTime updatedAt;

  ConversationModel({
    required this.conversationID,
    required this.title,
    required this.userID,
    required this.messages,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ConversationModel.fromMap(Map<String, dynamic> map) {
    List<MessagesModel> messages = [];
    if (map['messages'] != null && map['messages'] is List) {
      try {
        messages = (map['messages'] as List<dynamic>)
            .map(
              (message) =>
                  MessagesModel.fromMap(message as Map<String, dynamic>),
            )
            .toList();
      } catch (e) {
        messages = [];
      }
    }
    return ConversationModel(
      conversationID: map['conversationID'] ?? '',
      title: map['title'] ?? '',
      userID: map['userID'] ?? '',
      messages: messages,
      createdAt: DateTime.parse(
        map['createdAt']?.toString() ?? DateTime.now().toString(),
      ),
      updatedAt: DateTime.parse(
        map['updatedAt']?.toString() ?? DateTime.now().toString(),
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'conversationID': conversationID,
      'title': title,
      'userID': userID,
      'messages': messages.map((message) => message.toMap()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
