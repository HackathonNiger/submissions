import 'dart:io';
import 'package:cloudinary/cloudinary.dart';
import 'package:image_picker/image_picker.dart';

class CloudinaryServices {
  final Cloudinary cloudinary = Cloudinary.unsignedConfig(
    cloudName: 'dvqs2kxmw',
  );

  Future<String?> uploadFile({
    required File file,
    required CloudinaryResourceType resourceType,
  }) async {
    try {
      final response = await cloudinary.unsignedUpload(
        file: file.path,
        uploadPreset: 'Tidmuv_images',
        resourceType: resourceType,
        progressCallback: (count, total) {
          print('Uploading file: $count/$total');
        },
      );

      if (response.isSuccessful) {
        print('File uploaded successfully: ${response.secureUrl}');
        return response.secureUrl;
      } else {
        print('Upload failed: ${response.error}');
        return null;
      }
    } catch (e) {
      print('Error uploading file: $e');
      return null;
    }
  }

  // Pick an image from the gallery
  Future<File?> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      return File(pickedFile.path);
    } else {
      print('No image selected.');
      return null;
    }
  }

  // Convenience method for uploading images
  Future<String?> uploadImage(File imageFile) async {
    return uploadFile(
      file: imageFile,
      resourceType: CloudinaryResourceType.image,
    );
  }

  // Convenience method for uploading videos
  Future<String?> uploadVideo(File videoFile) async {
    return uploadFile(
      file: videoFile,
      resourceType: CloudinaryResourceType.video,
    );
  }
}