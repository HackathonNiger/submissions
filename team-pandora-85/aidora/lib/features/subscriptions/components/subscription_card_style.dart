import 'package:aidora/features/subscriptions/model/aidora_version_model.dart';
import 'package:flutter/material.dart';
import 'aidora_version_bottom_sheet.dart';

class SubscriptionCardStyle extends StatelessWidget {
  final AidoraVersionModel versionModel;
  const SubscriptionCardStyle({super.key, required this.versionModel});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
        gradient: LinearGradient(
          colors: versionModel.isFree
              ? [Colors.green.shade300, Colors.green.shade600]
              : [Colors.blue.shade300, Colors.blue.shade600],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        // Additional background effect with background image (optional)
        image: DecorationImage(
          image: AssetImage('assets/background.png'), // Optional background image
          fit: BoxFit.cover,
          opacity: 0.2, // Semi-transparent background image effect
        ),
      ),
      child: MaterialButton(
        onPressed: () {
          if (!versionModel.isFree) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => SubscriptionScreen(),
              ),
            );
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'Selected ${versionModel.name}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                backgroundColor: Colors.green.shade600,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
            );
          }
        },
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Stylish avatar with gradient border and shadow
            Container(
              height: 56,
              width: 56,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: versionModel.isFree
                      ? [Colors.green.shade300, Colors.green.shade600]
                      : [Colors.blue.shade300, Colors.blue.shade600],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 6,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  versionModel.name[0].toUpperCase(),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 20.0), // Space between avatar and text
            // Text layout with better spacing and font styles
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    versionModel.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6.0), // Spacing for description
                  Text(
                    versionModel.description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.8),
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8.0), // Space between description and price
                  Text(
                    versionModel.isFree
                        ? 'Free'
                        : versionModel.price,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: versionModel.isFree
                          ? Colors.green.shade200
                          : Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            // Subtle forward arrow icon
            Icon(
              Icons.arrow_forward_ios,
              size: 18,
              color: Colors.white.withOpacity(0.8),
            ),
          ],
        ),
      ),
    );
  }
}
