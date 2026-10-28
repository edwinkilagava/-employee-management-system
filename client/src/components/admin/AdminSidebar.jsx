
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "▦" },
  { label: "Employees", path: "/admin/employees", icon: "♙" },
  { label: "Departments", icon: "♧", comingSoon: true },
  { label: "Attendance", icon: "◷", comingSoon: true },
  { label: "Leave", icon: "✈", comingSoon: true },
  { label: "Salaries", icon: "$", comingSoon: true },
  { label: "Reports", icon: "▥", comingSoon: true },
  { label: "Settings", icon: "⚙", comingSoon: true },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-[#11112a] lg:flex">
      {/* Brand */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl font-bold text-white">
            E
          </div>

          <div>
            <h1 className="text-lg font-extrabold tracking-wide text-white">
              EMPLOYEE<span className="text-violet-400">X</span>
            </h1>

            <p className="text-[10px] tracking-widest text-slate-500">
              MANAGE · SUPPORT · GROW
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4" aria-label="Admin navigation">
        {navigationItems.map((item) => {
          if (item.comingSoon) {
            return (
              <div
                key={item.label}
                aria-disabled="true"
                title={`${item.label} page is not implemented yet`}
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600"
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>

                <span>{item.label}</span>

                <span className="ml-auto text-[9px] text-slate-600">
                  SOON
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-purple-500 font-semibold text-white shadow-lg shadow-violet-600/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center text-lg">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="m-4 rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/20 p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-xl text-violet-300">
          ✦
        </div>

        <h3 className="text-sm font-semibold text-white">
          Better Teams
        </h3>

        <h3 className="text-sm font-semibold text-white">
          Build Bigger Dreams
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Manage your people and help your organization grow.
        </p>
      </div>
    </aside>
  );
}