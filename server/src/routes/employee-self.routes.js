
import express from "express";

import validate from "../middleware/validate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

import { updateMyProfileSchema } from "../validators/employee.validator.js";

import {
  updateMyProfileController,
  uploadMyProfileImageController,
} from "../controllers/employee.controller.js";

import profileImageUpload from "../middleware/profile-image-upload.middleware.js";

const router = express.Router();

// Update employee profile details
router.patch(
  "/me",
  authenticate,
  authorize("employee"),
  validate(updateMyProfileSchema),
  updateMyProfileController
);

// Upload employee profile photo
router.post(
  "/me/profile-image",
  authenticate,
  authorize("employee"),
  profileImageUpload.single("profileImage"),
  uploadMyProfileImageController
);

export default router;

