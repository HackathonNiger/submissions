import 'package:aidora/features/aidora_ai/services/aidora_services.dart';
import 'package:aidora/features/auth/screens/login/login_screen.dart';
import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:aidora/utilities/constants/app_icons.dart';
import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../utilities/components/custom_button_one.dart';
import '../../../utilities/components/custom_dot_indicator.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int totalPage = 0;
  final PageController _pageController = PageController(initialPage: 0);

  final AidoraServices _aidoraServices = AidoraServices();

  void onPageChange(int index) {
    setState(() {
      totalPage = index;
    });
  }

  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    double imageHeightSize = MediaQuery.of(context).size.width / 1.6;
    double imageWidthSize = MediaQuery.of(context).size.width / 1.6;
    return Scaffold(
      body: Stack(
        children: [
          Scaffold(
            backgroundColor: Colors.white,
            appBar: AppBar(
              backgroundColor: Colors.white,
              surfaceTintColor: Colors.white,
              automaticallyImplyLeading: false,
              leadingWidth: 100,
              leading: totalPage > 0
                  ? GestureDetector(
                      onTap: totalPage > 0
                          ? () {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            }
                          : () {},
                      child: Padding(
                        padding: const EdgeInsets.only(left: 10.0),
                        child: Container(
                          decoration: BoxDecoration(),
                          child: Row(
                            children: [
                              Icon(
                                CupertinoIcons.backward_end,
                                color: Colors.grey,
                                size: 18,
                              ),
                              const SizedBox(width: 3),
                              Text(
                                "Previous",
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  : const SizedBox.shrink(),
              actions: [
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10.0),
                  child: Row(
                    children: [
                      for (int i = 0; i < 5; i++)
                        if (totalPage == i)
                          const CustomDotIndicator(isCurrent: true)
                        else
                          const CustomDotIndicator(isCurrent: false),
                    ],
                  ),
                ),
              ],
            ),
            body: PageView.builder(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 5,
              onPageChanged: onPageChange,
              itemBuilder: (context, pageIndex) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (pageIndex == 0) ...[
                        Expanded(child: SizedBox(
                          height: imageHeightSize,
                          width: imageWidthSize,
                            child: Image.asset(AppIcons.aidoraBot))),
                        const SizedBox(height: 10,),
                        RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text: "Meet ",
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black,
                                ),
                              ),
                              TextSpan(
                                text: AppStrings.appName,
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w400,
                                  color: Color(AppColors.primaryColor),
                                ),
                              ),
                              TextSpan(
                                text: " Your ",
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black,
                                ),
                              ),
                              TextSpan(
                                text: " AI ",
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.deepPurple,
                                ),
                              ),
                              TextSpan(
                                text: " Health Companion",
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Text(
                          "Access reliable medical support, right from your pocket.",
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                        const SizedBox(height: 10),
                      ]
                      else if (pageIndex == 1) ...[
                        Expanded(child: SizedBox(
                            height: imageHeightSize,
                            width: imageWidthSize,
                            child: Image.asset(AppIcons.onboardingImgOne))),
                        const SizedBox(height: 10,),
                        RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text: "Voice, Text & Image Support",
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Text(
                          "Share your symptoms, prescriptions or lab tests for instant guidance.",
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                        const SizedBox(height: 10),
                      ]
                      else if (pageIndex == 2) ...[
                          Expanded(child: SizedBox(
                              height: imageHeightSize,
                              width: imageWidthSize,
                              child: Image.asset(AppIcons.onboardingImgThree))),
                          const SizedBox(height: 10,),
                          RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: "Accurate, Safe, Reliable",
                                  style: TextStyle(
                                    fontSize: 25,
                                    fontWeight: FontWeight.w400,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        const Text(
                          "Aidora provides evidence-based insights and recommends the right specialist when necessary.",
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                        const SizedBox(height: 10),
                      ]
                        else if (pageIndex == 3) ...[
                            Expanded(child: SizedBox(
                                // height: imageHeightSize,
                                // width: imageWidthSize,
                                child: Image.asset(AppIcons.onboardingImgTwo))),
                            const SizedBox(height: 10,),
                          RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: "Care That Fits Your Life",
                                  style: TextStyle(
                                    fontSize: 25,
                                    fontWeight: FontWeight.w400,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        const Text(
                          "Always available, simplifying healthcare for you and your loved ones.",
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        const SizedBox(height: 10),
                      ]
                          else ...[
                              Expanded(child: SizedBox(
                                  height: imageHeightSize,
                                  width: imageWidthSize,
                                  child: Image.asset(AppIcons.securityShieldThree))),
                              const SizedBox(height: 15,),
                              RichText(
                                textAlign: TextAlign.center,
                                text: TextSpan(
                                  children: [
                                    TextSpan(
                                      text: "Privacy First. Care Always",
                                      style: TextStyle(
                                        fontSize: 25,
                                        fontWeight: FontWeight.w400,
                                        color: Colors.black,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                        const Text(
                          "Your medical data stays safe, private, and under your control while we deliver smarter AI-driven healthcare.",
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        const SizedBox(height: 10),
                      ],
                    ],
                  ),
                );
              },
            ),
            bottomNavigationBar: Padding(
              padding: const EdgeInsets.only(left: 10.0, right: 10, bottom: 10, top: 15),
              child: CustomButtonOne(
                title: totalPage < 4 ? "Next" : "Get Started",
                onClick: totalPage < 4
                    ? () => _pageController.nextPage(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.ease,
                )
                    // : () => _initializeAidoraAPIkey(context),
                    : () {
                  Navigator.of(context).push(MaterialPageRoute(builder: (context) => const LoginScreen()));
                },
                isLoading: isLoading,
              ),
            ),
          ),
          if (isLoading)
            Container(
              height: MediaQuery.of(context).size.height,
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.01)),
            ),
        ],
      ),
    );
  }
}
