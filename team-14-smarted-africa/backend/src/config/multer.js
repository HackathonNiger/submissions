// src/middleware/multer.js

// ----------------------------
// Import Modules
// ----------------------------
import multer from 'multer';

// ----------------------------
// Configure Storage
// ----------------------------
// Using memory storage: files are stored in memory as Buffer
const storage = multer.memoryStorage();

// ----------------------------
// Configure Upload Middleware
// ----------------------------
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Maximum file size: 2 MB
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      // Reject non-image files
      return cb(new Error('Only images allowed'), false);
    }
    // Accept the file
    cb(null, true);
  }
});

// ----------------------------
// Export Middleware
// ----------------------------
export { upload };
