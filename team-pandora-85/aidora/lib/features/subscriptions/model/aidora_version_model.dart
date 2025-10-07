import 'package:flutter/material.dart';

class AidoraVersionModel {
  final String name;
  final String description;
  final bool isFree;
  final String price;
  final Color color;

  AidoraVersionModel({
    required this.name,
    required this.description,
    required this.isFree,
    required this.price,
    required this.color,
  });
}