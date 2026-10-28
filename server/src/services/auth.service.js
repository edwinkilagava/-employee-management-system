
import bcrypt from "bcrypt";

import User from "../models/User.js";

import { generateAccessToken } from "../utils/jwt.js";

/*
 * Build the safe user object returned to the frontend.
 *
 * IMPORTANT:
 * passwordHash is deliberately excluded.
 * This keeps the response safe while allowing the
 * employee portal to display the complete employee profile.
 */
const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,

  // Account information
  status: user.status,

  // Employee information
  nationalId: user.nationalId,
  employeeId: user.employeeId,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  phone: user.phone,

  department: user.department,
  jobTitle: user.jobTitle,
  employmentType: user.employmentType,
  dateOfJoining: user.dateOfJoining,
  salary: user.salary,

  // Contact information
  address: user.address,
  city: user.city,

  // Emergency contact
  emergencyContactName: user.emergencyContactName,
  emergencyContactPhone: user.emergencyContactPhone,
  emergencyContactRelationship:
    user.emergencyContactRelationship,

  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error(
      "Email and password are required"
    );

    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;
    throw error;
  }

  /*
   * Invited users should not be able to log in
   * because they do not have a configured password.
   */
  if (!user.passwordHash) {
    const error = new Error(
      "User password configuration is invalid"
    );

    error.statusCode = 500;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;
    throw error;
  }

  /*
   * Only active users should be allowed to access
   * the employee/admin portal.
   */
  if (
    user.status === "suspended" ||
    user.status === "deactivated"
  ) {
    const error = new Error(
      "Your account is currently unavailable. Please contact your administrator."
    );

    error.statusCode = 403;
    throw error;
  }

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  return {
    accessToken,
    user: serializeUser(user),
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;
    throw error;
  }

  /*
   * Keep the current session synchronized with
   * the latest database record.
   */
  return serializeUser(user);
};

const logout = async () => {
  return true;
};

export {
  loginUser,
  getCurrentUser,
  logout,
};

