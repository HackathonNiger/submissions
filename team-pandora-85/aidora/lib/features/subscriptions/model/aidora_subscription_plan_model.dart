import 'package:flutter/material.dart';

class AidoraSubscriptionPlanModel {
  final String name;
  final String price;
  final List<String> features;
  final Color color;

  AidoraSubscriptionPlanModel({
    required this.name,
    required this.price,
    required this.features,
    required this.color,
  });
}