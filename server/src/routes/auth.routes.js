import express from "express";

import {
  login,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import authLimiter from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

router.get("/me", authenticate, getCurrentUser);

router.post("/logout", authenticate, logout);

export default router;