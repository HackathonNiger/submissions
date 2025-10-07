class MessageMetaData {
  final String source;
  final String urgent;
  final List<String> tags;

  MessageMetaData({
    required this.source,
    required this.urgent,
    required this.tags,
  });

  factory MessageMetaData.fromMap(Map<String, dynamic> map) {
    return MessageMetaData(
      source: map['source'] ?? '',
      urgent: map['urgent'] ?? '',
      tags: List<String>.from(map['tags'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {"source": source, "urgent": urgent, "tags": tags};
  }
}

class AidoraMessageModel {
  final String messageId;
  final String conversationId;
  final String userId;
  final String role;
  final String content;
  final String tokens;
  final String isStreaming;
  final MessageMetaData metadata;
  final DateTime? createdAt;

  AidoraMessageModel({
    required this.messageId,
    required this.conversationId,
    required this.userId,
    required this.role,
    required this.content,
    required this.tokens,
    required this.isStreaming,
    required this.metadata,
    required this.createdAt,
  });

  factory AidoraMessageModel.fromMap(Map<String, dynamic> map) {
    return AidoraMessageModel(
      messageId: map['messageId'] ?? '',
      conversationId: map['conversationId'] ?? '',
      userId: map['userId'] ?? '',
      role: map['role'] ?? '',
      content: map['content'] ?? '',
      tokens: map['tokens'] ?? '',
      isStreaming: map['isStreaming'] ?? '',
      metadata: MessageMetaData.fromMap(map['metadata']),
      createdAt: DateTime.parse(map['createdAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'messageId': messageId,
      'conversationId': conversationId,
      'userId': userId,
      'role': role,
      'content': content,
      'tokens': tokens,
      'isStreaming': isStreaming,
      'metadata': metadata.toMap(),
      "createdAt": createdAt?.toIso8601String()
    };
  }
}
