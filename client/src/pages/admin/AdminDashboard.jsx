import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "../../services/employee.service.js";

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const getEmployeeName = (employee) => {
  if (employee?.name) return employee.name;

  const fullName = [employee?.firstName, employee?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || employee?.email || "Unnamed employee";
};

const getInitials = (name) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const formatJoinedDate = (employee) => {
  const dateValue = employee?.createdAt || employee?.joinedAt || employee?.startDate;
  if (!dateValue) return "—";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEmployeeStatus = (employee) => {
  const status = String(employee?.status || "unknown").toLowerCase();

  if (status === "active") return "Active";
  if (status === "invited" || status === "pending") return "Invited";
  if (status === "suspended") return "Suspended";
  if (status === "deactivated") return "Deactivated";

  return status === "unknown" ? "Unknown" : status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClasses = (status) => {
  switch (String(status).toLowerCase()) {
    case "active":
      return "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20";
    case "invited":
    case "pending":
      return "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20";
    case "suspended":
    case "deactivated":
      return "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/20";
    default:
      return "bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/20";
  }
};

// ────────────────────────────────────────────────────────────────────────────
// Static Data
// ────────────────────────────────────────────────────────────────────────────

const attendance = [
  { day: "Mon", value: 82 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 65 },
  { day: "Thu", value: 73 },
  { day: "Fri", value: 88 },
  { day: "Sat", value: 42 },
  { day: "Sun", value: 30 },
];

const DEPARTMENTS = [
  { name: "Engineering", color: "#8b5cf6" },
  { name: "Marketing", color: "#38bdf8" },
  { name: "HR", color: "#2dd4bf" },
  { name: "Finance", color: "#f472b6" },
  { name: "Operations", color: "#fb923c" },
  { name: "Other", color: "#6366f1" },
];

// ────────────────────────────────────────────────────────────────────────────
// UI Components
// ────────────────────────────────────────────────────────────────────────────

function StatCard({ title, value, subtitle, icon, color, trend }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-5 backdrop-blur-sm transition hover:border-white/10 hover:shadow-xl hover:shadow-black/20">
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition group-hover:blur-2xl ${color.glow}`} />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className={`font-bold text-white ${String(value).length > 8 ? "text-2xl" : "text-3xl"}`}>
            {value}
          </h3>
          <div className="flex items-center gap-2">
            {trend && (
              <span className={`text-xs font-medium ${trend.positive ? "text-emerald-400" : "text-rose-400"}`}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
            )}
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-lg ${color.icon}`}>
          {icon}
        </div>
      </div>

      <div className="relative mt-4 h-10">
        <svg viewBox="0 0 220 40" preserveAspectRatio="none" className={`h-full w-full ${color.stroke}`}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={trend?.chart}
            fill={`url(#gradient-${title})`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl shadow-black/10 ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Avatar({ name, size = "md" }) {
  const initials = getInitials(name);
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 font-semibold text-violet-200 ring-1 ring-violet-500/30 ${sizeClasses[size]}`}>
      {initials || "?"}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ────────────────────────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadEmployees = async () => {
      setEmployeesLoading(true);
      setEmployeesError("");

      try {
        const response = await getEmployees({ signal: controller.signal });
        const employeeList = Array.isArray(response?.data)
          ? response.data
          : response?.data?.data;

        if (!Array.isArray(employeeList)) {
          throw new Error("The server returned an unexpected employee list.");
        }

        setEmployees(employeeList);
      } catch (error) {
        if (error?.name === "AbortError" || error?.name === "CanceledError") {
          return;
        }

        setEmployeesError(error?.message || "Unable to load employees. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setEmployeesLoading(false);
        }
      }
    };

    loadEmployees();
    return () => controller.abort();
  }, []);

  // Derived data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (employee) => String(employee?.status || "").toLowerCase() === "active"
  ).length;

  const pendingInvitations = employees.filter((employee) =>
    ["invited", "pending"].includes(String(employee?.status || "").toLowerCase())
  ).length;

  const recentEmployees = [...employees]
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || a?.joinedAt || 0).getTime();
      const dateB = new Date(b?.createdAt || b?.joinedAt || 0).getTime();
      return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
    })
    .slice(0, 5);

  const departmentStats = DEPARTMENTS.map((department) => {
    const count = employees.filter(
      (employee) =>
        String(employee?.department || "").trim().toLowerCase() === department.name.toLowerCase()
    ).length;
    return { ...department, count };
  });

  const totalDepartmentEmployees = departmentStats.reduce(
    (total, department) => total + department.count,
    0
  );

  let departmentChartPosition = 0;
  const departmentGradient = departmentStats
    .filter((department) => department.count > 0)
    .map((department) => {
      const start = departmentChartPosition;
      departmentChartPosition += (department.count / totalDepartmentEmployees) * 100;
      return `${department.color} ${start}% ${departmentChartPosition}%`;
    })
    .join(", ");

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Stats configuration
  const stats = [
    {
      title: "Total Employees",
      value: employeesLoading ? "…" : String(totalEmployees),
      subtitle: "All time",
      icon: "👥",
      color: {
        glow: "bg-violet-600/25",
        icon: "bg-violet-500/20 text-violet-300",
        stroke: "text-violet-400",
      },
      trend: { positive: true, value: "12%", chart: "M0 30 L30 25 L60 28 L90 15 L120 20 L150 10 L180 18 L220 8" },
    },
    {
      title: "Active Now",
      value: employeesLoading ? "…" : String(activeEmployees),
      subtitle: "Currently active",
      icon: "✓",
      color: {
        glow: "bg-emerald-600/25",
        icon: "bg-emerald-500/20 text-emerald-300",
        stroke: "text-emerald-400",
      },
      trend: { positive: true, value: "8%", chart: "M0 28 L40 22 L80 25 L120 15 L160 18 L200 10 L220 12" },
    },
    {
      title: "Pending",
      value: employeesLoading ? "…" : String(pendingInvitations),
      subtitle: "Awaiting response",
      icon: "⏳",
      color: {
        glow: "bg-amber-600/25",
        icon: "bg-amber-500/20 text-amber-300",
        stroke: "text-amber-400",
      },
      trend: { positive: false, value: "3%", chart: "M0 15 L40 20 L80 18 L120 25 L160 22 L200 28 L220 25" },
    },
    {
      title: "Payroll",
      value: "—",
      subtitle: "Not connected",
      icon: "$",
      color: {
        glow: "bg-fuchsia-600/25",
        icon: "bg-fuchsia-500/20 text-fuchsia-300",
        stroke: "text-fuchsia-400",
      },
      trend: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
        
        {/* ==================== HEADER ==================== */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl shadow-lg shadow-violet-600/30">
              ☀️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Good morning, Admin</h1>
              <p className="text-sm text-slate-400">{today}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-xl hover:shadow-violet-600/40 hover:scale-[1.02]"
          >
            <span className="text-lg">+</span>
            Add Employee
          </button>
        </header>

        {/* ==================== STATS GRID ==================== */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* ==================== MAIN CONTENT GRID ==================== */}
        <section className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column - Attendance & Employees */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Attendance Panel */}
            <Panel
              title="Attendance Overview"
              subtitle="Weekly attendance trends"
              action={
                <span className="rounded-lg border border-white/10 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400">
                  This Week
                </span>
              }
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    Present
                  </span>
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-600" />
                    Absent
                  </span>
                </div>
                <span className="text-xs text-slate-500">Illustrative data</span>
              </div>

              <div className="grid grid-cols-7 items-end gap-3">
                {attendance.map((item) => (
                  <div key={item.day} className="group flex flex-col items-center gap-2">
                    <div className="relative h-32 w-full rounded-t-xl bg-white/[0.02]">
                      <div
                        className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-fuchsia-500 opacity-80 transition-all group-hover:opacity-100"
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Recent Employees Table */}
            <Panel
              title="Recent Employees"
              subtitle="Latest additions to your team"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/admin/employees")}
                  className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
                >
                  View All →
                </button>
              }
            >
              {employeesError && (
                <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                  <p>{employeesError}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 font-semibold text-rose-300 underline underline-offset-2"
                  >
                    Reload
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3 font-medium">Employee</th>
                      <th className="px-4 py-3 font-medium">Department</th>
                      <th className="px-4 py-3 font-medium">Position</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employeesLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          Loading employees…
                        </td>
                      </tr>
                    ) : recentEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          {employeesError ? "Failed to load employees." : "No employees yet."}
                        </td>
                      </tr>
                    ) : (
                      recentEmployees.map((employee, index) => {
                        const name = getEmployeeName(employee);
                        const status = getEmployeeStatus(employee);

                        return (
                          <tr
                            key={employee?._id || employee?.id || employee?.email || `${name}-${index}`}
                            className="group transition hover:bg-white/[0.02]"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar name={name} size="sm" />
                                <span className="font-medium text-slate-200">{name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400">{employee?.department || "—"}</td>
                            <td className="px-4 py-3 text-slate-400">
                              {employee?.position || employee?.jobTitle || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(status)}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{formatJoinedDate(employee)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* Right Column - Departments & Leave */}
          <div className="space-y-6">
            
            {/* Department Distribution */}
            <Panel
              title="Department Distribution"
              subtitle={employeesLoading ? "Loading…" : "By department"}
            >
              <div className="flex flex-col items-center gap-6 py-4">
                <div
                  className="relative h-40 w-40 rounded-full"
                  style={{
                    background: totalDepartmentEmployees
                      ? `conic-gradient(${departmentGradient})`
                      : "#272744",
                  }}
                >
                  <div className="absolute inset-4 flex items-center justify-center rounded-full bg-slate-900">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-white">
                        {employeesLoading ? "…" : totalDepartmentEmployees}
                      </span>
                      <span className="text-xs text-slate-500">Total</span>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  {departmentStats.map((department) => {
                    const percentage = totalDepartmentEmployees
                      ? Math.round((department.count / totalDepartmentEmployees) * 100)
                      : 0;

                    return (
                      <div key={department.name} className="flex items-center gap-3 text-sm">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: department.color }}
                        />
                        <span className="flex-1 text-slate-400">{department.name}</span>
                        <span className="font-medium text-slate-300">
                          {employeesLoading ? "…" : `${department.count} (${percentage}%)`}
                        </span>
                      </div>
                    );
                  })}
                  {!employeesLoading && totalDepartmentEmployees === 0 && (
                    <p className="text-center text-sm text-slate-500">No employees assigned yet.</p>
                  )}
                </div>
              </div>
            </Panel>

            {/* Leave Requests */}
            <Panel
              title="Leave Requests"
              subtitle="Pending and approved"
              action={
                <span className="text-xs text-slate-500">Illustrative</span>
              }
            >
              <div className="space-y-4">
                {[
                  ["SK", "Sarah Kim", "Annual Leave", "Pending"],
                  ["JM", "James Mwangi", "Sick Leave", "Pending"],
                  ["AB", "Aisha Bello", "Annual Leave", "Approved"],
                  ["DO", "Daniel Okafor", "Personal Leave", "Pending"],
                  ["GW", "Grace Wanjiku", "Maternity Leave", "Approved"],
                ].map(([initials, name, type, status]) => (
                  <div
                    key={name}
                    className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 text-sm font-semibold text-violet-200 ring-1 ring-violet-500/30">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">{name}</p>
                      <p className="text-xs text-slate-500">{type}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Payroll Summary */}
            <Panel
              title="Payroll Summary"
              subtitle="Monthly overview"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div>
                    <p className="text-xs text-slate-500">Total Payroll</p>
                    <p className="mt-1 text-lg font-bold text-white">Not connected</p>
                  </div>
                  <span className="rounded-lg bg-slate-500/15 px-3 py-1.5 text-xs text-slate-400">
                    —
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-500">Avg Salary</p>
                    <p className="mt-1 font-semibold text-white">—</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-xs text-slate-500">Pending</p>
                    <p className="mt-1 font-semibold text-white">—</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          Employee Management System · Admin Dashboard
        </footer>
      </div>
    </div>
  );
}

export default AdminDashboard;