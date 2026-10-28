import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // PERSONAL INFORMATION
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", null],
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    // =========================
    // EMPLOYMENT INFORMATION
    // =========================

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
      default: null,
    },

    jobTitle: {
      type: String,
      trim: true,
      default: null,
    },

    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "intern"],
      default: "full-time",
    },

    dateOfJoining: {
      type: Date,
      default: null,
    },

    salary: {
      type: Number,
      min: 0,
      default: null,
    },

    // =========================
    // CONTACT INFORMATION
    // =========================

    address: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    emergencyContactName: {
      type: String,
      trim: true,
      default: null,
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
      default: null,
    },

    emergencyContactRelationship: {
      type: String,
      trim: true,
      default: null,
    },

    // =========================
    // ACCOUNT INFORMATION
    // =========================

    passwordHash: {
      type: String,
      select: false,
      default: null,
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    status: {
      type: String,
      enum: ["invited", "active", "suspended", "deactivated"],
      default: "invited",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;