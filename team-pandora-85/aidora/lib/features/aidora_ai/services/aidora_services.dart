import 'dart:convert';
import 'dart:io';
import 'package:aidora/features/aidora_ai/screens/aidora_chat_screen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:mime/mime.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../utilities/constants/app_strings.dart';

class AidoraServices {
  static const String voiceModel = 'playai-tts';
  static const String voice = 'Fritz-PlayAI';
  static String apiKey = AppStrings.aidoraApiKey;
  static const String model = 'llama-3.3-70b-versatile';
  static const String _model = 'meta-llama/llama-4-scout-17b-16e-instruct';
  static const String _baseUrl =
      'https://api.groq.com/openai/v1/chat/completions';
  static const String _audioTranscriptionsUrl =
      'https://api.groq.com/openai/v1/audio/transcriptions';
  final String serverBaseLink = AppStrings.serverUrl;

  Future<http.Response> callLlamaApi(String prompt) async {
    final response = await http.post(
      Uri.parse(_baseUrl),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'model': model,
        'messages': [
          {
            'role': 'system',
            'content':
            'You are a medical assistant. Provide accurate, concise '
                'answers based on UpToDate and CDC guidelines.',
          },
          {'role': 'user', 'content': prompt},
        ],
        'stream': true,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('API error: ${response.body}');
    }

    return response;
  }

  Future<File> generateSpeech(String text) async {
    final response = await http.post(
      Uri.parse('https://api.groq.com/openai/v1/audio/speech'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body:
      '{"model": "$voiceModel", "voice": "$voice", "input": "$text", "response_format": "wav"}',
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to generate speech: ${response.body}');
    }

    final directory = await getTemporaryDirectory();
    final file = File(
      '${directory.path}/speech_${DateTime
          .now()
          .millisecondsSinceEpoch}.wav',
    );
    await file.writeAsBytes(response.bodyBytes);
    return file;
  }

  String? encodeImage(File image) {
    try {
      final bytes = image.readAsBytesSync();
      final mimeType = lookupMimeType(image.path) ?? 'image/jpeg';

      if (bytes.length > 4 * 1024 * 1024) {
        throw Exception('Image size exceeds 4MB limit');
      }

      return 'data:$mimeType;base64,${base64Encode(bytes)}';
    } catch (e) {
      throw Exception('Error encoding image: $e');
    }
  }

