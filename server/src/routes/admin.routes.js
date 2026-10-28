import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";;
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the admin dashboard",
      user: req.user,
    });
  }
);

export default router;