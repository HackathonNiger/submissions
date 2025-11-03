import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/material.dart';

import '../../../utilities/constants/app_icons.dart';

class AidoraInfoDialog extends StatelessWidget {
  const AidoraInfoDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 10),
        child: Container(
          height: 300,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20)
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0, horizontal: 10),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "About ",
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.grey,
                        fontWeight: FontWeight.w500
                      ),
                    ),
                    Text(
                      AppStrings.appName,
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                Spacer(),
                SizedBox(
                  height: 120,
                    width: 120,
                    child: Image.asset(AppIcons.aidoraBot)),
                Spacer(),
                Text(
                AppStrings.appName,
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Text(
                    "${AppStrings.appName} is an intelligent virtual health assistant developed by CloDocs to deliver fast, accurate, and personalized responses to your health questions. Built with advanced proprietary AI technology, ${AppStrings.appName} enhances patient interaction and supports well-informed healthcare decisions.",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 10,
                      color: Colors.grey,
                    ),
                  )
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