  Future<String> transcribeAudio(File audioFile, {
    String language = 'en',
  }) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse(_audioTranscriptionsUrl),
    );
    request.headers['Authorization'] = 'Bearer $apiKey';
    request.fields['model'] = 'whisper-large-v3-turbo';
    request.fields['response_format'] = 'text';
    request.fields['language'] = language;
    request.files.add(
      await http.MultipartFile.fromPath('file', audioFile.path),
    );

    final response = await request.send();
    if (response.statusCode == 200) {
      final responseBody = await response.stream.bytesToString();
      return responseBody;
    } else {
      throw Exception(
        'Failed to transcribe audio: ${await response.stream.bytesToString()}',
      );
    }
  }

  Future<Map<String, dynamic>> sendRequest({
    required String? question,
    required String? imageUrl,
    required File? imageFile,
    required List<Map<String, dynamic>> messages,
  }) async {
    final content = <Map<String, dynamic>>[
      {
        'type': 'text',
        'text':
        question?.isNotEmpty == true
            ? '$question Provide the response as plain text with key-value pairs where keys are in bold.'
            : 'Provide the response as plain text with key-value pairs where keys are in bold.',
      },
    ];

    if (imageFile != null) {
      final base64Image = encodeImage(imageFile);
      if (base64Image != null) {
        content.add({
          'type': 'image_url',
          'image_url': {'url': base64Image},
        });
      }
    } else if (imageUrl?.isNotEmpty == true) {
      content.add({
        'type': 'image_url',
        'image_url': {'url': imageUrl},
      });
    }

    final updatedMessages =
    messages.map((msg) {
      if (msg['role'] == 'assistant') {
        if (msg['content'] is List) {
          final contentList = msg['content'] as List;
          final textContent = contentList
              .where((c) => c['type'] == 'text')
              .map((c) => c['text'])
              .join(' ');
          return {
            'role': 'assistant',
            'content': textContent.isNotEmpty ? textContent : ' ',
          };
        }
        return msg;
      }
      return msg;
    }).toList();

    updatedMessages.add({'role': 'user', 'content': content});

    final response = await http.post(
      Uri.parse(_baseUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $apiKey',
      },
      body: jsonEncode({
        'model': _model,
        'messages': updatedMessages,
        'temperature': 1,
        'max_completion_tokens': 1024,
        'top_p': 1,
        'stream': false,
        'stop': null,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final assistantContent = data['choices'][0]['message']['content'];
      return {
        'response': assistantContent,
        'messages':
        updatedMessages
          ..add({'role': 'assistant', 'content': assistantContent}),
      };
    } else {
      throw Exception('API Error: ${response.statusCode} - ${response.body}');
    }
  }

  Future<Map<String, dynamic>> sendReasoningRequest({
    required String model,
    required String prompt,
    double temperature = 0.6,
    int maxCompletionTokens = 1024,
    double topP = 0.95,
    bool stream = false,
    String reasoningFormat = 'raw',
    String? responseFormat,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("https://api.groq.com/openai/v1/chat/completions"),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'model': model,
          'messages': [
            {'role': 'user', 'content': prompt},
          ],
          'temperature': temperature,
          'max_tokens': maxCompletionTokens,
          'top_p': topP,
          'stream': stream,
          'reasoning_format': reasoningFormat,
          if (responseFormat != null)
            'response_format': {'type': responseFormat},
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
          'Failed to load completion: ${response.statusCode} - ${response
              .body}',
        );
      }
    } catch (e) {
      throw Exception('Error sending request: $e');
    }
  }

  Future<Map<String, dynamic>> sendToolUseRequest({
    required String model,
    required String prompt,
    required List<Map<String, dynamic>> tools,
    double temperature = 0.6,
    int maxCompletionTokens = 1024,
    double topP = 0.95,
    String reasoningFormat = 'hidden',
  }) async {
    try {
      final response = await http.post(
        Uri.parse("https://api.groq.com/openai/v1/chat/completions"),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'model': model,
          'messages': [
            {'role': 'user', 'content': prompt},
          ],
          'temperature': temperature,
          'max_tokens': maxCompletionTokens,
          'top_p': topP,
          'reasoning_format': reasoningFormat,
          'tools': tools,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
          'Failed to load completion: ${response.statusCode} - ${response
              .body}',
        );
      }
    } catch (e) {
      throw Exception('Error sending request: $e');
    }
  }


  Future<http.Response> triggerTextToSpeech({
    required String text,
    required String voice,
    String model = 'playai-tts',
    String responseFormat = 'wav',
  }) async {
    final url = Uri.parse('https://api.groq.com/openai/v1/audio/speech');
    final headers = {
      'Authorization': 'Bearer $apiKey',
      'Content-Type': 'application/json',
    };
    final body = {
      'model': model,
      'voice': voice,
      'input': text,
      'response_format': responseFormat,
    };

    return await http.post(
      url,
      headers: headers,
      body: jsonEncode(body),
    );
  }

  Future<String> generateConversationTitle({
    String? text,
    File? imageFile,
    String? base64Image,
  }) async {
    try {
      String imageDescription = imageFile != null || base64Image != null
          ? 'Medical-related image (e.g., X-ray, MRI scan, prescription, or medical condition)'
          : 'No image provided';

      String prompt = """
As an AI assistant for ${AppStrings.appName}, generate a concise and descriptive conversation title for a medical chat application based on user input:

- Text message: "${text ?? 'No text provided'}"
- Image: $imageDescription

Context:
- Assume images are medical-related (e.g., X-ray, MRI scan, prescription) unless specified.
- Combine text and image context if both are provided.
- Titles should be 3–10 words, professional, and medically relevant.
- Avoid generic terms like "Chat" unless essential.
- Use a fallback title like "Medical Query" if input is unclear.

Important:
Respond with the title only. Do not include any extra explanation, quotation marks, or formatting. Just output the raw title.
""";


      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'model': model,
          'messages': [
            {
              'role': 'system',
              'content':
              'You are a medical assistant. Provide accurate, concise answers based on UpToDate and CDC guidelines.',
            },
            {'role': 'user', 'content': prompt},
          ],
          'temperature': 0.6,
          'max_tokens': 50,
          'stream': false,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        String title = data['choices'][0]['message']['content']?.trim() ??
            'Medical Query';
        List<String> words = title.split(' ');
        if (words.length > 10) {
          title = words.sublist(0, 10).join(' ');
        }
        return title.isNotEmpty ? title : 'Medical Query';
      } else {
        throw Exception('API error: ${response.body}');
      }
    } catch (e) {
      debugPrint('Error generating conversation title: $e');
      return 'Medical Query';
    }
  }

}
