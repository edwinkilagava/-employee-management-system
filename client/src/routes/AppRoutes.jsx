
import { lazy, Suspense } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import EmployeeLayout from "../components/employee/EmployeeLayout.jsx";

/* -------------------------------------------------------------------------- */
/* Lazy-loaded pages                                                          */
/* -------------------------------------------------------------------------- */

const Login = lazy(() => import("../pages/auth/Login.jsx"));

const AcceptInvitation = lazy(
  () => import("../pages/auth/AcceptInvitation.jsx")
);

const AdminDashboard = lazy(
  () => import("../pages/admin/AdminDashboard.jsx")
);

const AdminEmployees = lazy(
  () => import("../pages/admin/Employee.jsx")
);

const EmployeeDashboard = lazy(
  () => import("../pages/employee/EmployeeDashboard.jsx")
);

const EmployeeProfile = lazy(
  () => import("../pages/employee/Profile.jsx")
);

const EmployeeLeave = lazy(
  () => import("../pages/employee/Leave.jsx")
);

const EmployeeSalary = lazy(
  () => import("../pages/employee/SalaryStatements.jsx")
);

const EmployeeDocuments = lazy(
  () => import("../pages/employee/Documents.jsx")
);

/* -------------------------------------------------------------------------- */
/* Loading fallback                                                           */
/* -------------------------------------------------------------------------- */

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-indigo-500" />

        <p className="text-sm text-slate-300">
          Loading page...
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Not-found page                                                             */
/* -------------------------------------------------------------------------- */

function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-lg text-slate-300">
        Page not found
      </p>

      <p className="mt-2 text-sm text-slate-400">
        The page you are looking for does not exist.
      </p>

      <button
        type="button"
        onClick={() => {
          window.location.href = "/";
        }}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
      >
        Go home
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Role-based home redirect                                                   */
/* -------------------------------------------------------------------------- */

function RoleHome() {
  const { user, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "employee") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

/* -------------------------------------------------------------------------- */
/* Public-only routes                                                         */
/* -------------------------------------------------------------------------- */

function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "employee") {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <Outlet />;
}

/* -------------------------------------------------------------------------- */
/* Application routes                                                         */
/* -------------------------------------------------------------------------- */

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* Public routes */}

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route
          path="/accept-invitation/:token"
          element={<AcceptInvitation />}
        />

        {/* Protected routes */}

        <Route element={<ProtectedRoute />}>
          {/* Admin routes */}

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/employees"
                element={<AdminEmployees />}
              />
            </Route>
          </Route>

          {/* Employee routes */}

          <Route element={<RoleRoute allowedRoles={["employee"]} />}>
            <Route element={<EmployeeLayout />}>
              <Route
                path="/employee/dashboard"
                element={<EmployeeDashboard />}
              />

              <Route
                path="/employee/profile"
                element={<EmployeeProfile />}
              />

              <Route
                path="/employee/leave"
                element={<EmployeeLeave />}
              />

              <Route
                path="/employee/salary"
                element={<EmployeeSalary />}
              />

              <Route
                path="/employee/documents"
                element={<EmployeeDocuments />}
              />
            </Route>
          </Route>
        </Route>

        {/* Home redirect */}

        <Route path="/" element={<RoleHome />} />

        {/* Catch-all route */}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

