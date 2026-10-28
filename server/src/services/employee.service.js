import mongoose from "mongoose";
import User from "../models/User.js";

import { createInvitation } from "./invitation.service.js";
import { sendInvitationEmail } from "./email.service.js";

// ============================================================
// CREATE EMPLOYEE
// ============================================================

export const createEmployee = async ({
  name,
  email,
  nationalId,
  dateOfBirth,
  gender,
  phone,
  employeeId,
  department,
  jobTitle,
  employmentType,
  dateOfJoining,
  salary,
  address,
  city,
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactRelationship,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Check whether the email already exists
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Check employee ID if one was provided
  if (employeeId) {
    const existingEmployeeId = await User.findOne({
      employeeId: employeeId.trim(),
    });

    if (existingEmployeeId) {
      throw new Error("Employee ID already exists");
    }
  }

  // Check national ID if one was provided
  if (nationalId) {
    const existingNationalId = await User.findOne({
      nationalId: nationalId.trim(),
    });

    if (existingNationalId) {
      throw new Error("National ID already exists");
    }
  }

  // Create the employee
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,

    nationalId: nationalId?.trim() || null,
    dateOfBirth: dateOfBirth || null,
    gender: gender || null,
    phone: phone?.trim() || null,

    employeeId: employeeId?.trim() || null,
    department: department?.trim() || null,
    jobTitle: jobTitle?.trim() || null,
    employmentType: employmentType || "full-time",
    dateOfJoining: dateOfJoining || null,
    salary:
      salary !== undefined && salary !== null && salary !== ""
        ? Number(salary)
        : null,

    address: address?.trim() || null,
    city: city?.trim() || null,

    emergencyContactName:
      emergencyContactName?.trim() || null,

    emergencyContactPhone:
      emergencyContactPhone?.trim() || null,

    emergencyContactRelationship:
      emergencyContactRelationship?.trim() || null,

    role: "employee",
    status: "invited",
  });

  // Create invitation
  const invitation = await createInvitation(user._id);

  // Build invitation URL
  const invitationUrl =
    `${process.env.CLIENT_URL}/accept-invitation/${invitation.token}`;

  // Send invitation email
  await sendInvitationEmail({
    to: user.email,
    name: user.name,
    invitationUrl,
  });

  return {
    user,
  };
};

// ============================================================
// GET ALL EMPLOYEES
// ============================================================

export const getEmployees = async () => {
  const employees = await User.find({
    role: "employee",
  }).select("-passwordHash");

  return employees;
};

// ============================================================
// GET ONE EMPLOYEE
// ============================================================

export const getEmployeeById = async (employeeId) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Employee not found");
  }

  const employee = await User.findOne({
    _id: employeeId,
    role: "employee",
  }).select("-passwordHash");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

// ============================================================
// UPDATE EMPLOYEE
// ============================================================

