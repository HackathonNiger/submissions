import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class SenderImageMessageBubble extends StatelessWidget {
  final File? imageFile;
  final String? imageUrl;
  final String text;

  const SenderImageMessageBubble({
    super.key,
    this.imageFile,
    this.imageUrl,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
      child: Container(
        width: MediaQuery.of(context).size.width / 1.8,
        decoration: BoxDecoration(
          // color: Colors.blue[50],
          borderRadius: BorderRadius.circular(15),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                height: 180,
                width: 150,
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(15),
                    topRight: Radius.circular(15),
                    bottomLeft: Radius.circular(15),
                    bottomRight: Radius.zero,
                  ),
                ),
                child: imageFile != null
                    ? Image.file(
                  imageFile!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.error,
                    color: Colors.red,
                    size: 50,
                  ),
                )
                    : imageUrl != null
                    ? Image.network(
                  imageUrl!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) =>
                  const Icon(
                    Icons.error,
                    color: Colors.red,
                    size: 50,
                  ),
                )
                    : const Icon(
                  Icons.image_not_supported,
                  color: Colors.grey,
                  size: 50,
                ),
              ),
              const SizedBox(height: 2),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(15),
                    topRight: Radius.zero,
                    bottomLeft: Radius.circular(15),
                    bottomRight: Radius.circular(15),
                  ),
                ),
                child: MarkdownBody(
                  data: text.isNotEmpty ? text : "No question provided",
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
            ],
          ),
        ),
      ),
    );
  }
}