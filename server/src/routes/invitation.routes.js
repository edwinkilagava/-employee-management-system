import express from "express";

import { acceptInvitationController } from "../controllers/invitation.controller.js";

const router = express.Router();

router.post("/:token/accept", acceptInvitationController);

export default router;