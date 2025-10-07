import 'package:aidora/features/aidora_ai/conversations/model/conversation_model.dart';
import 'package:aidora/features/aidora_ai/conversations/services/conversation_services.dart';
import 'package:aidora/utilities/error_handler/show_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../utilities/constants/app_colors.dart';
import '../components/conversation_history_card.dart';

class AidoraChatHistoryScreen extends StatefulWidget {
  const AidoraChatHistoryScreen({super.key});

  @override
  State<AidoraChatHistoryScreen> createState() => _AidoraChatHistoryScreenState();
}

class _AidoraChatHistoryScreenState extends State<AidoraChatHistoryScreen> {
  final ConversationServices _conversationServices = ConversationServices();
  late Future<List<ConversationModel>> _conversationsFuture;
  bool isDeleting = false;

  @override
  void initState() {
    super.initState();
    _loadConversations();
  }

  Future<void> _loadConversations() async {
    setState(() {
      _conversationsFuture = _conversationServices.allConversations(context);
    });
  }

  Future<void> _deleteConversation(BuildContext context, String conversationId) async {
   try {
     setState(() {
       isDeleting = true;
     });
     await _conversationServices.deleteConversation(context, conversationId);
     setState(() {
       isDeleting = false;
     });
     await _loadConversations();
   } catch (e) {
     setState(() {
       isDeleting = false;
     });
     showSnackBar(context: context, message: "$e", title: "Something Went Wrong");
   }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(context),
      body: _buildBody(),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.white,
      centerTitle: true,
      title: const Text(
        "Chat History",
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      actions: [
        isDeleting ? Padding(
          padding: const EdgeInsets.only(right: 10.0),
          child: Text(
            "Deleting...",
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey
            ),
          ),
        ) : const SizedBox.shrink()
      ],
    );
  }

  Widget _buildBody() {
    return RefreshIndicator(
      onRefresh: _loadConversations,
      backgroundColor: Colors.white,
      color: Color(AppColors.primaryColor),
      child: FutureBuilder<List<ConversationModel>>(
        future: _conversationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return _buildLoadingIndicator();
          }

          if (snapshot.hasError) {
            return _buildErrorWidget(snapshot.error.toString());
          }

          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return _buildEmptyState();
          }

          return _buildGroupedConversationList(snapshot.data!);
        },
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return Center(
      child: SizedBox(
        height: 30,
        width: 30,
        child: Padding(
          padding: EdgeInsets.all(5.0),
          child: CircularProgressIndicator(
            color: Color(AppColors.primaryColor),
            backgroundColor: Colors.transparent,
            strokeCap: StrokeCap.round,
          ),
        ),
      ),
    );
  }

  Widget _buildErrorWidget(String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 40),
          const SizedBox(height: 16),
          Text(
            'Failed to load conversations',
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            error,
            style: const TextStyle(color: Colors.red),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadConversations,
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.forum_outlined,
            size: 60,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 16),
          Text(
            'No conversations yet',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGroupedConversationList(List<ConversationModel> conversations) {
    final groupedConversations = <String, List<ConversationModel>>{};
    final dateFormat = DateFormat('yyyy-MM-dd');

    for (var conversation in conversations) {
      final dateKey = dateFormat.format(conversation.createdAt);
      if (!groupedConversations.containsKey(dateKey)) {
        groupedConversations[dateKey] = [];
      }
      groupedConversations[dateKey]!.add(conversation);
        }
    if (groupedConversations.isEmpty) {
      return _buildEmptyState();
    }
    final sortedDates = groupedConversations.keys.toList()
      ..sort((a, b) => b.compareTo(a));

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8),
      itemCount: sortedDates.length,
      itemBuilder: (context, index) {
        final date = sortedDates[index];
        final conversationsForDate = groupedConversations[date]!
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 2.0),
              child: Text(
                _formatDateHeader(DateTime.parse(date)),
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            ...conversationsForDate.map((conversation) => ConversationHistoryCard(
              conversation: conversation,
              onClick: () => _deleteConversation(context, conversation.conversationID),
            )),
          ],
        );
      },
    );
  }

  String _formatDateHeader(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));

    if (date.year == today.year && date.month == today.month && date.day == today.day) {
      return 'Today';
    } else if (date.year == yesterday.year &&
        date.month == yesterday.month &&
        date.day == yesterday.day) {
      return 'Yesterday';
    } else {
      return DateFormat('MMMM d, yyyy').format(date);
    }
  }
}