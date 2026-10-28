
import multer from "multer";

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const profileImageUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      const error = new Error(
        "Please upload a JPG, PNG, or WebP image."
      );

      error.statusCode = 400;
      return callback(error);
    }

    callback(null, true);
  },
});

export default profileImageUpload;