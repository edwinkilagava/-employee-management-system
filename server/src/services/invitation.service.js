
import crypto from "crypto";
import bcrypt from "bcrypt";

import Invitation from "../models/invitation.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

export const createInvitation = async (userId) => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    user: userId,
    tokenHash,
    expiresAt,
  });

  return {
    invitation,
    token: rawToken,
  };
};


export const acceptInvitation = async (rawToken, password) => {
  if (
    typeof rawToken !== "string" ||
    !/^[a-f0-9]{64}$/i.test(rawToken)
  ) {
    throw new AppError("This invitation link is invalid.", 400);
  }

  // Your existing backend validation middleware should also
  // enforce the password policy before this service is called.
  if (typeof password !== "string" || password.length < 8) {
    throw new AppError(
      "Password must contain at least 8 characters.",
      400
    );
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new AppError(
      "Password must not exceed 72 UTF-8 bytes.",
      400
    );
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const now = new Date();

  // Atomically claim the invitation before changing the user.
  const invitation = await Invitation.findOneAndUpdate(
    {
      tokenHash,
      acceptedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: { acceptedAt: now },
    },
    { new: true }
  );

  if (!invitation) {
    const existing = await Invitation.findOne({ tokenHash });

    if (!existing) {
      throw new AppError("This invitation link is invalid.", 400);
    }

    if (existing.expiresAt <= now) {
      throw new AppError("This invitation has expired.", 400);
    }

    if (existing.acceptedAt) {
      throw new AppError(
        "This invitation has already been used.",
        409
      );
    }

    throw new AppError(
      "This invitation could not be accepted. Please try again.",
      409
    );
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findOneAndUpdate(
      {
        _id: invitation.user,
        status: "invited",
      },
      {
        $set: {
          passwordHash,
          status: "active",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("_id name email role status profileImage createdAt");

    if (!user) {
      throw new AppError(
        "This account is no longer eligible for invitation acceptance.",
        409
      );
    }

    return user;
  } catch (error) {
    // Compensate if the user update fails. Only release the
    // claim made by this request, never another request's claim.
    await Invitation.updateOne(
      {
        _id: invitation._id,
        acceptedAt: now,
      },
      {
        $set: { acceptedAt: null },
      }
    ).catch((rollbackError) => {
      console.error(
        "Failed to release invitation claim:",
        rollbackError
      );
    });

    throw error;
  }
};