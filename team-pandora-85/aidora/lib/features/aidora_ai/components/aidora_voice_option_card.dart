import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

import '../../../utilities/constants/app_colors.dart';

class AidoraVoiceOptionCard extends StatelessWidget {
  final String title;
  final VoidCallback onClick;
  final int currentIndex;
  final int index;
  final bool isPlaying;
  const AidoraVoiceOptionCard({super.key, required this.title, required this.onClick, required this.currentIndex, required this.index, required this.isPlaying});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0),
      child: Container(
        height: 40,
        width: MediaQuery.of(context).size.width,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: Colors.transparent
        ),
        child: MaterialButton(
          onPressed: onClick,
          child: Row(
            children: [
              Icon(isPlaying ? Icons.multitrack_audio : IconlyBroken.voice_2, color: isPlaying ? Colors.green : Colors.grey,),
              const SizedBox(width: 5,),
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w400
                ),
              ),
              Spacer(),
              Container(
                height: 20,
                width: 20,
                decoration: BoxDecoration(
                  border: Border.all(width: 1, color: currentIndex == index ? Color(AppColors.primaryColor): Colors.grey),
                  shape: BoxShape.circle
                ),
                child: currentIndex == index ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(2.0),
                    child: Container(
                      height: 25,
                      width: 25,
                      decoration: BoxDecoration(
                          border: Border.all(width: 1, color: Color(AppColors.primaryColor)),
                          shape: BoxShape.circle
                      ),
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.all(2.0),
                          child: Container(
                            height: 25,
                            width: 25,
                            decoration: BoxDecoration(
                                border: Border.all(width: 1, color: Color(AppColors.primaryColor)),
                                shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ) : null,
              )
            ],
          ),
        ),
      ),
    );
  }
}
