
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Fixed sidebar */}
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <AdminSidebar />
        </div>

        {/* Main content scrolls normally */}
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

