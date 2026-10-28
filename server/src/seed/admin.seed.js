import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      name: "Admin",
      email,
      passwordHash,
      role: "admin",
      status: "active",
    });

    console.log(`Admin created: ${email}`);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();