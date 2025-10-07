class MessagesModel {
  final String messageID;
  final String sender;
  final String content;
  final DateTime createdAt;
  final DateTime updatedAt;

  MessagesModel({
    required this.messageID,
    required this.sender,
    required this.content,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MessagesModel.fromMap(Map<String, dynamic> map) {
    return MessagesModel(messageID: map['messageID'] ?? '',
        sender: map['sender'] ?? '',
        content: map['content'] ?? '',
      createdAt: DateTime.parse(map['createdAt']?.toString() ?? DateTime.now().toString()),
      updatedAt: DateTime.parse(map['updatedAt']?.toString() ?? DateTime.now().toString()),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'messageID': messageID,
      'sender': sender,
      'content': content,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