export const updateEmployee = async (employeeId, updates) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Employee not found");
  }

  const allowedUpdates = {};

  // -------------------------
  // Personal information
  // -------------------------

  if (updates.name !== undefined) {
    if (
      typeof updates.name !== "string" ||
      updates.name.trim().length === 0
    ) {
      throw new Error("Invalid name");
    }

    allowedUpdates.name = updates.name.trim();
  }

  if (updates.email !== undefined) {
    if (
      typeof updates.email !== "string" ||
      updates.email.trim().length === 0
    ) {
      throw new Error("Invalid email");
    }

    const normalizedEmail = updates.email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: employeeId },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    allowedUpdates.email = normalizedEmail;
  }

  if (updates.nationalId !== undefined) {
    if (updates.nationalId === null || updates.nationalId === "") {
      allowedUpdates.nationalId = null;
    } else {
      if (typeof updates.nationalId !== "string") {
        throw new Error("Invalid national ID");
      }

      const nationalId = updates.nationalId.trim();

      const existingNationalId = await User.findOne({
        nationalId,
        _id: { $ne: employeeId },
      });

      if (existingNationalId) {
        throw new Error("National ID already exists");
      }

      allowedUpdates.nationalId = nationalId;
    }
  }

  if (updates.dateOfBirth !== undefined) {
    allowedUpdates.dateOfBirth =
      updates.dateOfBirth || null;
  }

  if (updates.gender !== undefined) {
    allowedUpdates.gender =
      updates.gender || null;
  }

  if (updates.phone !== undefined) {
    allowedUpdates.phone =
      updates.phone === null
        ? null
        : updates.phone.trim();
  }

  // -------------------------
  // Employment information
  // -------------------------

  if (updates.employeeId !== undefined) {
    if (updates.employeeId === null || updates.employeeId === "") {
      allowedUpdates.employeeId = null;
    } else {
      if (typeof updates.employeeId !== "string") {
        throw new Error("Invalid employee ID");
      }

      const newEmployeeId = updates.employeeId.trim();

      const existingEmployee = await User.findOne({
        employeeId: newEmployeeId,
        _id: { $ne: employeeId },
      });

      if (existingEmployee) {
        throw new Error("Employee ID already exists");
      }

      allowedUpdates.employeeId = newEmployeeId;
    }
  }

  if (updates.department !== undefined) {
    allowedUpdates.department =
      updates.department === null
        ? null
        : updates.department.trim();
  }

  if (updates.jobTitle !== undefined) {
    allowedUpdates.jobTitle =
      updates.jobTitle === null
        ? null
        : updates.jobTitle.trim();
  }

  if (updates.employmentType !== undefined) {
    allowedUpdates.employmentType =
      updates.employmentType;
  }

  if (updates.dateOfJoining !== undefined) {
    allowedUpdates.dateOfJoining =
      updates.dateOfJoining || null;
  }

  if (updates.salary !== undefined) {
    if (
      updates.salary === null ||
      updates.salary === ""
    ) {
      allowedUpdates.salary = null;
    } else {
      const salary = Number(updates.salary);

      if (!Number.isFinite(salary) || salary < 0) {
        throw new Error("Invalid salary");
      }

      allowedUpdates.salary = salary;
    }
  }

  // -------------------------
  // Contact information
  // -------------------------

  if (updates.address !== undefined) {
    allowedUpdates.address =
      updates.address === null
        ? null
        : updates.address.trim();
  }

  if (updates.city !== undefined) {
    allowedUpdates.city =
      updates.city === null
        ? null
        : updates.city.trim();
  }

  if (updates.emergencyContactName !== undefined) {
    allowedUpdates.emergencyContactName =
      updates.emergencyContactName === null
        ? null
        : updates.emergencyContactName.trim();
  }

  if (updates.emergencyContactPhone !== undefined) {
    allowedUpdates.emergencyContactPhone =
      updates.emergencyContactPhone === null
        ? null
        : updates.emergencyContactPhone.trim();
  }

  if (updates.emergencyContactRelationship !== undefined) {
    allowedUpdates.emergencyContactRelationship =
      updates.emergencyContactRelationship === null
        ? null
        : updates.emergencyContactRelationship.trim();
  }

  // -------------------------
  // Profile image
  // -------------------------

  if (updates.profileImage !== undefined) {
    if (
      updates.profileImage !== null &&
      typeof updates.profileImage !== "string"
    ) {
      throw new Error("Invalid profile image");
    }

    allowedUpdates.profileImage =
      updates.profileImage === null
        ? null
        : updates.profileImage.trim();
  }

  // -------------------------
  // Make sure something changed
  // -------------------------

  if (Object.keys(allowedUpdates).length === 0) {
    throw new Error("No valid fields to update");
  }

  const employee = await User.findOneAndUpdate(
    {
      _id: employeeId,
      role: "employee",
    },
    {
      $set: allowedUpdates,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

// ============================================================
// DEACTIVATE EMPLOYEE
// ============================================================

export const deactivateEmployee = async (employeeId) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Employee not found");
  }

  const employee = await User.findOneAndUpdate(
    {
      _id: employeeId,
      role: "employee",
      status: { $ne: "deactivated" },
    },
    {
      $set: {
        status: "deactivated",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");

  if (!employee) {
    throw new Error(
      "Employee not found or already deactivated"
    );
  }

  return employee;
};

// ============================================================
// REACTIVATE EMPLOYEE
// ============================================================

export const reactivateEmployee = async (employeeId) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Employee not found");
  }

  const employee = await User.findOneAndUpdate(
    {
      _id: employeeId,
      role: "employee",
      status: "deactivated",
    },
    {
      $set: {
        status: "active",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");

  if (!employee) {
    throw new Error(
      "Employee not found or is not deactivated"
    );
  }

  return employee;
};

// ============================================================
// SUSPEND EMPLOYEE
// ============================================================

export const suspendEmployee = async (employeeId) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Employee not found");
  }

  const employee = await User.findOneAndUpdate(
    {
      _id: employeeId,
      role: "employee",
      status: "active",
    },
    {
      $set: {
        status: "suspended",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");

  if (!employee) {
    throw new Error(
      "Employee not found or is not active"
    );
  }

  return employee;
};

// ============================================================
// UPDATE MY PROFILE
// ============================================================

export const updateMyProfile = async (userId, updates) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("User not found");
  }

  const allowedUpdates = {};

  // ============================================================
  // PHONE
  // Employee is allowed to update their phone number
  // ============================================================

  if (updates.phone !== undefined) {
    if (
      typeof updates.phone !== "string" ||
      updates.phone.trim().length < 7
    ) {
      throw new Error("Invalid phone number");
    }

    allowedUpdates.phone = updates.phone.trim();
  }

  // ============================================================
  // ADDRESS
  // Employee is allowed to update their address
  // ============================================================

  if (updates.address !== undefined) {
    if (
      typeof updates.address !== "string" ||
      updates.address.trim().length < 2
    ) {
      throw new Error("Invalid address");
    }

    allowedUpdates.address = updates.address.trim();
  }

  // ============================================================
  // CITY / LOCATION
  // Employee is allowed to update their city/location
  // ============================================================

  if (updates.city !== undefined) {
    if (
      typeof updates.city !== "string" ||
      updates.city.trim().length < 2
    ) {
      throw new Error("Invalid city");
    }

    allowedUpdates.city = updates.city.trim();
  }

  // ============================================================
  // PROFILE IMAGE
  // Profile image URL is normally created by Cloudinary
  // ============================================================

  if (updates.profileImage !== undefined) {
    if (
      updates.profileImage !== null &&
      typeof updates.profileImage !== "string"
    ) {
      throw new Error("Invalid profile image");
    }

    allowedUpdates.profileImage = updates.profileImage;
  }

  // ============================================================
  // MAKE SURE SOMETHING WAS PROVIDED
  // ============================================================

  if (Object.keys(allowedUpdates).length === 0) {
    throw new Error("No valid fields to update");
  }

  // ============================================================
  // UPDATE ONLY THE LOGGED-IN EMPLOYEE
  // ============================================================

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      role: "employee",
    },
    {
      $set: allowedUpdates,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ============================================================
// RESEND EMPLOYEE INVITATION
// ============================================================

export const resendEmployeeInvitation = async (
  employeeId
) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Invited employee not found");
  }

  const user = await User.findOne({
    _id: employeeId,
    role: "employee",
    status: "invited",
  });

  if (!user) {
    throw new Error("Invited employee not found");
  }

  const invitation = await createInvitation(user._id);

  const invitationUrl =
    `${process.env.CLIENT_URL}/accept-invitation/${invitation.token}`;

  await sendInvitationEmail({
    to: user.email,
    name: user.name,
    invitationUrl,
  });

  return {
    message: "Invitation email sent successfully",
  };
};