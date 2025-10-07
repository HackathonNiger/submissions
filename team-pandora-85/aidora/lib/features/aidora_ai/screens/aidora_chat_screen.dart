import 'dart:convert';
import 'dart:io';
import 'package:aidora/features/aidora_ai/conversations/services/conversation_services.dart';
import 'package:aidora/features/aidora_ai/screens/aidora_voices_screen.dart';
import 'package:aidora/features/subscriptions/components/aidora_version_bottom_sheet.dart';
import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../../../utilities/constants/app_colors.dart';
import '../../../utilities/constants/app_icons.dart';
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
import 'aidora_voice_chat_screen.dart';

class AidoraChatScreen extends StatefulWidget {
  final String? conversationID;

  const AidoraChatScreen({super.key, this.conversationID});

  @override
  State<AidoraChatScreen> createState() => _AidoraChatScreenState();
}

class _AidoraChatScreenState extends State<AidoraChatScreen> {
  final _messageController = TextEditingController();
  String options = "";
  String selectedQuestion = "";
  bool isQuestionSelected = false;
  final ScrollController _scrollController = ScrollController();
  final ConversationServices _conversationServices = ConversationServices();

  final AidoraServices _aidoraServices = AidoraServices();
  final ImagePicker _imagePicker = ImagePicker();
  File? _imageFile;
  String? _base64Image;


