enum Sender { user, ai }

class Message {
  final String id;
  final String text;
  final Sender sender;
  final DateTime timestamp;
  final bool isStreaming;
  final Map<String, dynamic> imageMessageData;

  Message({
    required this.id,
    required this.text,
    required this.sender,
    required this.timestamp,
    required this.imageMessageData,
    this.isStreaming = false,
  });

  Message copyWith({
    String? text,
    bool? isStreaming,
    Map<String, dynamic>? imageMessageData,
  }) {
    return Message(
      id: id,
      text: text ?? this.text,
      sender: sender,
      timestamp: timestamp,
      isStreaming: isStreaming ?? this.isStreaming,
      imageMessageData: imageMessageData ?? this.imageMessageData,
    );
  }
}