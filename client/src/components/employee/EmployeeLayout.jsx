import { Link, NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";

function EmployeeLayout() {
  const { user } = useAuth();

  const employeeName = user?.name || "Employee";

  const profileImage = user?.profileImage || "";

  function getInitials(name) {
    if (!name) {
      return "E";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  const navigation = [
    {
      name: "Dashboard",
      to: "/employee/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <rect
            x="4"
            y="4"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <rect
            x="14"
            y="4"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <rect
            x="4"
            y="14"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <rect
            x="14"
            y="14"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      ),
    },

    {
      name: "My Profile",
      to: "/employee/profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <circle
            cx="12"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M5.5 19c.8-3.1 3.1-4.75 6.5-4.75s5.7 1.65 6.5 4.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      name: "Leave Requests",
      to: "/employee/leave",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <rect
            x="4"
            y="5.5"
            width="16"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8 3.75v3.5M16 3.75v3.5M4 10h16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      name: "Attendance",
      to: "/employee/attendance",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M12 7.5v5l3 1.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      name: "Payslips",
      to: "/employee/salary",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <rect
            x="5"
            y="3.5"
            width="14"
            height="17"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8.5 8h7M8.5 11.5h7M8.5 15h4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      name: "Documents",
      to: "/employee/documents",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M6 3.75h8l4 4v12.5H6V3.75Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          <path
            d="M14 3.75v4h4M9 12h6M9 15.5h4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      name: "Settings",
      to: "/employee/settings",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="m19 13.5 1.2 1-.9 1.6-1.5-.45a7.2 7.2 0 0 1-1.2 1.2l.45 1.5-1.6.9-1-1.2a7.2 7.2 0 0 1-1.7.35l-.5 1.45h-1.8l-.5-1.45a7.2 7.2 0 0 1-1.7-.35l-1 1.2-1.6-.9.45-1.5a7.2 7.2 0 0 1-1.2-1.2l-1.5.45-.9-1.6 1.2-1a7.2 7.2 0 0 1 0-1.7l-1.2-1 .9-1.6 1.5.45a7.2 7.2 0 0 1 1.2-1.2l-.45-1.5 1.6-.9 1 1.2a7.2 7.2 0 0 1 1.7-.35l.5-1.45h1.8l.5 1.45a7.2 7.2 0 0 1 1.7.35l1-1.2 1.6.9-.45 1.5a7.2 7.2 0 0 1 1.2 1.2l1.5-.45.9 1.6-1.2 1a7.2 7.2 0 0 1 0 1.7Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[230px] flex-col bg-[#0b2545] text-white lg:flex">
        {/* Logo */}
        <div className="flex h-[72px] items-center border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <circle
                  cx="9"
                  cy="8"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <circle
                  cx="16"
                  cy="9"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M4.5 18c.5-3 2.1-4.5 4.5-4.5s4 1.5 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M14 15c.5-.8 1.3-1.25 2.4-1.25 1.8 0 2.8 1.2 3.1 3.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold">
                Employee Portal
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-blue-200/70">
                Workforce Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200/50">
            Main Menu
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.icon}

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Help */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M9.5 9a2.5 2.5 0 1 1 4.7 1.2c-.6.9-2.2 1.1-2.2 2.3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 15.5h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-white">
                  Need help?
                </p>

                <p className="mt-0.5 text-[9px] text-blue-100/50">
                  Contact your HR team
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}
      <div className="lg:pl-[230px]">
        {/* ===================================================
            TOP HEADER
        =================================================== */}
        <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white">
          <div className="flex h-full items-center justify-between px-5 sm:px-7">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 lg:hidden"
                aria-label="Open menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M5 7h14M5 12h14M5 17h14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Employee Portal
                </p>

                <p className="text-[9px] text-slate-400">
                  Your work. Your activity.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Notification */}
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-[18px] w-[18px]"
                >
                  <path
                    d="M18 9a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 16 18 16 18 9Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M10 20h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>

              <div className="h-7 w-px bg-slate-200" />

              {/* User */}
              <Link
                to="/employee/profile"
                className="flex items-center gap-2.5"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={employeeName}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2747] text-[10px] font-bold text-white">
                    {getInitials(employeeName)}
                  </div>
                )}

                <div className="hidden sm:block">
                  <p className="text-[11px] font-bold text-slate-800">
                    {employeeName}
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Employee
                  </p>
                </div>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="hidden h-3.5 w-3.5 text-slate-400 sm:block"
                >
                  <path
                    d="m7 9 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}
        <main className="min-h-[calc(100vh-72px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default EmployeeLayout;