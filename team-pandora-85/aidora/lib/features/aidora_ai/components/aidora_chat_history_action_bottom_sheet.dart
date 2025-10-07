import 'package:aidora/features/aidora_ai/conversations/model/conversation_model.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import '../services/aidora_services.dart';

class AidoraChatHistoryActionBottomSheet extends StatefulWidget {
  final ConversationModel conversation;
  final VoidCallback refreshScreen;

  const AidoraChatHistoryActionBottomSheet({
    super.key,
    required this.refreshScreen,
    required this.conversation,
  });

  @override
  State<AidoraChatHistoryActionBottomSheet> createState() =>
      _AidoraChatHistoryActionBottomSheetState();
}

class _AidoraChatHistoryActionBottomSheetState
    extends State<AidoraChatHistoryActionBottomSheet> {
  final AidoraServices _aidoraServices = AidoraServices();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30.0, vertical: 10),
        child: Container(
          height: 210,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10),
            child: Column(
              children: [
                const Text(
                  "Quick Actions",
                  style: TextStyle(fontWeight: FontWeight.w500),
                ),
                const Spacer(),
                _buildActionItem(
                  icon: IconlyLight.delete,
                  label: "Delete Conversation",
                  onTap: _deleteConversation,
                ),
                _buildActionItem(
                  icon: Icons.headset_mic_rounded,
                  label: "Report Conversation",
                  onTap: () {},
                ),
                _buildActionItem(
                  icon: Icons.remove_red_eye,
                  label: "Review Conversation",
                  onTap: () {},
                ),
                _buildActionItem(
                  icon: Icons.share_rounded,
                  label: "Share Conversation",
                  onTap: () {},
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(5),
          onTap: onTap,
          child: SizedBox(
            height: 30,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Row(
                children: [
                  Icon(icon, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _deleteConversation() async {
    Navigator.pop(context);
    widget.refreshScreen();
  }
}