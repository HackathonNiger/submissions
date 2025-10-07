import 'package:provider/provider.dart';
import 'package:flutter/material.dart';

import '../model/aidora_subscription_plan_model.dart';
import '../model/aidora_version_model.dart';

class AidoraVersionProvider with ChangeNotifier {
  final List<AidoraVersionModel> _versions = [
    AidoraVersionModel(
      name: 'Basic',
      description: 'Core features for casual users',
      isFree: true,
      price: '',
      color: Colors.blue.shade200,
    ),
    AidoraVersionModel(
      name: 'Pro',
      description: 'Advanced features for professionals',
      isFree: false,
      price: '₦9.99/month',
      color: Colors.green.shade200,
    ),
    AidoraVersionModel(
      name: 'Enterprise',
      description: 'Full access with premium support',
      isFree: false,
      price: '₦29.99/month',
      color: Colors.purple.shade200,
    ),
    AidoraVersionModel(
      name: 'Ultimate',
      description: 'All features with exclusive benefits',
      isFree: false,
      price: '₦49.99/month',
      color: Colors.orange.shade200,
    ),
  ];

  final List<AidoraSubscriptionPlanModel> _plans = [
    AidoraSubscriptionPlanModel(
      name: 'Bronze',
      price: '₦5.99/month',
      features: ['Basic features', 'Limited support', '5 projects'],
      color: Colors.brown.shade300,
    ),
    AidoraSubscriptionPlanModel(
      name: 'Silver',
      price: '₦15.99/month',
      features: ['All Bronze features', 'Priority support', '10 projects'],
      color: Colors.grey.shade300,
    ),
    AidoraSubscriptionPlanModel(
      name: 'Gold',
      price: '₦29.99/month',
      features: ['All Silver features', '24/7 support', 'Unlimited projects'],
      color: Colors.yellow.shade300,
    ),
    AidoraSubscriptionPlanModel(
      name: 'Diamond',
      price: '₦49.99/month',
      features: [
        'All Gold features',
        'Dedicated account manager',
        'Custom integrations',
      ],
      color: Colors.cyan.shade300,
    ),
  ];

  List<AidoraVersionModel> get versions => _versions;
  List<AidoraSubscriptionPlanModel> get plans => _plans;

  void subscribeToPlan(String planName) {
    // Implement subscription logic here
    print('Subscribed to $planName');
    notifyListeners();
  }
}