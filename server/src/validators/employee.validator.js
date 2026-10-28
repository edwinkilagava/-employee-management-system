
import { z } from "zod";

// ============================================================
// CREATE EMPLOYEE
// ============================================================

export const createEmployeeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name is required")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(254, "Email must not exceed 254 characters")
      .transform((value) => value.toLowerCase()),

    nationalId: z
      .string()
      .trim()
      .min(1, "National ID is required")
      .max(30, "National ID must not exceed 30 characters"),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required"),

    gender: z.enum(["male", "female", "other"], {
      message: "Invalid gender",
    }),

    phone: z
      .string()
      .trim()
      .min(7, "Phone number is required")
      .max(20, "Phone number is too long"),

    profileImage: z
      .string()
      .trim()
      .url("Profile image must be a valid URL")
      .max(2048, "Profile image URL is too long")
      .nullable()
      .optional(),

    employeeId: z
      .string()
      .trim()
      .min(1, "Employee ID is required")
      .max(50, "Employee ID must not exceed 50 characters"),

    department: z
      .string()
      .trim()
      .min(2, "Department is required")
      .max(100, "Department must not exceed 100 characters"),

    jobTitle: z
      .string()
      .trim()
      .min(2, "Job title is required")
      .max(100, "Job title must not exceed 100 characters"),

    employmentType: z.enum(
      ["full-time", "part-time", "contract", "intern"],
      {
        message: "Invalid employment type",
      }
    ),

    dateOfJoining: z
      .string()
      .min(1, "Date of joining is required"),

    salary: z
      .coerce
      .number()
      .min(0, "Salary cannot be negative"),

    address: z
      .string()
      .trim()
      .min(2, "Address is required")
      .max(255, "Address must not exceed 255 characters"),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100, "City must not exceed 100 characters"),

    emergencyContactName: z
      .string()
      .trim()
      .min(2, "Emergency contact name is required")
      .max(100, "Emergency contact name must not exceed 100 characters"),

    emergencyContactPhone: z
      .string()
      .trim()
      .min(7, "Emergency contact phone is required")
      .max(20, "Emergency contact phone is too long"),

    emergencyContactRelationship: z
      .string()
      .trim()
      .min(2, "Emergency contact relationship is required")
      .max(50, "Emergency contact relationship must not exceed 50 characters"),
  })
  .strict();

// ============================================================
// UPDATE EMPLOYEE
// Admin updates an employee
// ============================================================

export const updateEmployeeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(254, "Email must not exceed 254 characters")
      .transform((value) => value.toLowerCase())
      .optional(),

    nationalId: z
      .string()
      .trim()
      .nullable()
      .optional(),

    dateOfBirth: z
      .string()
      .nullable()
      .optional(),

    gender: z
      .union([
        z.enum(["male", "female", "other"]),
        z.literal(""),
      ])
      .nullable()
      .optional(),

    phone: z
      .string()
      .trim()
      .max(20, "Phone number is too long")
      .nullable()
      .optional(),

    profileImage: z
      .string()
      .trim()
      .url("Profile image must be a valid URL")
      .max(2048, "Profile image URL is too long")
      .nullable()
      .optional(),

    employeeId: z
      .string()
      .trim()
      .max(50, "Employee ID must not exceed 50 characters")
      .nullable()
      .optional(),

    department: z
      .string()
      .trim()
      .max(100, "Department must not exceed 100 characters")
      .nullable()
      .optional(),

    jobTitle: z
      .string()
      .trim()
      .max(100, "Job title must not exceed 100 characters")
      .nullable()
      .optional(),

    employmentType: z
      .union([
        z.enum([
          "full-time",
          "part-time",
          "contract",
          "intern",
        ]),
        z.literal(""),
      ])
      .nullable()
      .optional(),

    dateOfJoining: z
      .string()
      .nullable()
      .optional(),

    salary: z
      .union([
        z
          .coerce
          .number()
          .min(0, "Salary cannot be negative"),
        z.literal(""),
      ])
      .nullable()
      .optional(),

    address: z
      .string()
      .trim()
      .max(255, "Address must not exceed 255 characters")
      .nullable()
      .optional(),

    city: z
      .string()
      .trim()
      .max(100, "City must not exceed 100 characters")
      .nullable()
      .optional(),

    emergencyContactName: z
      .string()
      .trim()
      .max(100, "Emergency contact name must not exceed 100 characters")
      .nullable()
      .optional(),

    emergencyContactPhone: z
      .string()
      .trim()
      .max(20, "Emergency contact phone is too long")
      .nullable()
      .optional(),

    emergencyContactRelationship: z
      .string()
      .trim()
      .max(50, "Emergency contact relationship is too long")
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );

// ============================================================
// UPDATE MY PROFILE
// Employee updates ONLY their own allowed profile information
// ============================================================

export const updateMyProfileSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .min(7, "Phone number must contain at least 7 characters")
      .max(20, "Phone number is too long")
      .optional(),

    profileImage: z
      .string()
      .trim()
      .url("Profile image must be a valid URL")
      .max(2048, "Profile image URL is too long")
      .nullable()
      .optional(),

    address: z
      .string()
      .trim()
      .min(2, "Address must contain at least 2 characters")
      .max(255, "Address must not exceed 255 characters")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City must contain at least 2 characters")
      .max(100, "City must not exceed 100 characters")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );

