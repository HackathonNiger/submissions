import 'package:aidora/features/aidora_ai/components/aidora_reply_indicator.dart';
import 'package:aidora/features/aidora_ai/screens/aidora_chat_screen.dart';
import 'package:aidora/features/aidora_ai/screens/home/sections/chat_history_section.dart';
import 'package:aidora/features/user/provider/user_provider.dart';
import 'package:aidora/features/user/screens/profile_screen.dart';
import 'package:aidora/utilities/components/custom_fab.dart';
import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:iconly/iconly.dart';
import 'package:provider/provider.dart';

import '../schedule/sections/schedule_section.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    _initializeSystemBG();
    super.initState();
  }

  void _initializeSystemBG() {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.white,
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.light,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).userModel;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        automaticallyImplyLeading: false,
        leadingWidth: double.infinity,
        leading: Padding(
          padding: const EdgeInsets.only(left: 10.0),
          child: GestureDetector(
            onTap: (){
              Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ProfileScreen()));
            },
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  height: 40,
                  width: 40,
                  clipBehavior: Clip.antiAlias,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Image.network(user.image, fit: BoxFit.cover, errorBuilder: (context, err, st) {
                    return Center(
                      child: Icon(IconlyBold.profile, color: Colors.grey, size: 16),
                    );
                  },),
                ),
                const SizedBox(width: 5),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Hi, ${user.firstName}", style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500
                    ),),
                    Text(
                      "What can I help you with today?",
                      style: TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: Icon(IconlyLight.calendar, color: Colors.grey),
          ),
        ],
      ),
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        child: Column(
          children: [
            ScheduleSection(),
            const SizedBox(height: 10),
            ChatHistorySection(),
          ],
        ),
      ),
      floatingActionButton: CustomFab(
        iconData: CupertinoIcons.chat_bubble_2,
        color: Color(AppColors.primaryColor),
        onClick: () {
          Navigator.of(context).push(MaterialPageRoute(builder: (context) => AidoraChatScreen()));
        },
      ),
    );
  }
}
