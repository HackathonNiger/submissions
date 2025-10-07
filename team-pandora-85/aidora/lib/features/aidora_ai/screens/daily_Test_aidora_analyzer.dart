import 'dart:convert';
import 'dart:io';
import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mime/mime.dart';
import 'dart:async';
import 'package:provider/provider.dart';
import '../components/aidora_info_dialog.dart';
import '../components/aidora_voice_chat_bottom_sheet.dart';
import '../components/chat_bubbles/chat_bubble.dart';
import '../components/image_option_bottom_sheet.dart';
import '../components/sender_image_message_bubble.dart';
import '../model/aidora_chat_model.dart';
import '../provider/aidora_chat_provider.dart';
import '../provider/aidora_seek_settings_provider.dart';
import '../services/aidora_services.dart';
import 'aidora_chat_history_screen.dart';

class DailyTestAidoraAnalyzer extends StatefulWidget {
  final Map<String, dynamic>? vitals;
  const DailyTestAidoraAnalyzer({super.key, this.vitals});

  @override
  State<DailyTestAidoraAnalyzer> createState() => _DailyTestAidoraAnalyzerState();
}

class _DailyTestAidoraAnalyzerState extends State<DailyTestAidoraAnalyzer> {
  final _messageController = TextEditingController();
  String options = "";
  String selectedQuestion = "";
  bool isQuestionSelected = false;

  final AidoraServices _aidoraServices = AidoraServices();
  final ImagePicker _imagePicker = ImagePicker();
  File? _imageFile;

  @override
  void initState() {
    // If vitals are provided, compose and send the vital check message
    if (widget.vitals != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _sendVitalsMessage(widget.vitals!);
      });
    }
    super.initState();
  }
  Future<void> _sendVitalsMessage(Map<String, dynamic> vitals) async {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    // Compose the vital check message
    String message = """
Please analyze the following patient vitals and provide a medical assessment:

- **Symptoms**: ${vitals['symptoms']['selected'].join(', ')}${vitals['symptoms']['other'].isNotEmpty ? ', Other: ${vitals['symptoms']['other']}' : ''}
- **Duration of Symptoms**: ${vitals['duration']}
- **Severity of Symptoms**: ${vitals['severity']}
- **Pre-existing Conditions**: ${vitals['pre_existing_conditions']['selected'].join(', ')}${vitals['pre_existing_conditions']['other'].isNotEmpty ? ', Other: ${vitals['pre_existing_conditions']['other']}' : ''}
- **Current Medication**: ${vitals['medication']}
""";

    try {
      await provider.sendMessage(message);
      _createNewConversation(context, "Vital Check");
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error sending vitals: $e')),
      );
    }
  }

  Future<void> _showAidoraBottomSheet(BuildContext context) async {
    showCupertinoModalPopup(
      context: context,
      builder: (context) => const AidoraInfoDialog(),
    );
  }

  Future<void> _createNewConversation(BuildContext context, String title) async {
    try {
    } catch (e) {
      print(e);
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _imagePicker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _imageFile = File(pickedFile.path);
          options = "Image";
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  void _showImageOptionBottomSheet(BuildContext context) {
    showCupertinoModalPopup(
      context: context,
      builder: (context) => ImageOptionBottomSheet(
        onGalleryClicked: () {
          _pickImage(ImageSource.gallery);
          Navigator.pop(context);
        },
        onCameraClicked: () {
          _pickImage(ImageSource.camera);
          Navigator.pop(context);
        },
      ),
    );
  }

  Future<void> _sendMessage() async {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    final seekSettingsProvider = Provider.of<AidoraSeekSettingsProvider>(context, listen: false);
    final text = _messageController.text.trim();

    if (text.isEmpty && _imageFile == null) return;

    try {
      if (options == "Seek") {
        setState(() {
          _messageController.clear();
          _imageFile = null;
        });
        await provider.sendSeekMessage(
          text: text.isNotEmpty ? text : null,
          model: seekSettingsProvider.selectedModel,
          temperature: seekSettingsProvider.temperature,
          maxTokens: seekSettingsProvider.maxTokens,
          topP: seekSettingsProvider.topP,
          reasoningFormat: seekSettingsProvider.selectedReasoningFormat,
          useTools: seekSettingsProvider.useTools,
          stream: seekSettingsProvider.streamResponse,
        );
      } else if (_imageFile != null) {
        final tempImageFile = _imageFile;
        setState(() {
          _messageController.clear();
          _imageFile = null;
          options = "";
        });
        await provider.sendImageMessage(
          text: text.isNotEmpty ? text : null,
          imageFile: tempImageFile,
        );
      } else {
        setState(() {
          _messageController.clear();
          _imageFile = null;
          options = "";
        });
        await provider.sendMessage(text);
        _createNewConversation(context, text);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error sending message: $e')),
      );
    }
  }

  void _showAidoraVoiceChatBottomSheet(BuildContext context) {
    showCupertinoModalPopup(context: context, builder: (context) {
      return AidoraVoiceChatBottomSheet();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AidoraChatProvider>(context);
    final seekSettingsProvider = Provider.of<AidoraSeekSettingsProvider>(context);
    return Stack(
      children: [
        // MovingCirclesScreen(),
        Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.9),
          ),
        ),
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.transparent,
            centerTitle: true,
            automaticallyImplyLeading: false,
            actions: [
            ],
            title: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "Vital Analysis",
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.black,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          body: provider.messages.isNotEmpty
              ? SingleChildScrollView(
            reverse: true,
            child: Column(
              children: [
                for (var msg in provider.messages.reversed)
                  if (msg.sender == Sender.user &&
                      (msg.imageMessageData.containsKey('file') ||
                          msg.imageMessageData.containsKey('url')))
                    Align(
                      alignment: Alignment.centerRight,
                      child: SenderImageMessageBubble(
                        imageFile: msg.imageMessageData['file'] as File?,
                        imageUrl: msg.imageMessageData['url'] as String?,
                        text: msg.text,
                      ),
                    )
                  else
                    Align(
                      alignment: msg.sender == Sender.user
                          ? Alignment.centerRight
                          : Alignment.centerLeft,
                      child: ChatBubble(
                        text: msg.text,
                        isUser: msg.sender == Sender.user,
                        isStreaming: msg.isStreaming,
                      ),
                    ),
                const SizedBox(height: 100),
              ],
            ),
          )
              : Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  height: 50,
                  width: 50,
                  child: Transform.scale(
                    scale: 2.3,
                    child: Image.asset("images/clodocs_ai.gif"),
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  "Hi, i'm ${AppStrings.appName}",
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                ),
                const Text(
                  "How can i help you today?",
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
      ],

    );
  }
}