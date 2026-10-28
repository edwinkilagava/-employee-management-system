import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

function AdminTopbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminName = user?.name || "Admin";

  const initials = adminName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#11112a]/95 px-4 py-4 backdrop-blur-xl sm:px-6 xl:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 font-bold text-violet-300 lg:hidden">
          EX
        </div>

        <label className="flex min-w-0 max-w-xl flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#191936] px-4 py-2.5">
          <span className="text-slate-500">⌕</span>

          <input
            type="search"
            placeholder="Search employees..."
            aria-label="Search employees"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                navigate("/admin/employees");
              }
            }}
          />
        </label>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden h-9 w-px bg-white/10 sm:block" />

        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-violet-400 bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white"
            aria-hidden="true"
          >
            {initials || "A"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {adminName}
            </p>
            <p className="text-xs text-slate-500">
              System Administrator
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;