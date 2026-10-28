import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import EmployeeIdCard from "../../components/employee/EmployeeIdCard.jsx";

function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  /* =========================================================
     PRINT EMPLOYEE ID CARD
  ========================================================= */

  function handlePrintIdCard() {
    if (!user?.employeeId) {
      window.alert(
        "Your official employee ID has not been assigned yet. Please contact HR."
      );
      return;
    }

    window.print();
  }

  /* =========================================================
     EMPLOYEE DATA
  ========================================================= */

  const employeeName = user?.name || "Employee";
  const employeeId = user?.employeeId || user?._id || user?.id || "Not available";
  const profileImage = user?.profileImage || "";
  const jobTitle = user?.jobTitle || "Not provided";
  const department = user?.department || "Not provided";
  const email = user?.email || "Not provided";
  const phone = user?.phone || "Not provided";
  const status = user?.status || "Not available";
  const dateOfBirth = user?.dateOfBirth || null;
  const dateOfJoining = user?.dateOfJoining || user?.createdAt || null;

  /* =========================================================
     HELPERS
  ========================================================= */

  function getInitials(name) {
    if (!name?.trim()) return "E";

    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part, index, parts) =>
        index === 0 || index === parts.length - 1 ? part[0] : ""
      )
      .join("")
      .toUpperCase();
  }

  function formatDate(value) {
    if (!value) return "Not provided";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not provided";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatStatus(value) {
    if (!value) return "Not available";

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  }

  function getStatusClasses(value) {
    switch (value) {
      case "active":
        return "border-emerald-100 bg-emerald-50 text-emerald-700";
      case "invited":
        return "border-blue-100 bg-blue-50 text-blue-700";
      case "suspended":
        return "border-amber-100 bg-amber-50 text-amber-700";
      case "deactivated":
        return "border-red-100 bg-red-50 text-red-700";
      default:
        return "border-slate-200 bg-slate-50 text-slate-600";
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f4f6f8]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0f2747]" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          EMPLOYEE DASHBOARD
          Hidden when printing the ID card
      ===================================================== */}

      <div className="min-h-[calc(100vh-72px)] bg-[#f4f6f8] print:hidden">
        <div className="mx-auto max-w-[1450px] px-5 py-6 sm:px-7 lg:px-8">

          {/* WELCOME SECTION */}

          <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Welcome back
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {getGreeting()}, {employeeName.trim().split(/\s+/)[0]}!
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Here's what's happening with your employee account today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 3.75v3.5M16 3.75v3.5M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-700">
                    Employee Portal
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Your personal workspace
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrintIdCard}
                disabled={!user.employeeId}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0f2747] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 14h10v6H7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                Print ID Card
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[10px] font-bold text-red-600 transition hover:bg-red-50"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Logout
              </button>
            </div>
          </section>

          {/* OVERVIEW CARDS */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              icon={<StatusIcon />}
              iconClass="bg-emerald-50 text-emerald-600"
              title="Account Status"
              value={formatStatus(status)}
              description="Current account status"
            />

            <DashboardCard
              icon={<IdIcon />}
              iconClass="bg-blue-50 text-blue-600"
              title="Employee ID"
              value={employeeId}
              description="Your staff identification"
            />

            <DashboardCard
              icon={<DepartmentIcon />}
              iconClass="bg-violet-50 text-violet-600"
              title="Department"
              value={department}
              description="Current department"
            />

            <DashboardCard
              icon={<JobIcon />}
              iconClass="bg-cyan-50 text-cyan-600"
              title="Job Title"
              value={jobTitle}
              description="Current position"
            />
          </section>

          {/* MAIN GRID */}

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

            {/* LEFT COLUMN */}

            <div className="space-y-5">

              {/* EMPLOYMENT DETAILS */}

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Employee information
                    </p>
                    <h2 className="mt-1 text-sm font-bold text-slate-800">
                      My employment details
                    </h2>
                  </div>

                  <Link to="/employee/profile" className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
                    View all →
                  </Link>
                </div>

                <div className="grid gap-0 sm:grid-cols-2">
                  <InformationRow label="Full Name" value={employeeName} />
                  <InformationRow label="Employee ID" value={employeeId} />
                  <InformationRow label="Job Title" value={jobTitle} />
                  <InformationRow label="Department" value={department} />
                  <InformationRow label="Email" value={email} />
                  <InformationRow label="Phone Number" value={phone} />
                  <InformationRow label="Year of Birth" value={dateOfBirth ? getBirthYear(dateOfBirth) : "Not provided"} />
                  <InformationRow label="Date Joined" value={formatDate(dateOfJoining)} />
                </div>
              </div>

              {/* ACCOUNT INFORMATION */}

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Account
                    </p>
                    <h2 className="mt-1 text-sm font-bold text-slate-800">
                      Account information
                    </h2>
                  </div>

                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${getStatusClasses(status)}`}>
                    {formatStatus(status)}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <DocumentIcon />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Employee record
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        Your dashboard information is loaded from your employee account.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link to="/employee/profile" className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-600 hover:text-blue-700">
                      View personal details <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-5">

              {/* PROFILE CARD */}

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[#0f2747] px-5 pb-5 pt-6 text-white">
                  <div className="flex items-center gap-4">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={`Profile of ${employeeName}`}
                        className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-lg font-bold">
                        {getInitials(employeeName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-base font-bold">{employeeName}</p>
                      <p className="mt-1 truncate text-[10px] text-blue-100/70">{jobTitle}</p>
                      <p className="mt-1 text-[9px] text-blue-100/50">{employeeId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-4">
                    <SmallInformation icon={<EmailIcon />} label="Email" value={email} />
                    <SmallInformation icon={<DepartmentIcon />} label="Department" value={department} />
                    <SmallInformation icon={<CalendarIcon />} label="Joined" value={formatDate(dateOfJoining)} />
                  </div>

                  <Link to="/employee/profile" className="mt-5 flex w-full items-center justify-center rounded-lg border border-slate-200 py-2.5 text-[10px] font-bold text-blue-600 transition hover:bg-slate-50">
                    View Personal Details
                  </Link>
                </div>
              </div>

              {/* QUICK LINKS */}

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Quick links
                  </p>
                  <h2 className="mt-1 text-sm font-bold text-slate-800">
                    Employee services
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  <QuickLink to="/employee/leave" icon={<CalendarIcon />} title="Leave Requests" description="Request time off" />
                  <QuickLink to="/employee/salary" icon={<DocumentIcon />} title="Payslips" description="View salary statements" />
                  <QuickLink to="/employee/documents" icon={<DocumentIcon />} title="Documents" description="Browse your documents" />
                  <QuickLink to="/employee/profile" icon={<ProfileIcon />} title="Personal Details" description="View your information" />
                </div>
              </div>

              {/* HR ASSISTANCE */}

              <div className="rounded-xl bg-[#0f2747] p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <HelpIcon />
                  </div>

                  <div>
                    <p className="text-xs font-bold">Need assistance?</p>
                    <p className="mt-1 text-[10px] leading-5 text-blue-100/60">
                      Contact your HR team if you need help with your employee account.
                    </p>
                  </div>
                </div>

                <a
                  href="mailto:hr@eklee.managementsx"
                  className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-bold text-white transition hover:bg-blue-500"
                >
                  Contact HR
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* PRINTABLE ID CARD — OUTSIDE THE DASHBOARD WRAPPER */}

      <EmployeeIdCard user={user} />
    </>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function DashboardCard({ icon, iconClass, title, value, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          {icon}
        </div>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-300">
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="mt-4 text-[10px] font-semibold text-slate-400">{title}</p>
      <p className="mt-1 truncate text-base font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-[9px] text-slate-400">{description}</p>
    </div>
  );
}

function InformationRow({ label, value }) {
  return (
    <div className="min-w-0 border-b border-slate-100 px-5 py-4 odd:sm:border-r">
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function SmallInformation({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, title, description }) {
  return (
    <Link to={to} className="group flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-slate-700">{title}</p>
        <p className="mt-0.5 text-[9px] text-slate-400">{description}</p>
      </div>

      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500">
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/* =========================================================
   INLINE ICONS
========================================================= */

function StatusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="m8.5 12 2.25 2.25L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 15c.5-1.3 1.2-2 2-2s1.5.7 2 2M13.5 10h4M13.5 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function DepartmentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function JobIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="4" y="7" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 11h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M6 3.75h8l4 4v12.5H6V3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 3.75v4h4M9 12h6M9 15.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="m4 6.5 8 5.5 8-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3.75v3.5M16 3.75v3.5M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 19c.8-3.1 3.1-4.75 6.5-4.75s5.7 1.65 6.5 4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.7 1.2c-.6.9-2.2 1.1-2.2 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function getBirthYear(value) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return String(date.getUTCFullYear());
}

export default EmployeeDashboard;