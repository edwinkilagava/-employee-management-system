import express from "express";

import validate from "../middleware/validate.middleware.js";

import profileImageUpload from "../middleware/profile-image-upload.middleware.js";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateMyProfileSchema,
} from "../validators/employee.validator.js";

import {
  createEmployeeController,
  getEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deactivateEmployeeController,
  reactivateEmployeeController,
  suspendEmployeeController,
  updateMyProfileController,
  uploadMyProfileImageController,
  resendEmployeeInvitationController,
} from "../controllers/employee.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

// ============================================================
// CREATE AN EMPLOYEE (ADMIN ONLY)
// ============================================================

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createEmployeeSchema),
  createEmployeeController
);

// ============================================================
// GET ALL EMPLOYEES (ADMIN ONLY)
// ============================================================

router.get(
  "/",
  authenticate,
  authorize("admin"),
  getEmployeesController
);

// ============================================================
// UPDATE MY PROFILE (EMPLOYEE ONLY)
//
// IMPORTANT:
// This must come BEFORE /:employeeId
// ============================================================

router.patch(
  "/me",
  authenticate,
  authorize("employee"),
  validate(updateMyProfileSchema),
  updateMyProfileController
);

// ============================================================
// UPLOAD MY PROFILE PHOTO (EMPLOYEE ONLY)
// ============================================================

router.post(
  "/me/profile-image",
  authenticate,
  authorize("employee"),
  profileImageUpload.single("profileImage"),
  uploadMyProfileImageController
);

// ============================================================
// GET ONE EMPLOYEE (ADMIN ONLY)
// ============================================================

router.get(
  "/:employeeId",
  authenticate,
  authorize("admin"),
  getEmployeeByIdController
);

// ============================================================
// UPDATE AN EMPLOYEE (ADMIN ONLY)
// ============================================================

router.patch(
  "/:employeeId",
  authenticate,
  authorize("admin"),
  validate(updateEmployeeSchema),
  updateEmployeeController
);

// ============================================================
// DEACTIVATE AN EMPLOYEE (ADMIN ONLY)
// ============================================================

router.delete(
  "/:employeeId",
  authenticate,
  authorize("admin"),
  deactivateEmployeeController
);

// ============================================================
// REACTIVATE AN EMPLOYEE (ADMIN ONLY)
// ============================================================

router.patch(
  "/:employeeId/reactivate",
  authenticate,
  authorize("admin"),
  reactivateEmployeeController
);

// ============================================================
// SUSPEND AN EMPLOYEE (ADMIN ONLY)
// ============================================================

router.patch(
  "/:employeeId/suspend",
  authenticate,
  authorize("admin"),
  suspendEmployeeController
);

// ============================================================
// RESEND EMPLOYEE INVITATION (ADMIN ONLY)
// ============================================================

router.post(
  "/:employeeId/resend-invitation",
  authenticate,
  authorize("admin"),
  resendEmployeeInvitationController
);

export default router;