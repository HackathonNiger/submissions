import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:provider/provider.dart';
import '../components/custom_button_one.dart';
import '../constants/app_colors.dart';
import '../themes/theme_provider.dart';



void showSnackBar(
    {required BuildContext context,
      required String message,
      required String title,
      VoidCallback? onClick,
      bool? isOkayButton,
      bool? isCancelButton,
      bool isExtra = false,
    }) {
  final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
  showCupertinoModalPopup(context: context, builder: (context) => Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Dialog(
        backgroundColor: themeProvider.isDarkMode ? Color(AppColors.primaryColorDarkMode) : Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: Container(
          padding: const EdgeInsets.all(20),
          width: MediaQuery.of(context).size.width * 0.8,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                height: 40,
                width: 40,
                decoration: BoxDecoration(
                    color: Color(AppColors.primaryColor)
                        .withOpacity(0.1),
                    shape: BoxShape.circle),
                child: Center(
                  child: Icon(IconlyBold.message, color: themeProvider.isDarkMode ? Colors.white.withOpacity(0.6) : Color(AppColors.primaryColor),),
                ),
              ),
              const SizedBox(height: 10,),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey
                ),
              ),
              const SizedBox(height: 10,),
              isExtra ? CustomButtonOne(title: "Proceed", onClick: (){
                // Navigator.of(context).push(MaterialPageRoute(builder: (context) => const BvnUpdateScreen()));
              }, isLoading: false) : const SizedBox.shrink()
            ],
          ),
        ),
      ),
      GestureDetector(
        onTap: (){
          Navigator.pop(context);
        },
        child: Container(
          height: 40,
          width: 40,
          decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.5),
              shape: BoxShape.circle
          ),
          child: const Center(
            child: Icon(Icons.close, size: 18,),
          ),
        ),
      ),
    ],
  ));
}
