// backend/src/services/storageService.js

/**
 * Storage Service
 * - Handles image upload/delete operations
 * - Currently a pseudo implementation returning a CDN URL
 */

// ----------------------------
// Upload image (pseudo)
// ----------------------------
export const uploadImage = async (buffer, filename, mimetype) => {
  // In production, integrate with S3, Cloudinary, etc.
  // Here we just simulate and return a URL
  const pseudoUrl = `https://cdn.smarted.africa/uploads/${encodeURIComponent(filename)}`;
  return { url: pseudoUrl, key: filename };
};

// ----------------------------
// Delete image (pseudo)
// ----------------------------
export const deleteImage = async (key) => {
  // In production, delete the image from the cloud storage
  return true;
};
