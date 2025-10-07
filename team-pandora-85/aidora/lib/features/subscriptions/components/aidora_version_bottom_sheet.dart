import 'package:aidora/features/subscriptions/components/subscription_card_style.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../provider/aidora_version_provider.dart';


class AidoraVersionBottomSheet extends StatefulWidget {
  const AidoraVersionBottomSheet({super.key});

  @override
  State<AidoraVersionBottomSheet> createState() => _AidoraVersionBottomSheetState();
}

class _AidoraVersionBottomSheetState extends State<AidoraVersionBottomSheet> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height / 1.9,
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Text(
              'Choose Your Version',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
          Consumer<AidoraVersionProvider>(
            builder: (context, provider, child) {
              return Expanded(
                child: SizedBox(
                  child: ListView.builder(
                    itemCount: provider.versions.length,
                    physics: BouncingScrollPhysics(),
                    itemBuilder: (context, index) {
                      final version = provider.versions[index];
                      return SubscriptionCardStyle(versionModel: version);
                    },
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Center(
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SubscriptionScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
              child: Text(
                'See More Plans',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

// Subscription screen
class SubscriptionScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Subscription Plans'),
        backgroundColor: Colors.blue,
      ),
      body: Consumer<AidoraVersionProvider>(
        builder: (context, provider, child) {
          return ListView.builder(
            padding: EdgeInsets.all(16),
            itemCount: provider.plans.length,
            itemBuilder: (context, index) {
              final plan = provider.plans[index];
              return Card(
                elevation: 4,
                margin: EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            plan.name,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: plan.color,
                            ),
                          ),
                          Text(
                            plan.price,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      ...plan.features.map((feature) => Padding(
                        padding: EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            Icon(Icons.check_circle, color: plan.color, size: 20),
                            SizedBox(width: 8),
                            Expanded(child: Text(feature)),
                          ],
                        ),
                      )),
                      SizedBox(height: 16),
                      Center(
                        child: ElevatedButton(
                          onPressed: () {
                            provider.subscribeToPlan(plan.name);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Subscribed to ${plan.name}')),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: plan.color,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          ),
                          child: Text(
                            'Subscribe to ${plan.name}',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}