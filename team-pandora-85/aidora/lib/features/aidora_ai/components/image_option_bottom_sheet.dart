import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
class ImageOptionBottomSheet extends StatelessWidget {
  final VoidCallback onGalleryClicked;
  final VoidCallback onCameraClicked;
  const ImageOptionBottomSheet({super.key, required this.onGalleryClicked, required this.onCameraClicked});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15),
        child: Container(
          height: 131,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15)
          ),
          child: Padding(
            padding: const EdgeInsets.all(15.0),
            child: Column(
              children: [
                AidoraImageOptionCard(title: "Gallery", subMessage: "Pick an already saved image from your gallery", iconData: IconlyLight.image, onClick: onGalleryClicked),
                const SizedBox(height: 10,),
                AidoraImageOptionCard(title: "Camera", subMessage: "Quickly snap and send the image you wish to diagnose", iconData: IconlyLight.camera, onClick: onCameraClicked),
              ],
            ),
          ),
        ),
      ),
    );
  }
}


class AidoraImageOptionCard extends StatelessWidget {
  final String title;
  final String subMessage;
  final IconData iconData;
  final Color? color;
  final VoidCallback onClick;
  const AidoraImageOptionCard({super.key, required this.title, required this.subMessage, required this.iconData, this.color, required this.onClick});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onClick,
      child: Container(
        child: Row(
          children: [
            Container(
              height: 40,
              width: 40,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [Colors.blue, Colors.purple],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Icon(iconData, color: Colors.white, size: 20,),
            ),
            const SizedBox(width: 5,),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                  Text(
                    subMessage,
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.grey
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