  Future<void> _createNewConversation(
    BuildContext context,
    String title,
  ) async {
    try {
      final provider = Provider.of<AidoraChatProvider>(context, listen: false);
      provider.setConversationId(const Uuid().v4());
      await _conversationServices.createNewConversation(context, title);
    } catch (e) {
      print(e);
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _imagePicker.pickImage(source: source);
      if (pickedFile != null) {
        if (kIsWeb) {
          final bytes = await pickedFile.readAsBytes();
          final base64Image = base64Encode(bytes);
          setState(() {
            _imageFile = null;
            _base64Image = base64Image;
            options = "Image";
          });
        } else {
          setState(() {
            _imageFile = File(pickedFile.path);
            _base64Image = null;
            options = "Image";
          });
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking image: $e')));
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
    final seekSettingsProvider = Provider.of<AidoraSeekSettingsProvider>(
      context,
      listen: false,
    );
    final text = _messageController.text.trim();

    if (text.isEmpty && _imageFile == null && _base64Image == null) return;

    try {
      if (options == "Seek") {
        setState(() {
          _messageController.clear();
          _imageFile = null;
          _base64Image = null;
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
      } else if (_imageFile != null || _base64Image != null) {
        final tempImageFile = _imageFile;
        final tempBase64Image = _base64Image;
        setState(() {
          _messageController.clear();
          _imageFile = null;
          _base64Image = null;
          options = "";
        });
        await provider.sendImageMessage(
          text: text.isNotEmpty ? text : null,
          imageFile: kIsWeb ? null : tempImageFile,
          base64Image: kIsWeb ? tempBase64Image : null,
        );
        String conversationTitle = await _aidoraServices.generateConversationTitle(
          text: text.isNotEmpty ? text : null,
          imageFile: tempImageFile,
          base64Image: tempBase64Image,
        );
        await _createNewConversation(context, conversationTitle);
      } else {
        setState(() {
          _messageController.clear();
          _imageFile = null;
          _base64Image = null;
          options = "";
        });
        await provider.sendMessage(text);
        String conversationTitle = await _aidoraServices
            .generateConversationTitle(
              text: text.isNotEmpty ? text : null,
              imageFile: _imageFile,
              base64Image: _base64Image,
            );
        await _createNewConversation(context, conversationTitle);
      }
      _scrollToBottom();
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error sending message: $e')));
    }
  }

  void _showAidoraVoiceChatBottomSheet(BuildContext context) {
    showCupertinoModalPopup(
      context: context,
      builder: (context) {
        return AidoraVoiceChatBottomSheet();
      },
    );
  }

  Future<void> _loadAidoraConversation(BuildContext context) async {
    try {} catch (e) {
      print(e);
    }
  }

  Future<void> _initializeConversation(BuildContext context) async {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    provider.setConversationId(widget.conversationID);
    if (widget.conversationID != null) {
      await _loadAidoraConversation(context);
    } else {
      // await _createNewConversation(context, "New Chat");
    }
  }

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    provider.addListener(_scrollToBottom);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeConversation(context);
      _scrollToBottom();
    });
  }

  @override
  void dispose() {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    provider.removeListener(_scrollToBottom);
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AidoraChatProvider>(context);
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        centerTitle: true,
        title: Container(
          height: 26,
          width: 100,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: Colors.grey.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: MaterialButton(
            onPressed: () {},
            padding: EdgeInsets.zero,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "${AppStrings.appName} v1.0",
                  style: TextStyle(
                    fontSize: 12,
                    // color: Colors.grey
                  ),
                ),
                const SizedBox(width: 5),
                Icon(Icons.keyboard_arrow_down_rounded, size: 13),
              ],
            ),
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                _messageController.clear();
                _imageFile = null;
                _base64Image = null;
                options = "";
              });
              provider.clearConversation();
            },
            icon: const Icon(IconlyLight.edit_square, color: Colors.grey),
          ),
          IconButton(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const AidoraChatHistoryScreen(),
                ),
              );
            },
            icon: SizedBox(
              height: 20,
              width: 20,
              child: Image.asset(AppIcons.historyIcon, color: Colors.grey),
            ),
          ),
        ],
      ),
      body: provider.messages.isNotEmpty
          ? SingleChildScrollView(
              controller: _scrollController,
              physics: const BouncingScrollPhysics(),
              reverse: false,
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
                      child: Image.asset(AppIcons.aidoraBot),
                    ),
                  ),
                  const SizedBox(height: 30),
                  Text(
                    "Hi, i'm ${AppStrings.appName}",
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Text(
                    "How can i help you today?",
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
      bottomSheet: _imageFile == null && _base64Image == null
          ? Container(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.2),
                    offset: const Offset(1, 1),
                    blurRadius: 10,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10.0,
                  vertical: 0,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: 35,
                      child: TextFormField(
                        controller: _messageController,
                        cursorHeight: 15,
                        onChanged: (value) {
                          setState(() {});
                        },
                        cursorColor: Color(AppColors.primaryColor),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                        decoration: InputDecoration(
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(50),
                            borderSide: const BorderSide(
                              color: Colors.transparent,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(50),
                            borderSide: BorderSide(
                              color: Colors.grey.withOpacity(0.0),
                            ),
                          ),
                          fillColor: Colors.grey.withOpacity(0.0),
                          filled: false,
                          hintText: _imageFile != null || _base64Image != null
                              ? "Need info on the image?"
                              : options == "Seek"
                              ? "Ask a question using Seek settings..."
                              : "Ask ${AppStrings.appName} any medical question...",
                          hintStyle: const TextStyle(
                            fontSize: 11,
                            color: Colors.grey,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 10,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () => _pickImage(ImageSource.camera),
                          child: Container(
                            height: 32,
                            width: 32,
                            decoration: BoxDecoration(
                              color: Colors.grey.withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Icon(
                                IconlyLight.camera,
                                size: 16,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 5),
                        GestureDetector(
                          onTap: () => _pickImage(ImageSource.gallery),
                          child: Container(
                            height: 32,
                            width: 32,
                            decoration: BoxDecoration(
                              color: Colors.grey.withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Icon(
                                IconlyLight.image,
                                size: 16,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 5),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => AidoraVoicesScreen(),
                              ),
                            );
                          },
                          child: Container(
                            height: 28,
                            width: 70,
                            decoration: BoxDecoration(
                              color: Colors.grey.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  IconlyLight.voice,
                                  color: Colors.grey,
                                  size: 14,
                                ),
                                const SizedBox(width: 2),
                                Text(
                                  "Voices",
                                  style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const Spacer(),
                        GestureDetector(
                          onTap:
                              _messageController.text.trim().isEmpty &&
                                  _imageFile == null &&
                                  _base64Image == null
                              ? () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          const AidoraVoiceChatScreen(),
                                    ),
                                  );
                                }
                              : _sendMessage,
                          onLongPress: () =>
                              _showAidoraVoiceChatBottomSheet(context),
                          child: Container(
                            height: 32,
                            width: 32,
                            decoration: BoxDecoration(
                              color:
                                  (_messageController.text.trim().isNotEmpty ||
                                      _imageFile != null ||
                                      _base64Image != null)
                                  ? Color(AppColors.primaryColor)
                                  : Colors.grey.withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Icon(
                                _messageController.text.trim().isEmpty &&
                                        _imageFile == null &&
                                        _base64Image == null
                                    ? IconlyLight.voice
                                    : Icons.arrow_upward_rounded,
                                size: 16,
                                color:
                                    _messageController.text.trim().isEmpty &&
                                        _imageFile == null &&
                                        _base64Image == null
                                    ? Colors.grey
                                    : Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                  ],
                ),
              ),
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: _imageFile != null || _base64Image != null
          ? Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Expanded(
                        child: Container(
                          height: 40,
                          width: MediaQuery.of(context).size.width,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(10),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.5),
                                offset: const Offset(-8, 1),
                                blurRadius: 15,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: SizedBox(
                            height: 35,
                            child: TextFormField(
                              controller: _messageController,
                              cursorHeight: 15,
                              onChanged: (value) {
                                setState(() {});
                              },
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                              decoration: InputDecoration(
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(50),
                                  borderSide: const BorderSide(
                                    color: Colors.transparent,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(50),
                                  borderSide: BorderSide(
                                    color: Colors.grey.withOpacity(0.0),
                                  ),
                                ),
                                fillColor: Colors.grey.withOpacity(0.0),
                                filled: false,
                                hintText: _imageFile != null
                                    ? "Need info on the image?"
                                    : options == "Seek"
                                    ? "Ask a question using Seek settings..."
                                    : "Ask ${AppStrings.appName} any medical question...",
                                hintStyle: const TextStyle(
                                  fontSize: 11,
                                  color: Colors.grey,
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 0),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10.0,
                            ),
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  // _imageFile = null;
                                  // options = "";
                                  _imageFile = null;
                                  _base64Image = null;
                                  options = "";
                                });
                              },
                              child: Container(
                                height: 30,
                                width: 30,
                                decoration: BoxDecoration(
                                  color: Colors.grey.withOpacity(0.4),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.close,
                                  color: Colors.white,
                                  size: 15,
                                ),
                              ),
                            ),
                          ),
                          Container(
                            height: 200,
                            width: 150,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(23),
                                topRight: Radius.circular(23),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.grey.withOpacity(0.1),
                                  offset: Offset(0, -18),
                                  blurRadius: 10,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(5.0),
                              child: Container(
                                height: 200,
                                width: 150,
                                clipBehavior: Clip.antiAlias,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                child: kIsWeb
                                    ? Image.memory(
                                        base64Decode(_base64Image!),
                                        fit: BoxFit.cover,
                                      )
                                    : Image.file(
                                        _imageFile!,
                                        fit: BoxFit.cover,
                                      ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    height: 50,
                    width: MediaQuery.of(context).size.width,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(10),
                        bottomRight: Radius.circular(10),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          offset: const Offset(10, 10),
                          blurRadius: 10,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 5.0),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              if (options == "Image") {
                                setState(() {
                                  options = "";
                                  _imageFile = null;
                                });
                              } else {
                                _showImageOptionBottomSheet(context);
                              }
                            },
                            child: Container(
                              height: 28,
                              width: 70,
                              decoration: BoxDecoration(
                                color: options == "Image"
                                    ? Color(
                                        AppColors.primaryColor,
                                      ).withOpacity(0.2)
                                    : Colors.grey.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    IconlyLight.image,
                                    color: options == "Image"
                                        ? Color(AppColors.primaryColor)
                                        : Colors.grey,
                                    size: 14,
                                  ),
                                  const SizedBox(width: 2),
                                  Text(
                                    "Image",
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w500,
                                      color: options == "Image"
                                          ? Color(AppColors.primaryColor)
                                          : Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const Spacer(),
                          GestureDetector(
                            onTap:
                                _messageController.text.trim().isEmpty &&
                                    _imageFile == null
                                ? () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const AidoraVoiceChatScreen(),
                                      ),
                                    );
                                  }
                                : _sendMessage,
                            child: Container(
                              height: 32,
                              width: 32,
                              decoration: BoxDecoration(
                                color:
                                    (_messageController.text
                                            .trim()
                                            .isNotEmpty ||
                                        _imageFile != null)
                                    ? Color(AppColors.primaryColor)
                                    : Colors.grey.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Icon(
                                  _messageController.text.trim().isEmpty &&
                                          _imageFile == null
                                      ? IconlyLight.voice
                                      : Icons.arrow_upward_rounded,
                                  size: 16,
                                  color:
                                      _messageController.text.trim().isEmpty &&
                                          _imageFile == null
                                      ? Colors.white
                                      : Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            )
          : null,
    );
  }
}
