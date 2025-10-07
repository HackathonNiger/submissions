import 'package:aidora/features/user/components/profile_options_card.dart';
import 'package:aidora/features/user/provider/user_provider.dart';
import 'package:aidora/features/user/services/user_services.dart';
import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:aidora/utilities/error_handler/show_snack_bar.dart';
import 'package:aidora/utilities/services/cloudinary_services.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import 'package:provider/provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final UserServices _userServices = UserServices();
  final CloudinaryServices _cloudinaryServices = CloudinaryServices();
  final ImagePicker _picker = ImagePicker();
  bool isLoading = false;

  Future<void> _pickAndUploadImage(BuildContext context) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: ImageSource.gallery);
      if (pickedFile == null) return;
      final imageUrl = await _cloudinaryServices.uploadImage(File(pickedFile.path));
      if (imageUrl == null) {
        showSnackBar(context: context, message: "Failed to upload image", title: "Failed");
        return;
      }
      final data = {"image": imageUrl};
      setState(() {
        isLoading = true;
      });
      int statusCode = await _userServices.updateUserProfile(context: context, data: data);
      if (statusCode == 200 || statusCode == 201) {
        setState(() {
          isLoading = false;
        });
        await _userServices.userProfile(context);
      }else {
        setState(() {
          isLoading = false;
        });
        showSnackBar(context: context, message: "Unable to upload profile image", title: "Upload Failed");
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      showSnackBar(context: context, message: "$e", title: "Something Went Wrong");
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).userModel;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        centerTitle: true,
        title: const Text(
          "Profile",
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(IconlyLight.logout, color: Colors.grey),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: SizedBox(
                height: 80,
                width: 80,
                child: Stack(
                  children: [
                    Container(
                      height: 80,
                      width: 80,
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.grey.withOpacity(0.2),
                      ),
                      child: Image.network(
                        user.image,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(IconlyBold.profile, color: Colors.grey, size: 35),
                      ),
                    ),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: GestureDetector(
                        onTap: () => _pickAndUploadImage(context),
                        child: Container(
                          height: 25,
                          width: 25,
                          decoration: BoxDecoration(
                            color: Color(AppColors.primaryColor),
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: Icon(
                              IconlyLight.edit,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
            Center(
              child: Column(
                children: [
                  Text(
                    "${user.firstName} ${user.lastName} ${user.otherNames}",
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w400),
                  ),
                  Text(
                    user.email,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 50),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 10.0),
              child: Text(
                "Data and Information",
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
              ),
            ),
            const SizedBox(height: 5),
            ProfileOptionsCard(
              icon: IconlyLight.filter,
              title: "Data Controls",
              onClick: () {},
            ),
            ProfileOptionsCard(
              icon: IconlyLight.document,
              title: "Terms of user",
              onClick: () {},
            ),
            ProfileOptionsCard(
              icon: IconlyLight.folder,
              title: "Privacy Policy",
              onClick: () {},
            ),
            ProfileOptionsCard(
              icon: IconlyLight.info_circle,
              title: "Contact Us",
              onClick: () {},
            ),
          ],
        ),
      ),
    );
  }
}