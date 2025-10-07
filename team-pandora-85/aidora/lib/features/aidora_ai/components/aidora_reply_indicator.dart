import 'package:aidora/utilities/constants/app_icons.dart';
import 'package:flutter/material.dart';
import 'dart:math' as math;

import 'package:iconly/iconly.dart';


class AidoraReplyIndicator extends StatefulWidget {
  final double dotSize;
  final Color dotColor;
  final Duration animationDuration;
  final double amplitude;

  const AidoraReplyIndicator({
    super.key,
    this.dotSize = 8.0,
    this.dotColor = Colors.grey,
    this.animationDuration = const Duration(milliseconds: 800),
    this.amplitude = 8.0,
  });

  @override
  State<AidoraReplyIndicator> createState() => _AidoraReplyIndicatorState();
}

class _AidoraReplyIndicatorState extends State<AidoraReplyIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.animationDuration,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0),
      child: Row(
        children: [
          Container(
            height: 25,
            width: 25,
            // clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
                // color: Colors.grey.withOpacity(0.2),
                shape: BoxShape.circle
            ),
            child: Image.asset(AppIcons.aidoraBot, errorBuilder: (context, err, st) {
              return Center(
                child: Icon(IconlyBold.profile, color: Colors.grey, size: 11,),
              );
            },
              // fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 3,),
          Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(3, (index) {
              return AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  final double phase = index * (1 * math.pi / 3); // 120-degree phase shift
                  final double offset = widget.amplitude *
                      math.sin(2 * math.pi * _controller.value + phase);
                  return Transform.translate(
                    offset: Offset(0, offset),
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 1.0),
                      width: widget.dotSize,
                      height: widget.dotSize,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: widget.dotColor,
                      ),
                    ),
                  );
                },
              );
            }),
          ),
        ],
      ),
    );
  }
}
