import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import '../aidora_reply_indicator.dart';

class SenderChatBubble extends StatelessWidget {
  final String text;
  final bool isStreaming;

  const SenderChatBubble({
    super.key,
    required this.text,
    this.isStreaming = false,
  });

  @override
  Widget build(BuildContext context) {
    return isStreaming || text.isEmpty
        ? const Padding(
      padding: EdgeInsets.only(top: 4),
      child: SizedBox(child: AidoraReplyIndicator(amplitude: 3.0)),
    )
        : Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.only(left: 48.0, right: 12.0),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.blue,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(15),
            topRight: Radius.circular(15),
            bottomLeft: Radius.circular(15),
            bottomRight: Radius.zero,
          ),
        ),
        child: MarkdownBody(
          data: text,
          styleSheet: MarkdownStyleSheet(
            p: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Colors.white
            ),
            code: TextStyle(
              backgroundColor: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
