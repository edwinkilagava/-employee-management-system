import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";

const validateEmail = (email) => {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "Email address is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return "Enter a valid email address.";
  }

  return "";
};

const validatePassword = (password) => {
  if (!password) {
    return "password is requred👆.";
  }

  return "";
};

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const emailInputRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) {
        delete nextErrors[key];
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const getRedirectPath = (user) => {
    const requestedPath = location.state?.from?.pathname;

    if (
      requestedPath &&
      requestedPath !== "/login" &&
      requestedPath !== "/"
    ) {
      return requestedPath;
    }

    if (user.role === "admin") {
      return "/admin/dashboard";
    }

    if (user.role === "employee") {
      return "/employee/dashboard";
    }

    return "/";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const user = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate(getRedirectPath(user), {
        replace: true,
      });
    } catch (error) {
      setServerError(
        error?.message ||
          "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <span className="text-lg font-bold text-white">
                E.M.S
              </span>
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Sign in to your Employee Dashbord
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {serverError && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <p className="text-sm font-medium text-red-800">
                  {serverError}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Email address
                </label>

                <input
                  ref={emailInputRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  className={`block w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                  }`}
                  placeholder="you@example.com"
                />

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : undefined
                  }
                  className={`block w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                  }`}
                  placeholder="Enter your password"
                />

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {submitting ? (
                  <>
                    <span
                      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    />

                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-6 text-center">
              <p className="text-xs leading-5 text-gray-500">
                Access to this system is provided by the  organization.
                If you have received an invitation, use the invitation
                link provided in your email.it expires after 4 hours. If you have not received an invitation, please contact your administrator.
              </p>

              <Link
                to="/accept-invitation"
                className="sr-only"
              >
                Accept invitation
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Eklee Management System
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;