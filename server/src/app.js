import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import employeeSelfRoutes from "./routes/employee-self.routes.js";

import requestId from "./middleware/requestId.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(requestId);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/employees", employeeRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/employee-self", employeeSelfRoutes);

// Centralized error handler
app.use(errorMiddleware);

export default app;